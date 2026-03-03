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
    path: "/hakkimizda",
    title: {
      tr: "Hakkımızda",
      en: "About Us",
    },
    description: {
      tr: "Kısmet Plastik hakkında bilgi. 1969'dan bu yana kozmetik ambalaj sektöründe kalite ve güvenin adresi. Misyonumuz, vizyonumuz ve değerlerimiz.",
      en: "About Kısmet Plastik. Your trusted partner in cosmetic packaging since 1969. Our mission, vision and values.",
    },
  });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
