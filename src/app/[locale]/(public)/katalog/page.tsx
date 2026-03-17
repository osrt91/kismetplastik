import { getPageContent, getResources } from "@/lib/content";
import { getDictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/locales";
import KatalogClient from "@/components/pages/KatalogClient";

export default async function KatalogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const [content, resources, dict] = await Promise.all([
    getPageContent("catalog"),
    getResources(),
    getDictionary(locale as Locale),
  ]);
  return <KatalogClient content={content} resources={resources} locale={locale as Locale} dict={dict} />;
}
