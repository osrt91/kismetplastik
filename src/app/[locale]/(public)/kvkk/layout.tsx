import type { Metadata } from "next";
import { locales, defaultLocale } from "@/lib/locales";

const BASE =
  process.env.NEXT_PUBLIC_BASE_URL || "https://www.kismetplastik.com";
const PATH = "kvkk";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isTr = locale === "tr";

  const title = isTr ? "KVKK Aydınlatma Metni" : "Privacy Policy (KVKK)";
  const description = isTr
    ? "Kısmet Plastik Kozmetik Ambalaj KVKK Aydınlatma Metni. 6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında veri işleme politikamız."
    : "Kismet Plastik Cosmetic Packaging KVKK Privacy Notice. Our data processing policy under the Personal Data Protection Law No. 6698.";

  return {
    title,
    description,
    openGraph: {
      title: isTr
        ? "KVKK Aydınlatma Metni | Kısmet Plastik"
        : "Privacy Policy | Kismet Plastik",
      description: isTr
        ? "Kişisel verilerin korunması politikamız hakkında bilgilendirme."
        : "Information about our personal data protection policy.",
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
