import type { Metadata } from "next";
import { locales, defaultLocale } from "@/lib/locales";

const BASE =
  process.env.NEXT_PUBLIC_BASE_URL || "https://www.kismetplastik.com";
const PATH = "iletisim";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isTr = locale === "tr";

  const title = isTr ? "İletişim" : "Contact";
  const description = isTr
    ? "Kısmet Plastik kozmetik ambalaj iletişim bilgileri. Teklif talebi, bilgi ve her türlü sorunuz için bizimle iletişime geçin. Tel: 0212 549 87 03"
    : "Kismet Plastik cosmetic packaging contact information. Get in touch for quote requests, information and any questions. Tel: +90 212 549 87 03";

  return {
    title,
    description,
    openGraph: {
      title: isTr ? "İletişim | Kısmet Plastik" : "Contact | Kismet Plastik",
      description: isTr
        ? "Teklif talebi ve bilgi için bizimle iletişime geçin."
        : "Get in touch for quote requests and information.",
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
