import { CreateQuoteDto, PublicQuotesSearchDto } from "@/schema";
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

type GetPublicQuotesResponse = {
  quotes: Quote[];
  has_more: boolean;
};

type PublicQuotesRpcRow = {
  quote: QuoteRow;
  suburb: QuoteSuburb | null;
  category: QuoteCategory | null;
};

async function getReadClient() {
  if (typeof window !== "undefined") {
    return supabaseBrowserClient();
  }

  const { createSsrClientFromNextCookies } = await import("@/supabase/server");
  return createSsrClientFromNextCookies();
}

export async function getPublicQuotes({
  page,
  limit,
  keyword,
  search_type,
  state,
  category_id,
  suburb_id,
  radius_km,
}: PublicQuotesSearchDto): Promise<{ data: GetPublicQuotesResponse }> {
  const client = await getReadClient();

  const { data, error } = await client.rpc("find_published_quotes", {
    p_page: page,
    p_limit: limit,
    p_keyword: keyword ?? undefined,
    p_search_type: search_type,
    p_state: state ?? undefined,
    p_category_id: category_id ?? undefined,
    p_suburb_id: suburb_id ?? undefined,
    p_radius_km: radius_km ? Number(radius_km) : undefined,
  });

  if (error) {
    throw new Error(error.message);
  }

  const rows = (data ?? []) as PublicQuotesRpcRow[];
  const has_more = rows.length > limit;
  const pageRows = has_more ? rows.slice(0, limit) : rows;

  return {
    data: {
      quotes: pageRows.map((row) => ({
        ...row.quote,
        category: row.category,
        suburb: row.suburb,
      })),
      has_more,
    },
  };
}

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
