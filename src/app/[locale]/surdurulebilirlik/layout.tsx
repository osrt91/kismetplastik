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
    path: "/surdurulebilirlik",
    title: {
      tr: "Sürdürülebilirlik",
      en: "Sustainability",
    },
    description: {
      tr: "Kısmet Plastik sürdürülebilirlik yaklaşımı: %100 geri dönüştürülebilir PET kozmetik ambalaj üretimi, ISO 14001 sertifikalı çevre yönetimi, enerji verimliliği ve sıfır atık hedefi.",
      en: "Kısmet Plastik sustainability approach: 100% recyclable PET cosmetic packaging production, ISO 14001 certified environmental management, energy efficiency and zero waste target.",
    },
  });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
