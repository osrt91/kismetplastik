import { getPageContent, getResources } from "@/lib/content";
import KatalogClient from "@/components/pages/KatalogClient";

export default async function KatalogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await params;
  const [content, resources] = await Promise.all([
    getPageContent("catalog"),
    getResources(),
  ]);
  return <KatalogClient content={content} resources={resources} />;
}
