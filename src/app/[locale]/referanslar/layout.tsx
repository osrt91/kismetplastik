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
    path: "/referanslar",
    title: {
      tr: "Referanslar",
      en: "References",
    },
    description: {
      tr: "Kısmet Plastik referansları. 1000+ mutlu müşteri ile kozmetik ambalaj alanında güvenilir iş ortağınız.",
      en: "Kısmet Plastik references. Your trusted partner in cosmetic packaging with 1000+ satisfied customers.",
    },
  });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
