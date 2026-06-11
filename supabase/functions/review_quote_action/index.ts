import "@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "@supabase/supabase-js";

import type { Database } from "../_shared/database.types.ts";

type ReviewActionStatus = "published" | "flagged";

type ActionQuote = Pick<
  Database["public"]["Tables"]["quote"]["Row"],
  "quote_id" | "status" | "title"
>;

type ReviewActionToken = Pick<
  Database["public"]["Tables"]["quote_review_action_token"]["Row"],
  "token_id" | "quote_id" | "action" | "expires_at" | "used_at"
>;

function isReviewActionStatus(action: string): action is ReviewActionStatus {
  return action === "published" || action === "flagged";
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function htmlResponse(title: string, message: string, status = 200) {
  const body = `
    <html>
      <body style="margin:0;background:#f5f1e8;padding:32px;font-family:Georgia,serif;color:#1b1b18;">
        <div style="margin:0 auto;max-width:640px;border:1px solid #d5ccb8;background:#fffaf1;padding:32px;">
          <p style="margin:0 0 12px;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:#7b6f58;">How Much Mate moderation</p>
          <h1 style="margin:0 0 16px;font-size:28px;line-height:1.2;">${
    escapeHtml(title)
  }</h1>
          <p style="margin:0;font-size:16px;line-height:1.6;">${
    escapeHtml(message)
  }</p>
        </div>
      </body>
    </html>
  `;

  return new Response(body, {
    status,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
    },
  });
}

function getRequiredEnv(name: string) {
  const value = Deno.env.get(name);

  if (!value) {
    throw new Error(`Missing required env var ${name}`);
  }

  return value;
}

async function loadQuote(
  admin: ReturnType<typeof createClient<Database>>,
  quoteId: string,
) {
  const { data, error } = await admin
    .from("quote")
    .select("quote_id, status, title")
    .eq("quote_id", quoteId)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to load quote ${quoteId}: ${error.message}`);
  }

  return data as ActionQuote | null;
}

async function loadReviewActionToken(
  admin: ReturnType<typeof createClient<Database>>,
  tokenId: string,
) {
  const { data, error } = await admin
    .from("quote_review_action_token")
    .select("token_id, quote_id, action, expires_at, used_at")
    .eq("token_id", tokenId)
    .maybeSingle();

  if (error) {
    throw new Error(
      `Failed to load review action token ${tokenId}: ${error.message}`,
    );
  }

  return data as ReviewActionToken | null;
}

async function consumeReviewActionToken(
  admin: ReturnType<typeof createClient<Database>>,
  tokenId: string,
) {
  const now = new Date().toISOString();
  const { data, error } = await admin
    .from("quote_review_action_token")
    .update({ used_at: now })
    .eq("token_id", tokenId)
    .is("used_at", null)
    .gt("expires_at", now)
    .select("token_id, quote_id, action, expires_at, used_at")
    .maybeSingle();

  if (error) {
    throw new Error(
      `Failed to consume review action token ${tokenId}: ${error.message}`,
    );
  }

  return data as ReviewActionToken | null;
}

export default {
  async fetch(request: Request) {
    if (request.method !== "GET") {
      return htmlResponse(
        "Method not allowed",
        "This moderation link only supports GET requests.",
        405,
      );
    }

    try {
      const supabaseUrl = getRequiredEnv("SUPABASE_URL");
      const serviceRoleKey = getRequiredEnv("SUPABASE_SERVICE_ROLE_KEY");
      const url = new URL(request.url);
      const tokenId = url.pathname.split("/").filter(Boolean).pop();

      if (!tokenId || tokenId === "review_quote_action") {
        return htmlResponse(
          "Invalid link",
          "This moderation link is missing a token.",
          400,
        );
      }

      const admin = createClient<Database>(supabaseUrl, serviceRoleKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      });

      const existingToken = await loadReviewActionToken(admin, tokenId);

      if (!existingToken) {
        return htmlResponse(
          "Invalid link",
          "This moderation link is invalid or no longer exists.",
          404,
        );
      }

      if (!isReviewActionStatus(existingToken.action)) {
        return htmlResponse(
          "Invalid action",
          "This moderation action is not supported.",
          400,
        );
      }

      if (Date.parse(existingToken.expires_at) < Date.now()) {
        return htmlResponse(
          "Link expired",
          "This moderation link has expired.",
          410,
        );
      }

      const action = existingToken.action;
      const quoteId = existingToken.quote_id;

      const quote = await loadQuote(admin, quoteId);

      if (!quote) {
        return htmlResponse(
          "Quote not found",
          "The quote attached to this moderation link no longer exists.",
          404,
        );
      }

      if (existingToken.used_at) {
        if (quote.status === action) {
          return htmlResponse(
            "Already processed",
            `The quote \"${quote.title}\" is already marked as ${action}.`,
          );
        }

        return htmlResponse(
          "Already reviewed",
          `The quote \"${quote.title}\" was already reviewed. Current status: ${quote.status}.`,
          409,
        );
      }

      const consumedToken = await consumeReviewActionToken(admin, tokenId);

      if (!consumedToken) {
        const latestQuote = await loadQuote(admin, quoteId);
        if (latestQuote?.status === action) {
          return htmlResponse(
            "Already processed",
            `The quote \"${latestQuote.title}\" is already marked as ${action}.`,
          );
        }

        return htmlResponse(
          "Already reviewed",
          `The quote \"${quote.title}\" was reviewed before this link completed.`,
          409,
        );
      }

      if (quote.status === action) {
        return htmlResponse(
          "Already processed",
          `The quote \"${quote.title}\" is already marked as ${action}.`,
        );
      }

      if (quote.status !== "pending") {
        return htmlResponse(
          "Already reviewed",
          `The quote \"${quote.title}\" is no longer pending. Current status: ${quote.status}.`,
          409,
        );
      }

      const updates = action === "published"
        ? { status: action, review_reason: null, review_source: null }
        : { status: action };

      const { data: updatedQuote, error: updateError } = await admin
        .from("quote")
        .update(updates)
        .eq("quote_id", quoteId)
        .eq("status", "pending")
        .select("quote_id, status, title")
        .maybeSingle();

      if (updateError) {
        throw new Error(
          `Failed to update quote ${quoteId}: ${updateError.message}`,
        );
      }

      if (!updatedQuote) {
        const latestQuote = await loadQuote(admin, quoteId);
        if (latestQuote?.status === action) {
          return htmlResponse(
            "Already processed",
            `The quote \"${latestQuote.title}\" is already marked as ${action}.`,
          );
        }

        return htmlResponse(
          "Already reviewed",
          `The quote \"${quote.title}\" was reviewed before this link completed.`,
          409,
        );
      }

      return htmlResponse(
        "Moderation updated",
        `The quote \"${updatedQuote.title}\" is now marked as ${updatedQuote.status}.`,
      );
    } catch (error) {
      console.error("REVIEW_QUOTE_ACTION_FAILED", error);
      return htmlResponse(
        "Moderation failed",
        error instanceof Error ? error.message : "Unknown error",
        500,
      );
    }
  },
};
