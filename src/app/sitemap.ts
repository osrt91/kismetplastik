import type { MetadataRoute } from "next";
import { categories, products } from "@/data/products";

const BASE_URL = "https://www.kismetplastik.com";
const locales = ["tr", "en"] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = [
    { path: "", changeFrequency: "weekly" as const, priority: 1.0 },
    { path: "/urunler", changeFrequency: "weekly" as const, priority: 0.9 },
    { path: "/hakkimizda", changeFrequency: "monthly" as const, priority: 0.7 },
    { path: "/kalite", changeFrequency: "monthly" as const, priority: 0.7 },
    { path: "/iletisim", changeFrequency: "monthly" as const, priority: 0.7 },
    { path: "/teklif-al", changeFrequency: "monthly" as const, priority: 0.8 },
    { path: "/uretim", changeFrequency: "monthly" as const, priority: 0.6 },
    { path: "/sss", changeFrequency: "monthly" as const, priority: 0.5 },
    { path: "/blog", changeFrequency: "weekly" as const, priority: 0.6 },
    { path: "/kariyer", changeFrequency: "monthly" as const, priority: 0.4 },
    { path: "/katalog", changeFrequency: "monthly" as const, priority: 0.5 },
    { path: "/bayi-girisi", changeFrequency: "yearly" as const, priority: 0.3 },
    { path: "/surdurulebilirlik", changeFrequency: "monthly" as const, priority: 0.6 },
    { path: "/galeri", changeFrequency: "monthly" as const, priority: 0.5 },
    { path: "/kvkk", changeFrequency: "yearly" as const, priority: 0.3 },
  ];

  const staticPages = staticPaths.flatMap(({ path, changeFrequency, priority }) =>
    locales.map((locale) => ({
      url: `${BASE_URL}/${locale}${path}`,
      lastModified: new Date(),
      changeFrequency,
      priority,
      alternates: {
        languages: Object.fromEntries(
          locales.map((l) => [l, `${BASE_URL}/${l}${path}`])
        ),
      },
    }))
  );

  const categoryPages = categories.flatMap((cat) =>
    locales.map((locale) => ({
      url: `${BASE_URL}/${locale}/urunler/${cat.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
      alternates: {
        languages: Object.fromEntries(
          locales.map((l) => [l, `${BASE_URL}/${l}/urunler/${cat.slug}`])
        ),
      },
    }))
  );

  const productPages = products.flatMap((product) =>
    locales.map((locale) => ({
      url: `${BASE_URL}/${locale}/urunler/${product.category}/${product.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
      alternates: {
        languages: Object.fromEntries(
          locales.map((l) => [
            l,
            `${BASE_URL}/${l}/urunler/${product.category}/${product.slug}`,
          ])
        ),
      },
    }))
  );

  return [...staticPages, ...categoryPages, ...productPages];
}
