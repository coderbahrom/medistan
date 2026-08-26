import type { MetadataRoute } from "next";
import { products } from "@/data/products";
import { locales } from "@/app/[lang]/dictionaries";
import { localeUrl } from "@/lib/seo";

/** Locale-relative paths, in descending priority order. */
const PATHS: { path: string; priority: number }[] = [
  { path: "", priority: 1.0 },
  { path: "/products", priority: 0.9 },
  { path: "/products/bone-graft-material", priority: 0.8 },
  { path: "/products/membrane", priority: 0.8 },
  ...products.map((product) => ({
    path: `/products/${product.slug}`,
    priority: 0.7,
  })),
];

/** hreflang map for one path: every locale plus x-default (English). */
function languagesFor(path: string): Record<string, string> {
  const languages: Record<string, string> = {};
  for (const lang of locales) languages[lang] = localeUrl(lang, path);
  languages["x-default"] = localeUrl("en", path);
  return languages;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return locales.flatMap((lang) =>
    PATHS.map(({ path, priority }) => ({
      url: localeUrl(lang, path),
      lastModified: now,
      changeFrequency: "monthly" as const,
      // Non-English locales rank one notch below the English original.
      priority: lang === "en" ? priority : Math.round((priority - 0.1) * 10) / 10,
      alternates: { languages: languagesFor(path) },
    }))
  );
}
