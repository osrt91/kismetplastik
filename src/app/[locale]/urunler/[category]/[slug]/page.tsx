import type { Metadata } from "next";
import { getProductBySlug, getCategoryBySlug } from "@/data/products";
import ProductDetailClient from "@/components/pages/ProductDetailClient";
import { ProductJsonLd, BreadcrumbJsonLd } from "@/components/seo/JsonLd";

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

  const title = `${product.name} - ${cat.name} | Kısmet Plastik`;
  const description = product.shortDescription || product.description;
  const url = `https://www.kismetplastik.com/${locale}/urunler/${category}/${slug}`;

  return {
    title,
    description,
    openGraph: {
      title,
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
          alt: `${product.name} - Kısmet Plastik`,
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
        tr: `https://www.kismetplastik.com/tr/urunler/${category}/${slug}`,
        en: `https://www.kismetplastik.com/en/urunler/${category}/${slug}`,
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
            description={product.shortDescription || product.description}
            category={cat.name}
            material={product.material}
            inStock={product.inStock}
          />
          <BreadcrumbJsonLd
            items={[
              { name: isTr ? "Ana Sayfa" : "Home", url: `https://www.kismetplastik.com/${locale}` },
              { name: isTr ? "Ürünler" : "Products", url: `https://www.kismetplastik.com/${locale}/urunler` },
              { name: cat.name, url: `https://www.kismetplastik.com/${locale}/urunler/${category}` },
              { name: product.name, url: `https://www.kismetplastik.com/${locale}/urunler/${category}/${slug}` },
            ]}
          />
        </>
      )}
      <ProductDetailClient />
    </>
  );
}
