"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { useLocale } from "@/contexts/LocaleContext";
import { Trophy, Package, Users, Factory } from "lucide-react";

const statKeys = ["statsExperience", "statsProducts", "statsCustomers", "statsCapacity"] as const;

const defaultStatValues = [
  { value: 55, suffix: "+" },
  { value: 500, suffix: "+" },
  { value: 1000, suffix: "+" },
  { value: 50, suffix: "M+" },
];

const statIcons = [Trophy, Package, Users, Factory];

function AnimatedNumber({
  target,
  suffix,
  inView,
}: {
  target: number;
  suffix: string;
  inView: boolean;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let frame: number;
    const duration = 2000;
    const start = performance.now();

    const animate = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [inView, target]);

  const isAnimating = inView && count < target;

  return (
    <span
      className={`inline-block transition-all duration-300 ${
        inView && count === target ? "scale-100" : inView ? "scale-105" : "scale-90"
      } ${isAnimating ? "[text-shadow:0_0_20px_rgba(245,158,11,0.6),0_0_40px_rgba(245,158,11,0.3)]" : ""}`}
    >
      {count}
      {suffix}
    </span>
  );
}

interface StatsProps {
  settings?: Record<string, string>;
}

export default function Stats({ settings }: StatsProps) {
  const { dict } = useLocale();
  const h = dict.home;
  const statValues = [
    { value: parseInt(settings?.stats_experience_years ?? String(defaultStatValues[0].value)), suffix: "+" },
    { value: parseInt(settings?.stats_products ?? String(defaultStatValues[1].value)), suffix: "+" },
    { value: parseInt(settings?.stats_customers ?? String(defaultStatValues[2].value)), suffix: "+" },
    { value: parseInt(settings?.stats_capacity ?? String(defaultStatValues[3].value)), suffix: "M+" },
  ];
  const stats = statValues.map((s, i) => ({ ...s, label: h[statKeys[i]] }));
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#0A1628] via-[#0E1D35] to-[#0A1628] py-20 lg:py-28">
      {/* Top gradient line */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#F59E0B]/60 to-transparent" />
      {/* Bottom gradient line */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#F59E0B]/60 to-transparent" />

      {/* Dot pattern background */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div
          className="h-full w-full"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      {/* Decorative blurs */}
      <div className="absolute -left-32 top-1/4 h-64 w-64 rounded-full bg-[#F59E0B]/8 blur-[100px]" />
      <div className="absolute -right-32 bottom-1/4 h-64 w-64 rounded-full bg-[#F59E0B]/5 blur-[100px]" />
      <div className="absolute left-1/2 top-0 h-48 w-48 -translate-x-1/2 rounded-full bg-[#F59E0B]/4 blur-[80px]" />

      <div className="relative mx-auto max-w-7xl px-4 lg:px-6" ref={ref}>
        {/* Section title */}
        <div className="mb-14 flex flex-col items-center text-center lg:mb-16">
          <div className="mb-3 flex items-center gap-3">
            <span className="h-px w-8 bg-gradient-to-r from-transparent to-[#F59E0B]/70" />
            <span className="font-body text-xs font-semibold uppercase tracking-[0.2em] text-[#F59E0B]">
              {h.statsOverline}
            </span>
            <span className="h-px w-8 bg-gradient-to-l from-transparent to-[#F59E0B]/70" />
          </div>
          <h2 className="font-display text-xl font-bold text-white sm:text-2xl lg:text-3xl">
            {h.statsTitle}
          </h2>
          <div className="mt-4 h-1 w-16 rounded-full bg-gradient-to-r from-[#F59E0B] to-[#F59E0B]/30" />
        </div>

        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4 lg:gap-8">
          {stats.map((stat, i) => {
            const Icon = statIcons[i];
            return (
              <div
                key={stat.label}
                className="relative flex"
              >
                {/* Vertical divider between cards (desktop only) */}
                {i > 0 && (
                  <div className="absolute -left-4 top-1/2 hidden h-20 w-px -translate-y-1/2 bg-gradient-to-b from-transparent via-white/10 to-transparent lg:block" />
                )}

                <div
                  className={`group relative flex w-full flex-col items-center overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-8 text-center backdrop-blur-sm transition-all duration-700 hover:border-[#F59E0B]/20 hover:bg-white/[0.06] hover:shadow-[0_0_40px_-5px_rgba(245,158,11,0.2)] sm:px-6 sm:py-10 ${
                    inView
                      ? "translate-y-0 opacity-100"
                      : "translate-y-8 opacity-0"
                  }`}
                  style={{ transitionDelay: `${i * 150}ms` }}
                >
                  {/* Card inner glow on hover */}
                  <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(245,158,11,0.08) 0%, transparent 70%)" }} />

                  {/* Icon */}
                  <div className="relative mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#F59E0B]/20 bg-[#F59E0B]/10 text-[#F59E0B] shadow-[0_0_20px_-5px_rgba(245,158,11,0.2)] transition-all duration-300 group-hover:border-[#F59E0B]/30 group-hover:bg-[#F59E0B]/15 group-hover:shadow-[0_0_30px_rgba(245,158,11,0.4)]">
                    <Icon size={26} strokeWidth={1.5} />
                  </div>

                  {/* Number */}
                  <div className="relative mb-3 font-mono text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
                    <AnimatedNumber
                      target={stat.value}
                      suffix={stat.suffix}
                      inView={inView}
                    />
                  </div>

                  {/* Label with accent underline */}
                  <div className="font-body relative text-sm font-medium text-white/50 sm:text-base">
                    {stat.label}
                    <span className="mx-auto mt-3 block h-0.5 w-8 rounded-full bg-[#F59E0B]/30 transition-all duration-300 group-hover:w-14 group-hover:bg-[#F59E0B]/60" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
