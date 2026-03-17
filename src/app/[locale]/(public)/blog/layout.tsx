import type { Metadata } from "next";
import { locales, defaultLocale } from "@/lib/locales";

const BASE =
  process.env.NEXT_PUBLIC_BASE_URL || "https://www.kismetplastik.com";
const PATH = "blog";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isTr = locale === "tr";

  const title = isTr ? "Blog & Haberler" : "Blog & News";
  const description = isTr
    ? "Kısmet Plastik blog. Kozmetik ambalaj sektöründen haberler, rehberler, PET şişe üretim süreçleri ve sektör trendleri."
    : "Kismet Plastik blog. News, guides, PET bottle production processes and industry trends from the cosmetic packaging sector.";

  return {
    title,
    description,
    openGraph: {
      title: isTr
        ? "Blog & Haberler | Kısmet Plastik"
        : "Blog & News | Kismet Plastik",
      description: isTr
        ? "Kozmetik ambalaj sektöründen haberler ve bilgilendirici içerikler."
        : "News and informative content from the cosmetic packaging industry.",
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
