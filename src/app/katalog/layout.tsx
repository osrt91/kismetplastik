import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Katalog İndir",
  description:
    "Kısmet Plastik ürün kataloglarını indirin. PET şişe, sprey, kapak ve pompa katalogları. PDF formatında ücretsiz.",
  openGraph: {
    title: "Katalog İndir | Kısmet Plastik",
    description: "Kozmetik ambalaj ürün kataloglarımızı indirerek tüm ürünlerimizi inceleyin.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
