import { getPageContent, getSettings, getCareerListings } from "@/lib/content";
import KariyerClient from "@/components/pages/KariyerClient";

export default async function KariyerPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await params;
  const [content, settings, listings] = await Promise.all([
    getPageContent("career"),
    getSettings(),
    getCareerListings(),
  ]);
  return <KariyerClient content={content} settings={settings} listings={listings} />;
}
