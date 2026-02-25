import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "KVKK Aydınlatma Metni",
  description:
    "Kısmet Plastik Kozmetik Ambalaj KVKK Aydınlatma Metni. 6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında veri işleme politikamız.",
  openGraph: {
    title: "KVKK Aydınlatma Metni | Kısmet Plastik",
    description: "Kişisel verilerin korunması politikamız hakkında bilgilendirme.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
