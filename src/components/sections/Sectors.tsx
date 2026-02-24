"use client";

import { Utensils, Pipette, FlaskConical, Pill, Brush, Droplets } from "lucide-react";
import AnimateOnScroll from "@/components/ui/AnimateOnScroll";
import { useLocale } from "@/contexts/LocaleContext";

const sectorIcons = [Utensils, Pipette, FlaskConical, Pill, Brush, Droplets];

export default function Sectors() {
  const { dict } = useLocale();
  const h = dict.home;
  const sectors = (dict.homeSectors as { name: string; description: string }[]).map((s, i) => ({
    ...s,
    icon: sectorIcons[i],
  }));

  return (
    <section className="bg-neutral-50 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        {/* Section Header */}
        <AnimateOnScroll animation="fade-up">
          <div className="mb-14 text-center">
            <span className="mb-3 inline-block text-sm font-bold uppercase tracking-widest text-accent-500">
              {h.sectorsOverline}
            </span>
            <h2 className="mb-4 text-3xl font-extrabold text-primary-900 sm:text-4xl">
              {h.sectorsTitle}
            </h2>
            <p className="mx-auto max-w-2xl text-neutral-500">
              {h.sectorsSubtitle}
            </p>
          </div>
        </AnimateOnScroll>

        {/* Sectors Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sectors.map((sector, i) => (
            <AnimateOnScroll
              key={sector.name}
              animation="fade-up"
              delay={i * 80}
            >
              <div className="group flex h-full items-start gap-5 rounded-2xl border border-neutral-100 bg-white p-7 transition-all duration-300 hover:border-primary-100 hover:shadow-lg hover:shadow-primary-900/5 hover:-translate-y-0.5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent-100 text-accent-600 transition-all duration-300 group-hover:bg-accent-500 group-hover:text-primary-900 group-hover:scale-110 group-hover:rotate-6">
                  <sector.icon size={22} />
                </div>
                <div>
                  <h3 className="mb-2 text-base font-bold text-primary-900">
                    {sector.name}
                  </h3>
                  <p className="text-sm leading-relaxed text-neutral-500">
                    {sector.description}
                  </p>
                </div>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
