import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fuarlar",
  description:
    "Kısmet Plastik'in katıldığı ulusal ve uluslararası fuarlar. Kozmetik ambalaj sektöründeki etkinliklerimizi keşfedin.",
  openGraph: {
    title: "Fuarlar | Kısmet Plastik",
    description: "Kozmetik ambalaj sektöründeki ulusal ve uluslararası fuar katılımlarımız.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
