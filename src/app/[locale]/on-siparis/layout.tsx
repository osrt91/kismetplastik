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
    ? "On Siparis | Kismet Plastik"
    : "Pre-Order | Kismet Plastik";

  const description = isTr
    ? "Kismet Plastik on siparis formu. Stokta olmayan veya ozel uretim kozmetik ambalaj urunleri icin on siparis verin."
    : "Kismet Plastik pre-order form. Place pre-orders for out-of-stock or custom production cosmetic packaging products.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: `https://www.kismetplastik.com/${locale}/on-siparis`,
      siteName: "Kismet Plastik",
    },
    alternates: {
      canonical: `https://www.kismetplastik.com/${locale}/on-siparis`,
      languages: {
        tr: "https://www.kismetplastik.com/tr/on-siparis",
        en: "https://www.kismetplastik.com/en/on-siparis",
      },
    },
  };
}

export default function OnSiparisLayout({ children }: LayoutProps) {
  return <>{children}</>;
}
