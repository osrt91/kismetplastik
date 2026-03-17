import type { Metadata } from "next";
import { locales, defaultLocale } from "@/lib/locales";

const BASE =
  process.env.NEXT_PUBLIC_BASE_URL || "https://www.kismetplastik.com";
const PATH = "fabrika";

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
    ? "Fabrika Turu | Kısmet Plastik Üretim Tesisi"
    : "Factory Tour | Kismet Plastik Production Facility";

  const description = isTr
    ? "Kısmet Plastik üretim tesisini keşfet. 10.000+ m2 üretim alanı, 50+ modern makine ve aylık 1 milyonun üzerinde üretim kapasitesi ile hizmetinizdeyiz."
    : "Explore Kismet Plastik production facility. 10,000+ sqm production area, 50+ modern machines and over 1 million monthly production capacity.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: `${BASE}/${locale}/${PATH}`,
      siteName: "Kısmet Plastik",
      images: [
        {
          url: "/images/og-image.png",
          width: 1200,
          height: 630,
          alt: isTr
            ? "Kısmet Plastik Fabrika"
            : "Kismet Plastik Factory",
        },
      ],
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

export default function FabrikaLayout({ children }: LayoutProps) {
  return <>{children}</>;
}
