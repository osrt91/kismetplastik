import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isTr = locale === "tr";

  return {
    title: isTr ? "Tarihçe | Kısmet Plastik" : "History | Kismet Plastik",
    description: isTr
      ? "Kısmet Plastik'in 1969'dan bugüne uzanan yolculuğu. Kozmetik ambalaj sektöründe yarım asrı aşkın deneyim ve kilometre taşları."
      : "Kismet Plastik's journey from 1969 to the present. Over half a century of experience and milestones in the cosmetic packaging industry.",
    openGraph: {
      title: isTr
        ? "Tarihçe | Kısmet Plastik"
        : "History | Kismet Plastik",
      description: isTr
        ? "1969'dan bugüne kozmetik ambalaj sektöründe yarım asrı aşkın deneyim."
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
