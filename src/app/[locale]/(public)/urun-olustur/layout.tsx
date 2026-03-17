import type { Metadata } from "next";
import { locales, defaultLocale } from "@/lib/locales";

const BASE =
  process.env.NEXT_PUBLIC_BASE_URL || "https://www.kismetplastik.com";
const PATH = "urun-olustur";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isTr = locale === "tr";

  const title = isTr ? "Ürün Oluştur" : "Product Builder";
  const description = isTr
    ? "Kısmet Plastik ürün yapılandırıcısı ile özel kozmetik ambalajınızı adım adım tasarlayın. PET şişe, hacim, şekil, renk ve kapak seçeneklerini belirleyerek hemen teklif alın."
    : "Design your custom cosmetic packaging step by step with Kismet Plastik product builder. Choose PET bottle volume, shape, color and cap options to get a quote.";

  return {
    title,
    description,
    openGraph: {
      title: isTr
        ? "Ürün Oluştur | Kısmet Plastik"
        : "Product Builder | Kismet Plastik",
      description: isTr
        ? "Özel kozmetik ambalajınızı adım adım tasarlayın ve hemen teklif alın."
        : "Design your custom cosmetic packaging step by step and get a quote.",
    },
    alternates: {
      canonical: `${BASE}/${defaultLocale}/${PATH}`,
      languages: Object.fromEntries([
        ...locales.map((l) => [l, `${BASE}/${l}/${PATH}`]),
        ["x-default", `${BASE}/${defaultLocale}/${PATH}`],
      ]),
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
