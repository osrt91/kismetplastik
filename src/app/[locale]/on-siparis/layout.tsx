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
      url: `https://www.kismetplastik.com/${locale}/on-siparis`,
      siteName: "Kısmet Plastik",
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
