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
    path: "/katalog",
    title: {
      tr: "Katalog İndir",
      en: "Download Catalog",
    },
    description: {
      tr: "Kısmet Plastik ürün kataloglarını indirin. PET şişe, sprey, kapak ve pompa katalogları. PDF formatında ücretsiz.",
      en: "Download Kısmet Plastik product catalogs. PET bottle, spray, cap and pump catalogs. Free PDF format.",
    },
  });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
