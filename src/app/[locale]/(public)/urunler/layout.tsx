import type { Metadata } from "next";
import { locales, defaultLocale } from "@/lib/locales";

const BASE =
  process.env.NEXT_PUBLIC_BASE_URL || "https://www.kismetplastik.com";
const PATH = "urunler";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isTr = locale === "tr";

  const title = isTr ? "Ürünler" : "Products";
  const description = isTr
    ? "Kısmet Plastik ürün kataloğu. PET şişeler, plastik şişeler, kolonya şişeleri, sprey ambalajlar, oda parfümü şişeleri, sıvı sabun şişeleri, kapaklar ve özel üretim. Toptan satış ve B2B fiyatları."
    : "Kismet Plastik product catalog. PET bottles, plastic bottles, cologne bottles, spray packaging, room fragrance bottles, liquid soap bottles, caps and custom production. Wholesale and B2B prices.";

  return {
    title,
    description,
    openGraph: {
      title: isTr ? "Ürünler | Kısmet Plastik" : "Products | Kismet Plastik",
      description: isTr
        ? "PET şişe, sprey, kapak ve pompa ürün kataloğu."
        : "PET bottle, spray, cap and pump product catalog.",
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
