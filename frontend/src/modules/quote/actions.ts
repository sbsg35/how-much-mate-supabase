"use server";

import {
  CreateQuoteDto,
  createQuoteSchema,
  EditQuoteDto,
  editQuoteSchema,
} from "@/schema";
import { createSsrClientFromNextCookies } from "@/supabase/server";
import { supabaseAdminServerClient } from "@/supabase/admin";
import { moderateContent, reviewQuoteContent } from "@/lib/moderation";
import { sendReviewEmail } from "@/modules/moderation/sendReviewEmail";

// const DAILY_QUOTE_LIMIT = 100;
const AI_CHECKED_QUOTE_LIMIT = 5;

export type CreateQuoteActionResult = {
  error?: string;
  underReview?: boolean;
};

export type UpdateQuoteActionResult = {
  error?: string;
  underReview?: boolean;
};

function buildReviewFields(params: {
  flagged: boolean;
  reason?: string;
  source?: "moderation" | "gpt";
}) {
  const { flagged, reason, source } = params;

  if (!flagged) {
    return {
      review_reason: null,
      review_source: null,
    };
  }

  return {
    review_reason: reason ?? null,
    review_source: source ?? null,
  };
}

// async function isRateLimited(userId: string): Promise<boolean> {
//   const oneDayAgo = new Date(Date.now() - 86_400_000).toISOString();
//   const { count } = await supabaseAdminServerClient()
//     .from("quote")
//     .select("*", { count: "exact", head: true })
//     .eq("profile_id", userId)
//     .gte("created_at", oneDayAgo);
//   return (count ?? 0) >= DAILY_QUOTE_LIMIT;
// }

async function getCategoryName(categoryId: number): Promise<string> {
  const { data } = await supabaseAdminServerClient()
    .from("category")
    .select("name")
    .eq("category_id", categoryId)
    .single();
  return data?.name ?? "Unknown";
}

async function shouldRunAiChecks(userId: string): Promise<boolean> {
  const { data, error } = await supabaseAdminServerClient()
    .from("quote")
    .select("quote_id")
    .eq("profile_id", userId)
    .limit(AI_CHECKED_QUOTE_LIMIT);

  if (error) {
    throw new Error(`Failed to count submitted quotes: ${error.message}`);
  }

  return (data?.length ?? 0) < AI_CHECKED_QUOTE_LIMIT;
}

