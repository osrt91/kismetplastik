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
    path: "/fuarlar",
    title: {
      tr: "Fuarlar",
      en: "Trade Fairs",
    },
    description: {
      tr: "Kısmet Plastik'in katıldığı kozmetik ambalaj fuarları ve etkinlikleri. Cosmoprof, BeautyEurasia ve sektör buluşmaları.",
      en: "Cosmetic packaging trade fairs and events attended by Kısmet Plastik. Cosmoprof, BeautyEurasia and industry gatherings.",
    },
  });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
