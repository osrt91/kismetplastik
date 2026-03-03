import type { Metadata } from "next";
import { generatePageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return generatePageMetadata({
    path: "/referanslar",
    titleTr: "Referanslar",
    titleEn: "References",
    descTr: "Kısmet Plastik müşteri referansları. Kozmetik, parfümeri ve kişisel bakım sektörlerinden güvenilir iş ortaklarımız.",
    descEn: "Kısmet Plastik customer references. Trusted business partners from cosmetics, perfumery and personal care sectors.",
    locale,
  });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
