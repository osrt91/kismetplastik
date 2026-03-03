import type { Metadata } from "next";
import { generatePageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return generatePageMetadata({
    path: "/vizyon-misyon",
    titleTr: "Vizyon & Misyon",
    titleEn: "Vision & Mission",
    descTr: "Kısmet Plastik vizyon ve misyonu. Kozmetik ambalaj sektöründe lider olmak ve sürdürülebilir çözümler sunmak.",
    descEn: "Kısmet Plastik vision and mission. Leading the cosmetic packaging industry with sustainable solutions.",
    locale,
  });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
