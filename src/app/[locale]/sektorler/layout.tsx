import type { Metadata } from "next";
import { generatePageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return generatePageMetadata({
    path: "/sektorler",
    titleTr: "Sektörler",
    titleEn: "Industries",
    descTr: "Kısmet Plastik'in hizmet verdiği sektörler. Kozmetik, parfümeri, kişisel bakım, temizlik ve otelcilik sektörlerine özel ambalaj çözümleri.",
    descEn: "Industries served by Kısmet Plastik. Custom packaging solutions for cosmetics, perfumery, personal care, cleaning and hospitality sectors.",
    locale,
  });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
