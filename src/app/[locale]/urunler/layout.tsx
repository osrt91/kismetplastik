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
    path: "/urunler",
    title: {
      tr: "Ürünler",
      en: "Products",
    },
    description: {
      tr: "Kısmet Plastik ürün kataloğu. PET şişeler, plastik şişeler, sprey ambalajlar, kapaklar, pompalar ve özel üretim kozmetik ambalaj çözümleri. Toptan satış ve B2B fiyatları.",
      en: "Kısmet Plastik product catalog. PET bottles, plastic bottles, spray packaging, caps, pumps and custom cosmetic packaging solutions. Wholesale and B2B pricing.",
    },
  });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
