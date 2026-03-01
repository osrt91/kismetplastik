"use client";

import AnimateOnScroll from "@/components/ui/AnimateOnScroll";
import { useLocale } from "@/contexts/LocaleContext";

const referenceNames = [
  "Farmasi",
  "Hunca",
  "Bioblas",
  "Hobby",
  "Deep Fresh",
  "Morfose",
  "Eyüp Sabri Tuncer",
  "Sleepy",
  "Cotton Bar",
  "Arko",
  "Komili",
  "Duru",
];

export default function References() {
  const { dict } = useLocale();
  const h = dict.home;

  const doubled = [...referenceNames, ...referenceNames];

  return (
    <section className="relative overflow-hidden bg-neutral-50 py-20 dark:bg-neutral-900 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <AnimateOnScroll animation="fade-up">
          <div className="mb-14 text-center">
            <span className="mb-3 inline-block text-xs font-bold uppercase tracking-[0.2em] bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">
              {h.referencesOverline}
            </span>
            <h2 className="mb-4 text-3xl font-extrabold text-primary-900 dark:text-white sm:text-4xl">
              {h.referencesTitle}
            </h2>
            <p className="mx-auto max-w-2xl text-neutral-500 dark:text-neutral-400">
              {h.referencesSubtitle}
            </p>
          </div>
        </AnimateOnScroll>
      </div>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 z-10 w-32 bg-gradient-to-r from-neutral-50 to-transparent dark:from-neutral-900" />
        <div className="absolute inset-y-0 right-0 z-10 w-32 bg-gradient-to-l from-neutral-50 to-transparent dark:from-neutral-900" />

        <div className="flex animate-marquee items-center gap-8">
          {doubled.map((name, i) => (
            <div
              key={`${name}-${i}`}
              className="flex h-20 w-48 shrink-0 items-center justify-center rounded-xl border border-neutral-200/60 bg-white px-6 shadow-sm transition-all duration-300 hover:border-primary-500/20 hover:shadow-md hover:-translate-y-0.5 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:border-primary-500/30"
            >
              <span className="text-center text-sm font-bold tracking-wide text-neutral-400 transition-colors duration-300 hover:text-primary-500 dark:text-neutral-500 dark:hover:text-primary-300">
                {name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
