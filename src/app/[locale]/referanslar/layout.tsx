import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Referanslar",
  description:
    "Kismet Plastik referansları. 500'den fazla firma ile 30 yılı aşkın iş birliği. Kozmetik, parfümeri, temizlik ve kişisel bakım sektörlerinde güvenilir ambalaj çözüm ortağı.",
  openGraph: {
    title: "Referanslar | Kısmet Plastik",
    description:
      "500'den fazla firma ile 30 yılı aşkın iş birliği. Kozmetik ambalaj sektöründe güvenilir çözüm ortağınız.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
