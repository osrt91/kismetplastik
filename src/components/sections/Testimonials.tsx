"use client";

import { Star, Quote, Building2 } from "lucide-react";
import AnimateOnScroll from "@/components/ui/AnimateOnScroll";
import { useLocale } from "@/contexts/LocaleContext";

const testimonials = [
  {
    name: "Mehmet Yılmaz",
    company: "Atelier Kozmetik",
    role: "Satın Alma Müdürü",
    text: "Kısmet Plastik ile 5 yıldır çalışıyoruz. Ürün kalitesi ve teslimat süreleri her zaman beklentilerimizin üzerinde oldu.",
    rating: 5,
  },
  {
    name: "Ayşe Demir",
    company: "Demir Kozmetik",
    role: "Genel Müdür",
    text: "Özel kalıp tasarımından seri üretime kadar her aşamada profesyonel destek aldık. Kesinlikle tavsiye ediyoruz.",
    rating: 5,
  },
  {
    name: "Can Özkan",
    company: "Orient Parfüm",
    role: "Üretim Müdürü",
    text: "ISO sertifikalı üretim süreçleri ve kozmetik uygunluk testleri bizim için en önemli kriterdi. Kısmet Plastik bu konuda çok başarılı.",
    rating: 5,
  },
];

const referenceCompanies = [
  "Atelier Kozmetik",
  "Demir Kozmetik",
  "Orient Parfüm",
  "Royal Beauty",
  "Derma Care",
  "Marmara Kimya",
  "Elegance Parfümeri",
  "Natura Kozmetik",
];

export default function Testimonials() {
  const { dict } = useLocale();
  const h = dict.home as Record<string, unknown>;
  const overline = (h.testimonialsOverline as string) ?? "MÜŞTERİ REFERANSLARI";
  const title = (h.testimonialsTitle as string) ?? "Müşterilerimiz Ne Diyor?";
  const badge = (h.testimonialsBadge as string) ?? "50+ Mutlu Müşteri";

  return (
    <section className="relative bg-white py-20 lg:py-28 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        {/* Section Header */}
        <AnimateOnScroll animation="fade-up">
          <div className="mb-14 text-center">
            <span className="mb-3 inline-block text-sm font-bold uppercase tracking-widest text-accent-500">
              {overline}
            </span>
            <h2 className="mb-4 text-3xl font-extrabold text-primary-900 sm:text-4xl">
              {title}
            </h2>
          </div>
        </AnimateOnScroll>

        {/* Testimonial Cards */}
        <div className="mb-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <AnimateOnScroll key={t.company} animation="fade-up" delay={i * 100}>
              <article className="group relative h-full overflow-hidden rounded-2xl border border-neutral-100 bg-white p-8 transition-all duration-300 hover:-translate-y-2 hover:border-primary-100 hover:shadow-xl hover:shadow-primary-900/10">
                {/* Accent top border */}
                <div className="absolute left-0 right-0 top-0 h-1 bg-gradient-to-r from-accent-400 via-accent-500 to-accent-400 opacity-80 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="relative z-10">
                  {/* Quote icon */}
                  <Quote
                    className="mb-4 text-primary-100"
                    size={40}
                    strokeWidth={1.5}
                  />
                  {/* Star rating */}
                  <div className="mb-4 flex gap-1">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star
                        key={j}
                        className="text-accent-500 fill-accent-500"
                        size={18}
                      />
                    ))}
                  </div>
                  {/* Quote text */}
                  <p className="mb-6 text-neutral-700 leading-relaxed">
                    &ldquo;{t.text}&rdquo;
                  </p>
                  {/* Author info */}
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary-700">
                      <Building2 size={22} />
                    </div>
                    <div>
                      <p className="font-semibold text-primary-900">{t.name}</p>
                      <p className="text-sm text-primary-700">{t.company}</p>
                      <p className="text-xs text-neutral-500">{t.role}</p>
                    </div>
                  </div>
                </div>
              </article>
            </AnimateOnScroll>
          ))}
        </div>

        {/* Reference Companies Marquee */}
        <AnimateOnScroll animation="fade-up">
          <div className="relative">
            {/* Company count badge */}
            <div className="mb-8 flex justify-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-accent-300 bg-accent-50 px-5 py-2 text-sm font-semibold text-accent-700">
                {badge}
              </span>
            </div>
            {/* Marquee strip */}
            <div className="overflow-hidden">
              <div className="flex w-max animate-marquee gap-4">
                {[...referenceCompanies, ...referenceCompanies].map((name, idx) => (
                  <span
                    key={`${name}-${idx}`}
                    className="shrink-0 rounded-full border border-neutral-200 bg-neutral-50 px-5 py-2.5 text-sm font-medium text-neutral-700 transition-colors hover:border-primary-200 hover:bg-primary-50 hover:text-primary-700"
                  >
                    {name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
