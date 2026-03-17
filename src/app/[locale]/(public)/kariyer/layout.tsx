import type { Metadata } from "next";
import { locales, defaultLocale } from "@/lib/locales";

const BASE =
  process.env.NEXT_PUBLIC_BASE_URL || "https://www.kismetplastik.com";
const PATH = "kariyer";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isTr = locale === "tr";

  const title = isTr ? "Kariyer" : "Careers";
  const description = isTr
    ? "Kısmet Plastik kozmetik ambalaj kariyer fırsatları. Üretim mühendisi, kalite kontrol uzmanı, satış uzmanı ve daha fazla açık pozisyon."
    : "Kismet Plastik cosmetic packaging career opportunities. Production engineer, quality control specialist, sales representative and more open positions.";

  return {
    title,
    description,
    openGraph: {
      title: isTr ? "Kariyer | Kısmet Plastik" : "Careers | Kismet Plastik",
      description: isTr
        ? "Kısmet Plastik ailesine katılın. Açık pozisyonları inceleyin."
        : "Join the Kismet Plastik family. Browse open positions.",
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
