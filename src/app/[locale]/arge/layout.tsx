import type { Metadata } from "next";
import { generatePageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return generatePageMetadata({
    path: "/arge",
    titleTr: "Ar-Ge",
    titleEn: "R&D",
    descTr: "Kısmet Plastik araştırma ve geliştirme merkezi. Yenilikçi kozmetik ambalaj tasarımları, malzeme geliştirme ve sürdürülebilir çözümler.",
    descEn: "Kısmet Plastik research and development center. Innovative cosmetic packaging designs, material development and sustainable solutions.",
    locale,
  });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
