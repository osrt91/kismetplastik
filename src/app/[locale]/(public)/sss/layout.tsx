import type { Metadata } from "next";
import { locales, defaultLocale } from "@/lib/locales";

const BASE =
  process.env.NEXT_PUBLIC_BASE_URL || "https://www.kismetplastik.com";
const PATH = "sss";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isTr = locale === "tr";

  const title = isTr ? "Sıkça Sorulan Sorular" : "Frequently Asked Questions";
  const description = isTr
    ? "Kısmet Plastik kozmetik ambalaj hakkında sıkça sorulan sorular. Sipariş, ürün, kalite, teslimat ve bayilik ile ilgili merak ettikleriniz."
    : "Frequently asked questions about Kismet Plastik cosmetic packaging. Everything you need to know about orders, products, quality, delivery and dealership.";

  return {
    title,
    description,
    openGraph: {
      title: isTr ? "SSS | Kısmet Plastik" : "FAQ | Kismet Plastik",
      description: isTr
        ? "Kozmetik ambalaj hakkında sıkça sorulan sorular ve yanıtları."
        : "Frequently asked questions and answers about cosmetic packaging.",
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
