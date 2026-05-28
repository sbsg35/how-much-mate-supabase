import { CreateQuoteDto } from "@/schema";
import { supabaseBrowserClient } from "@/supabase/client";
import { Database } from "@/supabase/database.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type QuoteRow = Database["public"]["Tables"]["quote"]["Row"];

type QuoteSuburb = Pick<
  Database["public"]["Tables"]["suburb"]["Row"],
  "suburb_id" | "locality" | "postcode" | "state"
>;

type QuoteCategory = Pick<
  Database["public"]["Tables"]["category"]["Row"],
  "category_id" | "name" | "slug"
>;

export type Quote = QuoteRow & {
  category?: QuoteCategory | null;
  suburb?: QuoteSuburb | null;
  like_count?: number | null;
  dislike_count?: number | null;
  username?: string | null;
};

/**
 * Create a new quote
 * @param data The quote data to create
 * @returns Promise with the created quote data
 */
export async function createQuote(data: CreateQuoteDto): Promise<Quote> {
  const user = await supabaseBrowserClient().auth.getUser();
  if (!user.data.user) {
    throw new Error("User not authenticated");
  }

  const { data: quote, error } = await supabaseBrowserClient()
    .from("quote")
    .insert({ ...data, profile_id: user.data.user.id })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return quote;
}

/**
 * Hook to create a quote using react-query mutation
 */
export const useCreateQuoteMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createQuote,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: quoteQueryKeys.allMyQuotes(),
      });
    },
  });
};

export const quoteQueryKeys = {
  all: ["quotes"] as const,
  allMyQuotes: () => ["my-quotes"] as const,
  myQuotes: (page: number, limit: number) =>
    ["my-quotes", page, limit] as const,
  userQuote: (quoteId: string) => ["user-quote", quoteId] as const,
};
