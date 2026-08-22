import { Metadata } from "next";
import { LandingPage } from "@/modules/landing/LandingPage";
import { getRandomCategories } from "@/service/category.server";
import { getPublicQuotes } from "@/service/admin-quote";
import { defaultOpenGraph, defaultTwitter } from "@/lib/seo";

const title = "How Much Mate | See what similar jobs have cost nearby";
const description =
  "Real, community-submitted quotes for everyday services in Australia — a reference for what to expect, not a price guide.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/" },
  openGraph: { ...defaultOpenGraph, title, description },
  twitter: { ...defaultTwitter, title, description },
};

export default async function Home() {
  const [categoriesResult, recentQuotesResult] = await Promise.allSettled([
    getRandomCategories(),
    getPublicQuotes({
      page: 1,
      limit: 4,
      sort_by: "newest",
      search_type: "state",
      state: null,
    }),
  ]);

  if (categoriesResult.status === "rejected") {
    console.error("Home page: failed to load categories", categoriesResult.reason);
  }
  if (recentQuotesResult.status === "rejected") {
    console.error("Home page: failed to load recent quotes", recentQuotesResult.reason);
  }

  const categories =
    categoriesResult.status === "fulfilled" ? categoriesResult.value : [];
  const recentQuotes =
    recentQuotesResult.status === "fulfilled"
      ? recentQuotesResult.value.data.quotes
      : [];

  return (
    <LandingPage
      categories={categories}
      recentQuotes={recentQuotes}
      renderedAt={new Date().toISOString()}
    />
  );
}
