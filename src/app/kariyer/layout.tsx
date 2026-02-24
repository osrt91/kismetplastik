import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kariyer",
  description:
    "Kismet Plastik kariyer fırsatları. Üretim mühendisi, kalite kontrol uzmanı, satış uzmanı ve daha fazla açık pozisyon.",
  openGraph: {
    title: "Kariyer | Kismet Plastik",
    description: "Kismet Plastik ailesine katılın. Açık pozisyonları inceleyin.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
