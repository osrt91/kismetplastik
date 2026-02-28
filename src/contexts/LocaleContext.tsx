"use client";

import {
  createContext,
  useContext,
  useMemo,
} from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/i18n";
import type { default as trType } from "@/locales/tr.json";

type Dictionary = typeof trType;

const LocaleContext = createContext<{
  locale: Locale;
  setLocale: (locale: Locale) => void;
  dict: Dictionary;
} | null>(null);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();

  const locale: Locale =
    params?.locale === "en" ? "en" : "tr";

  const dict = useMemo(() => getDictionary(locale), [locale]);

  const setLocale = (next: Locale) => {
    const pathWithoutLocale = pathname.replace(/^\/(tr|en)/, "") || "/";
    router.push(`/${next}${pathWithoutLocale}`);
  };

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
