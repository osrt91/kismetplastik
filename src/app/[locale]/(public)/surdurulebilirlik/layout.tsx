import type { Metadata } from "next";
import { locales, defaultLocale } from "@/lib/locales";

const BASE =
  process.env.NEXT_PUBLIC_BASE_URL || "https://www.kismetplastik.com";
const PATH = "surdurulebilirlik";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isTr = locale === "tr";

  const title = isTr ? "Sürdürülebilirlik" : "Sustainability";
  const description = isTr
    ? "Kısmet Plastik sürdürülebilirlik yaklaşımı: 1969'dan bu yana %100 geri dönüştürülebilir PET kozmetik ambalaj üretimi, ISO 14001 sertifikalı çevre yönetimi, enerji verimliliği ve sıfır atık hedefi."
    : "Kismet Plastik sustainability approach: 100% recyclable PET cosmetic packaging production since 1969, ISO 14001 certified environmental management, energy efficiency and zero waste goal.";

  return {
    title,
    description,
    openGraph: {
      title: isTr
        ? "Sürdürülebilirlik | Kısmet Plastik"
        : "Sustainability | Kismet Plastik",
      description: isTr
        ? "Çevreye duyarlı kozmetik ambalaj üretimi. Geri dönüştürülebilir PET, enerji tasarrufu ve döngüsel ekonomi yaklaşımı."
        : "Environmentally conscious cosmetic packaging production. Recyclable PET, energy savings and circular economy approach.",
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
