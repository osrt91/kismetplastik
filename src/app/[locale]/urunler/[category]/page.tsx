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

export default async function CategoryPage({ params }: PageProps) {
  const { locale, category } = await params;
  const cat = getCategoryBySlug(category);

  const breadcrumbSchema = cat
    ? {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: locale === "en" ? "Home" : "Ana Sayfa",
            item: `https://www.kismetplastik.com/${locale}`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: locale === "en" ? "Products" : "Ürünler",
            item: `https://www.kismetplastik.com/${locale}/urunler`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: cat.name,
            item: `https://www.kismetplastik.com/${locale}/urunler/${category}`,
          },
        ],
      }
    : null;

  return (
    <>
      {breadcrumbSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
      )}
      <CategoryClient />
    </>
  );
}
