import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog & Haberler",
  description:
    "Kismet Plastik blog. Plastik ambalaj sektöründen haberler, rehberler, PET şişe üretim süreçleri ve sektör trendleri.",
  openGraph: {
    title: "Blog & Haberler | Kismet Plastik",
    description: "Plastik ambalaj sektöründen haberler ve bilgilendirici içerikler.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
