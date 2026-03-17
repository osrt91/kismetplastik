import type { Metadata } from "next";
import { locales, defaultLocale } from "@/lib/locales";

const BASE =
  process.env.NEXT_PUBLIC_BASE_URL || "https://www.kismetplastik.com";
const PATH = "uretim";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isTr = locale === "tr";

  const title = isTr ? "Üretim Tesisi" : "Production Facility";
  const description = isTr
    ? "Kısmet Plastik kozmetik ambalaj üretim tesisi. 15.000 m² kapalı alan, 50+ üretim makinesi, 24/7 kesintisiz üretim. PET enjeksiyon ve şişirme teknolojileri."
    : "Kismet Plastik cosmetic packaging production facility. 15,000 sqm indoor area, 50+ production machines, 24/7 continuous production. PET injection and blow molding technologies.";

  return {
    title,
    description,
    openGraph: {
      title: isTr
        ? "Üretim Tesisi | Kısmet Plastik"
        : "Production Facility | Kismet Plastik",
      description: isTr
        ? "Son teknoloji makinelerle donatılmış modern üretim tesisimiz."
        : "Our modern production facility equipped with state-of-the-art machines.",
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
