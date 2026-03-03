import type { Metadata } from "next";
import { generatePageMetadata } from "@/lib/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return generatePageMetadata({
    locale,
    path: "/blog",
    title: {
      tr: "Blog & Haberler",
      en: "Blog & News",
    },
    description: {
      tr: "Kısmet Plastik blog. Kozmetik ambalaj sektöründen haberler, rehberler, PET şişe üretim süreçleri ve sektör trendleri.",
      en: "Kısmet Plastik blog. News, guides, PET bottle production processes and industry trends in cosmetic packaging.",
    },
  });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
