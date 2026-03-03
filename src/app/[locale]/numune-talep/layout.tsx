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
    path: "/numune-talep",
    title: {
      tr: "Numune Talep",
      en: "Sample Request",
    },
    description: {
      tr: "Kısmet Plastik kozmetik ambalaj numune talebi. PET şişe, sprey, kapak ve pompa numunelerini ücretsiz talep edin.",
      en: "Request cosmetic packaging samples from Kısmet Plastik. Request free PET bottle, spray, cap and pump samples.",
    },
  });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
