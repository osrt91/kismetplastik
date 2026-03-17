import type { Metadata } from "next";
import { locales, defaultLocale } from "@/lib/locales";

const BASE =
  process.env.NEXT_PUBLIC_BASE_URL || "https://www.kismetplastik.com";
const PATH = "karsilastir";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isTr = locale === "tr";

  const title = isTr
    ? "Ürün Karşılaştırma | Kısmet Plastik"
    : "Compare Products | Kismet Plastik";

  const description = isTr
    ? "Kozmetik ambalaj ürünlerini yan yana karşılaştırın. PET şişe, kapak, pompa ve daha fazlası."
    : "Compare cosmetic packaging products side by side. PET bottles, caps, pumps and more.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: `${BASE}/${locale}/${PATH}`,
      siteName: "Kısmet Plastik",
    },
    alternates: {
      canonical: `${BASE}/${defaultLocale}/${PATH}`,
      languages: Object.fromEntries([
        ...locales.map((l) => [l, `${BASE}/${l}/${PATH}`]),
        ["x-default", `${BASE}/${defaultLocale}/${PATH}`],
      ]),
    },
    robots: {
      index: false,
      follow: true,
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
