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
  const [categories, recentQuotesResponse] = await Promise.all([
    getRandomCategories(),
    getPublicQuotes({
      page: 1,
      limit: 4,
      sort_by: "newest",
      search_type: "state",
      state: null,
    }),
  ]);

  return (
    <LandingPage
      categories={categories}
      recentQuotes={recentQuotesResponse.data.quotes}
      renderedAt={new Date().toISOString()}
    />
  );
}
