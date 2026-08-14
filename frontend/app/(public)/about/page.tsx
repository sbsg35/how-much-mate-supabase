import { AboutPage } from "@/modules/information/AboutPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | How Much Mate",
  description:
    "Learn how How Much Mate makes local service pricing more transparent through community-submitted quotes.",
};

export default function Page() {
  return <AboutPage />;
}
