import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ürünler",
  description:
    "Kısmet Plastik ürün kataloğu. PET şişeler, plastik şişeler, kolonya şişeleri, sprey ambalajlar, oda parfümü şişeleri, sıvı sabun şişeleri, kapaklar ve özel üretim. Toptan satış ve B2B fiyatları.",
  openGraph: {
    title: "Ürünler | Kısmet Plastik",
    description: "PET şişe, sprey, kapak ve pompa ürün kataloğu.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
