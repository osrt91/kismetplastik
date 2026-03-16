import { getPageContent, getSettings, getReferences } from "@/lib/content";
import ReferanslarClient from "@/components/pages/ReferanslarClient";

export default async function ReferanslarPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await params;
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
    />
  );
}
