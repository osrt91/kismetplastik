import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hakkımızda",
  description:
    "Kısmet Plastik hakkında bilgi. 1969'dan bu yana kozmetik ambalaj sektöründe kalite ve güvenin adresi. Misyonumuz, vizyonumuz ve değerlerimiz.",
  openGraph: {
    title: "Hakkımızda | Kısmet Plastik",
    description: "1969'dan bu yana kozmetik ambalaj sektöründe kalite ve güvenin adresi.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
