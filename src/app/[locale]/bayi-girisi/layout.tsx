import type { Metadata } from "next";
import { generatePageMetadata } from "@/lib/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return generatePageMetadata({
    locale,
    path: "/bayi-girisi",
    title: {
      tr: "Bayi Girişi",
      en: "Dealer Login",
    },
    description: {
      tr: "Kısmet Plastik kozmetik ambalaj bayi paneli girişi. Bayilik hesabınız ile sipariş yönetimi, fiyat listesi ve özel kampanyalara erişin.",
      en: "Kısmet Plastik cosmetic packaging dealer panel login. Access order management, price lists and exclusive promotions with your dealer account.",
    },
  });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
