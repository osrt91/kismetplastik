import type { Metadata } from "next";
import { locales, defaultLocale } from "@/lib/locales";

const BASE =
  process.env.NEXT_PUBLIC_BASE_URL || "https://www.kismetplastik.com";
const PATH = "tarihce";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isTr = locale === "tr";

  const title = isTr
    ? "Tarihçe | Kısmet Plastik"
    : "History | Kismet Plastik";

  const description = isTr
    ? "Kısmet Plastik'in 1969'dan bugüne uzanan yolculuğu. Kozmetik ambalaj sektöründe yarım asrı aşkın deneyim ve kilometre taşları."
    : "Kismet Plastik's journey from 1969 to the present. Over half a century of experience and milestones in the cosmetic packaging industry.";

  return {
    title,
    description,
    openGraph: {
      title,
      description: isTr
        ? "1969'dan bugüne kozmetik ambalaj sektöründe yarım asrı aşkın deneyim."
        : "Over half a century of experience in cosmetic packaging since 1969.",
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

export default function TarihceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
