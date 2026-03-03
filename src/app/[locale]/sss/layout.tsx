import type { Metadata } from "next";
import { generatePageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return generatePageMetadata({
    path: "/sss",
    titleTr: "Sıkça Sorulan Sorular",
    titleEn: "Frequently Asked Questions",
    descTr: "Kısmet Plastik kozmetik ambalaj hakkında sıkça sorulan sorular. Sipariş, ürün, kalite, teslimat ve bayilik ile ilgili merak ettikleriniz.",
    descEn: "Frequently asked questions about Kısmet Plastik cosmetic packaging. Orders, products, quality, delivery and dealership inquiries.",
    locale,
  });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
