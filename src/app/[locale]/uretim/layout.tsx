import type { Metadata } from "next";
import { generatePageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return generatePageMetadata({
    path: "/uretim",
    titleTr: "Üretim Tesisi",
    titleEn: "Production Facility",
    descTr: "Kısmet Plastik kozmetik ambalaj üretim tesisi. 15.000 m² kapalı alan, 50+ üretim makinesi, 24/7 kesintisiz üretim. PET enjeksiyon ve şişirme teknolojileri.",
    descEn: "Kısmet Plastik cosmetic packaging production facility. 15,000 m² indoor area, 50+ machines, 24/7 production. PET injection and blow molding technologies.",
    locale,
  });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
