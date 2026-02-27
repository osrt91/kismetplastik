"use client";

import {
  Factory,
  Recycle,
  Truck,
  Headphones,
  Gauge,
  ShieldCheck,
} from "@phosphor-icons/react";
import AnimateOnScroll from "@/components/ui/AnimateOnScroll";
import { useLocale } from "@/contexts/LocaleContext";

const primaryScheme = {
  iconBg: "bg-primary-50",
  iconText: "text-primary-700",
  iconHoverBg: "group-hover:bg-primary-900",
  numberColor: "text-primary-100",
  borderGradient: "from-primary-500 via-primary-300 to-primary-700",
};

const accentScheme = {
  iconBg: "bg-accent-100",
  iconText: "text-accent-600",
  iconHoverBg: "group-hover:bg-accent-500",
  numberColor: "text-accent-100",
  borderGradient: "from-accent-500 via-accent-300 to-accent-600",
};

export default function WhyUs() {
  const { dict } = useLocale();
  const h = dict.home;
  const f = dict.homeFeatures as Record<string, string>;
  const features = [
    { icon: Factory, title: f.modernFactory, description: f.modernFactoryDesc },
    { icon: ShieldCheck, title: f.qualityAssurance, description: f.qualityAssuranceDesc },
    { icon: Recycle, title: f.ecoFriendly, description: f.ecoFriendlyDesc },
    { icon: Truck, title: f.fastDelivery, description: f.fastDeliveryDesc },
    { icon: Gauge, title: f.highCapacity, description: f.highCapacityDesc },
    { icon: Headphones, title: f.support, description: f.supportDesc },
  ];

  return (
    <section className="relative bg-neutral-50 py-20 dark:bg-neutral-900 lg:py-28 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        {/* Section Header */}
        <AnimateOnScroll animation="fade-up">
          <div className="mb-14 text-center">
            <span className="mb-3 inline-block text-sm font-bold uppercase tracking-widest text-accent-500">
              {h.whyUsOverline}
            </span>
            <h2 className="mb-4 text-3xl font-extrabold text-primary-900 dark:text-white sm:text-4xl">
              {h.whyUsTitle}
            </h2>
            <p className="mx-auto max-w-2xl text-neutral-500 dark:text-neutral-400">
              {h.whyUsSubtitle}
            </p>
          </div>
        </AnimateOnScroll>

        {/* Features Grid with connecting lines */}
        <div className="relative grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {/* Horizontal connecting dots (visible on lg) */}
          <div className="pointer-events-none absolute top-1/2 left-0 right-0 -translate-y-1/2 hidden lg:block" aria-hidden>
            <svg width="100%" height="4" className="overflow-visible">
              <line
                x1="18%"
                y1="2"
                x2="82%"
                y2="2"
                stroke="var(--primary-100)"
                strokeWidth="2"
                strokeDasharray="6 10"
              />
            </svg>
          </div>

          {/* Vertical connecting dots between rows (visible on lg) */}
          {[0, 1, 2].map((col) => (
            <div
              key={col}
              className="pointer-events-none absolute hidden lg:block"
              aria-hidden
              style={{
                left: `${16.66 + col * 33.33}%`,
                top: "42%",
                height: "16%",
              }}
            >
              <svg width="4" height="100%" className="overflow-visible">
                <line
                  x1="2"
                  y1="0"
                  x2="2"
                  y2="100%"
                  stroke="var(--primary-100)"
                  strokeWidth="2"
                  strokeDasharray="4 8"
                />
              </svg>
            </div>
          ))}

          {features.map((feature, i) => {
            const scheme = i % 2 === 0 ? primaryScheme : accentScheme;
            return (
              <AnimateOnScroll
                key={feature.title}
                animation="fade-up"
                delay={i * 100}
              >
                <div className="group relative h-full overflow-hidden rounded-2xl border border-neutral-100 bg-white p-8 transition-all duration-300 hover:-translate-y-1 hover:border-primary-100 hover:shadow-xl hover:shadow-primary-900/5 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:border-primary-500/30">
                  {/* Left border gradient reveal on hover */}
                  <div
                    className={`absolute left-0 top-0 h-full w-[3px] bg-gradient-to-b ${scheme.borderGradient} opacity-0 transition-all duration-500 group-hover:opacity-100`}
                  />

                  {/* Large faded step number */}
                  <span
                    className={`absolute -top-2 right-4 select-none font-mono text-[4.5rem] font-black leading-none ${scheme.numberColor} transition-colors duration-300 group-hover:text-primary-50`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  <div className="relative z-10">
                    <div
                      className={`mb-5 flex h-14 w-14 items-center justify-center rounded-xl ${scheme.iconBg} ${scheme.iconText} transition-all duration-300 ${scheme.iconHoverBg} group-hover:text-white group-hover:scale-110 group-hover:rotate-3`}
                    >
                      <feature.icon size={26} weight="duotone" />
                    </div>
                    <h3 className="mb-3 text-lg font-bold text-primary-900 dark:text-white">
                      {feature.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
                      {feature.description}
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
