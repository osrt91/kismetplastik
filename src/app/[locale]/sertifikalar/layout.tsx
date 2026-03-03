import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isTr = locale === "tr";

  return {
    title: isTr ? "Sertifikalar | Kısmet Plastik" : "Certificates | Kısmet Plastik",
    description: isTr
      ? "Kısmet Plastik uluslararası kalite sertifikaları: ISO 9001, ISO 22000, FSSC 22000, TSE, CE, GMP. Kozmetik ambalajda güvenilir üretim standartları."
      : "Kısmet Plastik international quality certificates: ISO 9001, ISO 22000, FSSC 22000, TSE, CE, GMP. Reliable manufacturing standards in cosmetic packaging.",
    openGraph: {
      title: isTr
        ? "Sertifikalar | Kısmet Plastik"
        : "Certificates | Kısmet Plastik",
      description: isTr
        ? "Uluslararası standartlarda üretim ve kalite belgeleri."
        : "Production and quality certificates at international standards.",
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
