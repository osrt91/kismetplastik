import type { Metadata } from "next";
import { generatePageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return generatePageMetadata({
    path: "/ambalaj-sozlugu",
    titleTr: "Ambalaj Sözlüğü",
    titleEn: "Packaging Glossary",
    descTr: "Kozmetik ambalaj sektöründe kullanılan terimler ve tanımları. PET, HDPE, PP, blow molding, preform ve daha fazlası.",
    descEn: "Terms and definitions used in the cosmetic packaging industry. PET, HDPE, PP, blow molding, preform and more.",
    locale,
  });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
