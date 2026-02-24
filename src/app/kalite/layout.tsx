import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kalite & Sertifikalar",
  description:
    "Kismet Plastik kalite sertifikaları: ISO 9001, ISO 14001, ISO 45001, ISO 10002, ISO/IEC 27001, CE. 4 aşamalı kalite kontrol süreci ve laboratuvar testleri.",
  openGraph: {
    title: "Kalite & Sertifikalar | Kismet Plastik",
    description: "Uluslararası standartlarda üretim ve kalite belgeleri.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
