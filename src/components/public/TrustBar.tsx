"use client";

import { useEffect, useRef, useState, useCallback } from "react";
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
      // ease-out cubic
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

function StatBlock({ item, isVisible }: { item: StatItem; isVisible: boolean }) {
  const count = useCountUp(item.value, 2000, isVisible);

  return (
    <div className="flex flex-col items-center gap-1 py-2">
      <span className="font-mono text-3xl font-bold text-[var(--primary-900)] dark:text-white">
        {count}
        {item.suffix}
      </span>
      <span className="font-body text-sm text-neutral-600 dark:text-neutral-400">
        {item.label}
      </span>
    </div>
  );
}

export default function TrustBar() {
  const { dict } = useLocale();
  const t = dict.trustBar;
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      if (entries[0].isIntersecting) {
        setIsVisible(true);
      }
    },
    []
  );

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(handleIntersection, {
      threshold: 0.3,
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [handleIntersection]);

  const stats: StatItem[] = [
    { value: 57, suffix: "", label: t.experience },
    { value: 8, suffix: "", label: t.exports },
    { value: 2000, suffix: "+", label: t.products },
    { value: 500, suffix: "+", label: t.customers },
  ];

  return (
    <section
      ref={ref}
      className="border-y border-neutral-200 bg-[#FAFAF7] py-8 dark:border-neutral-800 dark:bg-neutral-900"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-8">
          {stats.map((item) => (
            <StatBlock key={item.label} item={item} isVisible={isVisible} />
          ))}
        </div>
      </div>
    </section>
  );
}
