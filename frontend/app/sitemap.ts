import type { MetadataRoute } from "next";
import { getAppConfig } from "@/lib/config";
import { getPublishedQuoteSitemapEntries } from "@/service/admin-quote";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getAppConfig().frontendUrl;

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, changeFrequency: "daily", priority: 1 },
    { url: `${baseUrl}/search`, changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/quote/create`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/about`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${baseUrl}/privacy`, changeFrequency: "yearly", priority: 0.1 },
    { url: `${baseUrl}/terms`, changeFrequency: "yearly", priority: 0.1 },
  ];

  const quotes = await getPublishedQuoteSitemapEntries();
  const quoteRoutes: MetadataRoute.Sitemap = quotes.map((quote) => ({
    url: `${baseUrl}/quote/${quote.quote_id}`,
    lastModified: quote.updated_at,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...quoteRoutes];
}
