import type { Metadata } from "next";
import { generatePageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return generatePageMetadata({
    path: "/iletisim",
    titleTr: "İletişim",
    titleEn: "Contact",
    descTr: "Kısmet Plastik kozmetik ambalaj iletişim bilgileri. Teklif talebi, bilgi ve her türlü sorunuz için bizimle iletişime geçin. Tel: 0212 549 87 03",
    descEn: "Kısmet Plastik cosmetic packaging contact information. Reach out for quotes, inquiries and any questions. Phone: +90 212 549 87 03",
    locale,
  });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
