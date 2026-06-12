// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "@supabase/functions-js/edge-runtime.d.ts";
import { SupabaseContext, withSupabase } from "@supabase/server";
import { createClient } from "@supabase/supabase-js";
import { SendEmailCommand, SESv2Client } from "@aws-sdk/client-sesv2";
import mjml2html from "mjml";
import type { Database } from "../_shared/database.types.ts";
import { getConfig } from "../_shared/config.ts";
import { renderReviewPendingEmailMjml } from "./review_pending_email_template.ts";

type ReviewActionStatus = "published" | "flagged";

type PgmqReadArgs = {
  queue_name: string;
  vt?: number;
  qty?: number;
};

type PgmqDeleteArgs = {
  queue_name: string;
  msg_id: number;
};

type PgmqReadMessage = {
  msg_id: number;
  read_ct: number;
  enqueued_at: string;
  vt: string;
  message: unknown;
  headers: unknown;
};

type PgmqRpcClient = {
  schema: (
    schema: "pgmq",
  ) => {
    rpc: (
      fn: "read" | "delete",
      args: PgmqReadArgs | PgmqDeleteArgs,
    ) => Promise<{ data: PgmqReadMessage[] | boolean | null; error: unknown }>;
  };
};

type ReviewMessage = {
  quote_id: string;
};

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

function buildEmailHtml(params: {
  quote: ReviewQuoteRecord;
  publishUrl: string;
  flaggedUrl: string;
}) {
  const { quote, publishUrl, flaggedUrl } = params;
  const mjmlTemplate = renderReviewPendingEmailMjml({
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
  });

  const compiled = mjml2html(mjmlTemplate, {
    filePath: "",
    validationLevel: "soft",
  });

  if (compiled.errors.length > 0) {
    console.warn("MJML_TEMPLATE_WARNINGS", compiled.errors);
  }

  return compiled.html;
}

async function deleteMessage(pgmq: PgmqRpcClient, message: PgmqReadMessage) {
  const { error } = await pgmq.schema("pgmq").rpc("delete", {
    queue_name: "quote_review",
    msg_id: message.msg_id,
  });

  if (error) {
    throw new Error(
      `Failed to delete queue message ${message.msg_id}: ${
        JSON.stringify(error)
      }`,
    );
  }
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

async function sendViaLocalMailpit(params: {
  subject: string;
  textBody: string;
  htmlBody: string;
  toEmail: string;
  fromEmail: string;
  fromName: string;
}) {
  const { subject, textBody, htmlBody, toEmail, fromEmail, fromName } = params;
  const url = Deno.env.get("LOCAL_REVIEW_EMAIL_API_URL") ??
    "http://host.docker.internal:54324/api/v1/send";

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      From: {
        Name: fromName,
        Email: fromEmail,
      },
      To: [
        {
          Email: toEmail,
        },
      ],
      Subject: subject,
      Text: textBody,
      HTML: htmlBody,
    }),
  });

  if (!response.ok) {
    throw new Error(`Local mail API returned ${response.status}`);
  }
}

