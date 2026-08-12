// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.
// Sends a moderation email synchronously for a pending quote.

// Setup type definitions for built-in Supabase Runtime APIs
import "@supabase/functions-js/edge-runtime.d.ts";
import { SupabaseContext, withSupabase } from "@supabase/server";
import { createClient } from "@supabase/supabase-js";
import nodemailer from "nodemailer";
import { render } from "@react-email/render";
import type { Database } from "../_shared/database.types.ts";
import { getConfig } from "../_shared/config.ts";
import { ReviewPendingEmail } from "./review_pending_email_template.tsx";

type ReviewActionStatus = "published" | "flagged";

type ReviewQuoteRecord = Database["public"]["Tables"]["quote"]["Row"] & {
  category:
    | Pick<Database["public"]["Tables"]["category"]["Row"], "name">
    | null;
  profile: Pick<Database["public"]["Tables"]["profile"]["Row"], "email"> | null;
  suburb:
    | Pick<
      Database["public"]["Tables"]["suburb"]["Row"],
      "locality" | "postcode" | "state"
    >
    | null;
};

const ONE_WEEK_IN_SECONDS = 60 * 60 * 24 * 7;

type QuoteReviewActionTokenInsert =
  Database["public"]["Tables"]["quote_review_action_token"]["Insert"];

function isLocalSupabaseUrl(url: string) {
  return url.includes("127.0.0.1") || url.includes("localhost") ||
    url.includes("kong");
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    maximumFractionDigits: 2,
  }).format(value);
}

function formatLocation(quote: ReviewQuoteRecord) {
  if (!quote.suburb) {
    return "Unknown location";
  }

  return `${quote.suburb.locality}, ${quote.suburb.state} ${quote.suburb.postcode}`;
}

function buildEmailSubject(quote: ReviewQuoteRecord) {
  return `Quote pending review: ${quote.title}`;
}

function buildEmailText(params: {
  quote: ReviewQuoteRecord;
  publishUrl: string;
  flaggedUrl: string;
}) {
  const { quote, publishUrl, flaggedUrl } = params;

  return [
    `A quote was sent to pending review.`,
    "",
    `Why it was set to pending: ${quote.review_reason ?? "No reason supplied"}`,
    `Review source: ${quote.review_source ?? "unknown"}`,
    "",
    `Quote ID: ${quote.quote_id}`,
    `Title: ${quote.title}`,
    `Business: ${quote.business_name}`,
    `Category: ${quote.category?.name ?? "Unknown"}`,
    `Price: ${formatCurrency(quote.price)}`,
    `Location: ${formatLocation(quote)}`,
    `User email: ${quote.profile?.email ?? "Unknown"}`,
    `Quote date: ${quote.quote_date}`,
    "",
    "Description:",
    quote.description,
    "",
    `Publish: ${publishUrl}`,
    `Flagged: ${flaggedUrl}`,
  ].join("\n");
}

async function buildEmailHtml(params: {
  quote: ReviewQuoteRecord;
  publishUrl: string;
  flaggedUrl: string;
}) {
  const { quote, publishUrl, flaggedUrl } = params;
  return await render(ReviewPendingEmail({
    quoteId: quote.quote_id,
    reviewReason: quote.review_reason ?? "No reason supplied",
    title: quote.title,
    businessName: quote.business_name,
    categoryName: quote.category?.name ?? "Unknown",
    price: formatCurrency(quote.price),
    location: formatLocation(quote),
    userEmail: quote.profile?.email ?? "Unknown",
    quoteDate: quote.quote_date,
    reviewSource: quote.review_source ?? "unknown",
    descriptionHtml: quote.description,
    publishUrl,
    flaggedUrl,
  }));
}

