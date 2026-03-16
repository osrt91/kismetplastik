import { getPageContent } from "@/lib/content";
import PreOrderClient from "@/components/pages/PreOrderClient";

export default async function OnSiparisPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await params;
  const content = await getPageContent("preorder");
  return <PreOrderClient content={content} />;
}
