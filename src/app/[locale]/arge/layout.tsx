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
    path: "/arge",
    title: {
      tr: "Ar-Ge",
      en: "R&D",
    },
    description: {
      tr: "Kısmet Plastik Ar-Ge merkezi. Kozmetik ambalaj inovasyonu, yeni malzeme geliştirme, sürdürülebilir ambalaj araştırmaları ve kalıp tasarımı.",
      en: "Kısmet Plastik R&D center. Cosmetic packaging innovation, new material development, sustainable packaging research and mold design.",
    },
  });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
