"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/i18n";
import type { default as trType } from "@/locales/tr.json";

type Dictionary = typeof trType;

const LocaleContext = createContext<{
  locale: Locale;
  setLocale: (locale: Locale) => void;
  dict: Dictionary;
} | null>(null);

const STORAGE_KEY = "kismetplastik-locale";

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("tr");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as Locale | null;
      if (stored === "tr" || stored === "en") setLocaleState(stored);
    } catch (_) {}
    setMounted(true);
  }, []);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch (_) {}
  }, []);

  const dict = getDictionary(locale);

  if (!mounted) {
    return (
      <LocaleContext.Provider
        value={{ locale: "tr", setLocale, dict: getDictionary("tr") }}
      >
        {children}
      </LocaleContext.Provider>
    );
  }

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
