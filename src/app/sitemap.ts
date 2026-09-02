import type { MetadataRoute } from "next";
import { createAdminClient } from "@/lib/supabase/admin-client";
import { SITE_URL } from "@/lib/site";

// Static marketing routes — every page a search engine should actually
// index. Account-gated app screens (/mykundali/dashboard, /admin, etc.)
// are deliberately excluded here and blocked in robots.ts instead.
const staticRoutes: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
  { path: "/", priority: 1, changeFrequency: "weekly" },
  { path: "/about", priority: 0.8, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.8, changeFrequency: "monthly" },
  { path: "/toolkit", priority: 0.8, changeFrequency: "monthly" },
  { path: "/journal", priority: 0.7, changeFrequency: "weekly" },
  { path: "/mykundali", priority: 0.6, changeFrequency: "monthly" },
  { path: "/privacy-policy", priority: 0.3, changeFrequency: "yearly" },
  { path: "/terms-of-service", priority: 0.3, changeFrequency: "yearly" },
  { path: "/refund-policy", priority: 0.3, changeFrequency: "yearly" },
  { path: "/disclaimer", priority: 0.3, changeFrequency: "yearly" },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${SITE_URL}${route.path}`,
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  try {
    const admin = createAdminClient();
    const { data: articles } = await admin
      .from("articles")
      .select("slug, updated_at")
      .eq("published", true);

    for (const article of articles ?? []) {
      entries.push({
        url: `${SITE_URL}/journal/${article.slug}`,
        lastModified: new Date(article.updated_at),
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
  } catch (err) {
    // A sitemap that's missing a few dynamic entries is far better than one
    // that 500s outright — fall back to the static routes above.
    console.error("[sitemap] Failed to load published articles:", err);
  }

  return entries;
}
