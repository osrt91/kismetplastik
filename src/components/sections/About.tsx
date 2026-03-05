"use client";

import Link from "@/components/ui/LocaleLink";
import { ArrowRight, Check } from "lucide-react";
import AnimateOnScroll from "@/components/ui/AnimateOnScroll";
import { useLocale } from "@/contexts/LocaleContext";

export default function About() {
  const { dict } = useLocale();
  const h = dict.home;
  const strengths = dict.homeStrengths as string[];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#FAFAF7] via-white to-[#FAFAF7] py-20 dark:from-[#0A1628] dark:via-[#0f1d33] dark:to-[#0A1628] lg:py-28">
      {/* Decorative amber accent line at top */}
      <div className="absolute left-0 right-0 top-0 h-1 bg-gradient-to-r from-transparent via-[#F59E0B] to-transparent" />
      {/* Subtle background pattern */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.03] dark:opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #0A1628 1px, transparent 0)', backgroundSize: '40px 40px' }} />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative grid items-center gap-14 lg:grid-cols-2 lg:gap-24">
          {/* Vertical accent divider – desktop only */}
          <div className="pointer-events-none absolute inset-y-4 left-1/2 hidden w-px bg-gradient-to-b from-transparent via-primary-200 to-transparent lg:block" />

          {/* Left – Visual */}
          <AnimateOnScroll animation="fade-right">
            <div className="relative">
              {/* Decorative geometric shapes */}
              <div className="absolute -left-4 -top-4 h-16 w-16 rounded-full border-2 border-[#F59E0B]/20 opacity-60 dark:border-[#F59E0B]/10" />
              <div className="absolute -right-3 top-8 h-10 w-10 rotate-12 rounded-lg border-2 border-[#F59E0B]/30 opacity-50" />
              <div className="absolute -bottom-3 left-12 h-8 w-8 rounded-full bg-[#F59E0B]/10 opacity-40" />
              <div className="absolute -right-6 bottom-16 h-6 w-6 rotate-45 bg-[#0A1628]/10 opacity-50 dark:bg-white/10" />

              {/* Amber side accent bar - visible on desktop */}
              <div className="absolute -left-3 top-8 bottom-8 hidden w-1 rounded-full bg-gradient-to-b from-[#F59E0B] via-[#F59E0B]/50 to-transparent lg:block" />

              <div className="group relative aspect-[4/3] overflow-hidden rounded-2xl bg-gradient-to-br from-[#0A1628]/5 to-[#0A1628]/10 shadow-lg shadow-[#0A1628]/5 ring-1 ring-[#0A1628]/5 transition-all duration-500 hover:shadow-xl hover:shadow-[#F59E0B]/10 dark:from-[#F59E0B]/5 dark:to-[#0A1628]/40 dark:ring-white/10 sm:rounded-3xl">
                <div className="absolute inset-0 flex items-center justify-center transition-transform duration-700 group-hover:scale-105">
                  <div className="text-center">
                    <img
                      src="/images/logo2.svg"
                      alt="Kısmet Plastik"
                      className="mx-auto mb-4 h-36 w-36 drop-shadow-2xl transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3"
                    />
                    <p className="text-sm font-semibold text-[#0A1628]/70 dark:text-white/70">
                      {h.aboutFacility}
                    </p>
                  </div>
                </div>

                {/* Accent Decoration */}
                <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#F59E0B] via-[#0A1628] to-[#0A1628]" />
              </div>

              {/* Floating Badge with pulse-glow */}
              <div
                className="absolute -bottom-6 -right-4 rounded-2xl bg-[#F59E0B] px-6 py-4 shadow-xl shadow-[#F59E0B]/20 ring-1 ring-[#F59E0B]/20 transition-transform duration-300 hover:scale-105 sm:right-4"
                style={{ animation: "pulse-glow 2.5s ease-in-out infinite" }}
              >
                <div className="text-3xl font-extrabold text-[#0A1628]">
                  55+
                </div>
                <div className="text-sm font-semibold text-[#0A1628]/70">
                  {h.cardExperienceLabel}
                </div>
              </div>
            </div>
          </AnimateOnScroll>

          {/* Right – Content */}
          <AnimateOnScroll animation="fade-left">
            <div>
              <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#F59E0B]/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[#F59E0B] ring-1 ring-[#F59E0B]/20 dark:bg-[#F59E0B]/20 dark:ring-[#F59E0B]/30">
                <span className="h-1.5 w-1.5 rounded-full bg-[#F59E0B]" />
                {h.aboutOverline}
              </span>
              <h2 className="mb-6 text-3xl font-extrabold leading-tight text-[#0A1628] dark:text-white sm:text-4xl lg:text-[2.75rem]">
                {h.aboutTitle}{" "}
                <span className="relative text-[#F59E0B]">
                  {h.aboutTitleAccent}
                  <span className="absolute -bottom-1 left-0 h-[3px] w-full rounded-full bg-[#F59E0B]/40" />
                </span>
              </h2>
              <p className="mb-5 text-base leading-relaxed text-[#0A1628]/60 dark:text-white/60 lg:text-lg">
                {h.aboutLead1}
              </p>
              <p className="mb-10 text-base leading-relaxed text-[#0A1628]/60 dark:text-white/60 lg:text-lg">
                {h.aboutLead2}
              </p>

              {/* Strengths */}
              <ul className="mb-10 grid gap-3 sm:grid-cols-2">
                {strengths.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 rounded-xl border border-[#0A1628]/5 bg-white/80 px-4 py-3.5 shadow-sm transition-all duration-200 hover:border-[#F59E0B]/30 hover:bg-[#F59E0B]/5 hover:shadow-md dark:border-white/10 dark:bg-white/5 dark:hover:border-[#F59E0B]/30 dark:hover:bg-[#F59E0B]/10"
                  >
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#F59E0B] text-[#0A1628] shadow-sm shadow-[#F59E0B]/30">
                      <Check size={12} strokeWidth={3} />
                    </span>
                    <span className="text-sm font-medium text-[#0A1628]/80 dark:text-white/80">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>

              <Link
                href="/hakkimizda"
                className="group inline-flex items-center gap-2.5 rounded-xl bg-[#0A1628] px-8 py-4 text-sm font-bold text-white shadow-lg shadow-[#0A1628]/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#0A1628]/90 hover:shadow-xl hover:shadow-[#0A1628]/30 active:scale-[0.98] dark:bg-[#F59E0B] dark:text-[#0A1628] dark:shadow-[#F59E0B]/20 dark:hover:bg-[#F59E0B]/90"
              >
                {h.aboutMore}
                <ArrowRight
                  size={16}
                  className="transition-transform duration-300 group-hover:translate-x-1.5"
                />
              </Link>
            </div>
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  );
}
