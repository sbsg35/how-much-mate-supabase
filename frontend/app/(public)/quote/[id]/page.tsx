import { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";

import { QuoteDetailPage } from "@/modules/quote/QuoteDetailPage";
import { getQuoteById, type Quote } from "@/service/admin-quote";
import { defaultOpenGraph, defaultTwitter } from "@/lib/seo";

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
    if (!quote) {
      throw new Error("Quote not found");
    }
    const categoryName = quote.category?.name ?? "job";
    const locality = quote.suburb?.locality;
    const title = locality
      ? `${categoryName} in ${locality} — How Much Mate`
      : `${categoryName} — How Much Mate`;
    const description = `See what a ${categoryName} job cost${
      locality ? ` in ${locality}` : ""
    }. One of many real quotes shared on How Much Mate.`;

    return {
      title,
      description,
      alternates: { canonical: `/quote/${p.id}` },
      openGraph: {
        ...defaultOpenGraph,
        title,
        description,
        type: "article",
      },
      twitter: {
        ...defaultTwitter,
        card: "summary_large_image",
        title,
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
    quote = response.data;
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
