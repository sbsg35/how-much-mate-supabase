import { useAuth } from "@/providers/AuthProvider";
import { CreateQuoteDto } from "@/schema";
import { supabaseBrowserClient } from "@/supabase/client";
import { Database } from "@/supabase/database.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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
 * Delete one of the authenticated user's quotes
 * @param quoteId The quote to delete
 */
export async function deleteQuote(quoteId: string): Promise<string> {
  const user = await supabaseBrowserClient().auth.getUser();
  if (!user.data.user) {
    throw new Error("User not authenticated");
  }

  const { data: deletedQuote, error } = await supabaseBrowserClient()
    .from("quote")
    .delete()
    .eq("quote_id", quoteId)
    .eq("profile_id", user.data.user.id)
    .select("quote_id")
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!deletedQuote) {
    throw new Error("Quote not found or you do not have permission to delete it");
  }

  return deletedQuote.quote_id;
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

export const useDeleteQuoteMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteQuote,
    onSuccess: (quoteId) => {
      queryClient.invalidateQueries({
        queryKey: quoteQueryKeys.allMyQuotes(),
      });
      queryClient.removeQueries({
        queryKey: quoteQueryKeys.userQuote(quoteId),
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

const myQuotesQuery = async (page: number, limit: number, userId: string) => {
  const { data, error } = await supabaseBrowserClient()
    .from("quote")
    .select(
      `
      *,
      category:category_id (category_id, name, slug),
      suburb:suburb_id (suburb_id, locality, postcode, state),
      profile:profile_id (username)
    `,
    )
    .eq("profile_id", userId)
    .order("created_at", { ascending: false })
    .range((page - 1) * limit, page * limit - 1);

  if (error) {
    throw new Error(error.message);
  }

  return data as Quote[];
};

export const useMyQuotes = (page: number, limit: number) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: quoteQueryKeys.myQuotes(page, limit),
    queryFn: async () => {
      if (!user) {
        throw new Error("User not authenticated");
      }
      return myQuotesQuery(page, limit, user.id);
    },
  });
};
