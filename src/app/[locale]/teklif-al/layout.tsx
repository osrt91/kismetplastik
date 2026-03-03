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
    path: "/teklif-al",
    title: {
      tr: "Teklif Al",
      en: "Request Quote",
    },
    description: {
      tr: "Kısmet Plastik'ten ücretsiz teklif alın. PET şişe, sprey, kapak ve özel üretim kozmetik ambalaj çözümleri için hemen formu doldurun.",
      en: "Get a free quote from Kısmet Plastik. Fill out the form for PET bottles, sprays, caps and custom cosmetic packaging solutions.",
    },
  });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
