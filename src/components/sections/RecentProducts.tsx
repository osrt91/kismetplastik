"use client";

import Link from "@/components/ui/LocaleLink";
import { Clock, X, ArrowRight, Package, ChevronLeft, ChevronRight } from "lucide-react";
import { useRecentProducts } from "@/hooks/useRecentProducts";
import AnimateOnScroll from "@/components/ui/AnimateOnScroll";
import type { Product, Category, CategorySlug } from "@/types/product";
import { useLocale } from "@/contexts/LocaleContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useRef, useState, useCallback, useEffect } from "react";

const categoryBadgeStyles: Record<
  CategorySlug,
  { bg: string; text: string; darkBg: string; darkText: string }
> = {
  "pet-siseler": { bg: "#D6DFE8", text: "#152B55", darkBg: "#1e2d45", darkText: "#a3bfdb" },
  "plastik-siseler": { bg: "#FEF3C7", text: "#92610A", darkBg: "#3d2e0a", darkText: "#f5d98a" },
  "kapaklar": { bg: "#FEE2E2", text: "#991B1B", darkBg: "#3d1515", darkText: "#f5a3a3" },
  "tipalar": { bg: "#E0E8F5", text: "#0A1628", darkBg: "#1a2540", darkText: "#a3b8db" },
  "parmak-spreyler": { bg: "#E0E8F5", text: "#152B55", darkBg: "#1a2540", darkText: "#a3b8db" },
  "pompalar": { bg: "#E8EDF5", text: "#0F2040", darkBg: "#1a2540", darkText: "#a3b8db" },
  "tetikli-pusturtuculer": { bg: "#FEF3D1", text: "#92610A", darkBg: "#3d2e0a", darkText: "#f5d98a" },
  "huniler": { bg: "#EBF0F7", text: "#0A1628", darkBg: "#1a2540", darkText: "#a3b8db" },
};

