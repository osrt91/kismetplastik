import { getPageContent } from "@/lib/content";
import FactoryClient from "@/components/pages/FactoryClient";

export default async function FabrikaPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await params;
  const content = await getPageContent("factory");
  return <FactoryClient content={content} />;
}
