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
    path: "/sektorler",
    title: {
      tr: "Sektörler",
      en: "Sectors",
    },
    description: {
      tr: "Kısmet Plastik'in hizmet verdiği sektörler: kozmetik, parfümeri, kişisel bakım, temizlik ve otelcilik. Her sektöre özel ambalaj çözümleri.",
      en: "Sectors served by Kısmet Plastik: cosmetics, perfumery, personal care, cleaning and hospitality. Custom packaging solutions for each sector.",
    },
  });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
