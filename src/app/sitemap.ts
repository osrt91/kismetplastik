import type { MetadataRoute } from "next";
import { categories, products } from "@/data/products";

const BASE_URL = "https://www.kismetplastik.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 1.0 },
    { url: `${BASE_URL}/urunler`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${BASE_URL}/hakkimizda`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${BASE_URL}/kalite`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${BASE_URL}/iletisim`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${BASE_URL}/teklif-al`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${BASE_URL}/uretim`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${BASE_URL}/sss`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.5 },
    { url: `${BASE_URL}/blog`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.6 },
    { url: `${BASE_URL}/kariyer`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.4 },
    { url: `${BASE_URL}/katalog`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.5 },
    { url: `${BASE_URL}/bayi-girisi`, lastModified: new Date(), changeFrequency: "yearly" as const, priority: 0.3 },
    { url: `${BASE_URL}/surdurulebilirlik`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${BASE_URL}/galeri`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.5 },
    { url: `${BASE_URL}/kvkk`, lastModified: new Date(), changeFrequency: "yearly" as const, priority: 0.3 },
  ];

  const categoryPages = categories.map((cat) => ({
    url: `${BASE_URL}/urunler/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const productPages = products.map((product) => ({
    url: `${BASE_URL}/urunler/${product.category}/${product.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...categoryPages, ...productPages];
}
