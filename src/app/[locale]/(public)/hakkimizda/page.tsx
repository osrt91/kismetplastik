import { getPageContent, getSettings } from "@/lib/content";
import { getDictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/locales";
import HakkimizdaClient from "@/components/pages/HakkimizdaClient";

export default async function HakkimizdaPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const [content, settings, dict] = await Promise.all([
    getPageContent("about"),
    getSettings(),
    getDictionary(locale as Locale),
  ]);
  return <HakkimizdaClient content={content} settings={settings} locale={locale as Locale} dict={dict} />;
}
