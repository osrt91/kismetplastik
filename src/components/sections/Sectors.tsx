"use client";

import { useState } from "react";
import { FaFlask, FaSprayCan, FaHandSparkles, FaPumpSoap, FaHotel, FaWandMagicSparkles } from "react-icons/fa6";
import AnimateOnScroll from "@/components/ui/AnimateOnScroll";
import { useLocale } from "@/contexts/LocaleContext";

const sectorIcons = [FaFlask, FaSprayCan, FaHandSparkles, FaPumpSoap, FaHotel, FaWandMagicSparkles];

export default function Sectors() {
  const { dict } = useLocale();
  const h = dict.home;
  const sectors = (dict.homeSectors as { name: string; description: string }[]).map((s, i) => ({
    ...s,
    icon: sectorIcons[i],
  }));

  const [activeTab, setActiveTab] = useState(0);

  return (
    <section className="bg-neutral-50 py-20 dark:bg-neutral-900 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <AnimateOnScroll animation="fade-up">
          <div className="mb-14 text-center">
            <span className="mb-3 inline-block text-xs font-bold uppercase tracking-[0.2em] bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">
              {h.sectorsOverline}
            </span>
            <h2 className="mb-4 text-3xl font-extrabold text-primary-900 dark:text-white sm:text-4xl">
              {h.sectorsTitle}
            </h2>
            <p className="mx-auto max-w-2xl text-neutral-500 dark:text-neutral-400">
              {h.sectorsSubtitle}
            </p>
            <div className="mx-auto mt-5 inline-flex items-center gap-2 rounded-full border border-primary-100 bg-white px-4 py-1.5 shadow-sm dark:border-neutral-700 dark:bg-neutral-800">
              <span className="h-2 w-2 rounded-full bg-accent-500" />
              <span className="text-xs font-bold tracking-wide text-primary-700 dark:text-primary-300">
                {h.sectorsBadge} &middot; {sectors.length} {h.sectorLabel}
              </span>
            </div>
          </div>
        </AnimateOnScroll>

        <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
          <div className="flex flex-row gap-2 overflow-x-auto pb-2 lg:w-64 lg:shrink-0 lg:flex-col lg:overflow-visible lg:pb-0">
            {sectors.map((sector, i) => {
              const Icon = sector.icon;
              const isActive = activeTab === i;
              return (
                <button
                  key={sector.name}
                  onClick={() => setActiveTab(i)}
                  className={`group relative flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium transition-all duration-300 lg:w-full ${
                    isActive
                      ? "bg-white text-primary-900 shadow-lg shadow-primary-500/5 dark:bg-neutral-800 dark:text-white"
                      : "text-neutral-500 hover:bg-white/60 hover:text-primary-700 dark:text-neutral-400 dark:hover:bg-neutral-800/60 dark:hover:text-white"
                  }`}
                >
                  {isActive && (
                    <span className="absolute inset-y-2 left-0 w-[3px] rounded-full bg-gradient-to-b from-primary-500 to-accent-500 hidden lg:block" />
                  )}
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-all duration-300 ${
                      isActive
                        ? "bg-gradient-to-br from-accent-500 to-accent-400 text-white shadow-md"
                        : "bg-neutral-100 text-neutral-400 group-hover:bg-primary-50 group-hover:text-primary-500 dark:bg-neutral-700 dark:text-neutral-500"
                    }`}
                  >
                    <Icon size={16} />
                  </span>
                  <span className="whitespace-nowrap">{sector.name}</span>
                </button>
              );
            })}
          </div>

          <div className="flex-1">
            {sectors.map((sector, i) => {
              const Icon = sector.icon;
              if (i !== activeTab) return null;
              return (
                <div
                  key={sector.name}
                  className="animate-[fade-in-up_400ms_ease-out]"
                >
                  <div className="relative overflow-hidden rounded-2xl border border-neutral-100 bg-white p-8 shadow-sm dark:border-neutral-700 dark:bg-neutral-800 lg:p-10">
                    <span className="pointer-events-none absolute -bottom-6 -right-6 text-primary-50 opacity-20 dark:text-primary-300">
                      <Icon size={120} />
                    </span>

                    <div className="relative">
                      <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-accent-500 to-accent-400 text-white shadow-lg shadow-accent-500/20">
                        <Icon size={24} />
                      </div>
                      <h3 className="mb-4 text-2xl font-extrabold text-primary-900 dark:text-white">
                        {sector.name}
                      </h3>
                      <p className="max-w-xl text-base leading-relaxed text-neutral-600 dark:text-neutral-400">
                        {sector.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
