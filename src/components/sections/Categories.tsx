"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Link from "@/components/ui/LocaleLink";
import { ArrowRight, ChevronLeft, ChevronRight, Package } from "lucide-react";
import { categoryIconList } from "@/components/ui/CategoryIcons";
import AnimateOnScroll from "@/components/ui/AnimateOnScroll";
import { useLocale } from "@/contexts/LocaleContext";

const categorySlugs = [
  "pet-siseler",
  "plastik-siseler",
  "kapaklar",
  "tipalar",
  "parmak-spreyler",
  "pompalar",
  "tetikli-pusturtuculer",
  "huniler",
];
const icons = categoryIconList;

export default function Categories() {
  const { dict } = useLocale();
  const h = dict.home;
  const cats = (
    dict.homeCategories as { name: string; description: string; count: string }[]
  ).map((c, i) => ({
    ...c,
    href: `/urunler/${categorySlugs[i]}`,
    icon: icons[i],
  }));

  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [checkScroll]);

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = 312; // min-w-[300px] + gap
    el.scrollBy({
      left: direction === "left" ? -cardWidth : cardWidth,
      behavior: "smooth",
    });
  };

  return (
    <section className="relative bg-[#FAFAF7] py-24 dark:bg-[#0A1628] lg:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        {/* Section Header */}
        <AnimateOnScroll animation="fade-up">
          <div className="relative mb-12 text-center lg:mb-16">
            <span className="mb-3 inline-block text-sm font-bold uppercase tracking-widest text-accent-500">
              {h.categoriesOverline}
            </span>
            <h2 className="font-display mb-4 text-3xl font-extrabold text-primary-900 dark:text-white sm:text-4xl lg:text-5xl">
              {h.categoriesTitle}
            </h2>
            <div className="mx-auto mb-4 flex items-center justify-center gap-2">
              <span className="h-[3px] w-8 rounded-full bg-[#0A1628]/20 dark:bg-white/20" />
              <span className="h-[3px] w-16 rounded-full bg-[#F59E0B]" />
              <span className="h-[3px] w-8 rounded-full bg-[#0A1628]/20 dark:bg-white/20" />
            </div>
            <p className="font-body mx-auto max-w-2xl text-muted-foreground">
              {h.categoriesSubtitle}
            </p>
          </div>
        </AnimateOnScroll>

        {/* Carousel Container */}
        <AnimateOnScroll animation="fade-up" delay={100}>
          <div className="relative">
            {/* Left Arrow - desktop only */}
            {canScrollLeft && (
              <button
                onClick={() => scroll("left")}
                className="absolute -left-4 top-1/2 z-10 hidden -translate-y-1/2 items-center justify-center rounded-full border border-border bg-white/90 p-2.5 shadow-lg backdrop-blur-sm transition-all hover:border-[#F59E0B]/40 hover:shadow-xl dark:border-white/10 dark:bg-[#0A1628]/90 dark:hover:border-[#F59E0B]/30 lg:flex"
                aria-label="Scroll left"
              >
                <ChevronLeft size={20} className="text-primary-900 dark:text-white" />
              </button>
            )}

            {/* Right Arrow - desktop only */}
            {canScrollRight && (
              <button
                onClick={() => scroll("right")}
                className="absolute -right-4 top-1/2 z-10 hidden -translate-y-1/2 items-center justify-center rounded-full border border-border bg-white/90 p-2.5 shadow-lg backdrop-blur-sm transition-all hover:border-[#F59E0B]/40 hover:shadow-xl dark:border-white/10 dark:bg-[#0A1628]/90 dark:hover:border-[#F59E0B]/30 lg:flex"
                aria-label="Scroll right"
              >
                <ChevronRight size={20} className="text-primary-900 dark:text-white" />
              </button>
            )}

            {/* Scrollable Row */}
            <div
              ref={scrollRef}
              className="scrollbar-hide flex gap-5 overflow-x-auto scroll-smooth pb-4"
              style={{ scrollSnapType: "x mandatory" }}
            >
              {cats.map((cat, i) => (
                <Link
                  key={categorySlugs[i]}
                  href={cat.href}
                  className="group relative block min-w-[280px] flex-shrink-0 overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:border-[#F59E0B]/40 hover:shadow-xl dark:border-[#1e293b] dark:bg-[#0f1d32] dark:hover:border-[#F59E0B]/30 sm:min-w-[300px]"
                  style={{ scrollSnapAlign: "start" }}
                >
                  {/* Image Placeholder */}
                  <div className="relative flex aspect-[4/3] items-center justify-center bg-neutral-100 dark:bg-[#1a2744]">
                    <Package
                      size={48}
                      className="text-neutral-300 transition-colors duration-300 group-hover:text-[#F59E0B]/50 dark:text-neutral-600"
                    />
                    {/* Step number */}
                    <span className="font-mono absolute right-3 top-2 text-xs font-medium tracking-wider text-neutral-300 dark:text-neutral-600">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>

                  {/* Card Content */}
                  <div className="p-5">
                    <div className="mb-3 flex items-center justify-between">
                      <h3 className="font-display text-lg font-bold text-primary-900 dark:text-white">
                        {cat.name}
                      </h3>
                      <span className="font-mono rounded-full bg-[#F59E0B]/10 px-2.5 py-1 text-xs font-bold text-[#F59E0B]">
                        {cat.count}
                      </span>
                    </div>
                    <p className="font-body mb-4 text-sm leading-relaxed text-muted-foreground line-clamp-2">
                      {cat.description}
                    </p>
                    <div className="font-body flex items-center gap-1.5 text-sm font-semibold text-[#0A1628]/70 transition-all duration-300 group-hover:gap-2.5 group-hover:text-[#F59E0B] dark:text-neutral-400 dark:group-hover:text-[#F59E0B]">
                      {h.viewProducts}
                      <ArrowRight
                        size={14}
                        className="transition-transform duration-300 group-hover:translate-x-1"
                      />
                    </div>
                  </div>

                  {/* Bottom border on hover */}
                  <div className="absolute inset-x-0 bottom-0 h-[3px] origin-left scale-x-0 bg-gradient-to-r from-[#F59E0B] via-[#F59E0B]/80 to-[#0A1628] transition-transform duration-500 ease-out group-hover:scale-x-100" />
                </Link>
              ))}
            </div>
          </div>
        </AnimateOnScroll>
      </div>

      {/* Scrollbar hide utility */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
}
