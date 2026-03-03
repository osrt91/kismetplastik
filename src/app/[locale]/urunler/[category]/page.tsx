import type { Metadata } from "next";
import { getCategoryBySlug } from "@/data/products";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import CategoryClient from "@/components/pages/CategoryClient";

const BASE_URL = "https://www.kismetplastik.com";

interface PageProps {
  params: Promise<{ locale: string; category: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, category } = await params;
  const cat = getCategoryBySlug(category);

  if (!cat) {
    return { title: "Kategori bulunamadı | Kısmet Plastik" };
  }

  const title = locale === "en"
    ? `${cat.name} Products`
    : `${cat.name} Ürünleri`;

  const description = cat.description;
  const url = `${BASE_URL}/${locale}/urunler/${category}`;

  return {
    title,
    description,
    openGraph: {
      title: `${title} | Kısmet Plastik`,
      description,
      type: "website",
      url,
      siteName: "Kısmet Plastik",
      locale: locale === "tr" ? "tr_TR" : "en_US",
      images: [
        {
          url: "/images/og-image.png",
          width: 1200,
          height: 630,
          alt: `${cat.name} - Kısmet Plastik`,
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
        tr: `${BASE_URL}/tr/urunler/${category}`,
        en: `${BASE_URL}/en/urunler/${category}`,
        "x-default": `${BASE_URL}/tr/urunler/${category}`,
      },
    },
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { locale, category } = await params;
  const cat = getCategoryBySlug(category);
  const isTr = locale === "tr";

  return (
    <>
      {cat && (
        <BreadcrumbJsonLd
          items={[
            { name: isTr ? "Ana Sayfa" : "Home", url: `${BASE_URL}/${locale}` },
            { name: isTr ? "Ürünler" : "Products", url: `${BASE_URL}/${locale}/urunler` },
            { name: cat.name, url: `${BASE_URL}/${locale}/urunler/${category}` },
          ]}
        />
      )}
      <CategoryClient />
    </>
  );
}
