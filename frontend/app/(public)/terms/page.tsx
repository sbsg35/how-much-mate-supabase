import { TermsPage } from "@/modules/information/TermsPage";
import type { Metadata } from "next";
import { defaultOpenGraph, defaultTwitter } from "@/lib/seo";

const title = "Terms of Use | How Much Mate";
const description = "Read the Terms of Use for How Much Mate.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/terms" },
  openGraph: { ...defaultOpenGraph, title, description },
  twitter: { ...defaultTwitter, title, description },
};

export default function Page() {
  return <TermsPage />;
}
