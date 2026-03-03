import type { Metadata } from "next";
import { generatePageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return generatePageMetadata({
    path: "/fuarlar",
    titleTr: "Fuarlar & Etkinlikler",
    titleEn: "Trade Fairs & Events",
    descTr: "Kısmet Plastik'in katıldığı kozmetik ambalaj fuarları ve sektör etkinlikleri. Cosmoprof, BeautyWorld ve daha fazlası.",
    descEn: "Cosmetic packaging trade fairs and industry events attended by Kısmet Plastik. Cosmoprof, BeautyWorld and more.",
    locale,
  });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
