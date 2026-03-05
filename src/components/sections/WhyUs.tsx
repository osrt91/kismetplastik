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
  iconBg: "bg-gradient-to-br from-amber-400 to-amber-600",
  iconText: "text-white",
  iconHoverBg: "group-hover:from-amber-500 group-hover:to-amber-700",
  numberColor: "text-[#0A1628]/[0.06] dark:text-white/[0.04]",
  borderGradient: "from-amber-500 via-amber-300 to-amber-600",
};

const accentScheme = {
  iconBg: "bg-gradient-to-br from-amber-500 to-amber-700",
  iconText: "text-white",
  iconHoverBg: "group-hover:from-amber-400 group-hover:to-amber-600",
  numberColor: "text-[#0A1628]/[0.06] dark:text-white/[0.04]",
  borderGradient: "from-amber-500 via-amber-300 to-amber-600",
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
    <section className="relative py-20 lg:py-28 overflow-hidden bg-gradient-to-b from-[#FAFAF7] via-white to-[#FAFAF7] dark:from-[#0A1628] dark:via-neutral-900 dark:to-[#0A1628]">
      {/* Subtle background pattern */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.03] dark:opacity-[0.02]" aria-hidden>
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #0A1628 1px, transparent 0)', backgroundSize: '40px 40px' }} />
      </div>
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        {/* Section Header */}
        <AnimateOnScroll animation="fade-up">
          <div className="mb-14 text-center">
            <span className="mb-3 inline-block rounded-full bg-amber-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-amber-600 dark:bg-amber-500/20 dark:text-amber-400">
              {h.whyUsOverline}
            </span>
            <h2 className="mb-4 text-3xl font-extrabold text-[#0A1628] dark:text-white sm:text-4xl lg:text-5xl">
              {h.whyUsTitle}
            </h2>
            <p className="mx-auto max-w-2xl text-base leading-relaxed text-muted-foreground">
              {h.whyUsSubtitle}
            </p>
          </div>
        </AnimateOnScroll>

        {/* Features Grid with connecting lines */}
        <div className="relative grid gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-8">
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
                delay={i * 120}
              >
                <div className="group relative h-full overflow-hidden rounded-2xl border border-border/60 bg-card/70 p-7 backdrop-blur-md transition-all duration-500 ease-out hover:-translate-y-2 hover:border-amber-400/50 hover:shadow-2xl hover:shadow-amber-500/10 sm:p-8 dark:border-white/[0.08] dark:bg-white/[0.04] dark:backdrop-blur-xl dark:hover:border-amber-500/30 dark:hover:shadow-amber-500/5">
                  {/* Left border gradient reveal on hover */}
                  <div
                    className={`absolute left-0 top-0 h-full w-[3px] rounded-full bg-gradient-to-b ${scheme.borderGradient} opacity-0 transition-all duration-500 group-hover:opacity-100`}
                  />

                  {/* Large faded step number */}
                  <span
                    className={`absolute -top-2 right-4 select-none font-mono text-[4.5rem] font-black leading-none ${scheme.numberColor} transition-colors duration-300 group-hover:text-primary-50 dark:group-hover:text-white/[0.06]`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  <div className="relative z-10">
                    <div
                      className={`mb-5 flex h-14 w-14 items-center justify-center rounded-2xl shadow-lg shadow-amber-500/20 ${scheme.iconBg} ${scheme.iconText} transition-all duration-500 ${scheme.iconHoverBg} group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-xl group-hover:shadow-amber-500/30`}
                    >
                      <feature.icon size={26} weight="duotone" />
                    </div>
                    <h3 className="mb-2.5 text-lg font-bold tracking-tight text-[#0A1628] dark:text-white">
                      {feature.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">
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
