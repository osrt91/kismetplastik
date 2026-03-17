import type { Metadata } from "next";
import { locales, defaultLocale } from "@/lib/locales";

const BASE =
  process.env.NEXT_PUBLIC_BASE_URL || "https://www.kismetplastik.com";
const PATH = "kaynaklar";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isTr = locale === "tr";

  return {
    title: isTr ? "Kaynaklar & Rehberler" : "Resources & Guides",
    description: isTr
      ? "Kozmetik ambalaj sektörü için teknik rehberler, spesifikasyonlar ve sürdürülebilirlik raporları. Ücretsiz indirilebilir PDF kaynaklar."
      : "Technical guides, specifications and sustainability reports for the cosmetic packaging industry. Free downloadable PDF resources.",
    keywords: isTr
      ? [
          "kozmetik ambalaj rehberi",
          "PET şişe teknik doküman",
          "ambalaj seçim rehberi",
          "sürdürülebilir ambalaj rapor",
          "kalite kontrol prosedür",
          "ambalaj kaynakları",
        ]
      : [
          "cosmetic packaging guide",
          "PET bottle technical document",
          "packaging selection guide",
          "sustainable packaging report",
          "quality control procedures",
          "packaging resources",
        ],
    openGraph: {
      title: isTr
        ? "Kaynaklar & Rehberler | Kısmet Plastik"
        : "Resources & Guides | Kismet Plastik",
      description: isTr
        ? "Kozmetik ambalaj sektörü için ücretsiz teknik rehberler ve raporlar."
        : "Free technical guides and reports for the cosmetic packaging industry.",
      type: "website",
      locale: isTr ? "tr_TR" : "en_US",
      siteName: "Kısmet Plastik",
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

export default function KaynaklarLayout({ children }: Props) {
  return <>{children}</>;
}
