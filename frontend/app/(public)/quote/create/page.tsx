import { QuoteCreatePage } from "@/modules/quote/QuoteCreatePage";
import { createQuoteAction } from "@/modules/quote/actions";

export default async function QuotePage() {
  return <QuoteCreatePage createQuoteAction={createQuoteAction} />;
}
