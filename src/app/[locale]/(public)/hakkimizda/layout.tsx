import type { Metadata } from "next";
import { locales, defaultLocale } from "@/lib/locales";

const BASE =
  process.env.NEXT_PUBLIC_BASE_URL || "https://www.kismetplastik.com";
const PATH = "hakkimizda";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isTr = locale === "tr";

  const title = isTr ? "Hakkımızda" : "About Us";
  const description = isTr
    ? "Kısmet Plastik hakkında bilgi. 1969'dan bu yana kozmetik ambalaj sektöründe kalite ve güvenin adresi. Misyonumuz, vizyonumuz ve değerlerimiz."
    : "About Kismet Plastik. The address of quality and trust in cosmetic packaging since 1969. Our mission, vision and values.";

  return {
    title,
    description,
    openGraph: {
      title: isTr
        ? "Hakkımızda | Kısmet Plastik"
        : "About Us | Kismet Plastik",
      description: isTr
        ? "1969'dan bu yana kozmetik ambalaj sektöründe kalite ve güvenin adresi."
        : "The address of quality and trust in cosmetic packaging since 1969.",
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
