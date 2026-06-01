"use server";

import { createQuoteSchema, CreateQuoteDto } from "@/schema";
import { createSsrClientFromNextCookies } from "@/supabase/server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type CreateQuoteActionResult = {
  error?: string;
};

export async function createQuoteAction(
  data: CreateQuoteDto,
): Promise<CreateQuoteActionResult | never> {
  const parsedData = createQuoteSchema.safeParse(data);
  if (!parsedData.success) {
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
    return {
      error: "User not authenticated",
    };
  }

  const { error } = await supabase
    .from("quote")
    .insert({ ...parsedData.data, profile_id: user.id });

  if (error) {
    return {
      error: error.message,
    };
  }

  revalidatePath("/user/my-quotes");
  redirect("/user/my-quotes");
}