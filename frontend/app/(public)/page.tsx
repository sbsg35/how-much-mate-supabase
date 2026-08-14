import { Metadata } from "next";
import { LandingPage } from "@/modules/landing/LandingPage";
import { getRandomCategories } from "@/service/category.server";

export const metadata: Metadata = {
  title: "How Much Mate? | Know what a job should cost",
  description: "Compare community-submitted quotes for everyday services in Australia.",
};

export default async function Home() {
  const categories = await getRandomCategories();

  return <LandingPage categories={categories} />;
}
