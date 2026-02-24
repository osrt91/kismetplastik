import tr from "@/locales/tr.json";
import en from "@/locales/en.json";

export type Locale = "tr" | "en";

const dictionaries: Record<Locale, typeof tr> = { tr, en };

export function getDictionary(locale: Locale) {
  return dictionaries[locale] ?? tr;
}
