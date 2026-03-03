import type { Metadata } from "next";
import { generatePageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return generatePageMetadata({
    path: "/hakkimizda",
    titleTr: "Hakkımızda",
    titleEn: "About Us",
    descTr: "Kısmet Plastik hakkında bilgi. 1969'dan bu yana kozmetik ambalaj sektöründe kalite ve güvenin adresi. Misyonumuz, vizyonumuz ve değerlerimiz.",
    descEn: "About Kısmet Plastik. A trusted name in cosmetic packaging since 1969. Our mission, vision and values.",
    locale,
  });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
