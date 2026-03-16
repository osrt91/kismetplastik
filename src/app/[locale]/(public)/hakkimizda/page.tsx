import { getPageContent, getSettings } from "@/lib/content";
import HakkimizdaClient from "@/components/pages/HakkimizdaClient";

export default async function HakkimizdaPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await params;
  const [content, settings] = await Promise.all([
    getPageContent("about"),
    getSettings(),
  ]);
  return <HakkimizdaClient content={content} settings={settings} />;
}
