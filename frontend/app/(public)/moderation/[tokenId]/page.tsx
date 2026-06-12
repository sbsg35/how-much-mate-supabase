import { Metadata } from "next";

import { supabaseAdminServerClient } from "@/supabase/admin";
import { ModerationAction } from "@/modules/moderation/actions";
import { ModerationConfirmPage } from "@/modules/moderation/ModerationConfirmPage";
import { ModerationStatusPage } from "@/modules/moderation/ModerationStatusPage";

export const metadata: Metadata = {
  title: "Quote Moderation - How Much Mate",
};

interface PageProps {
  params: Promise<{ tokenId: string }>;
  searchParams: Promise<{ result?: string; action?: string }>;
}

async function loadToken(tokenId: string) {
  const admin = supabaseAdminServerClient();
  const { data } = await admin
    .from("quote_review_action_token")
    .select(
      "token_id, action, expires_at, used_at, quote:quote_id (title, status)",
    )
    .eq("token_id", tokenId)
    .maybeSingle();
  return { tokenData: data, now: Date.now() };
}

export default async function ModerationPage({
  params,
  searchParams,
}: PageProps) {
  const { tokenId } = await params;
  const { result, action } = await searchParams;

  if (result === "success") {
    return (
      <ModerationStatusPage
        title="Moderation updated"
        message={`The quote has been marked as ${action}.`}
      />
    );
  }

  if (result === "already_done") {
    return (
      <ModerationStatusPage
        title="Already processed"
        message={`This quote is already marked as ${action}.`}
      />
    );
  }

  if (result === "conflict") {
    return (
      <ModerationStatusPage
        title="Already reviewed"
        message="This quote was reviewed before this action completed."
      />
    );
  }

  if (result === "expired") {
    return (
      <ModerationStatusPage
        title="Link expired"
        message="This moderation link has expired."
      />
    );
  }

  if (result === "invalid") {
    return (
      <ModerationStatusPage
        title="Invalid link"
        message="This moderation link is invalid or no longer exists."
      />
    );
  }

  const { tokenData, now } = await loadToken(tokenId);

  if (!tokenData) {
    return (
      <ModerationStatusPage
        title="Invalid link"
        message="This moderation link is invalid or no longer exists."
      />
    );
  }

  if (Date.parse(tokenData.expires_at) < now) {
    return (
      <ModerationStatusPage
        title="Link expired"
        message="This moderation link has expired."
      />
    );
  }

  const quote = tokenData.quote as { title: string; status: string } | null;
  const quoteTitle = quote?.title ?? "Unknown quote";
  const currentStatus = quote?.status;
  const tokenAction = tokenData.action as ModerationAction;

  if (tokenData.used_at) {
    if (currentStatus === tokenAction) {
      return (
        <ModerationStatusPage
          title="Already processed"
          message={`"${quoteTitle}" is already marked as ${tokenAction}.`}
        />
      );
    }
    return (
      <ModerationStatusPage
        title="Already reviewed"
        message={`"${quoteTitle}" was already reviewed. Current status: ${currentStatus}.`}
      />
    );
  }

  return (
    <ModerationConfirmPage
      tokenId={tokenId}
      quoteTitle={quoteTitle}
      tokenAction={tokenAction}
    />
  );
}
