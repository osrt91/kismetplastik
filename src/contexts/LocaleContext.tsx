"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import type { Locale } from "@/lib/i18n";
import type { Dictionary } from "@/lib/i18n";
import { getDictionary, getFallbackDictionary, allLocales } from "@/lib/i18n";

const LocaleContext = createContext<{
  locale: Locale;
  setLocale: (locale: Locale) => void;
  dict: Dictionary;
} | null>(null);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();

  const locale: Locale = allLocales.includes(params?.locale as Locale)
    ? (params?.locale as Locale)
    : "tr";

  const [dict, setDict] = useState<Dictionary>(getFallbackDictionary);

  useEffect(() => {
    let cancelled = false;
    getDictionary(locale).then((d) => {
      if (!cancelled) setDict(d);
    });
    return () => { cancelled = true; };
  }, [locale]);

  const setLocale = useCallback((next: Locale) => {
    const localePattern = allLocales.join("|");
    const localeRegex = new RegExp(`^/(${localePattern})`);
    const pathWithoutLocale = pathname.replace(localeRegex, "") || "/";
    router.push(`/${next}${pathWithoutLocale}`);
  }, [pathname, router]);

  return (
    <LocaleContext.Provider value={{ locale, setLocale, dict }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within LocaleProvider");
  return ctx;
}
