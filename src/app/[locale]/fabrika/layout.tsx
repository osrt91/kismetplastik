import type { Metadata } from "next";

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
    ? "Fabrika Turu | Kismet Plastik Uretim Tesisi"
    : "Factory Tour | Kismet Plastik Production Facility";

  const description = isTr
    ? "Kismet Plastik uretim tesisini kesfet. 10.000+ m2 uretim alani, 50+ modern makine ve aylik 1 milyonun uzerinde uretim kapasitesi ile hizmetinizdeyiz."
    : "Explore Kismet Plastik production facility. 10,000+ sqm production area, 50+ modern machines and over 1 million monthly production capacity.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: `https://www.kismetplastik.com/${locale}/fabrika`,
      siteName: "Kismet Plastik",
      images: [
        {
          url: "/images/og-image.png",
          width: 1200,
          height: 630,
          alt: isTr
            ? "Kismet Plastik Fabrika"
            : "Kismet Plastik Factory",
        },
      ],
    },
    alternates: {
      canonical: `https://www.kismetplastik.com/${locale}/fabrika`,
      languages: {
        tr: "https://www.kismetplastik.com/tr/fabrika",
        en: "https://www.kismetplastik.com/en/fabrika",
      },
    },
  };
}

export default function FabrikaLayout({ children }: LayoutProps) {
  return <>{children}</>;
}
