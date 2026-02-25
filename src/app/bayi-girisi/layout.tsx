import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bayi Girişi",
  description:
    "Kısmet Plastik bayi paneli girişi. Bayilik hesabınız ile sipariş yönetimi, fiyat listesi ve özel kampanyalara erişin.",
  openGraph: {
    title: "Bayi Girişi | Kısmet Plastik",
    description: "Bayi paneline giriş yaparak siparişlerinizi yönetin.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
