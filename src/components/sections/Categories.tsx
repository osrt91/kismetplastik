"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Link from "@/components/ui/LocaleLink";
import { ArrowRight, ChevronLeft, ChevronRight, Package } from "lucide-react";
import { categoryIconList } from "@/components/ui/CategoryIcons";
import AnimateOnScroll from "@/components/ui/AnimateOnScroll";
import { useLocale } from "@/contexts/LocaleContext";
import type { DbContentSection } from "@/types/database";
import { getLocalizedFieldSync } from "@/lib/content";

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

interface CategoriesProps {
  content?: Record<string, DbContentSection>;
}

export default function Categories({ content }: CategoriesProps) {
  const { dict, locale } = useLocale();
  const h = dict.home;

  const catSection = content?.home_categories;
  const catTitle = catSection ? getLocalizedFieldSync(catSection, "title", locale) : "";
  const catSubtitle = catSection ? getLocalizedFieldSync(catSection, "subtitle", locale) : "";
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
    const cardWidth = 320;
    el.scrollBy({
      left: direction === "left" ? -cardWidth : cardWidth,
      behavior: "smooth",
    });
  };

  return (
    <section className="relative bg-[#FAFAF7] py-20 dark:bg-[#0A1628] lg:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        {/* Section Header - left-aligned for asymmetry */}
        <AnimateOnScroll animation="fade-up">
          <div className="relative mb-10 max-w-xl lg:mb-14">
            <span className="mb-3 inline-block font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#F59E0B]">
              {h.categoriesOverline}
            </span>
            <h2 className="font-display mb-4 text-2xl font-bold text-[#0A1628] dark:text-white sm:text-3xl lg:text-4xl">
              {catTitle || h.categoriesTitle}
            </h2>
            <div className="mb-4 flex items-center gap-2">
              <span className="h-[3px] w-12 rounded-full bg-[#F59E0B]" />
              <span className="h-[3px] w-6 rounded-full bg-[#0A1628]/15 dark:bg-white/15" />
            </div>
            <p className="font-body text-base leading-relaxed text-[#0A1628]/60 dark:text-white/60">
              {catSubtitle || h.categoriesSubtitle}
            </p>
          </div>
        </AnimateOnScroll>

        {/* Carousel */}
        <AnimateOnScroll animation="fade-up" delay={100}>
          <div className="relative">
            {/* Desktop scroll arrows */}
            <button
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              className={`absolute -left-5 top-1/2 z-10 hidden -translate-y-1/2 items-center justify-center rounded-full border bg-white/95 p-3 shadow-lg backdrop-blur-sm transition-all duration-200 lg:flex ${
                canScrollLeft
                  ? "border-[#0A1628]/10 text-[#0A1628] hover:border-[#F59E0B]/50 hover:text-[#F59E0B] hover:shadow-xl dark:border-white/10 dark:bg-[#0A1628]/95 dark:text-white dark:hover:border-[#F59E0B]/40 dark:hover:text-[#F59E0B]"
                  : "pointer-events-none border-transparent opacity-0"
              }`}
              aria-label="Scroll left"
            >
              <ChevronLeft size={22} />
            </button>

            <button
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              className={`absolute -right-5 top-1/2 z-10 hidden -translate-y-1/2 items-center justify-center rounded-full border bg-white/95 p-3 shadow-lg backdrop-blur-sm transition-all duration-200 lg:flex ${
                canScrollRight
                  ? "border-[#0A1628]/10 text-[#0A1628] hover:border-[#F59E0B]/50 hover:text-[#F59E0B] hover:shadow-xl dark:border-white/10 dark:bg-[#0A1628]/95 dark:text-white dark:hover:border-[#F59E0B]/40 dark:hover:text-[#F59E0B]"
                  : "pointer-events-none border-transparent opacity-0"
              }`}
              aria-label="Scroll right"
            >
              <ChevronRight size={22} />
            </button>

            {/* Scrollable container */}
            <div
              ref={scrollRef}
              className="category-carousel flex gap-5 overflow-x-auto scroll-smooth pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              style={{ scrollSnapType: "x mandatory" }}
            >
              {cats.map((cat, i) => (
                <Link
                  key={categorySlugs[i]}
                  href={cat.href}
                  className="card-shine group relative block min-w-[280px] flex-shrink-0 overflow-hidden rounded-2xl border border-[#0A1628]/8 bg-white shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_20px_60px_-15px_rgba(10,22,40,0.15)] dark:border-white/8 dark:bg-[#0f1d32] dark:hover:border-[#F59E0B]/20 dark:hover:shadow-[0_20px_60px_-15px_rgba(245,158,11,0.1)] sm:min-w-[300px]"
                  style={{ scrollSnapAlign: "start" }}
                >
                  {/* Image area - large with placeholder */}
                  <div className="relative flex aspect-[5/4] items-center justify-center overflow-hidden bg-gradient-to-br from-amber-50/50 to-neutral-50 dark:from-[#1a2744]/80 dark:to-[#0f1d32]">
                    <Package
                      size={56}
                      strokeWidth={1.2}
                      className="text-[#0A1628]/10 transition-all duration-500 group-hover:scale-110 group-hover:text-[#F59E0B]/30 dark:text-white/10 dark:group-hover:text-[#F59E0B]/25"
                    />

                    {/* Category number */}
                    <span className="absolute right-3.5 top-3 font-mono text-[11px] font-semibold tracking-wider text-[#0A1628]/15 dark:text-white/12">
                      {String(i + 1).padStart(2, "0")}
                    </span>

                    {/* Product count badge overlaid */}
                    <span className="absolute bottom-3 left-3.5 rounded-full bg-[#F59E0B]/12 px-2.5 py-1 font-mono text-[11px] font-bold text-[#F59E0B] backdrop-blur-sm">
                      {cat.count}
                    </span>
                  </div>

                  {/* Card content */}
                  <div className="p-5">
                    <h3 className="font-display mb-2 text-lg font-bold leading-tight text-[#0A1628] dark:text-white">
                      {cat.name}
                    </h3>
                    <p className="font-body mb-4 line-clamp-2 text-sm leading-relaxed text-[#0A1628]/55 dark:text-white/50">
                      {cat.description}
                    </p>
                    <div className="font-body flex items-center gap-1.5 text-sm font-semibold text-[#0A1628]/50 transition-all duration-300 group-hover:gap-2.5 group-hover:text-[#F59E0B] dark:text-white/40 dark:group-hover:text-[#F59E0B]">
                      {h.viewProducts}
                      <ArrowRight
                        size={14}
                        className="transition-transform duration-300 group-hover:translate-x-1"
                      />
                    </div>
                  </div>

                  {/* Hover accent line */}
                  <div className="absolute inset-x-0 bottom-0 h-[4px] origin-left scale-x-0 bg-[#F59E0B] transition-transform duration-500 ease-out group-hover:scale-x-100" />
                </Link>
              ))}
            </div>

            {/* Scroll progress dots - mobile hint */}
            <div className="mt-4 flex items-center justify-center gap-1.5 lg:hidden">
              {cats.map((_, i) => (
                <span
                  key={i}
                  className="h-1.5 w-1.5 rounded-full bg-[#0A1628]/15 dark:bg-white/15"
                />
              ))}
            </div>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
