import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LocaleProvider } from "@/contexts/LocaleContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import ScrollToTop from "@/components/ui/ScrollToTop";
import CookieBanner from "@/components/ui/CookieBanner";
import AIChatbot from "@/components/ui/AIChatbot";
import { LocalBusinessJsonLd, OrganizationJsonLd } from "@/components/seo/JsonLd";
import { locales } from "@/middleware";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isTr = locale === "tr";

  return {
    metadataBase: new URL("https://www.kismetplastik.com"),
    title: {
      default: isTr
        ? "Kısmet Plastik | B2B Kozmetik Ambalaj Çözümleri"
        : "Kısmet Plastik | B2B Cosmetic Packaging Solutions",
      template: "%s | Kısmet Plastik",
    },
    description: isTr
      ? "Kısmet Plastik - Türkiye'nin lider kozmetik ambalaj üreticisi. PET şişe, sprey, kapak ve özel üretim kozmetik ambalaj çözümleri. Toptan satış ve B2B hizmetler."
      : "Kısmet Plastik - Turkey's leading cosmetic packaging manufacturer. PET bottles, sprays, caps and custom cosmetic packaging solutions. Wholesale and B2B services.",
    keywords: isTr
      ? [
          "kozmetik ambalaj",
          "PET şişe",
          "plastik şişe",
          "ambalaj üreticisi",
          "toptan plastik",
          "B2B plastik",
          "kismet plastik",
          "sprey ambalaj",
          "plastik kapak",
          "özel üretim ambalaj",
        ]
      : [
          "cosmetic packaging",
          "PET bottle",
          "plastic bottle",
          "packaging manufacturer",
          "wholesale plastic",
          "B2B plastic",
          "kismet plastik",
          "spray packaging",
          "plastic cap",
          "custom packaging",
        ],
    openGraph: {
      title: isTr
        ? "Kısmet Plastik | B2B Kozmetik Ambalaj Çözümleri"
        : "Kısmet Plastik | B2B Cosmetic Packaging Solutions",
      description: isTr
        ? "Türkiye'nin lider kozmetik ambalaj üreticisi. Toptan satış ve B2B hizmetler."
        : "Turkey's leading cosmetic packaging manufacturer. Wholesale and B2B services.",
      type: "website",
      locale: isTr ? "tr_TR" : "en_US",
      siteName: "Kısmet Plastik",
    },
    robots: { index: true, follow: true },
    alternates: {
      canonical: `https://www.kismetplastik.com/${locale}`,
      languages: {
        tr: "https://www.kismetplastik.com/tr",
        en: "https://www.kismetplastik.com/en",
      },
    },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!locales.includes(locale as "tr" | "en")) {
    notFound();
  }

  return (
    <html lang={locale}>
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
          {locale === "tr" ? "İçeriğe atla" : "Skip to content"}
        </a>
        <div className="scroll-progress-bar" />
        <ThemeProvider>
          <LocaleProvider>
            <Header />
            <main id="main-content" tabIndex={-1}>
              {children}
            </main>
            <Footer />
            <WhatsAppButton />
            <AIChatbot />
            <ScrollToTop />
            <CookieBanner />
          </LocaleProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
