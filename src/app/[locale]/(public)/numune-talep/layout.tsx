import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Numune Talep",
  description:
    "Kısmet Plastik'ten ücretsiz numune talep edin. PET şişe, plastik şişe, kapak ve pompa numuneleri.",
  openGraph: {
    title: "Numune Talep | Kısmet Plastik",
    description: "Kozmetik ambalaj ürünleri için ücretsiz numune talep formu.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
