import type { Metadata } from "next";
import { generatePageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return generatePageMetadata({
    path: "/kariyer",
    titleTr: "Kariyer",
    titleEn: "Careers",
    descTr: "Kısmet Plastik kozmetik ambalaj kariyer fırsatları. Üretim mühendisi, kalite kontrol uzmanı, satış uzmanı ve daha fazla açık pozisyon.",
    descEn: "Kısmet Plastik cosmetic packaging career opportunities. Production engineer, quality control, sales and more open positions.",
    locale,
  });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
