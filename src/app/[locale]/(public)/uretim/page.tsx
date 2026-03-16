import { getPageContent, getSettings } from "@/lib/content";
import UretimClient from "@/components/pages/UretimClient";

export default async function UretimPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await params;
  const [content, settings] = await Promise.all([
    getPageContent("production"),
    getSettings(),
  ]);
  return <UretimClient content={content} settings={settings} />;
}
