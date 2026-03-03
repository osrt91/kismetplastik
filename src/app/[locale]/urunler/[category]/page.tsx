import type { Metadata } from "next";
import { getCategoryBySlug } from "@/data/products";
import CategoryClient from "@/components/pages/CategoryClient";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";

interface PageProps {
  params: Promise<{ locale: string; category: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, category } = await params;
  const cat = getCategoryBySlug(category);

  if (!cat) {
    return { title: "Kategori bulunamadı | Kısmet Plastik" };
  }

  const isTr = locale !== "en";
  const title = isTr
    ? `${cat.name} Ürünleri | Kısmet Plastik`
    : `${cat.name} Products | Kısmet Plastik`;
  const description = cat.description;
  const url = `https://www.kismetplastik.com/${locale}/urunler/${category}`;

  return {
    title,
    description,
    openGraph: {
      title,
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
          alt: `${cat.name} - Kısmet Plastik`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/images/og-image.png"],
    },
    alternates: {
      canonical: url,
      languages: {
        tr: `https://www.kismetplastik.com/tr/urunler/${category}`,
        en: `https://www.kismetplastik.com/en/urunler/${category}`,
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
            { name: isTr ? "Ana Sayfa" : "Home", url: `https://www.kismetplastik.com/${locale}` },
            { name: isTr ? "Ürünler" : "Products", url: `https://www.kismetplastik.com/${locale}/urunler` },
            { name: cat.name, url: `https://www.kismetplastik.com/${locale}/urunler/${category}` },
          ]}
        />
      )}
      <CategoryClient />
    </>
  );
}
