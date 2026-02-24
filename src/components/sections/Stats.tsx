"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale } from "@/contexts/LocaleContext";

// Labels come from useLocale in component
const statKeys = ["statsExperience", "statsProducts", "statsCustomers", "statsCapacity"] as const;
const statValues = [
  { value: 20, suffix: "+" },
  { value: 500, suffix: "+" },
  { value: 1000, suffix: "+" },
  { value: 50, suffix: "M+" },
];

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
    <section className="relative overflow-hidden bg-primary-900 py-16 lg:py-20">
      {/* Background */}
      <div className="absolute inset-0 opacity-[0.04]">
        <div
          className="h-full w-full"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      {/* Decorative */}
      <div className="absolute -left-20 top-0 h-40 w-40 rounded-full bg-accent-500/10 blur-3xl" />
      <div className="absolute -right-20 bottom-0 h-40 w-40 rounded-full bg-primary-300/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 lg:px-6" ref={ref}>
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className={`text-center transition-all duration-700 ${inView ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}
              style={{ transitionDelay: `${i * 150}ms` }}
            >
              <div className="mb-2 text-4xl font-extrabold text-white sm:text-5xl lg:text-6xl">
                <AnimatedNumber
                  target={stat.value}
                  suffix={stat.suffix}
                  inView={inView}
                />
              </div>
              <div className="text-sm font-medium text-white/50 sm:text-base">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
