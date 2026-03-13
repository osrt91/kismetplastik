import { getPageContent } from "@/lib/content";
import SampleRequestClient from "@/components/pages/SampleRequestClient";

export default async function NumuneTalepPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await params;
  const content = await getPageContent("sample");
  return <SampleRequestClient content={content} />;
}
