import type { Metadata } from "next";
import { getProductBySlug, getCategoryBySlug } from "@/data/products";
import ProductDetailClient from "@/components/pages/ProductDetailClient";

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

  const title = locale === "en"
    ? `${product.name} - ${cat.name} | Kısmet Plastik`
    : `${product.name} - ${cat.name} | Kısmet Plastik`;

  const description = product.shortDescription || product.description;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: `https://www.kismetplastik.com/${locale}/urunler/${category}/${slug}`,
      siteName: "Kısmet Plastik",
    },
    alternates: {
      canonical: `https://www.kismetplastik.com/${locale}/urunler/${category}/${slug}`,
      languages: {
        tr: `https://www.kismetplastik.com/tr/urunler/${category}/${slug}`,
        en: `https://www.kismetplastik.com/en/urunler/${category}/${slug}`,
      },
    },
  };
}

export default function ProductDetailPage() {
  return <ProductDetailClient />;
}
