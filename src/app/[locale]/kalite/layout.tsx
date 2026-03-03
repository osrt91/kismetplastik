import type { Metadata } from "next";
import { generatePageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return generatePageMetadata({
    path: "/kalite",
    titleTr: "Kalite & Sertifikalar",
    titleEn: "Quality & Certifications",
    descTr: "Kısmet Plastik kozmetik ambalaj kalite sertifikaları: ISO 9001, ISO 14001, ISO 45001, ISO 10002, ISO/IEC 27001, CE. 4 aşamalı kalite kontrol süreci ve laboratuvar testleri.",
    descEn: "Kısmet Plastik cosmetic packaging quality certifications: ISO 9001, ISO 14001, ISO 45001, ISO 10002, ISO/IEC 27001, CE. 4-stage quality control and lab testing.",
    locale,
  });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
