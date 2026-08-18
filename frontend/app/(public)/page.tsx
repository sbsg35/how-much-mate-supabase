import { Metadata } from "next";
import { LandingPage } from "@/modules/landing/LandingPage";
import { getRandomCategories } from "@/service/category.server";
import { getPublicQuotes } from "@/service/admin-quote";

export const metadata: Metadata = {
  title: "How Much Mate? | Know what a job should cost",
  description:
    "Compare community-submitted quotes for everyday services in Australia.",
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
