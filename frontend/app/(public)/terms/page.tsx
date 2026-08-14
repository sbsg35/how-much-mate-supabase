import { TermsPage } from "@/modules/information/TermsPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Use | How Much Mate",
  description: "Read the Terms of Use for How Much Mate.",
};

export default function Page() {
  return <TermsPage />;
}
