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
    path: "/kalite",
    title: {
      tr: "Kalite & Sertifikalar",
      en: "Quality & Certifications",
    },
    description: {
      tr: "Kısmet Plastik kozmetik ambalaj kalite sertifikaları: ISO 9001, ISO 14001, ISO 45001, ISO 10002, ISO/IEC 27001, CE. 4 aşamalı kalite kontrol süreci ve laboratuvar testleri.",
      en: "Kısmet Plastik cosmetic packaging quality certifications: ISO 9001, ISO 14001, ISO 45001, ISO 10002, ISO/IEC 27001, CE. 4-stage quality control process and laboratory testing.",
    },
  });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
