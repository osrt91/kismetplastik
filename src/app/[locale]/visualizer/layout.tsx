import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ürün Görselleştirici | Kısmet Plastik",
  description:
    "Kozmetik ambalajlarınızı 2D ve 3D olarak özelleştirin. Renk, logo ve yazı ekleyin, tasarımınızı kaydedin veya teklif alın.",
  openGraph: {
    title: "Ürün Görselleştirici | Kısmet Plastik",
    description:
      "Kozmetik ambalajlarınızı 2D ve 3D olarak özelleştirin. Renk, logo ve yazı ekleyin.",
  },
};

export default function VisualizerPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
