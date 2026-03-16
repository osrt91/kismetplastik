import { getPageContent, getSettings } from "@/lib/content";
import TeklifAlClient from "@/components/pages/TeklifAlClient";

export default async function TeklifAlPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await params;
  const [content, settings] = await Promise.all([
    getPageContent("quote"),
    getSettings(),
  ]);
  return <TeklifAlClient content={content} settings={settings} />;
}
