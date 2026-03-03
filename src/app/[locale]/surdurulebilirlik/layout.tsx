import type { Metadata } from "next";
import { generatePageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return generatePageMetadata({
    path: "/surdurulebilirlik",
    titleTr: "Sürdürülebilirlik",
    titleEn: "Sustainability",
    descTr: "Kısmet Plastik sürdürülebilirlik yaklaşımı: %100 geri dönüştürülebilir PET kozmetik ambalaj üretimi, ISO 14001 sertifikalı çevre yönetimi, enerji verimliliği ve sıfır atık hedefi.",
    descEn: "Kısmet Plastik sustainability approach: 100% recyclable PET cosmetic packaging, ISO 14001 certified environmental management, energy efficiency and zero waste goals.",
    locale,
  });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
