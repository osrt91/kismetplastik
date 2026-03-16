import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ar-Ge",
  description:
    "Kısmet Plastik Ar-Ge merkezi. Yenilikçi ambalaj tasarımları, malzeme araştırmaları ve sürdürülebilir çözümler.",
  openGraph: {
    title: "Ar-Ge | Kısmet Plastik",
    description: "Yenilikçi ambalaj tasarımları ve sürdürülebilir çözümler.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
