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
    path: "/urun-olustur",
    title: {
      tr: "Ürün Oluştur",
      en: "Product Builder",
    },
    description: {
      tr: "Kısmet Plastik ürün yapılandırıcısı ile özel kozmetik ambalajınızı adım adım tasarlayın. PET şişe, hacim, şekil, renk ve kapak seçeneklerini belirleyerek hemen teklif alın.",
      en: "Design your custom cosmetic packaging step by step with Kısmet Plastik product builder. Choose PET bottle, volume, shape, color and cap options to get an instant quote.",
    },
  });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
