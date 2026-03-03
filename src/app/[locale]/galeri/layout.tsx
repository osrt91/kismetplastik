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
    path: "/galeri",
    title: {
      tr: "Galeri",
      en: "Gallery",
    },
    description: {
      tr: "Kısmet Plastik üretim tesisi, ürün çeşitleri ve etkinlik fotoğrafları. 1969'dan bu yana kozmetik ambalaj sektöründeki yolculuğumuz.",
      en: "Kısmet Plastik production facility, product range and event photos. Our journey in cosmetic packaging since 1969.",
    },
  });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
