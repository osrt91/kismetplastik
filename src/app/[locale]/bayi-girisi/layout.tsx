import type { Metadata } from "next";
import { generatePageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return generatePageMetadata({
    path: "/bayi-girisi",
    titleTr: "Bayi Girişi",
    titleEn: "Dealer Login",
    descTr: "Kısmet Plastik kozmetik ambalaj bayi paneli girişi. Bayilik hesabınız ile sipariş yönetimi, fiyat listesi ve özel kampanyalara erişin.",
    descEn: "Kısmet Plastik cosmetic packaging dealer panel login. Access order management, price lists and exclusive campaigns with your dealer account.",
    locale,
  });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
