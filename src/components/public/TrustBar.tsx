"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useLocale } from "@/contexts/LocaleContext";

interface StatItem {
  value: number;
  suffix: string;
  label: string;
}

function useCountUp(target: number, duration: number, isVisible: boolean) {
  const [count, setCount] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!isVisible || hasAnimated.current) return;
    hasAnimated.current = true;

    const startTime = performance.now();

    function tick(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    }

    requestAnimationFrame(tick);
  }, [isVisible, target, duration]);

  return count;
}

function StatBlock({ item, isVisible, index }: { item: StatItem; isVisible: boolean; index: number }) {
  const count = useCountUp(item.value, 2000, isVisible);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col items-center gap-1.5 py-3"
    >
      <span className="font-mono text-3xl font-bold text-navy-900 dark:text-amber-400 sm:text-4xl">
        {count}
        {item.suffix}
      </span>
      <span className="font-body text-xs font-medium uppercase tracking-wider text-navy-900/50 dark:text-white/40 sm:text-sm">
        {item.label}
      </span>
    </motion.div>
  );
}

interface TrustBarProps {
  settings?: Record<string, string>;
}

export default function TrustBar({ settings }: TrustBarProps) {
  const { dict } = useLocale();
  const t = dict.trustBar;
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  const stats: StatItem[] = [
    { value: parseInt(settings?.stats_experience_years ?? "57"), suffix: "", label: t.experience },
    { value: 8, suffix: "", label: t.exports },
    { value: parseInt(settings?.stats_products ?? "2000"), suffix: "+", label: t.products },
    { value: parseInt(settings?.stats_customers ?? "500"), suffix: "+", label: t.customers },
  ];

  return (
    <section
      ref={ref}
      className="relative border-y border-navy-900/10 bg-cream-50 py-8 dark:border-amber-500/10 dark:bg-navy-900/80 lg:py-10"
    >
      {/* Subtle amber gradient line at top */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />

      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-8">
          {stats.map((item, i) => (
            <StatBlock key={item.label} item={item} isVisible={inView} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
