import type { Metadata } from "next";
import { locales, defaultLocale } from "@/lib/locales";

const BASE =
  process.env.NEXT_PUBLIC_BASE_URL || "https://www.kismetplastik.com";
const PATH = "teklif-al";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isTr = locale === "tr";

  const title = isTr ? "Teklif Al" : "Get a Quote";
  const description = isTr
    ? "Kısmet Plastik'ten ücretsiz teklif alın. PET şişe, sprey, kapak ve özel üretim kozmetik ambalaj çözümleri için hemen formu doldurun."
    : "Get a free quote from Kismet Plastik. Fill out the form for PET bottles, sprays, caps and custom cosmetic packaging solutions.";

  return {
    title,
    description,
    openGraph: {
      title: isTr
        ? "Teklif Al | Kısmet Plastik"
        : "Get a Quote | Kismet Plastik",
      description: isTr
        ? "Kozmetik ambalaj çözümleri için ücretsiz teklif alın. PET şişe, sprey ve kapak."
        : "Get a free quote for cosmetic packaging solutions. PET bottles, sprays and caps.",
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
