"use client";

import { useLocale } from "@/contexts/LocaleContext";

import portalTr from "@/locales/portal-tr.json";
import portalEn from "@/locales/portal-en.json";
import portalAr from "@/locales/portal-ar.json";
import portalRu from "@/locales/portal-ru.json";
import portalFr from "@/locales/portal-fr.json";
import portalDe from "@/locales/portal-de.json";
import portalEs from "@/locales/portal-es.json";
import portalZh from "@/locales/portal-zh.json";
import portalJa from "@/locales/portal-ja.json";
import portalKo from "@/locales/portal-ko.json";
import portalPt from "@/locales/portal-pt.json";

const portalDicts: Record<string, typeof portalTr> = {
  tr: portalTr,
  en: portalEn,
  ar: portalAr,
  ru: portalRu,
  fr: portalFr,
  de: portalDe,
  es: portalEs,
  zh: portalZh,
  ja: portalJa,
  ko: portalKo,
  pt: portalPt,
};

export function usePortalLocale() {
  const { locale } = useLocale();
  const dict = portalDicts[locale] || portalDicts.tr;
  return { locale, dict };
}
