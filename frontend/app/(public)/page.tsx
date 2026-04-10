import { Metadata } from "next";

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
  return <>Home page</>;
}
