import { getPageContent, getSettings } from "@/lib/content";
import { getDictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/locales";
import UretimClient from "@/components/pages/UretimClient";

export default async function UretimPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const [content, settings, dict] = await Promise.all([
    getPageContent("production"),
    getSettings(),
    getDictionary(locale as Locale),
  ]);
  return <UretimClient content={content} settings={settings} locale={locale as Locale} dict={dict} />;
}
