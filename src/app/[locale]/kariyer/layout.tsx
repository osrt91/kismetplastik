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
    path: "/kariyer",
    title: {
      tr: "Kariyer",
      en: "Career",
    },
    description: {
      tr: "Kısmet Plastik kozmetik ambalaj kariyer fırsatları. Üretim mühendisi, kalite kontrol uzmanı, satış uzmanı ve daha fazla açık pozisyon.",
      en: "Kısmet Plastik cosmetic packaging career opportunities. Production engineer, quality control specialist, sales representative and more open positions.",
    },
  });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
