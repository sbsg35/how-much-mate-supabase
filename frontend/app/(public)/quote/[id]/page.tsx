import { Metadata } from "next";
import { headers } from "next/headers";
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
    const description = `Check out this quote from ${quote.business_name} on How Much Mate. ${quote.description.substring(0, 140)}`;

    return {
      title: `Check out this quote: ${quote.title}`,
      description,
      openGraph: {
        title: `Check out this quote: ${quote.title}`,
        description,
        type: "article",
      },
      twitter: {
        card: "summary_large_image",
        title: `Check out this quote: ${quote.title}`,
        description,
      },
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

  const requestHeaders = await headers();
  const host =
    requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");
  const protocol = requestHeaders.get("x-forwarded-proto") ?? "https";
  const shareUrl = host
    ? `${protocol}://${host}/quote/${(await params).id}`
    : `/quote/${(await params).id}`;

  return <QuoteDetailPage quote={quote} shareUrl={shareUrl} />;
}
