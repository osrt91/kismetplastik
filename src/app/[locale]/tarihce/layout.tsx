import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isTr = locale === "tr";

  return {
    title: isTr ? "Tarihce | Kismet Plastik" : "History | Kismet Plastik",
    description: isTr
      ? "Kismet Plastik'in 1969'dan bugune uzanan yolculugu. Kozmetik ambalaj sektorunde yarim asri askin deneyim ve kilometre taslari."
      : "Kismet Plastik's journey from 1969 to the present. Over half a century of experience and milestones in the cosmetic packaging industry.",
    openGraph: {
      title: isTr
        ? "Tarihce | Kismet Plastik"
        : "History | Kismet Plastik",
      description: isTr
        ? "1969'dan bugune kozmetik ambalaj sektorunde yarim asri askin deneyim."
        : "Over half a century of experience in cosmetic packaging since 1969.",
    },
  };
}

export default function TarihceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
