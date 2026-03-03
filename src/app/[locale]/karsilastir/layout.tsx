import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  const title =
    locale === "en"
      ? "Compare Products | Kismet Plastik"
      : "Ürün Karşılaştırma | Kısmet Plastik";

  const description =
    locale === "en"
      ? "Compare cosmetic packaging products side by side. PET bottles, caps, pumps and more."
      : "Kozmetik ambalaj ürünlerini yan yana karşılaştırın. PET şişe, kapak, pompa ve daha fazlası.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: `https://www.kismetplastik.com/${locale}/karsilastir`,
      siteName: "Kısmet Plastik",
    },
    alternates: {
      canonical: `https://www.kismetplastik.com/${locale}/karsilastir`,
      languages: {
        tr: "https://www.kismetplastik.com/tr/karsilastir",
        en: "https://www.kismetplastik.com/en/karsilastir",
      },
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
