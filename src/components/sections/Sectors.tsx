"use client";

import { FaFlask, FaSprayCan, FaHandSparkles, FaPumpSoap, FaHotel, FaGears } from "react-icons/fa6";
import AnimateOnScroll from "@/components/ui/AnimateOnScroll";
import { useLocale } from "@/contexts/LocaleContext";

const sectorIcons = [FaFlask, FaSprayCan, FaHandSparkles, FaPumpSoap, FaHotel, FaGears];

export default function Sectors() {
  const { dict } = useLocale();
  const h = dict.home;
  const sectors = (dict.homeSectors as { name: string; description: string }[]).map((s, i) => ({
    ...s,
    icon: sectorIcons[i],
  }));

  return (
    <section className="bg-[#FAFAF7] py-20 dark:bg-[#0A1628] lg:py-28">
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        {/* Section Header */}
        <AnimateOnScroll animation="fade-up">
          <div className="mb-14 text-center">
            <span className="mb-3 inline-block text-sm font-bold uppercase tracking-widest text-[#F59E0B]">
              {h.sectorsOverline}
            </span>
            <h2 className="relative mb-4 inline-block text-3xl font-extrabold text-[#0A1628] dark:text-white sm:text-4xl">
              {h.sectorsTitle}
              <span className="absolute -bottom-2 left-1/2 h-1 w-16 -translate-x-1/2 rounded-full bg-[#F59E0B]" />
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              {h.sectorsSubtitle}
            </p>
            {/* Counter badge */}
            <div className="mx-auto mt-5 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 shadow-sm dark:border-neutral-700 dark:bg-neutral-800">
              <span className="h-2 w-2 rounded-full bg-[#F59E0B]" />
              <span className="text-xs font-bold tracking-wide text-[#0A1628] dark:text-neutral-300">
                Hizmet verdiğimiz sektörler &middot; {sectors.length} Sektör
              </span>
            </div>
          </div>
        </AnimateOnScroll>

        {/* Bento Grid */}
        <div className="grid gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {sectors.map((sector, i) => {
            const Icon = sector.icon;
            return (
              <AnimateOnScroll
                key={sector.name}
                animation="fade-up"
                delay={i * 120}
              >
                <div className="group relative flex h-full items-start gap-5 overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:border-[#F59E0B]/50 hover:shadow-xl hover:shadow-[#0A1628]/8 hover:-translate-y-1.5 active:scale-[0.98] sm:p-7 dark:border-neutral-700 dark:bg-[#0A1628]/60 dark:hover:border-[#F59E0B]/40 dark:hover:shadow-[#F59E0B]/5">
                  {/* Top amber accent line */}
                  <span className="absolute inset-x-0 top-0 mx-auto h-[3px] w-0 rounded-b-full bg-gradient-to-r from-[#F59E0B] to-amber-400 transition-all duration-500 group-hover:w-full" />

                  {/* Hover overlay gradient (navy to transparent) */}
                  <span className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#0A1628]/0 via-[#0A1628]/0 to-[#F59E0B]/0 opacity-0 transition-opacity duration-300 group-hover:from-[#0A1628]/[0.03] group-hover:via-transparent group-hover:to-[#F59E0B]/[0.06] group-hover:opacity-100 dark:group-hover:from-[#0A1628]/20 dark:group-hover:via-transparent dark:group-hover:to-[#F59E0B]/10" />

                  {/* Background watermark icon */}
                  <span className="pointer-events-none absolute -bottom-4 -right-4 text-[#0A1628]/[0.04] transition-all duration-500 group-hover:scale-125 group-hover:text-[#F59E0B]/[0.08] dark:text-white/[0.04] dark:group-hover:text-[#F59E0B]/[0.06]">
                    <Icon size={80} />
                  </span>

                  {/* Icon container */}
                  <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#F59E0B]/10 text-[#F59E0B] transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 group-hover:bg-[#F59E0B] group-hover:text-[#0A1628] group-hover:shadow-lg group-hover:shadow-[#F59E0B]/25 dark:bg-[#F59E0B]/15 dark:text-[#F59E0B]">
                    <Icon size={22} />
                  </div>

                  {/* Content */}
                  <div className="relative min-w-0 flex-1">
                    <h3 className="mb-1.5 text-base font-bold leading-snug text-[#0A1628] transition-colors duration-200 group-hover:text-[#0A1628] sm:text-[17px] dark:text-white dark:group-hover:text-white">
                      {sector.name}
                    </h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {sector.description}
                    </p>
                  </div>
                </div>
              </AnimateOnScroll>
            );
          })}
        </div>
      </div>
    </section>
  );
}
