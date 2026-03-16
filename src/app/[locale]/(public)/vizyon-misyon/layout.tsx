import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vizyon & Misyon",
  description:
    "Kısmet Plastik'in vizyonu ve misyonu. Kozmetik ambalaj sektöründe sürdürülebilir büyüme ve kalite odaklı yaklaşım.",
  openGraph: {
    title: "Vizyon & Misyon | Kısmet Plastik",
    description: "Kozmetik ambalaj sektöründe sürdürülebilir büyüme ve kalite odaklı yaklaşım.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
