import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "İletişim",
  description:
    "Kismet Plastik iletişim bilgileri. Teklif talebi, bilgi ve her türlü sorunuz için bizimle iletişime geçin. Tel: +90 (212) 123 45 67",
  openGraph: {
    title: "İletişim | Kismet Plastik",
    description: "Teklif talebi ve bilgi için bizimle iletişime geçin.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
