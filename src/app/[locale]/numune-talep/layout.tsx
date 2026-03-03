import type { Metadata } from "next";
import { generatePageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return generatePageMetadata({
    path: "/numune-talep",
    titleTr: "Numune Talep",
    titleEn: "Sample Request",
    descTr: "Kısmet Plastik kozmetik ambalaj numune talebi. PET şişe, sprey, kapak ve pompa numunelerini ücretsiz talep edin.",
    descEn: "Kısmet Plastik cosmetic packaging sample request. Request free samples of PET bottles, sprays, caps and pumps.",
    locale,
  });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
