import type { Metadata } from "next";
import { locales, defaultLocale } from "@/lib/locales";

const BASE =
  process.env.NEXT_PUBLIC_BASE_URL || "https://www.kismetplastik.com";
const PATH = "on-siparis";

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isTr = locale === "tr";

  const title = isTr
    ? "Ön Sipariş | Kısmet Plastik"
    : "Pre-Order | Kismet Plastik";

  const description = isTr
    ? "Kısmet Plastik ön sipariş formu. Stokta olmayan veya özel üretim kozmetik ambalaj ürünleri için ön sipariş verin."
    : "Kismet Plastik pre-order form. Place pre-orders for out-of-stock or custom production cosmetic packaging products.";

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
  };
}

export default function OnSiparisLayout({ children }: LayoutProps) {
  return <>{children}</>;
}
