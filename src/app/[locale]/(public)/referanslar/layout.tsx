import type { Metadata } from "next";
import { locales, defaultLocale } from "@/lib/locales";

const BASE =
  process.env.NEXT_PUBLIC_BASE_URL || "https://www.kismetplastik.com";
const PATH = "referanslar";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isTr = locale === "tr";

  const title = isTr ? "Referanslar" : "References";
  const description = isTr
    ? "Kısmet Plastik referansları. 500'den fazla firma ile 30 yılı aşkın iş birliği. Kozmetik, parfümeri, temizlik ve kişisel bakım sektörlerinde güvenilir ambalaj çözüm ortağı."
    : "Kismet Plastik references. Over 30 years of collaboration with more than 500 companies. Trusted packaging partner in cosmetics, perfumery, cleaning and personal care.";

  return {
    title,
    description,
    openGraph: {
      title: isTr
        ? "Referanslar | Kısmet Plastik"
        : "References | Kismet Plastik",
      description: isTr
        ? "500'den fazla firma ile 30 yılı aşkın iş birliği. Kozmetik ambalaj sektöründe güvenilir çözüm ortağınız."
        : "Over 30 years of collaboration with 500+ companies. Your trusted partner in cosmetic packaging.",
    },
    alternates: {
      canonical: `${BASE}/${defaultLocale}/${PATH}`,
      languages: Object.fromEntries([
        ...locales.map((l) => [l, `${BASE}/${l}/${PATH}`]),
        ["x-default", `${BASE}/${defaultLocale}/${PATH}`],
      ]),
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
