import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hakkımızda",
  description:
    "Kismet Plastik hakkında bilgi. 2004'ten bu yana plastik ambalaj sektöründe kalite ve güvenin adresi. Misyonumuz, vizyonumuz ve değerlerimiz.",
  openGraph: {
    title: "Hakkımızda | Kismet Plastik",
    description: "2004'ten bu yana plastik ambalaj sektöründe kalite ve güvenin adresi.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
