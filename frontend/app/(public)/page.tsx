import { Metadata } from "next";
import { LandingPage } from "@/modules/landing/LandingPage";

export const metadata: Metadata = {
  title: "HowMuchMate? | Know what a job should cost",
  description: "Compare community-submitted quotes for everyday services in Australia.",
};

export default function Home() {
  return <LandingPage />;
}
