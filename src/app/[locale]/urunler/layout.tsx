import type { Metadata } from "next";
import { generatePageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return generatePageMetadata({
    path: "/urunler",
    titleTr: "Ürünler",
    titleEn: "Products",
    descTr: "Kısmet Plastik ürün kataloğu. PET şişeler, plastik şişeler, sprey ambalajlar, kapaklar ve özel üretim kozmetik ambalaj. Toptan satış ve B2B fiyatları.",
    descEn: "Kısmet Plastik product catalog. PET bottles, plastic bottles, spray packaging, caps and custom cosmetic packaging. Wholesale and B2B pricing.",
    locale,
  });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
