import { PrivacyPage } from "@/modules/information/PrivacyPage";
import type { Metadata } from "next";
import { defaultOpenGraph, defaultTwitter } from "@/lib/seo";

const title = "Privacy Policy | How Much Mate";
const description =
  "Learn how How Much Mate collects, uses, protects, and shares information.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/privacy" },
  openGraph: { ...defaultOpenGraph, title, description },
  twitter: { ...defaultTwitter, title, description },
};

export default function Page() {
  return <PrivacyPage />;
}
