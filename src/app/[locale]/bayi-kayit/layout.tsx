import type { Metadata } from "next";
import { generatePageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return generatePageMetadata({
    path: "/bayi-kayit",
    titleTr: "Bayi Kayıt",
    titleEn: "Dealer Registration",
    descTr: "Kısmet Plastik kozmetik ambalaj bayilik başvurusu. Bayi olun, özel fiyatlardan ve kampanyalardan yararlanın.",
    descEn: "Kısmet Plastik cosmetic packaging dealership application. Become a dealer and benefit from exclusive prices and campaigns.",
    locale,
  });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
