import type { Metadata } from "next";
import { generatePageMetadata } from "@/lib/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return generatePageMetadata({
    locale,
    path: "/uretim",
    title: {
      tr: "Üretim Tesisi",
      en: "Production Facility",
    },
    description: {
      tr: "Kısmet Plastik kozmetik ambalaj üretim tesisi. 15.000 m² kapalı alan, 50+ üretim makinesi, 24/7 kesintisiz üretim. PET enjeksiyon ve şişirme teknolojileri.",
      en: "Kısmet Plastik cosmetic packaging production facility. 15,000 m² indoor area, 50+ production machines, 24/7 non-stop manufacturing. PET injection and blow molding technologies.",
    },
  });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
