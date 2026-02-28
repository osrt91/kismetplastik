"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale } from "@/contexts/LocaleContext";
import { Trophy, Package, Users, Factory } from "@phosphor-icons/react";

const statKeys = ["statsExperience", "statsProducts", "statsCustomers", "statsCapacity"] as const;
const statValues = [
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

  return (
    <span>
      {count}
      {suffix}
    </span>
  );
}

export default function Stats() {
  const { dict } = useLocale();
  const h = dict.home;
  const stats = statValues.map((s, i) => ({ ...s, label: h[statKeys[i]] }));
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="relative overflow-hidden bg-[#002060] py-16 lg:py-20">
      {/* Top gradient line */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-500/60 to-transparent" />
      {/* Bottom gradient line */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-accent-500/60 to-transparent" />

      {/* Dot pattern background */}
      <div className="absolute inset-0 opacity-[0.04]">
        <div
          className="h-full w-full"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      {/* Decorative blurs */}
      <div className="absolute -left-20 top-0 h-40 w-40 rounded-full bg-accent-500/10 blur-3xl" />
      <div className="absolute -right-20 bottom-0 h-40 w-40 rounded-full bg-primary-300/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 lg:px-6" ref={ref}>
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
                  <div className="absolute -left-4 top-1/2 hidden h-12 w-[2px] rounded-full -translate-y-1/2 bg-gradient-to-b from-transparent via-white/20 to-transparent lg:block" />
                )}

                <div
                  className={`group flex w-full flex-col items-center rounded-2xl border border-transparent px-4 py-6 text-center transition-all duration-700 hover:border-white/10 hover:bg-white/[0.04] hover:shadow-lg hover:shadow-accent-500/5 hover:backdrop-blur-sm ${
                    inView
                      ? "translate-y-0 opacity-100"
                      : "translate-y-8 opacity-0"
                  }`}
                  style={{ transitionDelay: `${i * 150}ms` }}
                >
                  {/* Icon */}
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent-500/10 text-accent-400 transition-colors duration-300 group-hover:bg-accent-500/20">
                    <Icon size={24} weight="duotone" />
                  </div>

                  {/* Number */}
                  <div className="mb-2 text-4xl font-extrabold text-white sm:text-5xl lg:text-6xl">
                    <AnimatedNumber
                      target={stat.value}
                      suffix={stat.suffix}
                      inView={inView}
                    />
                  </div>

                  {/* Label with accent underline */}
                  <div className="relative text-sm font-medium text-white/70 sm:text-base">
                    {stat.label}
                    <span className="mx-auto mt-2 block h-0.5 w-8 rounded-full bg-accent-500/40 transition-all duration-300 group-hover:w-12 group-hover:bg-accent-500/70" />
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
