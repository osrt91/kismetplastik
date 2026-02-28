import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Teklif Al",
  description:
    "Kısmet Plastik'ten ücretsiz teklif alın. PET şişe, sprey, kapak ve özel üretim kozmetik ambalaj çözümleri için hemen formu doldurun.",
  openGraph: {
    title: "Teklif Al | Kısmet Plastik",
    description: "Kozmetik ambalaj çözümleri için ücretsiz teklif alın. PET şişe, sprey ve kapak.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