export default function RecentProducts() {
  const { dict } = useLocale();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { recentIds, clearRecent } = useRecentProducts();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Fetch recent products from API by IDs
  const [recentProducts, setRecentProducts] = useState<Product[]>([]);
  const [categoriesMap, setCategoriesMap] = useState<Record<string, Category>>({});

  useEffect(() => {
    if (recentIds.length === 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- clear when no recent IDs
      setRecentProducts([]);
      return;
    }

    let cancelled = false;
    async function load() {
      try {
        const res = await fetch(`/api/products?ids=${encodeURIComponent(recentIds.join(","))}&limit=8`);
        const json = await res.json();
        if (!cancelled && json.success && json.data) {
          // Maintain the order from recentIds
          const productsById = new Map<string, Product>();
          for (const p of json.data.products ?? []) {
            productsById.set(p.id, p);
          }
          const ordered = recentIds
            .map((id) => productsById.get(id))
            .filter((p): p is Product => p != null);
          setRecentProducts(ordered);

          // Build categories map
          const catMap: Record<string, Category> = {};
          for (const cat of json.data.categories ?? []) {
            catMap[cat.slug] = cat;
          }
          setCategoriesMap(catMap);
        }
      } catch {
        // Silently fail
      }
    }
    load();
    return () => { cancelled = true; };
  }, [recentIds]);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }, []);

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [checkScroll, recentProducts.length]);

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = direction === "left" ? -260 : 260;
    el.scrollBy({ left: amount, behavior: "smooth" });
  };

  if (recentProducts.length === 0) {
    return null;
  }

  const volumeWeightInfo = (p: (typeof recentProducts)[0]) => {
    const parts: string[] = [];
    if (p.volume) parts.push(p.volume);
    if (p.weight) parts.push(p.weight);
    return parts.join(" \u2022 ");
  };

  return (
    <section className="relative border-t border-neutral-100 bg-gradient-to-b from-[#FAFAF7] via-white to-[#FAFAF7] py-12 lg:py-16 dark:border-neutral-800 dark:from-[#0A1628]/80 dark:via-[#0D1B2A] dark:to-[#0A1628]/80">
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        {/* Section header */}
        <AnimateOnScroll animation="fade-up">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 shadow-sm dark:bg-amber-500/10 dark:text-amber-400">
                <Clock size={20} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#0A1628] lg:text-2xl dark:text-neutral-100">
                  {dict.components.recentProducts}
                </h2>
                <div className="mt-1 h-0.5 w-12 rounded-full bg-[#F59E0B]" />
              </div>
            </div>
            <button
              onClick={clearRecent}
              className="group/clear flex items-center gap-1.5 rounded-lg border border-neutral-200 px-3 py-1.5 text-sm text-neutral-500 transition-all hover:border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-neutral-700 dark:text-neutral-400 dark:hover:border-red-800 dark:hover:bg-red-950/30 dark:hover:text-red-400"
              type="button"
              aria-label={dict.components.clearHistory}
            >
              <X size={14} className="transition-transform duration-200 group-hover/clear:rotate-90" />
              {dict.components.clear}
            </button>
          </div>
        </AnimateOnScroll>

        {/* Carousel container */}
        <div className="relative">
          {/* Navigation arrows - desktop only */}
          {canScrollLeft && (
            <button
              onClick={() => scroll("left")}
              className="absolute -left-3 top-1/2 z-10 hidden -translate-y-1/2 items-center justify-center rounded-full border border-white/60 bg-white/80 p-2 shadow-lg backdrop-blur-sm transition-all hover:scale-110 hover:border-[#F59E0B]/30 hover:bg-white hover:shadow-amber-200/30 lg:flex dark:border-neutral-700/60 dark:bg-neutral-800/80 dark:hover:border-amber-500/30 dark:hover:bg-neutral-800"
              type="button"
              aria-label="Scroll left"
            >
              <ChevronLeft size={20} className="text-[#0A1628] dark:text-neutral-200" />
            </button>
          )}
          {canScrollRight && (
            <button
              onClick={() => scroll("right")}
              className="absolute -right-3 top-1/2 z-10 hidden -translate-y-1/2 items-center justify-center rounded-full border border-white/60 bg-white/80 p-2 shadow-lg backdrop-blur-sm transition-all hover:scale-110 hover:border-[#F59E0B]/30 hover:bg-white hover:shadow-amber-200/30 lg:flex dark:border-neutral-700/60 dark:bg-neutral-800/80 dark:hover:border-amber-500/30 dark:hover:bg-neutral-800"
              type="button"
              aria-label="Scroll right"
            >
              <ChevronRight size={20} className="text-[#0A1628] dark:text-neutral-200" />
            </button>
          )}

          {/* Horizontal scroll row */}
          <div
            ref={scrollRef}
            className="-mx-4 overflow-x-auto px-4 pb-3 lg:-mx-6 lg:px-6 scrollbar-none"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            <div className="flex gap-5 snap-x snap-mandatory">
              {recentProducts.map((product, index) => {
                const category = categoriesMap[product.category];
                const badgeStyle = categoryBadgeStyles[product.category];

                return (
                  <AnimateOnScroll
                    key={product.id}
                    animation="fade-up"
                    delay={index * 80}
                    duration={500}
                  >
                    <Link
                      href={`/urunler/${product.category}/${product.slug}`}
                      className="group flex min-w-[220px] max-w-[220px] shrink-0 snap-start"
                    >
                      <div className="flex h-full w-full flex-col overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-[#F59E0B]/20 hover:shadow-xl hover:shadow-amber-900/8 dark:border-neutral-800 dark:bg-[#111827] dark:hover:border-amber-500/20 dark:hover:shadow-amber-500/5">
                        {/* Placeholder icon area */}
                        <div className="relative flex h-24 items-center justify-center bg-gradient-to-br from-neutral-50 to-neutral-100 transition-all duration-300 group-hover:from-amber-50/50 group-hover:to-amber-100/30 dark:from-neutral-800 dark:to-neutral-800/50 dark:group-hover:from-amber-950/20 dark:group-hover:to-amber-900/10">
                          <Package
                            size={36}
                            className="text-neutral-300 transition-all duration-300 group-hover:scale-110 group-hover:text-[#F59E0B]/60 dark:text-neutral-600 dark:group-hover:text-amber-500/50"
                          />
                          {/* Decorative corner accent */}
                          <div className="absolute right-0 top-0 h-8 w-8 rounded-bl-2xl bg-gradient-to-bl from-[#F59E0B]/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                        </div>

                        <div className="flex flex-1 flex-col p-3.5">
                          <span
                            className="mb-2 inline-block w-fit rounded-full px-2.5 py-0.5 text-[10px] font-semibold tracking-wide uppercase"
                            style={{
                              backgroundColor: isDark ? badgeStyle?.darkBg : badgeStyle?.bg,
                              color: isDark ? badgeStyle?.darkText : badgeStyle?.text,
                            }}
                          >
                            {category?.name ?? product.category}
                          </span>
                          <h3 className="mb-1 line-clamp-2 text-sm font-semibold text-[#0A1628] transition-colors group-hover:text-[#F59E0B] dark:text-neutral-100 dark:group-hover:text-amber-400">
                            {product.name}
                          </h3>
                          <p className="mb-2 line-clamp-2 text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
                            {product.shortDescription}
                          </p>
                          {volumeWeightInfo(product) && (
                            <p className="mb-2 text-[11px] font-medium text-neutral-400 dark:text-neutral-500">
                              {volumeWeightInfo(product)}
                            </p>
                          )}
                          <span className="mt-auto flex items-center gap-1 text-xs font-semibold text-[#F59E0B] transition-colors group-hover:text-amber-600 dark:text-amber-400 dark:group-hover:text-amber-300">
                            {dict.components.detail}
                            <ArrowRight
                              size={12}
                              className="transition-transform duration-300 group-hover:translate-x-1"
                            />
                          </span>
                        </div>
                      </div>
                    </Link>
                  </AnimateOnScroll>
                );
              })}
            </div>
          </div>

          {/* Scroll fade edges */}
          {canScrollLeft && (
            <div className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-[#FAFAF7] to-transparent dark:from-[#0A1628]/80" />
          )}
          {canScrollRight && (
            <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-[#FAFAF7] to-transparent dark:from-[#0A1628]/80" />
          )}
        </div>
      </div>
    </section>
  );
}
