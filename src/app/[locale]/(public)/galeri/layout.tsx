import type { Metadata } from "next";
import { locales, defaultLocale } from "@/lib/locales";

const BASE =
  process.env.NEXT_PUBLIC_BASE_URL || "https://www.kismetplastik.com";
const PATH = "galeri";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isTr = locale === "tr";

  const title = isTr ? "Galeri" : "Gallery";
  const description = isTr
    ? "Kısmet Plastik üretim tesisi, ürün çeşitleri ve etkinlik fotoğrafları. 1969'dan bu yana kozmetik ambalaj sektöründeki yolculuğumuz."
    : "Kismet Plastik production facility, product range and event photos. Our journey in the cosmetic packaging industry since 1969.";

  return {
    title,
    description,
    openGraph: {
      title: isTr ? "Galeri | Kısmet Plastik" : "Gallery | Kismet Plastik",
      description: isTr
        ? "Üretim tesisimiz, ürünlerimiz ve etkinliklerimizden kareler."
        : "Snapshots from our production facility, products and events.",
    },
    alternates: {
      canonical: `${BASE}/${defaultLocale}/${PATH}`,
      languages: Object.fromEntries([
        ...locales.map((l) => [l, `${BASE}/${l}/${PATH}`]),
        ["x-default", `${BASE}/${defaultLocale}/${PATH}`],
      ]),
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
