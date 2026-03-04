/**
 * Single source of truth for supported locales.
 * Used by both middleware (proxy.ts) and i18n system (i18n.ts).
 */
export const locales = ["tr", "en", "ar", "ru", "fr", "de", "es", "zh", "ja", "ko", "pt"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "tr";

export const localeNames: Record<Locale, string> = {
  tr: "Türkçe",
  en: "English",
  ar: "العربية",
  ru: "Русский",
  fr: "Français",
  de: "Deutsch",
  es: "Español",
  zh: "中文",
  ja: "日本語",
  ko: "한국어",
  pt: "Português",
};

export const localeDirections: Partial<Record<Locale, "rtl">> = {
  ar: "rtl",
};
