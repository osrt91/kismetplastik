import type { Metadata } from "next";
import { generatePageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return generatePageMetadata({
    path: "/teklif-al",
    titleTr: "Teklif Al",
    titleEn: "Get a Quote",
    descTr: "Kısmet Plastik'ten ücretsiz teklif alın. PET şişe, sprey, kapak ve özel üretim kozmetik ambalaj çözümleri için hemen formu doldurun.",
    descEn: "Get a free quote from Kısmet Plastik. Fill out the form for PET bottles, sprays, caps and custom cosmetic packaging solutions.",
    locale,
  });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
