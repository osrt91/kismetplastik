import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Katalog İndir",
  description:
    "Kısmet Plastik ürün kataloglarını indirin. PET şişe, kavanoz, kapak ve preform katalogları. PDF formatında ücretsiz.",
  openGraph: {
    title: "Katalog İndir | Kısmet Plastik",
    description: "Ürün kataloglarımızı indirerek tüm ürünlerimizi inceleyin.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
