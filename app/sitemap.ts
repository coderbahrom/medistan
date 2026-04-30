import type { MetadataRoute } from "next";
import { products } from "@/data/products";

const BASE = "https://medistan.co.kr";
const locales = ["en", "ar", "fr", "de", "ru"] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  for (const lang of locales) {
    const priority = lang === "en" ? 1.0 : 0.9;

    entries.push({
      url: `${BASE}/${lang}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority,
    });
    entries.push({
      url: `${BASE}/${lang}/products`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: priority - 0.1,
    });
    entries.push({
      url: `${BASE}/${lang}/products/bone-graft-material`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: priority - 0.2,
    });
    entries.push({
      url: `${BASE}/${lang}/products/membrane`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: priority - 0.2,
    });

    for (const product of products) {
      entries.push({
        url: `${BASE}/${lang}/products/${product.slug}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: priority - 0.3,
      });
    }
  }

  return entries;
}
