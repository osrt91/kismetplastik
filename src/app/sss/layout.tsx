import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sıkça Sorulan Sorular",
  description:
    "Kısmet Plastik kozmetik ambalaj hakkında sıkça sorulan sorular. Sipariş, ürün, kalite, teslimat ve bayilik ile ilgili merak ettikleriniz.",
  openGraph: {
    title: "SSS | Kısmet Plastik",
    description: "Kozmetik ambalaj hakkında sıkça sorulan sorular ve yanıtları.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
