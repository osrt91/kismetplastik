import tr from "@/locales/tr.json";
import en from "@/locales/en.json";
import ar from "@/locales/ar.json";
import ru from "@/locales/ru.json";
import fr from "@/locales/fr.json";
import de from "@/locales/de.json";
import es from "@/locales/es.json";
import zh from "@/locales/zh.json";
import ja from "@/locales/ja.json";
import ko from "@/locales/ko.json";
import pt from "@/locales/pt.json";

export type Locale = "tr" | "en" | "ar" | "ru" | "fr" | "de" | "es" | "zh" | "ja" | "ko" | "pt";

export const allLocales: Locale[] = ["tr", "en", "ar", "ru", "fr", "de", "es", "zh", "ja", "ko", "pt"];

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

const dictionaries: Record<Locale, typeof tr> = { tr, en, ar, ru, fr, de, es, zh, ja, ko, pt };

export function getDictionary(locale: Locale) {
  return dictionaries[locale] ?? tr;
}
