import "server-only";

import { render } from "@react-email/render";
import nodemailer from "nodemailer";

import { supabaseAdminServerClient } from "@/supabase/admin";
import { Database } from "@/supabase/database.types";
import { ReviewPendingEmail } from "./ReviewPendingEmail";

type ReviewAction = "published" | "flagged";

type ReviewQuote = Database["public"]["Tables"]["quote"]["Row"] & {
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

const ONE_WEEK_IN_MILLISECONDS = 7 * 24 * 60 * 60 * 1000;

function isLocalEnvironment() {
  const appEnv = process.env.NEXT_PUBLIC_APP_ENV ?? "local";
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  return (
    appEnv === "local" ||
    supabaseUrl.includes("127.0.0.1") ||
    supabaseUrl.includes("localhost")
  );
}

function getFrontendUrl() {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "");
  }

  switch (process.env.NEXT_PUBLIC_APP_ENV ?? "local") {
    case "prod":
      return "https://howmuchmate.com.au";
    case "dev":
      return "https://dev.howmuchmate.com.au";
    default:
      return "http://localhost:3000";
  }
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    maximumFractionDigits: 2,
  }).format(value);
}

function formatLocation(quote: ReviewQuote) {
  if (!quote.suburb) return "Unknown location";
  return `${quote.suburb.locality}, ${quote.suburb.state} ${quote.suburb.postcode}`;
}

function buildEmailText(params: {
  quote: ReviewQuote;
  publishUrl: string;
  flaggedUrl: string;
}) {
  const { quote, publishUrl, flaggedUrl } = params;

  return [
    "A quote was sent to pending review.",
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

async function loadPendingQuote(quoteId: string) {
  const admin = supabaseAdminServerClient();
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

  if (error) throw new Error(`Failed to load quote ${quoteId}: ${error.message}`);
  if (!data) throw new Error(`Quote ${quoteId} was not found`);
  if (data.status !== "pending") {
    throw new Error(`Quote ${quoteId} is not pending review`);
  }

  return data as ReviewQuote;
}

async function createActionTokens(quoteId: string) {
  const admin = supabaseAdminServerClient();
  const expiresAt = new Date(Date.now() + ONE_WEEK_IN_MILLISECONDS).toISOString();
  const actions: ReviewAction[] = ["published", "flagged"];
  const { data, error } = await admin
    .from("quote_review_action_token")
    .insert(actions.map((action) => ({ quote_id: quoteId, action, expires_at: expiresAt })))
    .select("token_id, action");

  if (error) throw new Error(`Failed to create review tokens: ${error.message}`);

  const publishToken = data.find((token) => token.action === "published");
  const flaggedToken = data.find((token) => token.action === "flagged");
  if (!publishToken || !flaggedToken) {
    throw new Error("Failed to create both review tokens");
  }

  return {
    publishTokenId: publishToken.token_id,
    flaggedTokenId: flaggedToken.token_id,
  };
}

async function deleteActionTokens(tokenIds: string[]) {
  const { error } = await supabaseAdminServerClient()
    .from("quote_review_action_token")
    .delete()
    .in("token_id", tokenIds);

  if (error) {
    console.error("[moderation.sendReviewEmail] Token cleanup failed", {
      tokenIds,
      error: error.message,
    });
  }
}

function createSmtpTransport() {
  const isLocal = isLocalEnvironment();
  const host = process.env.SMTP_HOST ?? (isLocal ? "127.0.0.1" : undefined);
  const portValue = process.env.SMTP_PORT ?? (isLocal ? "54325" : "587");
  const port = Number(portValue);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host) throw new Error("Missing required env var: SMTP_HOST");
  if (!Number.isInteger(port) || port < 1 || port > 65_535) {
    throw new Error(`Invalid SMTP_PORT: ${portValue}`);
  }
  if (Boolean(user) !== Boolean(pass)) {
    throw new Error("SMTP_USER and SMTP_PASS must be provided together");
  }

  const secureValue = process.env.SMTP_SECURE;
  if (secureValue !== undefined && secureValue !== "true" && secureValue !== "false") {
    throw new Error("SMTP_SECURE must be either true or false");
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: secureValue === undefined ? port === 465 : secureValue === "true",
    auth: user && pass ? { user, pass } : undefined,
  });
}

export async function sendReviewEmail(quoteId: string): Promise<void> {
  const quote = await loadPendingQuote(quoteId);
  const { publishTokenId, flaggedTokenId } = await createActionTokens(quoteId);
  const tokenIds = [publishTokenId, flaggedTokenId];
  const moderationUrl = `${getFrontendUrl()}/moderation`;
  const publishUrl = `${moderationUrl}/${publishTokenId}`;
  const flaggedUrl = `${moderationUrl}/${flaggedTokenId}`;

  try {
    const emailProps = {
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
      description: quote.description,
      publishUrl,
      flaggedUrl,
    };

    const [html, text] = await Promise.all([
      render(<ReviewPendingEmail {...emailProps} />),
      Promise.resolve(buildEmailText({ quote, publishUrl, flaggedUrl })),
    ]);

    await createSmtpTransport().sendMail({
      from: {
        name: process.env.REVIEW_NOTIFICATION_FROM_NAME ?? "How Much Mate",
        address:
          process.env.REVIEW_NOTIFICATION_FROM_EMAIL ?? "hello@howmuchmate.com.au",
      },
      to: process.env.REVIEW_NOTIFICATION_TO_EMAIL ?? "hello@howmuchmate.com.au",
      subject: `Quote pending review: ${quote.title}`,
      text,
      html,
    });
  } catch (error) {
    await deleteActionTokens(tokenIds);
    throw error;
  }
}
