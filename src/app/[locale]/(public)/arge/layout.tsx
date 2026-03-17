import type { Metadata } from "next";
import { locales, defaultLocale } from "@/lib/locales";

const BASE =
  process.env.NEXT_PUBLIC_BASE_URL || "https://www.kismetplastik.com";
const PATH = "arge";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isTr = locale === "tr";

  const title = isTr ? "Ar-Ge" : "R&D";
  const description = isTr
    ? "Kısmet Plastik Ar-Ge merkezi. Yenilikçi ambalaj tasarımları, malzeme araştırmaları ve sürdürülebilir çözümler."
    : "Kismet Plastik R&D center. Innovative packaging designs, material research and sustainable solutions.";

  return {
    title,
    description,
    openGraph: {
      title: isTr ? "Ar-Ge | Kısmet Plastik" : "R&D | Kismet Plastik",
      description: isTr
        ? "Yenilikçi ambalaj tasarımları ve sürdürülebilir çözümler."
        : "Innovative packaging designs and sustainable solutions.",
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
