import type { Metadata } from "next";

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
    title: isTr
      ? "Kaynaklar & Rehberler"
      : "Resources & Guides",
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
      canonical: `https://www.kismetplastik.com/${locale}/kaynaklar`,
      languages: {
        tr: "https://www.kismetplastik.com/tr/kaynaklar",
        en: "https://www.kismetplastik.com/en/kaynaklar",
      },
    },
  };
}

export default function KaynaklarLayout({ children }: Props) {
  return <>{children}</>;
}
