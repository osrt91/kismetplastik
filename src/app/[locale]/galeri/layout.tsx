import type { Metadata } from "next";
import { generatePageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return generatePageMetadata({
    path: "/galeri",
    titleTr: "Galeri",
    titleEn: "Gallery",
    descTr: "Kısmet Plastik üretim tesisi, ürün çeşitleri ve etkinlik fotoğrafları. 1969'dan bu yana kozmetik ambalaj sektöründeki yolculuğumuz.",
    descEn: "Kısmet Plastik production facility, product range and event photos. Our journey in cosmetic packaging since 1969.",
    locale,
  });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
