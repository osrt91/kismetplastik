import type { Metadata } from "next";
import { locales, defaultLocale } from "@/lib/locales";

const BASE =
  process.env.NEXT_PUBLIC_BASE_URL || "https://www.kismetplastik.com";
const PATH = "ambalaj-sozlugu";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isTr = locale === "tr";

  const title = isTr ? "Ambalaj Sözlüğü" : "Packaging Glossary";
  const description = isTr
    ? "Plastik ambalaj ve kozmetik ambalaj sektörüne ait terimler sözlüğü. PET, HDPE, PP, kapasite, ağız çapı ve daha fazlası."
    : "Glossary of terms for the plastic and cosmetic packaging industry. PET, HDPE, PP, capacity, neck diameter and more.";

  return {
    title,
    description,
    openGraph: {
      title: isTr
        ? "Ambalaj Sözlüğü | Kısmet Plastik"
        : "Packaging Glossary | Kismet Plastik",
      description: isTr
        ? "Plastik ve kozmetik ambalaj sektörü terimleri sözlüğü."
        : "Glossary of plastic and cosmetic packaging industry terms.",
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
