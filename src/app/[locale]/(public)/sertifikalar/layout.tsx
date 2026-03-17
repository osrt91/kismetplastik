import type { Metadata } from "next";
import { locales, defaultLocale } from "@/lib/locales";

const BASE =
  process.env.NEXT_PUBLIC_BASE_URL || "https://www.kismetplastik.com";
const PATH = "sertifikalar";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isTr = locale === "tr";

  const title = isTr
    ? "Sertifikalar | Kısmet Plastik"
    : "Certificates | Kismet Plastik";

  const description = isTr
    ? "Kısmet Plastik uluslararası kalite sertifikaları: ISO 9001, ISO 22000, FSSC 22000, TSE, CE, GMP. Kozmetik ambalajda güvenilir üretim standartları."
    : "Kismet Plastik international quality certificates: ISO 9001, ISO 22000, FSSC 22000, TSE, CE, GMP. Reliable manufacturing standards in cosmetic packaging.";

  return {
    title,
    description,
    openGraph: {
      title,
      description: isTr
        ? "Uluslararası standartlarda üretim ve kalite belgeleri."
        : "Production and quality certificates at international standards.",
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