async function sendViaSes(params: {
  subject: string;
  textBody: string;
  htmlBody: string;
  toEmail: string;
  fromEmail: string;
  fromName: string;
}) {
  const { subject, textBody, htmlBody, toEmail, fromEmail, fromName } = params;

  const awsRegion = Deno.env.get("AWS_REGION");
  const awsAccessKeyId = Deno.env.get("AWS_ACCESS_KEY_ID");
  const awsSecretAccessKey = Deno.env.get("AWS_SECRET_ACCESS_KEY");

  if (!awsRegion || !awsAccessKeyId || !awsSecretAccessKey) {
    throw new Error(
      "Missing required env vars for SES: AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY",
    );
  }

  const client = new SESv2Client({
    region: awsRegion,
    credentials: {
      accessKeyId: awsAccessKeyId,
      secretAccessKey: awsSecretAccessKey,
      sessionToken: Deno.env.get("AWS_SESSION_TOKEN"),
    },
  });

  await client.send(
    new SendEmailCommand({
      Destination: {
        ToAddresses: [toEmail],
      },
      FromEmailAddress: `${fromName} <${fromEmail}>`,
      Content: {
        Simple: {
          Subject: {
            Data: subject,
          },
          Body: {
            Text: {
              Data: textBody,
            },
            Html: {
              Data: htmlBody,
            },
          },
        },
      },
    }),
  );
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

  const subject = buildEmailSubject(quote);
  const textBody = buildEmailText({ quote, publishUrl, flaggedUrl });
  const htmlBody = buildEmailHtml({ quote, publishUrl, flaggedUrl });

  const hasAwsCredentials = Deno.env.get("AWS_REGION") &&
    Deno.env.get("AWS_ACCESS_KEY_ID") &&
    Deno.env.get("AWS_SECRET_ACCESS_KEY");
  const isLocal = isLocalSupabaseUrl(supabaseUrl) || !hasAwsCredentials;

  if (isLocal) {
    await sendViaLocalMailpit({
      subject,
      textBody,
      htmlBody,
      toEmail,
      fromEmail,
      fromName,
    });
    return;
  }

  await sendViaSes({
    subject,
    textBody,
    htmlBody,
    toEmail,
    fromEmail,
    fromName,
  });
}

async function processMessage(params: {
  admin: ReturnType<typeof createClient<Database>>;
  message: PgmqReadMessage;
  pgmq: PgmqRpcClient;
  supabaseUrl: string;
}) {
  const { admin, message, pgmq, supabaseUrl } = params;
  const payload = message.message;

  if (
    !payload ||
    typeof payload !== "object" ||
    !("quote_id" in payload) ||
    typeof payload.quote_id !== "string"
  ) {
    console.error("INVALID_REVIEW_MESSAGE", message);
    await deleteMessage(pgmq, message);
    return { ok: false, reason: "invalid_payload" };
  }

  const quote = await loadQuote(admin, payload.quote_id);

  if (!quote) {
    console.warn("REVIEW_QUOTE_NOT_FOUND", { quoteId: payload.quote_id });
    await deleteMessage(pgmq, message);
    return { ok: true, reason: "quote_missing" };
  }

  if (quote.status !== "pending") {
    console.info("REVIEW_QUOTE_ALREADY_RESOLVED", {
      quoteId: quote.quote_id,
      status: quote.status,
    });
    await deleteMessage(pgmq, message);
    return { ok: true, reason: "quote_not_pending" };
  }

  await sendReviewEmail({
    admin,
    supabaseUrl,
    quote,
  });
  await deleteMessage(pgmq, message);

  return { ok: true, reason: "email_sent" };
}

// This endpoint uses 'publishable' | 'secret' access, apiKey is required.
// Use publishable for Client-facing, key-validated endpoints
// Use secret for Server-to-server, internal calls
export default {
  fetch: withSupabase(
    { auth: ["secret"] },
    async (_req, _ctx: SupabaseContext<Database>) => {
      const supabaseUrl = Deno.env.get("SUPABASE_URL");
      const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
      console.log({ supabaseUrl, serviceRoleKey });

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

      const pgmq = admin as unknown as PgmqRpcClient;

      const { data: messagesData, error } = await pgmq.schema("pgmq").rpc(
        "read",
        {
          queue_name: "quote_review",
          vt: 30, // Visibility Timeout in seconds
          qty: 5, // Number of messages to read
        },
      );

      const messages = (messagesData ?? []) as PgmqReadMessage[];

      if (error) {
        console.error("RPC_ERROR pgmq.read", error);
        return Response.json(
          { error: "Failed to read queue", details: error },
          {
            status: 500,
          },
        );
      }

      const results = [];
      for (const message of messages) {
        try {
          results.push(
            await processMessage({
              admin,
              message,
              pgmq,
              supabaseUrl,
            }),
          );
        } catch (processError) {
          console.error("PROCESS_REVIEW_MESSAGE_FAILED", {
            msgId: message.msg_id,
            error: processError instanceof Error
              ? processError.message
              : String(processError),
          });
          results.push({ ok: false, reason: "processing_failed" });
        }
      }

      return Response.json({
        processed: messages.length,
        results,
      });
    },
  ),
};
