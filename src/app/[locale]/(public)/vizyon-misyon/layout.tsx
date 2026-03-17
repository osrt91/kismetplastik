import type { Metadata } from "next";
import { locales, defaultLocale } from "@/lib/locales";

const BASE =
  process.env.NEXT_PUBLIC_BASE_URL || "https://www.kismetplastik.com";
const PATH = "vizyon-misyon";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isTr = locale === "tr";

  const title = isTr ? "Vizyon & Misyon" : "Vision & Mission";
  const description = isTr
    ? "Kısmet Plastik'in vizyonu ve misyonu. Kozmetik ambalaj sektöründe sürdürülebilir büyüme ve kalite odaklı yaklaşım."
    : "Kismet Plastik vision and mission. Sustainable growth and quality-focused approach in the cosmetic packaging industry.";

  return {
    title,
    description,
    openGraph: {
      title: isTr
        ? "Vizyon & Misyon | Kısmet Plastik"
        : "Vision & Mission | Kismet Plastik",
      description: isTr
        ? "Kozmetik ambalaj sektöründe sürdürülebilir büyüme ve kalite odaklı yaklaşım."
        : "Sustainable growth and quality-focused approach in the cosmetic packaging industry.",
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
