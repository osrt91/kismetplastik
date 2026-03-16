import { getPageContent, getSettings } from "@/lib/content";
import KaliteClient from "@/components/pages/KaliteClient";

export default async function KalitePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await params;
  const [content, settings] = await Promise.all([
    getPageContent("quality"),
    getSettings(),
  ]);
  return <KaliteClient content={content} settings={settings} />;
}
