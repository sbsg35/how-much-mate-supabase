import { Metadata } from "next";
import { QuoteListPage } from "@/modules/quote/QuoteListPage";
import { getPublicQuotes } from "@/service/admin-quote";

import {
  PublicQuotesSearchDto,
  AUState,
  publicQuotesSearchSchema,
} from "@/schema";

export const metadata: Metadata = {
  title: "How Much Mate - Find Quotes",
  description: "Browse quotes from service providers in your area",
};

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<PublicQuotesSearchDto>;
}) {
  // Parse search parameters
  const query = await searchParams;

  const {
    page,
    search_type,
    state,
    keyword,
    category_id,
    suburb_id,
    radius_km,
    limit,
  } = publicQuotesSearchSchema.parse(query);

  // Fetch quotes server-side
  const response = await getPublicQuotes({
    page,
    limit,
    keyword,
    search_type,
    state,
    category_id,
    suburb_id,
    radius_km,
  });
  const { quotes, has_more } = response.data;

  return (
    <QuoteListPage
      quotes={quotes}
      page={page}
      keyword={keyword}
      search_type={search_type}
      state={state as AUState}
      limit={limit}
      category_id={category_id}
      suburb_id={suburb_id}
      radius_km={radius_km}
      has_more={has_more}
    />
  );
}
