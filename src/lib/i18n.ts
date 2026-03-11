import tr from "@/locales/tr.json";

// Re-export from single source of truth
export { locales as allLocales, localeNames, localeDirections } from "@/lib/locales";
export type { Locale } from "@/lib/locales";

import type { Locale } from "@/lib/locales";

export type Dictionary = typeof tr;

const loaders: Record<Locale, () => Promise<Dictionary>> = {
  tr: () => Promise.resolve(tr),
  en: () => import("@/locales/en.json").then(m => m.default as unknown as Dictionary),
  ar: () => import("@/locales/ar.json").then(m => m.default as unknown as Dictionary),
  ru: () => import("@/locales/ru.json").then(m => m.default as unknown as Dictionary),
  fr: () => import("@/locales/fr.json").then(m => m.default as unknown as Dictionary),
  de: () => import("@/locales/de.json").then(m => m.default as unknown as Dictionary),
  es: () => import("@/locales/es.json").then(m => m.default as unknown as Dictionary),
  zh: () => import("@/locales/zh.json").then(m => m.default as unknown as Dictionary),
  ja: () => import("@/locales/ja.json").then(m => m.default as unknown as Dictionary),
  ko: () => import("@/locales/ko.json").then(m => m.default as unknown as Dictionary),
  pt: () => import("@/locales/pt.json").then(m => m.default as unknown as Dictionary),
};

const cache = new Map<Locale, Dictionary>();
cache.set("tr", tr);

/** Returns the fallback (Turkish) dictionary synchronously. */
export function getFallbackDictionary(): Dictionary {
  return tr;
}

/** Lazily loads the dictionary for the given locale. Falls back to Turkish on error. */
export async function getDictionary(locale: Locale): Promise<Dictionary> {
  const cached = cache.get(locale);
  if (cached) return cached;

  try {
    const dict = await loaders[locale]();
    cache.set(locale, dict);
    return dict;
  } catch {
    return tr;
  }
}
