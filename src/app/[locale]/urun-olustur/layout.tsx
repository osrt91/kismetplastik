import type { Metadata } from "next";
import { generatePageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return generatePageMetadata({
    path: "/urun-olustur",
    titleTr: "Ürün Oluştur",
    titleEn: "Product Builder",
    descTr: "Kısmet Plastik ürün yapılandırıcısı ile özel kozmetik ambalajınızı adım adım tasarlayın. PET şişe, hacim, şekil, renk ve kapak seçeneklerini belirleyerek hemen teklif alın.",
    descEn: "Design your custom cosmetic packaging step by step with Kısmet Plastik product builder. Choose PET bottle volume, shape, color and cap options to get a quote.",
    locale,
  });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
