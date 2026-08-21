import type { MetadataRoute } from "next";
import { getAppConfig } from "@/lib/config";

const AI_TRAINING_CRAWLERS = [
  "GPTBot",
  "ClaudeBot",
  "Google-Extended",
  "CCBot",
  "Bytespider",
  "Meta-ExternalAgent",
  "cohere-ai",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/auth/", "/moderation/", "/user/"],
      },
      {
        userAgent: AI_TRAINING_CRAWLERS,
        disallow: "/",
      },
    ],
    sitemap: `${getAppConfig().frontendUrl}/sitemap.xml`,
  };
}
