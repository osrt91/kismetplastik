import Link from "next/link";
import { Fraunces, Instrument_Sans } from "next/font/google";
import { headers } from "next/headers";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument-sans",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const translations = {
  tr: {
    title: "Sayfa Bulunamad\u0131",
    description: "Arad\u0131\u011F\u0131n\u0131z sayfa ta\u015F\u0131nm\u0131\u015F, kald\u0131r\u0131lm\u0131\u015F veya hi\u00E7 var olmam\u0131\u015F olabilir.",
    backToHome: "Ana Sayfaya D\u00F6n",
    popularPages: "Pop\u00FCler Sayfalar",
    pages: [
      { href: "/tr/urunler", label: "\u00DCr\u00FCnler" },
      { href: "/tr/hakkimizda", label: "Hakk\u0131m\u0131zda" },
      { href: "/tr/iletisim", label: "\u0130leti\u015Fim" },
      { href: "/tr/teklif-al", label: "Teklif Al" },
      { href: "/tr/sss", label: "SSS" },
    ],
  },
  en: {
    title: "Page Not Found",
    description: "The page you are looking for may have been moved, removed, or never existed.",
    backToHome: "Back to Home",
    popularPages: "Popular Pages",
    pages: [
      { href: "/en/urunler", label: "Products" },
      { href: "/en/hakkimizda", label: "About Us" },
      { href: "/en/iletisim", label: "Contact" },
      { href: "/en/teklif-al", label: "Get Quote" },
      { href: "/en/sss", label: "FAQ" },
    ],
  },
};

export default async function NotFound() {
  const headerList = await headers();
  const pathname = headerList.get("x-pathname") || headerList.get("x-invoke-path") || "";
  const locale = pathname.startsWith("/en") ? "en" : "tr";
  const t = translations[locale];

  return (
    <html lang={locale} className={`${fraunces.variable} ${instrumentSans.variable}`}>
      <body className="antialiased" style={{ margin: 0 }}>
        <div
          className="flex min-h-screen flex-col items-center justify-center px-4 py-16"
          style={{ backgroundColor: "#0A1628" }}
        >
          {/* 404 heading */}
          <h1
            className="font-[var(--font-fraunces)] text-[8rem] font-black leading-none sm:text-[12rem] md:text-[16rem]"
            style={{ color: "#F59E0B", fontFamily: "var(--font-fraunces), serif" }}
          >
            404
          </h1>

          {/* Message */}
          <h2
            className="mt-4 text-center text-2xl font-semibold sm:text-3xl md:text-4xl"
            style={{ color: "#FAFAF7", fontFamily: "var(--font-fraunces), serif" }}
          >
            {t.title}
          </h2>

          <p
            className="mt-4 max-w-md text-center text-base sm:text-lg"
            style={{ color: "#94A3B8" }}
          >
            {t.description}
          </p>

          {/* Back to home button */}
          <Link
            href={`/${locale}`}
            className="mt-10 inline-flex items-center gap-2 rounded-lg px-8 py-4 text-base font-semibold transition-all duration-200 hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 sm:text-lg"
            style={{
              backgroundColor: "#F59E0B",
              color: "#0A1628",
              fontFamily: "var(--font-instrument-sans), sans-serif",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m12 19-7-7 7-7" />
              <path d="M19 12H5" />
            </svg>
            {t.backToHome}
          </Link>

          {/* Divider */}
          <div
            className="mt-12 h-px w-full max-w-md"
            style={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
          />

          {/* Popular pages */}
          <div className="mt-8 text-center">
            <p
              className="mb-4 text-sm font-medium uppercase tracking-widest"
              style={{ color: "#64748B" }}
            >
              {t.popularPages}
            </p>
            <nav className="flex flex-wrap items-center justify-center gap-3">
              {t.pages.map((page) => (
                <Link
                  key={page.href}
                  href={page.href}
                  className="rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200 hover:scale-105"
                  style={{
                    borderColor: "rgba(245, 158, 11, 0.3)",
                    color: "#F59E0B",
                    fontFamily: "var(--font-instrument-sans), sans-serif",
                  }}
                >
                  {page.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Brand footer */}
          <p
            className="mt-16 text-sm"
            style={{ color: "#475569" }}
          >
            Kismet Plastik
          </p>
        </div>
      </body>
    </html>
  );
}
