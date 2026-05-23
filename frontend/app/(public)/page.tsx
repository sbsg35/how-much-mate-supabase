import { Metadata } from "next";

import {
  PublicQuotesSearchDto,
  AUState,
  publicQuotesSearchSchema,
} from "@/schema";
import { createSsrClient } from "@/supabase/server";
import { cookies } from "next/headers";

export const metadata: Metadata = {
  title: "How Much Mate - Find Quotes",
  description: "Browse quotes from service providers in your area",
};

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<PublicQuotesSearchDto>;
}) {
  const serverClient = createSsrClient(cookies());
  const { data } = await serverClient.from("suburb").select("*").limit(1);

  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}
