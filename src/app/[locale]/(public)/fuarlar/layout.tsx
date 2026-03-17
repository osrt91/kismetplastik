import type { Metadata } from "next";
import { locales, defaultLocale } from "@/lib/locales";

const BASE =
  process.env.NEXT_PUBLIC_BASE_URL || "https://www.kismetplastik.com";
const PATH = "fuarlar";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isTr = locale === "tr";

  const title = isTr ? "Fuarlar" : "Trade Fairs";
  const description = isTr
    ? "Kısmet Plastik'in katıldığı ulusal ve uluslararası fuarlar. Kozmetik ambalaj sektöründeki etkinliklerimizi keşfedin."
    : "National and international trade fairs attended by Kismet Plastik. Discover our events in the cosmetic packaging industry.";

  return {
    title,
    description,
    openGraph: {
      title: isTr ? "Fuarlar | Kısmet Plastik" : "Trade Fairs | Kismet Plastik",
      description: isTr
        ? "Kozmetik ambalaj sektöründeki ulusal ve uluslararası fuar katılımlarımız."
        : "Our national and international trade fair participations in cosmetic packaging.",
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
