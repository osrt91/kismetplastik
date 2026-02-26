"use client";

import Link from "@/components/ui/LocaleLink";
import { ChevronRight, Star, Building2, Quote } from "lucide-react";
import { FaHandshake } from "react-icons/fa6";
import AnimateOnScroll from "@/components/ui/AnimateOnScroll";
import { useLocale } from "@/contexts/LocaleContext";

const referenceCompanies = [
  "Atelier Kozmetik", "Demir Kozmetik", "Orient Parfüm", "Royal Beauty",
  "Derma Care", "Marmara Kimya", "Elegance Parfümeri", "Natura Kozmetik",
  "Anadolu Kolonya", "Ege Kimya", "Akdeniz Ambalaj", "Trakya Plastik",
];

const sectorFilters = ["all", "kozmetik", "kolonya", "temizlik", "otelcilik"];

const labels: Record<string, Record<string, string>> = {
  tr: {
    title: "Referanslarımız",
    subtitle: "1000+ firma bize güveniyor. Kozmetik, kolonya, temizlik ve otelcilik sektörlerinde lider markaların çözüm ortağıyız.",
    trustBadge: "1000+ Mutlu Müşteri",
    all: "Tümü",
    kozmetik: "Kozmetik",
    kolonya: "Kolonya",
    temizlik: "Temizlik",
    otelcilik: "Otelcilik",
    ctaTitle: "Siz de referanslarımız arasında yerinizi alın",
    ctaButton: "Teklif Al",
  },
  en: {
    title: "Our References",
    subtitle: "1000+ companies trust us. We are the solution partner of leading brands in cosmetics, cologne, cleaning and hospitality sectors.",
    trustBadge: "1000+ Happy Customers",
    all: "All",
    kozmetik: "Cosmetics",
    kolonya: "Cologne",
    temizlik: "Cleaning",
    otelcilik: "Hospitality",
    ctaTitle: "Take your place among our references",
    ctaButton: "Request Quote",
  },
};

export default function ReferanslarPage() {
  const { locale, dict } = useLocale();
  const t = labels[locale] || labels.tr;
  const nav = dict.nav;
  const testimonials = (dict.testimonials as { name: string; company: string; role: string; text: string }[]) ?? [];

  return (
    <section className="bg-white">
      <div className="relative overflow-hidden bg-gradient-to-br from-primary-900 via-primary-700 to-primary-900 py-20 lg:py-28">
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="h-full w-full" style={{ backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`, backgroundSize: "40px 40px" }} />
        </div>
        <FaHandshake size={300} className="pointer-events-none absolute -right-10 top-1/2 -translate-y-1/2 text-white/[0.04]" />
        <div className="relative mx-auto max-w-7xl px-4 lg:px-6">
          <AnimateOnScroll animation="fade-up">
            <nav className="mb-6 flex items-center gap-1.5 text-sm text-white/60">
              <Link href="/" className="transition-colors hover:text-white">{nav.home}</Link>
              <ChevronRight size={14} />
              <span className="text-white">{t.title}</span>
            </nav>
            <h1 className="mb-4 text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl">{t.title}</h1>
            <p className="max-w-2xl text-lg text-white/70">{t.subtitle}</p>
          </AnimateOnScroll>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-6 lg:py-20">
        <AnimateOnScroll animation="fade-up">
          <div className="mb-8 flex justify-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-accent-300 bg-accent-50 px-5 py-2 text-sm font-semibold text-accent-700">{t.trustBadge}</span>
          </div>
        </AnimateOnScroll>

        <div className="mb-16 grid gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {referenceCompanies.map((name, i) => (
            <AnimateOnScroll key={name} animation="fade-up" delay={i * 50}>
              <div className="group flex h-24 items-center justify-center rounded-xl border border-neutral-100 bg-neutral-50 p-4 transition-all hover:border-primary-200 hover:bg-white hover:shadow-md">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100 text-primary-700 transition-colors group-hover:bg-primary-900 group-hover:text-white">
                    <Building2 size={20} />
                  </div>
                  <span className="text-sm font-semibold text-primary-900">{name}</span>
                </div>
              </div>
            </AnimateOnScroll>
          ))}
        </div>

        {testimonials.length > 0 && (
          <div className="mb-16">
            <AnimateOnScroll animation="fade-up">
              <h2 className="mb-8 text-center text-2xl font-extrabold text-primary-900">{locale === "tr" ? "Müşterilerimiz Ne Diyor?" : "What Our Customers Say?"}</h2>
            </AnimateOnScroll>
            <div className="grid gap-8 md:grid-cols-3">
              {testimonials.map((t, i) => (
                <AnimateOnScroll key={t.company} animation="fade-up" delay={i * 100}>
                  <div className="group relative h-full rounded-2xl border border-neutral-100 bg-white p-8 transition-all hover:-translate-y-1 hover:shadow-xl">
                    <div className="absolute left-0 right-0 top-0 h-1 bg-gradient-to-r from-accent-400 to-accent-500 opacity-80" />
                    <Quote size={32} className="mb-4 text-primary-100" />
                    <div className="mb-4 flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <Star key={j} size={16} className="fill-accent-500 text-accent-500" />
                      ))}
                    </div>
                    <p className="mb-6 leading-relaxed text-neutral-700">&ldquo;{t.text}&rdquo;</p>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50 text-primary-700">
                        <Building2 size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-primary-900">{t.name}</p>
                        <p className="text-xs text-neutral-500">{t.company} &middot; {t.role}</p>
                      </div>
                    </div>
                  </div>
                </AnimateOnScroll>
              ))}
            </div>
          </div>
        )}

        <AnimateOnScroll animation="fade-up">
          <div className="rounded-2xl bg-gradient-to-r from-primary-900 to-primary-700 p-8 text-center lg:p-12">
            <h3 className="mb-4 text-2xl font-bold text-white">{t.ctaTitle}</h3>
            <Link href="/teklif-al" className="inline-flex items-center gap-2 rounded-xl bg-accent-500 px-8 py-3.5 font-bold text-primary-900 transition-all hover:bg-accent-600 hover:scale-105">
              {t.ctaButton}
            </Link>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
