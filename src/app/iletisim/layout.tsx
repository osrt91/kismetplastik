import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "İletişim",
  description:
    "Kısmet Plastik iletişim bilgileri. Teklif talebi, bilgi ve her türlü sorunuz için bizimle iletişime geçin. Tel: 0212 549 87 03",
  openGraph: {
    title: "İletişim | Kısmet Plastik",
    description: "Teklif talebi ve bilgi için bizimle iletişime geçin.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
