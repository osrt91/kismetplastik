import type { Metadata } from "next";
import { locales, defaultLocale } from "@/lib/locales";

const BASE =
  process.env.NEXT_PUBLIC_BASE_URL || "https://www.kismetplastik.com";
const PATH = "numune-talep";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isTr = locale === "tr";

  const title = isTr ? "Numune Talep" : "Sample Request";
  const description = isTr
    ? "Kısmet Plastik'ten ücretsiz numune talep edin. PET şişe, plastik şişe, kapak ve pompa numuneleri."
    : "Request free samples from Kismet Plastik. PET bottle, plastic bottle, cap and pump samples.";

  return {
    title,
    description,
    openGraph: {
      title: isTr
        ? "Numune Talep | Kısmet Plastik"
        : "Sample Request | Kismet Plastik",
      description: isTr
        ? "Kozmetik ambalaj ürünleri için ücretsiz numune talep formu."
        : "Free sample request form for cosmetic packaging products.",
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
