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
    path: "/iletisim",
    title: {
      tr: "İletişim",
      en: "Contact",
    },
    description: {
      tr: "Kısmet Plastik kozmetik ambalaj iletişim bilgileri. Teklif talebi, bilgi ve her türlü sorunuz için bizimle iletişime geçin. Tel: 0212 549 87 03",
      en: "Kısmet Plastik cosmetic packaging contact information. Get in touch for quotes, inquiries and support. Tel: 0212 549 87 03",
    },
  });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
