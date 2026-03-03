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
    path: "/vizyon-misyon",
    title: {
      tr: "Vizyon & Misyon",
      en: "Vision & Mission",
    },
    description: {
      tr: "Kısmet Plastik vizyon ve misyonu. Kozmetik ambalaj sektöründe liderlik hedefimiz, değerlerimiz ve geleceğe bakışımız.",
      en: "Kısmet Plastik vision and mission. Our leadership goals in cosmetic packaging, our values and our outlook for the future.",
    },
  });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
