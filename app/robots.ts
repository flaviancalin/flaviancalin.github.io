import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/content";

// Preview: nimic nu se indexează. La lansare: allow "/" și disallow "/admin".
export default function robots(): MetadataRoute.Robots {
  return { rules: [{ userAgent: "*", disallow: "/" }], sitemap: `${SITE_URL}/sitemap.xml` };
}
