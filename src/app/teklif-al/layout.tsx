import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Teklif Al",
  description:
    "Kısmet Plastik'ten ücretsiz teklif alın. PET şişe, kavanoz, kapak ve özel üretim ambalaj çözümleri için hemen formu doldurun.",
  openGraph: {
    title: "Teklif Al | Kısmet Plastik",
    description: "Kozmetik ambalaj çözümleri için ücretsiz teklif alın.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
