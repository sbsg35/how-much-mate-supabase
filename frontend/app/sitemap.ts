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

  let quotes: Awaited<ReturnType<typeof getPublishedQuoteSitemapEntries>> =
    [];
  try {
    quotes = await getPublishedQuoteSitemapEntries();
  } catch (error) {
    // Supabase can transiently reject requests during build with clock-skew
    // errors like "JWT issued at future" (a known platform-side issue, not
    // something this app can fix). Don't let that fail the whole deploy —
    // fall back to the static routes and pick up quote URLs on the next build.
    console.error("Failed to fetch quote entries for sitemap:", error);
  }

  const quoteRoutes: MetadataRoute.Sitemap = quotes.map((quote) => ({
    url: `${baseUrl}/quote/${quote.quote_id}`,
    lastModified: quote.updated_at,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...quoteRoutes];
}
