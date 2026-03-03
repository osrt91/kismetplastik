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
    path: "/ambalaj-sozlugu",
    title: {
      tr: "Ambalaj Sözlüğü",
      en: "Packaging Glossary",
    },
    description: {
      tr: "Kozmetik ambalaj sektörü terimleri sözlüğü. PET, HDPE, PP, boyun çapı, şişirme kalıplama ve daha fazlası hakkında teknik terimler.",
      en: "Cosmetic packaging industry terminology glossary. Technical terms about PET, HDPE, PP, neck size, blow molding and more.",
    },
  });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
