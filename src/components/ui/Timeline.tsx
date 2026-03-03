"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import type { Milestone } from "@/data/milestones";

interface TimelineProps {
  milestones: Milestone[];
  locale: string;
}

function TimelineCard({
  milestone,
  locale,
  index,
}: {
  milestone: Milestone;
  locale: string;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // Respect reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(node);
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const isLeft = index % 2 === 0;
  const title = locale === "en" ? milestone.titleEn : milestone.title;
  const description =
    locale === "en" ? milestone.descriptionEn : milestone.description;

  return (
    <div
      ref={ref}
      className={cn(
        "relative flex w-full items-center",
        /* Desktop: alternate left/right */
        "md:justify-center",
        /* Mobile: single column */
        "justify-start"
      )}
    >
      {/* Desktop layout */}
      <div className="hidden w-full md:grid md:grid-cols-[1fr_auto_1fr] md:items-center md:gap-0">
        {/* Left content or spacer */}
        {isLeft ? (
          <div
            className={cn(
              "flex justify-end pr-8 transition-all duration-700 ease-out",
              isVisible
                ? "translate-x-0 opacity-100"
                : "-translate-x-12 opacity-0"
            )}
          >
            <div className="max-w-md rounded-2xl border border-neutral-100 bg-[#FAFAF7] p-6 shadow-sm transition-shadow duration-300 hover:shadow-md dark:border-neutral-700 dark:bg-neutral-800">
              <h3 className="mb-2 text-lg font-bold text-[#0A1628] dark:text-white">
                {title}
              </h3>
              <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
                {description}
              </p>
            </div>
          </div>
        ) : (
          <div />
        )}

        {/* Center: year badge on the line */}
        <div
          className={cn(
            "relative z-10 flex flex-col items-center transition-all duration-500 ease-out",
            isVisible ? "scale-100 opacity-100" : "scale-75 opacity-0"
          )}
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-full border-4 border-[#F59E0B] bg-[#0A1628] shadow-lg shadow-[#F59E0B]/20">
            <span className="text-sm font-bold text-white">
              {milestone.year}
            </span>
          </div>
        </div>

        {/* Right content or spacer */}
        {!isLeft ? (
          <div
            className={cn(
              "flex justify-start pl-8 transition-all duration-700 ease-out",
              isVisible
                ? "translate-x-0 opacity-100"
                : "translate-x-12 opacity-0"
            )}
          >
            <div className="max-w-md rounded-2xl border border-neutral-100 bg-[#FAFAF7] p-6 shadow-sm transition-shadow duration-300 hover:shadow-md dark:border-neutral-700 dark:bg-neutral-800">
              <h3 className="mb-2 text-lg font-bold text-[#0A1628] dark:text-white">
                {title}
              </h3>
              <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
                {description}
              </p>
            </div>
          </div>
        ) : (
          <div />
        )}
      </div>

      {/* Mobile layout: single column */}
      <div className="flex w-full items-start gap-4 md:hidden">
        {/* Year badge */}
        <div
          className={cn(
            "relative z-10 flex shrink-0 flex-col items-center transition-all duration-500 ease-out",
            isVisible ? "scale-100 opacity-100" : "scale-75 opacity-0"
          )}
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full border-4 border-[#F59E0B] bg-[#0A1628] shadow-lg shadow-[#F59E0B]/20">
            <span className="text-xs font-bold text-white">
              {milestone.year}
            </span>
          </div>
        </div>

        {/* Card */}
        <div
          className={cn(
            "flex-1 rounded-2xl border border-neutral-100 bg-[#FAFAF7] p-5 shadow-sm transition-all duration-700 ease-out dark:border-neutral-700 dark:bg-neutral-800",
            isVisible
              ? "translate-y-0 opacity-100"
              : "translate-y-6 opacity-0"
          )}
        >
          <h3 className="mb-1.5 text-base font-bold text-[#0A1628] dark:text-white">
            {title}
          </h3>
          <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Timeline({ milestones, locale }: TimelineProps) {
  return (
    <div className="relative">
      {/* Desktop: center vertical connecting line */}
      <div className="absolute left-1/2 top-0 hidden h-full w-0.5 -translate-x-1/2 bg-gradient-to-b from-[#0A1628] via-[#0A1628] to-[#0A1628]/30 md:block" />

      {/* Mobile: left vertical connecting line */}
      <div className="absolute left-6 top-0 h-full w-0.5 -translate-x-1/2 bg-gradient-to-b from-[#0A1628] via-[#0A1628] to-[#0A1628]/30 md:hidden" />

      <div className="flex flex-col gap-10 md:gap-16">
        {milestones.map((milestone, index) => (
          <TimelineCard
            key={milestone.year}
            milestone={milestone}
            locale={locale}
            index={index}
          />
        ))}
      </div>
    </div>
  );
}
