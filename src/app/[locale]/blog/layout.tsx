import type { Metadata } from "next";
import { generatePageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return generatePageMetadata({
    path: "/blog",
    titleTr: "Blog & Haberler",
    titleEn: "Blog & News",
    descTr: "Kısmet Plastik blog. Kozmetik ambalaj sektöründen haberler, rehberler, PET şişe üretim süreçleri ve sektör trendleri.",
    descEn: "Kısmet Plastik blog. News, guides, PET bottle production processes and industry trends from the cosmetic packaging sector.",
    locale,
  });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
