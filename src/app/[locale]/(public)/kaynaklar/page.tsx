import { getResources } from "@/lib/content";
import ResourcesClient from "@/components/pages/ResourcesClient";

export default async function KaynaklarPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await params;
  const resources = await getResources();
  return <ResourcesClient resources={resources} />;
}
