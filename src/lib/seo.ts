import type { Metadata } from "next";

const BASE_URL = "https://www.kismetplastik.com";

interface PageMetadataOptions {
  path: string;
  titleTr: string;
  titleEn: string;
  descTr: string;
  descEn: string;
  locale: string;
  noindex?: boolean;
}

export function generatePageMetadata({
  path,
  titleTr,
  titleEn,
  descTr,
  descEn,
  locale,
  noindex,
}: PageMetadataOptions): Metadata {
  const isTr = locale === "tr";
  const title = isTr ? titleTr : titleEn;
  const description = isTr ? descTr : descEn;
  const url = `${BASE_URL}/${locale}${path}`;

  return {
    title,
    description,
    openGraph: {
      title: `${title} | Kısmet Plastik`,
      description,
      type: "website",
      url,
      siteName: "Kısmet Plastik",
      locale: isTr ? "tr_TR" : "en_US",
      images: [
        {
          url: "/images/og-image.png",
          width: 1200,
          height: 630,
          alt: "Kısmet Plastik",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Kısmet Plastik`,
      description,
      images: ["/images/og-image.png"],
    },
    alternates: {
      canonical: url,
      languages: {
        tr: `${BASE_URL}/tr${path}`,
        en: `${BASE_URL}/en${path}`,
        "x-default": `${BASE_URL}/tr${path}`,
      },
    },
    ...(noindex && { robots: { index: false, follow: false } }),
  };
}