async function notifyReviewTeam(quoteId: string): Promise<void> {
  try {
    await sendReviewEmail(quoteId);
  } catch (error) {
    console.error("[quote.notifyReviewTeam] Review email failed", {
      quoteId,
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

async function checkContent(params: {
  title: string;
  business_name: string;
  description: string;
  price: number;
  categoryId: number;
}): Promise<
  { flagged: boolean; reason?: string; source?: "moderation" | "gpt" }
> {
  const { title, business_name, description, price, categoryId } = params;

  let categoryName = "Unknown";
  let moderationFlagged = false;

  try {
    [categoryName, { flagged: moderationFlagged }] = await Promise.all([
      getCategoryName(categoryId),
      moderateContent([title, business_name, description].join(" ")),
    ]);
  } catch (error) {
    console.error("[quote.checkContent] Initial moderation lookup failed", {
      categoryId,
      error: error instanceof Error ? error.message : String(error),
    });
    throw error;
  }

  if (moderationFlagged) {
    return {
      flagged: true,
      source: "moderation",
      reason: "OpenAI moderation endpoint flagged the content",
    };
  }

  let reviewFlagged = false;
  let reviewReason: string | null = null;
  try {
    ({ flagged: reviewFlagged, reason: reviewReason } =
      await reviewQuoteContent({
        title,
        business_name,
        description,
        price,
        categoryName,
      }));
  } catch (error) {
    console.error("[quote.checkContent] GPT review failed", {
      categoryId,
      categoryName,
      error: error instanceof Error ? error.message : String(error),
    });
    throw error;
  }

  if (reviewFlagged) {
    return {
      flagged: true,
      source: "gpt",
      reason: reviewReason ?? "GPT review flagged the content",
    };
  }

  return { flagged: false };
}

export async function createQuoteAction(
  data: CreateQuoteDto,
): Promise<CreateQuoteActionResult> {
  const parsedData = createQuoteSchema.safeParse(data);
  if (!parsedData.success) {
    console.error("[quote.createQuoteAction] Validation failed", {
      issues: parsedData.error.issues,
    });
    return {
      error: parsedData.error.issues[0]?.message ?? "Invalid quote data",
    };
  }

  const supabase = await createSsrClientFromNextCookies();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    console.error("[quote.createQuoteAction] Auth failed", {
      authError: authError?.message,
      hasUser: Boolean(user),
    });
    return { error: "User not authenticated" };
  }

  // if (await isRateLimited(user.id)) {
  //   return {
  //     error:
  //       "You have reached the daily limit of 100 quotes. Please try again tomorrow.",
  //   };
  // }

  const { title, business_name, description, price, category_id } =
    parsedData.data;
  let flagged = false;
  let moderationReason: string | undefined;
  let moderationSource: "moderation" | "gpt" | undefined;
  let runAiChecks: boolean;
  try {
    runAiChecks = await shouldRunAiChecks(user.id);

    if (runAiChecks) {
      ({
        flagged,
        reason: moderationReason,
        source: moderationSource,
      } = await checkContent({
        title,
        business_name,
        description,
        price,
        categoryId: category_id,
      }));
    }
  } catch (error) {
    console.error("[quote.createQuoteAction] Pre-insert checks failed", {
      userId: user.id,
      categoryId: category_id,
      error: error instanceof Error ? error.message : String(error),
    });
    return { error: "Content moderation is temporarily unavailable." };
  }

  const status = flagged ? "pending" : "published";

  console.info("[quote.createQuoteAction] Moderation decision", {
    userId: user.id,
    categoryId: category_id,
    flagged,
    status,
    aiChecksRun: runAiChecks,
    source: moderationSource,
    reason: moderationReason,
  });

  const reviewFields = buildReviewFields({
    flagged,
    reason: moderationReason,
    source: moderationSource,
  });

  const { data: createdQuote, error } = await supabaseAdminServerClient()
    .from("quote")
    .insert({
      ...parsedData.data,
      ...reviewFields,
      profile_id: user.id,
      status,
    })
    .select("quote_id")
    .single();

  if (error) {
    console.error("[quote.createQuoteAction] Insert failed", {
      userId: user.id,
      categoryId: category_id,
      status,
      error: error.message,
    });
    return { error: error.message };
  }

  if (flagged) {
    await notifyReviewTeam(createdQuote.quote_id);
    return {
      underReview: true,
    };
  }

  return {};
}

export async function updateQuoteAction(
  quoteId: string,
  data: EditQuoteDto,
): Promise<UpdateQuoteActionResult> {
  const parsedData = editQuoteSchema.safeParse(data);
  if (!parsedData.success) {
    console.error("[quote.updateQuoteAction] Validation failed", {
      quoteId,
      issues: parsedData.error.issues,
    });
    return {
      error: parsedData.error.issues[0]?.message ?? "Invalid quote data",
    };
  }

  const supabase = await createSsrClientFromNextCookies();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    console.error("[quote.updateQuoteAction] Auth failed", {
      quoteId,
      authError: authError?.message,
      hasUser: Boolean(user),
    });
    return { error: "User not authenticated" };
  }

  const { title, business_name, description, price, category_id } =
    parsedData.data;
  let flagged = false;
  let moderationReason: string | undefined;
  let moderationSource: "moderation" | "gpt" | undefined;
  try {
    ({
      flagged,
      reason: moderationReason,
      source: moderationSource,
    } = await checkContent({
      title,
      business_name,
      description,
      price,
      categoryId: category_id,
    }));
  } catch (error) {
    console.error("[quote.updateQuoteAction] checkContent failed", {
      quoteId,
      userId: user.id,
      categoryId: category_id,
      error: error instanceof Error ? error.message : String(error),
    });
    return { error: "Content moderation is temporarily unavailable." };
  }

  const status = flagged ? "pending" : "published";

  console.info("[quote.updateQuoteAction] Moderation decision", {
    quoteId,
    userId: user.id,
    categoryId: category_id,
    flagged,
    status,
    source: moderationSource,
    reason: moderationReason,
  });

  const reviewFields = buildReviewFields({
    flagged,
    reason: moderationReason,
    source: moderationSource,
  });

  const admin = supabaseAdminServerClient();
  const { data: existingQuote, error: existingQuoteError } = await admin
    .from("quote")
    .select("status")
    .eq("quote_id", quoteId)
    .eq("profile_id", user.id)
    .maybeSingle();

  if (existingQuoteError || !existingQuote) {
    console.error("[quote.updateQuoteAction] Quote lookup failed", {
      quoteId,
      userId: user.id,
      error: existingQuoteError?.message ?? "Quote not found",
    });
    return { error: existingQuoteError?.message ?? "Quote not found" };
  }

  const { data: updatedQuote, error } = await admin
    .from("quote")
    .update({
      ...parsedData.data,
      ...reviewFields,
      status,
    })
    .eq("quote_id", quoteId)
    .eq("profile_id", user.id)
    .select("quote_id")
    .single();

  if (error) {
    console.error("[quote.updateQuoteAction] Update failed", {
      quoteId,
      userId: user.id,
      categoryId: category_id,
      status,
      error: error.message,
    });
    return { error: error.message };
  }

  if (flagged) {
    if (existingQuote.status !== "pending") {
      await notifyReviewTeam(updatedQuote.quote_id);
    }
    return {
      underReview: true,
    };
  }

  return {};
}
