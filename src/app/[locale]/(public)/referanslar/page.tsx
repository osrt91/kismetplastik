import { getPageContent, getSettings, getReferences } from "@/lib/content";
import type { Locale } from "@/lib/locales";
import ReferanslarClient from "@/components/pages/ReferanslarClient";

export default async function ReferanslarPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const [content, settings, references] = await Promise.all([
    getPageContent("references"),
    getSettings(),
    getReferences(),
  ]);
  return (
    <ReferanslarClient
      content={content}
      settings={settings}
      references={references}
      locale={locale as Locale}
    />
  );
}
