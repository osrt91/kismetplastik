import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog & Haberler",
  description:
    "Kısmet Plastik blog. Kozmetik ambalaj sektöründen haberler, rehberler, PET şişe üretim süreçleri ve sektör trendleri.",
  openGraph: {
    title: "Blog & Haberler | Kısmet Plastik",
    description: "Kozmetik ambalaj sektöründen haberler ve bilgilendirici içerikler.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
