import tr from "@/locales/tr.json";
import en from "@/locales/en.json";

/** Supported locale codes. */
export type Locale = "tr" | "en";

const dictionaries: Record<Locale, typeof tr> = { tr, en };

/**
 * Returns the translation dictionary for the given locale.
 * Falls back to Turkish (`tr`) if the locale is not recognized.
 *
 * @param locale - The locale code ("tr" or "en")
 * @returns The full translation dictionary object
 *
 * @example
 * ```ts
 * const dict = getDictionary("en");
 * console.log(dict.common.home); // "Home"
 * ```
 */
export function getDictionary(locale: Locale) {
  return dictionaries[locale] ?? tr;
}
