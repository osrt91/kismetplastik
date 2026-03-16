import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sektörler",
  description:
    "Kısmet Plastik'in hizmet verdiği sektörler. Kozmetik, ilaç, gıda ve kimya sektörlerine özel ambalaj çözümleri.",
  openGraph: {
    title: "Sektörler | Kısmet Plastik",
    description: "Kozmetik, ilaç, gıda ve kimya sektörlerine özel ambalaj çözümleri.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
