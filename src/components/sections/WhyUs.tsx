import { Camera, ChevronRight } from "lucide-react";
import AnimateOnScroll from "@/components/ui/AnimateOnScroll";
import type { DbContentSection } from "@/types/database";
import { getLocalizedFieldSync } from "@/lib/content";
import type { Dictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/locales";

interface WhyUsProps {
  content?: Record<string, DbContentSection>;
  locale: Locale;
  dict: Dictionary;
}

export default function WhyUs({ content, locale, dict }: WhyUsProps) {
  const h = dict.home;
  const f = dict.homeFeatures as Record<string, string>;

  const steps = [1, 2, 3, 4].map((i) => {
    const key = `home_feature_${i}`;
    const section = content?.[key];
    return {
      title: (section ? getLocalizedFieldSync(section, "title", locale) : "") || f[`processStep${i}Title`],
      description: (section ? getLocalizedFieldSync(section, "content", locale) : "") || f[`processStep${i}Desc`],
    };
  });

  return (
    <section className="relative overflow-hidden bg-[#FAFAF7] py-24 dark:bg-[#0A1628] lg:py-32">
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        {/* Section Header - left-aligned for asymmetry */}
        <AnimateOnScroll animation="fade-up">
          <div className="mb-16 max-w-2xl lg:mb-24">
            <span className="mb-3 inline-block rounded-full bg-amber-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-amber-600 dark:bg-amber-500/20 dark:text-amber-400">
              {h.whyUsOverline}
            </span>
            <h2 className="font-display mb-4 text-2xl font-bold text-[#0A1628] dark:text-white sm:text-3xl lg:text-4xl">
              {h.whyUsTitle}
            </h2>
            <p className="font-body text-base leading-relaxed text-[#0A1628]/60 dark:text-white/50 lg:text-lg">
              {h.whyUsSubtitle}
            </p>
          </div>
        </AnimateOnScroll>

        {/* Desktop: Horizontal Process Timeline */}
        <div className="hidden lg:block">
          <div className="relative">
            {/* Horizontal connector line behind everything */}
            <div
              className="pointer-events-none absolute left-0 right-0 top-[68px] z-0 h-[2px]"
              aria-hidden="true"
            >
              <div className="mx-auto h-full max-w-[calc(100%-120px)] bg-gradient-to-r from-amber-500/20 via-amber-500/50 to-amber-500/20 dark:from-amber-500/10 dark:via-amber-500/35 dark:to-amber-500/10" />
            </div>

            {/* Steps row */}
            <div className="relative z-10 grid grid-cols-4 gap-6">
              {steps.map((step, i) => (
                <AnimateOnScroll
                  key={i}
                  animation="fade-up"
                  delay={i * 180}
                >
                  <div className="group relative flex flex-col items-center rounded-2xl p-4 transition-all duration-300 hover:ring-1 hover:ring-amber-500/20">
                    {/* Arrow connector between steps (not on last) */}
                    {i < steps.length - 1 && (
                      <div
                        className="absolute right-0 top-[56px] z-20 translate-x-1/2"
                        aria-hidden="true"
                      >
                        <ChevronRight
                          size={20}
                          className="text-[#F59E0B]/50 dark:text-[#F59E0B]/30"
                          strokeWidth={2.5}
                        />
                      </div>
                    )}

                    {/* Circle number */}
                    <div className="relative mb-8 flex h-[104px] w-[104px] items-center justify-center">
                      {/* Outer ring */}
                      <div className="absolute inset-0 rounded-full border-2 border-[#0A1628]/10 transition-colors duration-300 group-hover:border-[#F59E0B]/40 dark:border-white/10 dark:group-hover:border-[#F59E0B]/40" />
                      {/* Inner filled circle */}
                      <div className="flex h-[76px] w-[76px] items-center justify-center rounded-full bg-[#0A1628] shadow-lg shadow-[#0A1628]/15 transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_0_30px_rgba(245,158,11,0.3)] dark:bg-[#F59E0B] dark:shadow-[0_0_20px_rgba(245,158,11,0.2)]">
                        <span className="font-display text-2xl font-bold text-white dark:text-[#0A1628]">
                          {i + 1}
                        </span>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="font-display mb-3 text-center text-lg font-bold text-[#0A1628] dark:text-white">
                      {step.title}
                    </h3>

                    {/* Description */}
                    <p className="font-body mb-6 text-center text-sm leading-relaxed text-[#0A1628]/55 dark:text-white/45">
                      {step.description}
                    </p>

                    {/* Photo placeholder */}
                    <div className="flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-xl border border-[#0A1628]/5 bg-[#0A1628]/[0.03] transition-colors duration-300 group-hover:border-[#F59E0B]/20 group-hover:bg-[#0A1628]/[0.05] dark:border-white/8 dark:bg-white/[0.04] dark:backdrop-blur-sm dark:group-hover:border-[#F59E0B]/20 dark:group-hover:bg-white/[0.06]">
                      <div className="flex flex-col items-center gap-2">
                        <Camera
                          size={28}
                          className="text-[#0A1628]/15 dark:text-white/15"
                          strokeWidth={1.5}
                        />
                        <span className="font-body text-xs text-[#0A1628]/25 dark:text-white/25">
                          {f.processPhotoPlaceholder}
                        </span>
                      </div>
                    </div>
                  </div>
                </AnimateOnScroll>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile / Tablet: Vertical Timeline */}
        <div className="lg:hidden">
          <div className="relative ml-6 border-l-2 border-[#F59E0B]/25 pl-8 dark:border-[#F59E0B]/15 sm:ml-8 sm:pl-10">
            {steps.map((step, i) => (
              <AnimateOnScroll
                key={i}
                animation="fade-up"
                delay={i * 120}
              >
                <div
                  className={`relative ${i < steps.length - 1 ? "pb-12" : "pb-0"}`}
                >
                  {/* Circle number on the line */}
                  <div className="absolute -left-[calc(2rem+17px)] top-0 flex h-[34px] w-[34px] items-center justify-center rounded-full bg-[#0A1628] shadow-md shadow-[#0A1628]/15 ring-4 ring-[#FAFAF7] dark:bg-[#F59E0B] dark:ring-[#0A1628] sm:-left-[calc(2.5rem+17px)]">
                    <span className="font-display text-sm font-bold text-white dark:text-[#0A1628]">
                      {i + 1}
                    </span>
                  </div>

                  {/* Arrow to next step (not on last) */}
                  {i < steps.length - 1 && (
                    <div
                      className="absolute -left-[calc(2rem+11px)] bottom-3 sm:-left-[calc(2.5rem+11px)]"
                      aria-hidden="true"
                    >
                      <ChevronRight
                        size={14}
                        className="rotate-90 text-[#F59E0B]/40 dark:text-[#F59E0B]/25"
                        strokeWidth={2.5}
                      />
                    </div>
                  )}

                  {/* Content */}
                  <div className="-mt-1">
                    <h3 className="font-display mb-2 text-lg font-bold text-[#0A1628] dark:text-white">
                      {step.title}
                    </h3>
                    <p className="font-body mb-5 max-w-md text-sm leading-relaxed text-[#0A1628]/55 dark:text-white/45">
                      {step.description}
                    </p>

                    {/* Photo placeholder */}
                    <div className="flex aspect-video w-full max-w-sm items-center justify-center rounded-xl border border-[#0A1628]/5 bg-[#0A1628]/[0.03] dark:border-white/5 dark:bg-white/[0.03]">
                      <div className="flex flex-col items-center gap-1.5">
                        <Camera
                          size={22}
                          className="text-[#0A1628]/15 dark:text-white/15"
                          strokeWidth={1.5}
                        />
                        <span className="font-body text-xs text-[#0A1628]/25 dark:text-white/25">
                          {f.processPhotoPlaceholder}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
