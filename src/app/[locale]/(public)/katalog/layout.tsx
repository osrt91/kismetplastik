import type { Metadata } from "next";
import { locales, defaultLocale } from "@/lib/locales";

const BASE =
  process.env.NEXT_PUBLIC_BASE_URL || "https://www.kismetplastik.com";
const PATH = "katalog";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isTr = locale === "tr";

  const title = isTr ? "Katalog İndir" : "Download Catalog";
  const description = isTr
    ? "Kısmet Plastik ürün kataloglarını indirin. PET şişe, sprey, kapak ve pompa katalogları. PDF formatında ücretsiz."
    : "Download Kismet Plastik product catalogs. PET bottle, spray, cap and pump catalogs. Free in PDF format.";

  return {
    title,
    description,
    openGraph: {
      title: isTr
        ? "Katalog İndir | Kısmet Plastik"
        : "Download Catalog | Kismet Plastik",
      description: isTr
        ? "Kozmetik ambalaj ürün kataloglarımızı indirerek tüm ürünlerimizi inceleyin."
        : "Download our cosmetic packaging product catalogs and browse all our products.",
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
