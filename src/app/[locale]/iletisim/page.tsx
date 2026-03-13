import { getPageContent, getSettings } from "@/lib/content";
import IletisimClient from "@/components/pages/IletisimClient";

export default async function IletisimPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await params;
  const [content, settings] = await Promise.all([
    getPageContent("contact"),
    getSettings(),
  ]);
  return <IletisimClient content={content} settings={settings} />;
}
