import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sürdürülebilirlik",
  description:
    "Kısmet Plastik sürdürülebilirlik yaklaşımı: 1969'dan bu yana %100 geri dönüştürülebilir PET kozmetik ambalaj üretimi, ISO 14001 sertifikalı çevre yönetimi, enerji verimliliği ve sıfır atık hedefi.",
  openGraph: {
    title: "Sürdürülebilirlik | Kısmet Plastik",
    description:
      "Çevreye duyarlı kozmetik ambalaj üretimi. Geri dönüştürülebilir PET, enerji tasarrufu ve döngüsel ekonomi yaklaşımı.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
