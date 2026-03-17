import type { Metadata } from "next";
import { locales, defaultLocale } from "@/lib/locales";

const BASE =
  process.env.NEXT_PUBLIC_BASE_URL || "https://www.kismetplastik.com";
const PATH = "kalite";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isTr = locale === "tr";

  const title = isTr ? "Kalite & Sertifikalar" : "Quality & Certificates";
  const description = isTr
    ? "Kısmet Plastik kozmetik ambalaj kalite sertifikaları: ISO 9001, ISO 14001, ISO 45001, ISO 10002, ISO/IEC 27001, CE. 4 aşamalı kalite kontrol süreci ve laboratuvar testleri."
    : "Kismet Plastik cosmetic packaging quality certificates: ISO 9001, ISO 14001, ISO 45001, ISO 10002, ISO/IEC 27001, CE. 4-stage quality control process and laboratory tests.";

  return {
    title,
    description,
    openGraph: {
      title: isTr
        ? "Kalite & Sertifikalar | Kısmet Plastik"
        : "Quality & Certificates | Kismet Plastik",
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
