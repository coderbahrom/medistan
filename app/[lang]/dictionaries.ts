import "server-only";

const dictionaries = {
  en: () => import("../../dictionaries/en.json").then((m) => m.default),
  ar: () => import("../../dictionaries/ar.json").then((m) => m.default),
  fr: () => import("../../dictionaries/fr.json").then((m) => m.default),
  de: () => import("../../dictionaries/de.json").then((m) => m.default),
  ru: () => import("../../dictionaries/ru.json").then((m) => m.default),
};

export type Locale = keyof typeof dictionaries;
export type Dictionary = Awaited<ReturnType<typeof getDictionary>>;

export const locales: Locale[] = ["en", "ar", "fr", "de", "ru"];

export const hasLocale = (locale: string): locale is Locale =>
  locale in dictionaries;

export const getDictionary = async (locale: Locale) =>
  dictionaries[locale]();
