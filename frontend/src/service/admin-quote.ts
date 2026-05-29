import "server-only";

import { PublicQuotesSearchDto } from "@/schema";
import { Database } from "@/supabase/database.types";
import { supabaseAdminServerClient } from "@/supabase/admin";

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

export async function getPublicQuotes({
  page,
  limit,
  keyword,
  sort_by,
  search_type,
  state,
  category_id,
  suburb_id,
  radius_km,
}: PublicQuotesSearchDto): Promise<{ data: GetPublicQuotesResponse }> {
  const { data, error } = await supabaseAdminServerClient().rpc(
    "find_published_quotes",
    {
      p_page: page,
      p_limit: limit,
      p_keyword: keyword ?? undefined,
      p_sort_by: sort_by,
      p_search_type: search_type,
      p_state: state ?? undefined,
      p_category_id: category_id ?? undefined,
      p_suburb_id: suburb_id ?? undefined,
      p_radius_km: radius_km ? Number(radius_km) : undefined,
    },
  );

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
