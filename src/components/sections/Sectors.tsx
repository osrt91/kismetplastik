import { FlaskConical, SprayCan, Sparkles, Droplets, Hotel, Settings2 } from "lucide-react";
import AnimateOnScroll from "@/components/ui/AnimateOnScroll";
import type { DbContentSection } from "@/types/database";
import { getLocalizedFieldSync } from "@/lib/content";
import type { Dictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/locales";

const sectorIcons = [FlaskConical, SprayCan, Sparkles, Droplets, Hotel, Settings2];

interface SectorsProps {
  content?: Record<string, DbContentSection>;
  locale: Locale;
  dict: Dictionary;
}

export default function Sectors({ content, locale, dict }: SectorsProps) {
  const h = dict.home;
  const dictSectors = dict.homeSectors as { name: string; description: string }[];
  const sectors = dictSectors.map((s, i) => {
    const key = `home_sector_${i + 1}`;
    const section = content?.[key];
    return {
      name: (section ? getLocalizedFieldSync(section, "title", locale) : "") || s.name,
      description: (section ? getLocalizedFieldSync(section, "content", locale) : "") || s.description,
      icon: sectorIcons[i],
    };
  });

  return (
    <section className="relative bg-[#FAFAF7] py-20 dark:bg-[#0A1628] lg:py-28">
      {/* Subtle dot pattern in dark mode */}
      <div className="pointer-events-none absolute inset-0 hidden opacity-[0.03] dark:block" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        {/* Section Header */}
        <AnimateOnScroll animation="fade-up">
          <div className="mb-14 text-center">
            <span className="mb-3 inline-block text-sm font-bold uppercase tracking-widest text-[#F59E0B]">
              {h.sectorsOverline}
            </span>
            <h2 className="font-display relative mb-4 inline-block text-2xl font-bold text-[#0A1628] dark:text-white sm:text-3xl">
              {h.sectorsTitle}
              <span className="absolute -bottom-2 left-1/2 h-1 w-16 -translate-x-1/2 rounded-full bg-[#F59E0B]" />
            </h2>
            <p className="font-body mx-auto mt-4 max-w-2xl text-muted-foreground">
              {h.sectorsSubtitle}
            </p>
            {/* Counter badge */}
            <div className="mx-auto mt-5 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 shadow-sm shadow-amber-500/10 dark:border-neutral-700 dark:bg-neutral-800">
              <span className="h-2 w-2 rounded-full bg-[#F59E0B]" />
              <span className="text-xs font-bold tracking-wide text-[#0A1628] dark:text-neutral-300">
                {h.sectorsCountLabel} &middot; <span className="font-mono">{sectors.length}</span> {h.sectorsCountSuffix}
              </span>
            </div>
          </div>
        </AnimateOnScroll>

        {/* Asymmetric Bento Grid — 2+1 / 1+2 alternating rows on lg */}
        <div className="grid gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {sectors.map((sector, i) => {
            const Icon = sector.icon;
            // 2+1 / 1+2 alternating: wide cards at indices 0, 3, 5
            const isWide = i === 0 || i === 3 || i === 5;
            return (
              <AnimateOnScroll
                key={sector.name}
                animation="fade-up"
                delay={i * 120}
                className={isWide ? "lg:col-span-2" : ""}
              >
                <div className={`card-shine group relative flex h-full items-start gap-5 overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:border-[#F59E0B]/50 hover:shadow-xl hover:shadow-[#0A1628]/8 hover:-translate-y-1.5 active:scale-[0.98] sm:p-7 dark:border-neutral-700 dark:bg-[#0A1628]/60 dark:hover:border-[#F59E0B]/40 dark:hover:shadow-[#F59E0B]/5 ${isWide ? 'hover:border-l-[#F59E0B]/50' : ''}`}>
                  {/* Top amber accent line */}
                  <span className="absolute inset-x-0 top-0 mx-auto h-[3px] w-0 rounded-b-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 transition-all duration-500 group-hover:w-full" />

                  {/* Hover overlay gradient (navy to transparent) */}
                  <span className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#0A1628]/0 via-[#0A1628]/0 to-[#F59E0B]/0 opacity-0 transition-opacity duration-300 group-hover:from-[#0A1628]/[0.03] group-hover:via-transparent group-hover:to-[#F59E0B]/[0.06] group-hover:opacity-100 dark:group-hover:from-[#0A1628]/20 dark:group-hover:via-transparent dark:group-hover:to-[#F59E0B]/10" />

                  {/* Background watermark icon */}
                  <span className="pointer-events-none absolute -bottom-4 -right-4 text-[#0A1628]/[0.04] transition-all duration-500 group-hover:scale-125 group-hover:text-[#F59E0B]/[0.08] dark:text-white/[0.04] dark:group-hover:text-[#F59E0B]/[0.06]">
                    <Icon size={80} />
                  </span>

                  {/* Icon container */}
                  <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#F59E0B]/10 text-[#F59E0B] transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 group-hover:bg-[#F59E0B] group-hover:text-[#0A1628] group-hover:shadow-[0_0_25px_rgba(245,158,11,0.35)] dark:bg-[#F59E0B]/15 dark:text-[#F59E0B]">
                    <Icon size={22} />
                  </div>

                  {/* Content */}
                  <div className="relative min-w-0 flex-1">
                    <h3 className="font-display mb-1.5 text-base font-bold leading-snug text-[#0A1628] transition-colors duration-200 group-hover:text-[#0A1628] sm:text-[17px] dark:text-white dark:group-hover:text-white">
                      {sector.name}
                    </h3>
                    <p className="font-body text-sm leading-relaxed text-muted-foreground">
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
