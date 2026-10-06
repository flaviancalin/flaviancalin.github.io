import type { MetadataRoute } from "next";
import { ARTICOLE, SITE_URL, TEME } from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const pagini = ["", "/despre-mine", "/despre-mine/cv", "/program", "/spune-mi-problema", "/implica-te", "/noutati", "/contact", "/termeni-si-conditii", "/politica-de-confidentialitate", "/politica-de-cookies"];
  return [
    ...pagini.map((p) => ({ url: `${SITE_URL}${p}`, changeFrequency: "weekly" as const, priority: p === "" ? 1 : 0.7 })),
    ...TEME.map((t) => ({ url: `${SITE_URL}/program/${t.slug}`, priority: 0.6 })),
    ...ARTICOLE.map((a) => ({ url: `${SITE_URL}/noutati/${a.slug}`, priority: 0.5 })),
  ];
}
