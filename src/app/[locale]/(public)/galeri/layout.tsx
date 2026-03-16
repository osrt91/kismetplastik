import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Galeri",
  description:
    "Kısmet Plastik üretim tesisi, ürün çeşitleri ve etkinlik fotoğrafları. 1969'dan bu yana kozmetik ambalaj sektöründeki yolculuğumuz.",
  openGraph: {
    title: "Galeri | Kısmet Plastik",
    description: "Üretim tesisimiz, ürünlerimiz ve etkinliklerimizden kareler.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
