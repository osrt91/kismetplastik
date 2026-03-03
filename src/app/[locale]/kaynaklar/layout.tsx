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
      ? "Kozmetik ambalaj sektoru icin teknik rehberler, spesifikasyonlar ve surdurulebilirlik raporlari. Ucretsiz indirilebilir PDF kaynaklar."
      : "Technical guides, specifications and sustainability reports for the cosmetic packaging industry. Free downloadable PDF resources.",
    keywords: isTr
      ? [
          "kozmetik ambalaj rehberi",
          "PET sise teknik dokuman",
          "ambalaj secim rehberi",
          "surdurulebilir ambalaj rapor",
          "kalite kontrol prosedur",
          "ambalaj kaynaklari",
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
        ? "Kaynaklar & Rehberler | Kismet Plastik"
        : "Resources & Guides | Kismet Plastik",
      description: isTr
        ? "Kozmetik ambalaj sektoru icin ucretsiz teknik rehberler ve raporlar."
        : "Free technical guides and reports for the cosmetic packaging industry.",
      type: "website",
      locale: isTr ? "tr_TR" : "en_US",
      siteName: "Kismet Plastik",
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