async function loadQuote(
  admin: ReturnType<typeof createClient<Database>>,
  quoteId: string,
) {
  const { data, error } = await admin
    .from("quote")
    .select(
      `
      *,
      category:category_id (name),
      profile:profile_id (email),
      suburb:suburb_id (locality, postcode, state)
    `,
    )
    .eq("quote_id", quoteId)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to load quote ${quoteId}: ${error.message}`);
  }

  return data as ReviewQuoteRecord | null;
}

async function sendViaSmtp(params: {
  subject: string;
  textBody: string;
  htmlBody: string;
  toEmail: string;
  fromEmail: string;
  fromName: string;
  isLocal: boolean;
}) {
  const {
    subject,
    textBody,
    htmlBody,
    toEmail,
    fromEmail,
    fromName,
    isLocal,
  } = params;
  const host = Deno.env.get("SMTP_HOST") ??
    (isLocal ? "inbucket" : undefined);
  const portValue = Deno.env.get("SMTP_PORT") ?? (isLocal ? "1025" : "587");
  const port = Number(portValue);
  const user = Deno.env.get("SMTP_USER");
  const pass = Deno.env.get("SMTP_PASS");

  if (!host) {
    throw new Error("Missing required env var: SMTP_HOST");
  }

  if (!Number.isInteger(port) || port < 1 || port > 65_535) {
    throw new Error(`Invalid SMTP_PORT: ${portValue}`);
  }

  if (Boolean(user) !== Boolean(pass)) {
    throw new Error("SMTP_USER and SMTP_PASS must be provided together");
  }

  const secureValue = Deno.env.get("SMTP_SECURE");
  if (
    secureValue !== undefined &&
    secureValue !== "true" &&
    secureValue !== "false"
  ) {
    throw new Error("SMTP_SECURE must be either true or false");
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: secureValue === undefined ? port === 465 : secureValue === "true",
    auth: user && pass ? { user, pass } : undefined,
  });

  await transporter.sendMail({
    from: {
      name: fromName,
      address: fromEmail,
    },
    to: toEmail,
    subject,
    text: textBody,
    html: htmlBody,
  });
}

async function sendReviewEmail(params: {
  admin: ReturnType<typeof createClient<Database>>;
  supabaseUrl: string;
  quote: ReviewQuoteRecord;
}) {
  const { admin, supabaseUrl, quote } = params;
  const toEmail = Deno.env.get("REVIEW_NOTIFICATION_TO_EMAIL") ??
    "hello@howmuchmate.com.au";
  const fromEmail = Deno.env.get("REVIEW_NOTIFICATION_FROM_EMAIL") ??
    "hello@howmuchmate.com.au";
  const fromName = Deno.env.get("REVIEW_NOTIFICATION_FROM_NAME") ??
    "How Much Mate";
  const actionBaseUrl = `${getConfig().frontendUrl}/moderation`;
  const expiresAt = Math.floor(Date.now() / 1000) + ONE_WEEK_IN_SECONDS;

  const createToken = async (action: ReviewActionStatus) => {
    const tokenInsert: QuoteReviewActionTokenInsert = {
      quote_id: quote.quote_id,
      action,
      expires_at: new Date(expiresAt * 1000).toISOString(),
    };

    const { data, error } = await admin
      .from("quote_review_action_token")
      .insert(tokenInsert)
      .select("token_id")
      .single();

    if (error) {
      throw new Error(`Failed to create review token: ${error.message}`);
    }

    return data.token_id;
  };

  const toTokenUrl = (tokenId: string) => {
    const normalizedBaseUrl = actionBaseUrl.endsWith("/")
      ? actionBaseUrl.slice(0, -1)
      : actionBaseUrl;
    return `${normalizedBaseUrl}/${tokenId}`;
  };

  const [publishTokenId, flaggedTokenId] = await Promise.all([
    createToken("published"),
    createToken("flagged"),
  ]);

  const publishUrl = toTokenUrl(publishTokenId);
  const flaggedUrl = toTokenUrl(flaggedTokenId);

  try {
    const subject = buildEmailSubject(quote);
    const textBody = buildEmailText({ quote, publishUrl, flaggedUrl });
    const htmlBody = await buildEmailHtml({ quote, publishUrl, flaggedUrl });

    await sendViaSmtp({
      subject,
      textBody,
      htmlBody,
      toEmail,
      fromEmail,
      fromName,
      isLocal: isLocalSupabaseUrl(supabaseUrl),
    });
  } catch (error) {
    const { error: cleanupError } = await admin
      .from("quote_review_action_token")
      .delete()
      .in("token_id", [publishTokenId, flaggedTokenId]);

    if (cleanupError) {
      console.error("REVIEW_TOKEN_CLEANUP_FAILED", {
        quoteId: quote.quote_id,
        error: cleanupError.message,
      });
    }

    throw error;
  }
}

// This endpoint uses 'publishable' | 'secret' access, apiKey is required.
// Use publishable for Client-facing, key-validated endpoints
// Use secret for Server-to-server, internal calls
export default {
  fetch: withSupabase(
    { auth: ["secret"] },
    async (req, _ctx: SupabaseContext<Database>) => {
      const supabaseUrl = Deno.env.get("SUPABASE_URL");
      const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

      if (!supabaseUrl || !serviceRoleKey) {
        return Response.json({ error: "Missing Supabase env vars" }, {
          status: 500,
        });
      }

      const admin = createClient<Database>(supabaseUrl, serviceRoleKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      });

      let payload: unknown;
      try {
        payload = await req.json();
      } catch {
        return Response.json({ error: "Request body must be valid JSON" }, {
          status: 400,
        });
      }

      if (
        !payload ||
        typeof payload !== "object" ||
        !("quote_id" in payload) ||
        typeof payload.quote_id !== "string"
      ) {
        return Response.json({ error: "quote_id is required" }, {
          status: 400,
        });
      }

      try {
        const quote = await loadQuote(admin, payload.quote_id);

        if (!quote) {
          return Response.json({ error: "Quote not found" }, { status: 404 });
        }

        if (quote.status !== "pending") {
          return Response.json(
            { error: "Quote is not pending review", status: quote.status },
            { status: 409 },
          );
        }

        await sendReviewEmail({ admin, supabaseUrl, quote });

        return Response.json({ ok: true, reason: "email_sent" });
      } catch (error) {
        console.error("REVIEW_EMAIL_FAILED", {
          quoteId: payload.quote_id,
          error: error instanceof Error ? error.message : String(error),
        });
        return Response.json({ error: "Failed to send review email" }, {
          status: 500,
        });
      }
    },
  ),
};
