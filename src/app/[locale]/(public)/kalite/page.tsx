import { getPageContent, getSettings } from "@/lib/content";
import { getDictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/locales";
import KaliteClient from "@/components/pages/KaliteClient";

export default async function KalitePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const [content, settings, dict] = await Promise.all([
    getPageContent("quality"),
    getSettings(),
    getDictionary(locale as Locale),
  ]);
  return <KaliteClient content={content} settings={settings} locale={locale as Locale} dict={dict} />;
}
