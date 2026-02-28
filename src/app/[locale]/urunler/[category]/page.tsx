import type { Metadata } from "next";
import { getCategoryBySlug } from "@/data/products";
import CategoryClient from "@/components/pages/CategoryClient";

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
    ? `${cat.name} Products | Kısmet Plastik`
    : `${cat.name} Ürünleri | Kısmet Plastik`;

  const description = cat.description;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: `https://www.kismetplastik.com/${locale}/urunler/${category}`,
      siteName: "Kısmet Plastik",
    },
    alternates: {
      canonical: `https://www.kismetplastik.com/${locale}/urunler/${category}`,
      languages: {
        tr: `https://www.kismetplastik.com/tr/urunler/${category}`,
        en: `https://www.kismetplastik.com/en/urunler/${category}`,
      },
    },
  };
}

export default function CategoryPage() {
  return <CategoryClient />;
}
