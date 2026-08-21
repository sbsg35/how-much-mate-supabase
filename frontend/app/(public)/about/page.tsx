import { AboutPage } from "@/modules/information/AboutPage";
import type { Metadata } from "next";
import { defaultOpenGraph, defaultTwitter } from "@/lib/seo";

const title = "About | How Much Mate";
const description =
  "Learn how How Much Mate makes local service pricing more transparent through community-submitted quotes.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/about" },
  openGraph: { ...defaultOpenGraph, title, description },
  twitter: { ...defaultTwitter, title, description },
};

export default function Page() {
  return <AboutPage />;
}
