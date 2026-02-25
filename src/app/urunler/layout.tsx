import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ürünler",
  description:
    "Kısmet Plastik ürün kataloğu. PET şişeler, kavanozlar, kapaklar, preformlar, özel üretim ve ambalaj setleri. Toptan satış ve B2B fiyatları.",
  openGraph: {
    title: "Ürünler | Kısmet Plastik",
    description: "PET şişe, kavanoz, kapak ve preform ürün kataloğu.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
