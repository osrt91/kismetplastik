import type { Metadata } from "next";
import "./globals.css";
import { LocaleProvider } from "@/contexts/LocaleContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import ScrollToTop from "@/components/ui/ScrollToTop";
import CookieBanner from "@/components/ui/CookieBanner";
import { LocalBusinessJsonLd, OrganizationJsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.kismetplastik.com"),
  title: {
    default: "Kısmet Plastik | B2B Kozmetik Ambalaj Çözümleri",
    template: "%s | Kısmet Plastik",
  },
  description:
    "Kısmet Plastik - Türkiye'nin lider kozmetik ambalaj üreticisi. PET şişe, kavanoz, kapak ve özel üretim kozmetik ambalaj çözümleri. Toptan satış ve B2B hizmetler.",
  keywords: [
    "kozmetik ambalaj",
    "PET şişe",
    "plastik kavanoz",
    "ambalaj üreticisi",
    "toptan plastik",
    "B2B plastik",
    "kismet plastik",
    "PET preform",
    "plastik kapak",
    "özel üretim ambalaj",
  ],
  openGraph: {
    title: "Kısmet Plastik | B2B Kozmetik Ambalaj Çözümleri",
    description:
      "Türkiye'nin lider kozmetik ambalaj üreticisi. Toptan satış ve B2B hizmetler.",
    type: "website",
    locale: "tr_TR",
    siteName: "Kısmet Plastik",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://www.kismetplastik.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <head>
        <LocalBusinessJsonLd />
        <OrganizationJsonLd />
        <link
          rel="preload"
          href="/fonts/MyriadPro-Regular.otf"
          as="font"
          type="font/otf"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/MyriadPro-Semibold.ttf"
          as="font"
          type="font/truetype"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/MyriadPro-Black.otf"
          as="font"
          type="font/otf"
          crossOrigin="anonymous"
        />
        <link rel="dns-prefetch" href="https://www.google.com" />
        <link rel="dns-prefetch" href="https://wa.me" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#002060" />
        <link rel="apple-touch-icon" href="/images/logo.jpg" />
      </head>
      <body className="antialiased">
        <a
          href="#main-content"
          className="fixed left-4 top-4 z-[100] -translate-y-20 rounded-lg bg-primary-900 px-4 py-2 text-sm font-bold text-white shadow-lg transition-transform focus:translate-y-0"
        >
          İçeriğe atla
        </a>
        <LocaleProvider>
          <Header />
          <main id="main-content" tabIndex={-1}>{children}</main>
          <Footer />
          <WhatsAppButton />
          <ScrollToTop />
          <CookieBanner />
        </LocaleProvider>
      </body>
    </html>
  );
}
