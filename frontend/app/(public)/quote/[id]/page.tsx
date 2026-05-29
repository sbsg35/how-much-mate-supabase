import { Metadata } from "next";
import { notFound } from "next/navigation";

import { Quote } from "@/service/quote";
import { QuoteDetailPage } from "@/modules/quote/QuoteDetailPage";
import { getQuoteById } from "@/service/admin-quote";

interface QuotePageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: QuotePageProps): Promise<Metadata> {
  try {
    const p = await params;
    const response = await getQuoteById(p.id);

    const quote = response.data;

    return {
      title: `${quote.title} - How Much Mate`,
      description: quote.description.substring(0, 160),
    };
  } catch {
    return {
      title: "Quote Details - How Much Mate",
      description: "View detailed information about this service quote",
    };
  }
}

export default async function QuotePage({ params }: QuotePageProps) {
  let quote: Quote | null = null;

  try {
    const p = await params;
    const response = await getQuoteById(p.id);
    quote = response.data as unknown as Quote;
  } catch {
    notFound();
  }

  if (!quote) {
    notFound();
  }

  return <QuoteDetailPage quote={quote} />;
}
