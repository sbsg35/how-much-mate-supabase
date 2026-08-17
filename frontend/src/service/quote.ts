import { useAuth } from "@/providers/AuthProvider";
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
    throw new Error(
      "Quote not found or you do not have permission to delete it",
    );
  }

  return deletedQuote.quote_id;
}

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

const userQuoteQuery = async (quoteId: string, userId: string) => {
  const { data, error } = await supabaseBrowserClient()
    .from("quote")
    .select(
      `
      *,
      category:category_id (category_id, name, slug),
      suburb:suburb_id (suburb_id, locality, postcode, state)
    `,
    )
    .eq("quote_id", quoteId)
    .eq("profile_id", userId)
    .neq("status", "flagged")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as Quote;
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
    .neq("status", "flagged")
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

export const useUserQuote = (quoteId: string) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: quoteQueryKeys.userQuote(quoteId),
    queryFn: async () => {
      if (!user) {
        throw new Error("User not authenticated");
      }

      return userQuoteQuery(quoteId, user.id);
    },
    enabled: Boolean(user && quoteId),
  });
};
