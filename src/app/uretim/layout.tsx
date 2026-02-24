import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Üretim Tesisi",
  description:
    "Kismet Plastik üretim tesisi. 15.000 m² kapalı alan, 50+ üretim makinesi, 24/7 kesintisiz üretim. PET enjeksiyon ve şişirme teknolojileri.",
  openGraph: {
    title: "Üretim Tesisi | Kismet Plastik",
    description: "Son teknoloji makinelerle donatılmış modern üretim tesisimiz.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
