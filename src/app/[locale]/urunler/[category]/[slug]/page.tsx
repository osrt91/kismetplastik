import type { Metadata } from "next";
import { getProductBySlug, getCategoryBySlug } from "@/data/products";
import { ProductJsonLd, BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import ProductDetailClient from "@/components/pages/ProductDetailClient";

const BASE_URL = "https://www.kismetplastik.com";

interface PageProps {
  params: Promise<{ locale: string; category: string; slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, category, slug } = await params;
  const product = getProductBySlug(slug);
  const cat = getCategoryBySlug(category);

  if (!product || !cat) {
    return { title: "Ürün bulunamadı | Kısmet Plastik" };
  }

  const title = `${product.name} - ${cat.name}`;
  const description = product.shortDescription || product.description;
  const url = `${BASE_URL}/${locale}/urunler/${category}/${slug}`;

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
          alt: `${product.name} - Kısmet Plastik kozmetik ambalaj`,
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
        tr: `${BASE_URL}/tr/urunler/${category}/${slug}`,
        en: `${BASE_URL}/en/urunler/${category}/${slug}`,
        "x-default": `${BASE_URL}/tr/urunler/${category}/${slug}`,
      },
    },
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { locale, category, slug } = await params;
  const product = getProductBySlug(slug);
  const cat = getCategoryBySlug(category);
  const isTr = locale === "tr";

  return (
    <>
      {product && cat && (
        <>
          <ProductJsonLd
            name={product.name}
            description={product.description}
            category={cat.name}
            material={product.material}
            inStock={product.inStock}
          />
          <BreadcrumbJsonLd
            items={[
              { name: isTr ? "Ana Sayfa" : "Home", url: `${BASE_URL}/${locale}` },
              { name: isTr ? "Ürünler" : "Products", url: `${BASE_URL}/${locale}/urunler` },
              { name: cat.name, url: `${BASE_URL}/${locale}/urunler/${category}` },
              { name: product.name, url: `${BASE_URL}/${locale}/urunler/${category}/${slug}` },
            ]}
          />
        </>
      )}
      <ProductDetailClient />
    </>
  );
}
