import { Metadata } from "next";
import { QuoteListPage } from "@/modules/quote/QuoteListPage";
import { getPublicQuotes } from "@/service/admin-quote";
import {
  PublicQuotesSearchDto,
  AUState,
  publicQuotesSearchSchema,
} from "@/schema";

export const metadata: Metadata = {
  title: "Browse quotes | HowMuchMate?",
  description: "Browse community-submitted quotes for services in your area.",
};

export default async function Search({
  searchParams,
}: {
  searchParams: Promise<PublicQuotesSearchDto>;
}) {
  const query = await searchParams;
  const filters = publicQuotesSearchSchema.parse(query);
  const response = await getPublicQuotes(filters);
  const { quotes, has_more } = response.data;

  return (
    <QuoteListPage
      {...filters}
      state={filters.state as AUState}
      quotes={quotes}
      has_more={has_more}
    />
  );
}
