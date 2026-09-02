import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/admin/",
          "/api/",
          "/mykundali/dashboard",
          "/mykundali/dashboard/",
          "/mykundali/assessment",
          "/mykundali/assessment/",
          "/mykundali/login",
          "/mykundali/payment-failed",
          "/mykundali/maintenance",
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
