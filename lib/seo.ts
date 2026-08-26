import type { Metadata } from "next";
import { locales, type Locale } from "@/app/[lang]/dictionaries";

export const SITE_URL = "https://medistan.co.kr";

/** og:locale value per supported locale. */
export const OG_LOCALE: Record<Locale, string> = {
  en: "en_US",
  ar: "ar_SA",
  fr: "fr_FR",
  de: "de_DE",
  ru: "ru_RU",
};

/**
 * Absolute URL for a locale + locale-relative path.
 * `path` is "" for the home page, otherwise "/products", "/products/renew-oss", …
 */
export function localeUrl(lang: string, path = ""): string {
  return `${SITE_URL}/${lang}${path}`;
}

/**
 * canonical + hreflang alternates for one page across every locale.
 * Every localized URL lists all its siblings (including itself), which is what
 * Google expects; x-default points at the English version.
 */
export function alternatesFor(lang: string, path = ""): Metadata["alternates"] {
  const languages: Record<string, string> = {};
  for (const l of locales) languages[l] = localeUrl(l, path);
  languages["x-default"] = localeUrl("en", path);
  return { canonical: localeUrl(lang, path), languages };
}

/** og:locale:alternate — every locale except the current one. */
export function ogAlternateLocales(lang: string): string[] {
  return locales.filter((l) => l !== lang).map((l) => OG_LOCALE[l]);
}
