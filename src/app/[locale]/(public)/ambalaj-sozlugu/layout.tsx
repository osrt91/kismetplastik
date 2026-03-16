import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ambalaj Sözlüğü",
  description:
    "Plastik ambalaj ve kozmetik ambalaj sektörüne ait terimler sözlüğü. PET, HDPE, PP, kapasite, ağız çapı ve daha fazlası.",
  openGraph: {
    title: "Ambalaj Sözlüğü | Kısmet Plastik",
    description: "Plastik ve kozmetik ambalaj sektörü terimleri sözlüğü.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
