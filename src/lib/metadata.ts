import type { Metadata } from "next";

const BASE_URL = "https://www.kismetplastik.com";

interface PageMetadataOptions {
  locale: string;
  path: string;
  title: { tr: string; en: string };
  description: { tr: string; en: string };
  ogType?: "website" | "article";
  noIndex?: boolean;
}

export function generatePageMetadata({
  locale,
  path,
  title,
  description,
  ogType = "website",
  noIndex = false,
}: PageMetadataOptions): Metadata {
  const isTr = locale === "tr";
  const pageTitle = isTr ? title.tr : title.en;
  const pageDescription = isTr ? description.tr : description.en;
  const url = `${BASE_URL}/${locale}${path}`;

  return {
    title: pageTitle,
    description: pageDescription,
    openGraph: {
      title: `${pageTitle} | Kısmet Plastik`,
      description: pageDescription,
      type: ogType,
      url,
      siteName: "Kısmet Plastik",
      locale: isTr ? "tr_TR" : "en_US",
      images: [
        {
          url: "/images/og-image.png",
          width: 1200,
          height: 630,
          alt: isTr
            ? "Kısmet Plastik - B2B Kozmetik Ambalaj"
            : "Kısmet Plastik - B2B Cosmetic Packaging",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${pageTitle} | Kısmet Plastik`,
      description: pageDescription,
      images: ["/images/og-image.png"],
    },
    alternates: {
      canonical: url,
      languages: {
        tr: `${BASE_URL}/tr${path}`,
        en: `${BASE_URL}/en${path}`,
      },
    },
    ...(noIndex && { robots: { index: false, follow: false } }),
  };
}
