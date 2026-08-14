import { PrivacyPage } from "@/modules/information/PrivacyPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | How Much Mate",
  description:
    "Learn how How Much Mate collects, uses, protects, and shares information.",
};

export default function Page() {
  return <PrivacyPage />;
}
