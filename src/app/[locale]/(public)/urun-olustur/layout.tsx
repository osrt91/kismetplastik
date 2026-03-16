import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ürün Oluştur",
  description:
    "Kısmet Plastik ürün yapılandırıcısı ile özel kozmetik ambalajınızı adım adım tasarlayın. PET şişe, hacim, şekil, renk ve kapak seçeneklerini belirleyerek hemen teklif alın.",
  openGraph: {
    title: "Ürün Oluştur | Kısmet Plastik",
    description:
      "Özel kozmetik ambalajınızı adım adım tasarlayın ve hemen teklif alın.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
