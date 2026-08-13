"use server";

import { redirect } from "next/navigation";

import { supabaseAdminServerClient } from "@/supabase/admin";

export type ModerationAction = "published" | "flagged";

export async function submitModerationAction(formData: FormData) {
  const tokenId = formData.get("tokenId") as string;
  const admin = supabaseAdminServerClient();

  const { data: existingToken } = await admin
    .from("quote_review_action_token")
    .select("token_id, quote_id, action, expires_at, used_at")
    .eq("token_id", tokenId)
    .maybeSingle();

  if (!existingToken) {
    redirect(`/moderation/${tokenId}?result=invalid`);
  }

  if (Date.parse(existingToken.expires_at) < Date.now()) {
    redirect(`/moderation/${tokenId}?result=expired`);
  }

  const action = existingToken.action as ModerationAction;
  const quoteId = existingToken.quote_id;

  if (existingToken.used_at) {
    redirect(`/moderation/${tokenId}?result=already_done&action=${action}`);
  }

  const now = new Date().toISOString();
  const { data: consumedToken } = await admin
    .from("quote_review_action_token")
    .update({ used_at: now })
    .eq("token_id", tokenId)
    .is("used_at", null)
    .gt("expires_at", now)
    .select("token_id")
    .maybeSingle();

  if (!consumedToken) {
    const { data: latestQuote } = await admin
      .from("quote")
      .select("status")
      .eq("quote_id", quoteId)
      .maybeSingle();

    if (latestQuote?.status === action) {
      redirect(`/moderation/${tokenId}?result=already_done&action=${action}`);
    }
    redirect(`/moderation/${tokenId}?result=conflict`);
  }

  const updates: {
    status: string;
    review_reason?: null;
    review_source?: null;
  } =
    action === "published"
      ? { status: action, review_reason: null, review_source: null }
      : { status: action };

  const { data: updatedQuote } = await admin
    .from("quote")
    .update(updates)
    .eq("quote_id", quoteId)
    .eq("status", "pending")
    .select("quote_id")
    .maybeSingle();

  if (!updatedQuote) {
    redirect(`/moderation/${tokenId}?result=conflict`);
  }

  redirect(`/moderation/${tokenId}?result=success&action=${action}`);
}
