import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kariyer",
  description:
    "Kısmet Plastik kariyer fırsatları. Üretim mühendisi, kalite kontrol uzmanı, satış uzmanı ve daha fazla açık pozisyon.",
  openGraph: {
    title: "Kariyer | Kısmet Plastik",
    description: "Kısmet Plastik ailesine katılın. Açık pozisyonları inceleyin.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
