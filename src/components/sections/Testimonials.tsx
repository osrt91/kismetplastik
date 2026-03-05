"use client";

import { Star, Quote } from "lucide-react";
import AnimateOnScroll from "@/components/ui/AnimateOnScroll";
import { useLocale } from "@/contexts/LocaleContext";

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

  const testimonials = (dict.testimonials as { name: string; company: string; role: string; text: string }[]) ?? [];

  return (
    <section className="relative bg-gradient-to-b from-[#FAFAF7] via-white to-[#FAFAF7] py-20 dark:from-[#0A1628] dark:via-neutral-900 dark:to-[#0A1628] lg:py-28 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        {/* Section Header */}
        <AnimateOnScroll animation="fade-up">
          <div className="mb-14 text-center">
            <span className="mb-3 inline-block text-sm font-bold uppercase tracking-widest text-[#F59E0B]">
              {overline}
            </span>
            <h2 className="mb-4 text-3xl font-extrabold text-[#0A1628] dark:text-white sm:text-4xl">
              {title}
            </h2>
          </div>
        </AnimateOnScroll>

        {/* Testimonial Cards */}
        <div className="mb-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <AnimateOnScroll key={t.company} animation="fade-up" delay={i * 100}>
              <article className="group relative h-full overflow-hidden rounded-2xl border border-border bg-card/70 backdrop-blur-md p-8 shadow-sm shadow-[#0A1628]/5 transition-all duration-300 hover:-translate-y-2 hover:border-[#0A1628]/20 hover:shadow-xl hover:shadow-[#0A1628]/10 dark:border-white/10 dark:bg-white/5 dark:backdrop-blur-lg dark:shadow-none dark:hover:border-[#F59E0B]/30 dark:hover:shadow-lg dark:hover:shadow-[#F59E0B]/5">
                <div className="absolute left-0 right-0 top-0 h-1 bg-gradient-to-r from-[#F59E0B]/60 via-[#F59E0B] to-[#F59E0B]/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="relative z-10">
                  <Quote
                    className="mb-4 text-[#F59E0B]/30 dark:text-[#F59E0B]/20 transition-colors duration-300 group-hover:text-[#F59E0B]/50"
                    size={48}
                    strokeWidth={1.5}
                    fill="currentColor"
                  />
                  <div className="mb-4 flex gap-1">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star
                        key={j}
                        className="text-[#F59E0B] fill-[#F59E0B] drop-shadow-[0_0_2px_rgba(245,158,11,0.3)]"
                        size={16}
                      />
                    ))}
                  </div>
                  <p className="mb-6 text-[#0A1628]/70 leading-relaxed dark:text-neutral-300/90">
                    &ldquo;{t.text}&rdquo;
                  </p>
                  <div className="flex items-center gap-4 border-t border-[#0A1628]/5 pt-5 dark:border-white/10">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#0A1628] to-[#0A1628]/80 text-white shadow-md shadow-[#0A1628]/20 dark:from-[#F59E0B]/20 dark:to-[#F59E0B]/10 dark:text-[#F59E0B] dark:shadow-none">
                      <span className="text-base font-bold">{t.name.charAt(0)}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-[#0A1628] dark:text-white">{t.name}</p>
                      <p className="text-sm font-medium text-[#0A1628]/60 dark:text-[#F59E0B]/70">{t.company}</p>
                      <p className="text-xs text-muted-foreground">{t.role}</p>
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
            <div className="mb-8 flex justify-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#F59E0B]/30 bg-[#F59E0B]/10 px-5 py-2 text-sm font-semibold text-[#F59E0B] dark:border-[#F59E0B]/20 dark:bg-[#F59E0B]/5">
                {badge}
              </span>
            </div>
            <div className="overflow-hidden">
              <div className="flex w-max animate-marquee gap-4">
                {[...referenceCompanies, ...referenceCompanies].map((name, idx) => (
                  <span
                    key={`${name}-${idx}`}
                    className="shrink-0 rounded-full border border-border bg-card/60 backdrop-blur-sm px-5 py-2.5 text-sm font-medium text-foreground/70 transition-all duration-200 hover:border-[#F59E0B]/40 hover:bg-[#F59E0B]/10 hover:text-foreground dark:border-white/10 dark:bg-white/5 dark:text-neutral-300 dark:hover:border-[#F59E0B]/30 dark:hover:bg-[#F59E0B]/10 dark:hover:text-[#F59E0B]"
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
