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
    path: "/bayi-kayit",
    title: {
      tr: "Bayi Kayıt",
      en: "Dealer Registration",
    },
    description: {
      tr: "Kısmet Plastik bayi kayıt formu. B2B kozmetik ambalaj bayiliği için başvurun ve özel fiyatlandırma avantajlarından yararlanın.",
      en: "Kısmet Plastik dealer registration form. Apply for B2B cosmetic packaging dealership and benefit from exclusive pricing.",
    },
  });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
