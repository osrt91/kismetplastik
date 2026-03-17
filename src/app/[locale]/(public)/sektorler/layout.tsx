import type { Metadata } from "next";
import { locales, defaultLocale } from "@/lib/locales";

const BASE =
  process.env.NEXT_PUBLIC_BASE_URL || "https://www.kismetplastik.com";
const PATH = "sektorler";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isTr = locale === "tr";

  const title = isTr ? "Sektörler" : "Industries";
  const description = isTr
    ? "Kısmet Plastik'in hizmet verdiği sektörler. Kozmetik, ilaç, gıda ve kimya sektörlerine özel ambalaj çözümleri."
    : "Industries served by Kismet Plastik. Custom packaging solutions for cosmetics, pharmaceutical, food and chemical industries.";

  return {
    title,
    description,
    openGraph: {
      title: isTr ? "Sektörler | Kısmet Plastik" : "Industries | Kismet Plastik",
      description: isTr
        ? "Kozmetik, ilaç, gıda ve kimya sektörlerine özel ambalaj çözümleri."
        : "Custom packaging solutions for cosmetics, pharmaceutical, food and chemical industries.",
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
