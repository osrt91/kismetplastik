import type { Metadata } from "next";
import { generatePageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return generatePageMetadata({
    path: "/katalog",
    titleTr: "Katalog İndir",
    titleEn: "Download Catalog",
    descTr: "Kısmet Plastik ürün kataloglarını indirin. PET şişe, sprey, kapak ve pompa katalogları. PDF formatında ücretsiz.",
    descEn: "Download Kısmet Plastik product catalogs. PET bottles, sprays, caps and pumps. Free PDF format.",
    locale,
  });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
