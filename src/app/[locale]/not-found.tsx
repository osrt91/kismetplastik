"use client";

import Link from "@/components/ui/LocaleLink";
import { useLocale } from "@/contexts/LocaleContext";
import { Home, Search, ArrowRight } from "lucide-react";

export default function NotFound() {
  const { locale, dict } = useLocale();
  return (
    <section className="relative flex min-h-[80vh] items-center justify-center overflow-hidden bg-gradient-to-br from-neutral-50 via-white to-primary-50/30 px-4 py-16">
      {/* Animated dot pattern */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle, var(--primary-300) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          opacity: 0.07,
          animation: "dot-drift 25s linear infinite",
        }}
      />

      {/* Geometric decorations */}
      <div
        className="pointer-events-none absolute -left-10 -top-10 h-44 w-44 rounded-full bg-primary-100/30"
        style={{ animation: "float 6s ease-in-out infinite" }}
      />
      <div
        className="pointer-events-none absolute -bottom-16 -right-16 h-60 w-60 rounded-full border-[3px] border-accent-300/25"
        style={{ animation: "float 8s ease-in-out infinite 1s" }}
      />
      <div
        className="pointer-events-none absolute right-[20%] top-12 hidden h-10 w-10 rounded-full bg-accent-400/20 sm:block"
        style={{ animation: "float 5s ease-in-out infinite 0.5s" }}
      />
      <div
        className="pointer-events-none absolute right-16 top-28 hidden h-14 w-14 bg-primary-300/15 sm:block"
        style={{
          clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
          animation: "float 7s ease-in-out infinite 2s",
        }}
      />
      <div
        className="pointer-events-none absolute bottom-24 left-20 hidden h-10 w-10 bg-accent-400/15 sm:block"
        style={{
          clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
          animation: "float 6s ease-in-out infinite 1.5s",
        }}
      />
      <div
        className="pointer-events-none absolute left-[30%] top-[22%] hidden h-5 w-5 rotate-45 bg-primary-500/10 sm:block"
        style={{ animation: "float 9s ease-in-out infinite 3s" }}
      />
      <div
        className="pointer-events-none absolute -right-6 top-[35%] hidden h-28 w-28 rounded-full border-2 border-primary-100/40 sm:block"
        style={{ animation: "float 10s ease-in-out infinite 0.7s" }}
      />
      <div
        className="pointer-events-none absolute bottom-[15%] left-[45%] h-3 w-3 rounded-full bg-primary-300/30"
        style={{ animation: "float 4s ease-in-out infinite 2.5s" }}
      />

      {/* Content */}
      <div className="relative z-10 w-full max-w-2xl text-center">
        <div className="mb-4">
          <span
            className="inline-block bg-gradient-to-br from-primary-900 via-primary-500 to-primary-300 bg-clip-text text-[120px] font-black leading-none text-transparent sm:text-[160px]"
            style={{ animation: "float 4s ease-in-out infinite" }}
          >
            404
          </span>
        </div>

        <h1 className="mb-2 text-2xl font-extrabold text-primary-900 sm:text-3xl">
          {dict.notFound.title}
        </h1>
        <p className="mb-1.5 text-base font-semibold text-accent-500 sm:text-lg">
          {dict.notFound.subtitle}
        </p>
        <p className="mx-auto mb-8 max-w-md text-sm text-neutral-500 sm:text-base">
          {dict.notFound.description}
        </p>

        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl bg-accent-500 px-6 py-3.5 font-bold text-primary-900 shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:bg-accent-400 hover:shadow-xl"
          >
            <Home size={18} />
            {dict.common.backToHome}
          </Link>
          <Link
            href="/urunler"
            className="inline-flex items-center gap-2 rounded-xl border-2 border-primary-900 px-6 py-3.5 font-semibold text-primary-900 transition-all duration-200 hover:bg-primary-900 hover:text-white"
          >
            <Search size={18} />
            {dict.home.ctaProducts}
          </Link>
        </div>

        <form
          action={`/${locale}/urunler`}
          className="mx-auto mt-8 flex max-w-sm items-center gap-2"
        >
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400"
            />
            <input
              type="text"
              name="q"
              placeholder={dict.notFound.searchPlaceholder}
              className="w-full rounded-xl border border-neutral-200 bg-white py-3 pl-10 pr-4 text-sm text-neutral-700 shadow-sm outline-none transition-all placeholder:text-neutral-400 focus:border-primary-300 focus:ring-2 focus:ring-primary-100"
            />
          </div>
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 rounded-xl bg-primary-900 px-5 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-primary-700"
          >
            {dict.common.search}
            <ArrowRight size={14} />
          </button>
        </form>

        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { name: dict.nav.about, href: "/hakkimizda" },
            { name: dict.nav.contact, href: "/iletisim" },
            { name: dict.nav.quote, href: "/teklif-al" },
            { name: dict.nav.faq, href: "/sss" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm font-medium text-neutral-600 shadow-sm transition-all duration-200 hover:scale-105 hover:border-primary-100 hover:text-primary-900 hover:shadow-lg"
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
