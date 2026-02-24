import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sıkça Sorulan Sorular",
  description:
    "Kismet Plastik hakkında sıkça sorulan sorular. Sipariş, ürün, kalite, teslimat ve bayilik ile ilgili merak ettikleriniz.",
  openGraph: {
    title: "SSS | Kismet Plastik",
    description: "Plastik ambalaj hakkında sıkça sorulan sorular ve yanıtları.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
