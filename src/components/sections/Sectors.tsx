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
    <section className="bg-neutral-50 py-20 dark:bg-neutral-900 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        {/* Section Header */}
        <AnimateOnScroll animation="fade-up">
          <div className="mb-14 text-center">
            <span className="mb-3 inline-block text-sm font-bold uppercase tracking-widest text-accent-500">
              {h.sectorsOverline}
            </span>
            <h2 className="mb-4 text-3xl font-extrabold text-primary-900 dark:text-white sm:text-4xl">
              {h.sectorsTitle}
            </h2>
            <p className="mx-auto max-w-2xl text-neutral-500 dark:text-neutral-400">
              {h.sectorsSubtitle}
            </p>
            {/* Counter badge */}
            <div className="mx-auto mt-5 inline-flex items-center gap-2 rounded-full border border-primary-100 bg-white px-4 py-1.5 shadow-sm dark:border-neutral-700 dark:bg-neutral-800">
              <span className="h-2 w-2 rounded-full bg-accent-500" />
              <span className="text-xs font-bold tracking-wide text-primary-700">
                Hizmet verdiğimiz sektörler &middot; {sectors.length} Sektör
              </span>
            </div>
          </div>
        </AnimateOnScroll>

        {/* Bento Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sectors.map((sector, i) => {
            const Icon = sector.icon;
            return (
              <AnimateOnScroll
                key={sector.name}
                animation="fade-up"
                delay={i * 80}
              >
                <div className="group relative flex h-full items-start gap-5 overflow-hidden rounded-2xl border border-neutral-100 bg-white p-7 transition-all duration-300 hover:border-primary-100 hover:shadow-lg hover:shadow-primary-900/5 hover:-translate-y-0.5 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:border-primary-500/30">
                  <span className="absolute inset-x-0 top-0 mx-auto h-[3px] w-0 rounded-b-full bg-gradient-to-r from-accent-400 to-accent-500 transition-all duration-500 group-hover:w-full" />

                  <span className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary-50/0 via-accent-100/0 to-primary-100/0 opacity-0 transition-opacity duration-300 group-hover:from-primary-50/40 group-hover:via-accent-100/20 group-hover:to-primary-100/30 group-hover:opacity-100" />

                  <span className="pointer-events-none absolute -bottom-4 -right-4 text-primary-50 opacity-20 transition-transform duration-500 group-hover:scale-125">
                    <Icon size={80} />
                  </span>

                  <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent-100 text-accent-600 transition-all duration-300 group-hover:bg-accent-500 group-hover:text-primary-900 group-hover:scale-110 group-hover:rotate-6">
                    <Icon size={22} />
                  </div>

                  <div className="relative">
                    <h3 className="mb-2 text-base font-bold text-primary-900 dark:text-white">
                      {sector.name}
                    </h3>
                    <p className="text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
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
