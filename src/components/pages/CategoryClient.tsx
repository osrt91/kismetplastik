"use client";

import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "@/components/ui/LocaleLink";
import { ChevronRight, SlidersHorizontal } from "lucide-react";
import {
  getProductsByCategory,
  getCategoryBySlug,
} from "@/data/products";
import { CategorySlug, SortOption } from "@/types/product";
import ProductCard from "@/components/ui/ProductCard";
import AnimateOnScroll from "@/components/ui/AnimateOnScroll";
import QuoteCartBar from "@/components/ui/QuoteCartBar";
import { useLocale } from "@/contexts/LocaleContext";

export default function CategoryClient() {
  const { dict } = useLocale();
  const p = dict.products;
  const comp = dict.components;

  const params = useParams();
  const categorySlug = params.category as string;
  const category = getCategoryBySlug(categorySlug);
  const allProducts = getProductsByCategory(categorySlug as CategorySlug);

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOption>("name-asc");
  const [neckSize, setNeckSize] = useState("");
  const [color, setColor] = useState("");

  const neckSizes = useMemo(() => {
    const sizes = new Set<string>();
    allProducts.forEach((p) => {
      if (p.neckDiameter) sizes.add(p.neckDiameter);
    });
    return [...sizes].sort();
  }, [allProducts]);

  const colors = useMemo(() => {
    const c = new Set<string>();
    allProducts.forEach((p) => p.colors.forEach((cl) => c.add(cl)));
    return [...c].sort((a, b) => a.localeCompare(b, "tr"));
  }, [allProducts]);

  const filtered = useMemo(() => {
    let result = [...allProducts];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (pr) =>
          pr.name.toLowerCase().includes(q) ||
          pr.shortDescription.toLowerCase().includes(q)
      );
    }

    if (neckSize) {
      result = result.filter((pr) => pr.neckDiameter === neckSize);
    }

    if (color) {
      result = result.filter((pr) => pr.colors.includes(color));
    }

    result.sort((a, b) => {
      switch (sort) {
        case "name-asc":
          return a.name.localeCompare(b.name, "tr");
        case "name-desc":
          return b.name.localeCompare(a.name, "tr");
        case "volume-asc":
          return (parseInt(a.volume || "0") || 0) - (parseInt(b.volume || "0") || 0);
        case "volume-desc":
          return (parseInt(b.volume || "0") || 0) - (parseInt(a.volume || "0") || 0);
        default:
          return 0;
      }
    });

    return result;
  }, [search, sort, neckSize, color, allProducts]);

  const hasFilters = search !== "" || neckSize !== "" || color !== "";

  if (!category) {
    return (
      <section className="flex min-h-[60vh] items-center justify-center bg-neutral-50">
        <div className="text-center">
          <h1 className="mb-2 text-2xl font-bold text-neutral-700">{p.categoryNotFound}</h1>
          <Link href="/urunler" className="text-primary-700 hover:underline">
            {p.backToAll}
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-neutral-50 py-12 dark:bg-neutral-900 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <nav className="mb-6 flex items-center gap-1.5 text-sm text-neutral-400">
          <Link href="/" className="hover:text-primary-700">{p.breadcrumbHome}</Link>
          <ChevronRight size={14} />
          <Link href="/urunler" className="hover:text-primary-700">{p.breadcrumbProducts}</Link>
          <ChevronRight size={14} />
          <span className="font-medium text-primary-900 dark:text-white">{category.name}</span>
        </nav>

        <AnimateOnScroll animation="fade-up">
          <div className="mb-10">
            <h1 className="mb-3 text-3xl font-extrabold text-primary-900 dark:text-white sm:text-4xl">
              {category.name}
            </h1>
            <p className="max-w-2xl text-neutral-500 dark:text-neutral-400">{category.description}</p>
          </div>
        </AnimateOnScroll>

        {/* Filters Bar */}
        <div className="mb-8 rounded-2xl border border-neutral-200/80 bg-white p-4 shadow-sm dark:border-neutral-700 dark:bg-neutral-800 sm:p-5">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <SlidersHorizontal size={16} className="text-primary-500" />
              <span className="text-sm font-bold text-primary-900 dark:text-white">{comp.filters}</span>
            </div>
            <div className="flex items-center gap-2">
              {hasFilters && (
                <button
                  onClick={() => { setSearch(""); setNeckSize(""); setColor(""); }}
                  className="text-xs font-medium text-destructive hover:text-destructive/80"
                >
                  {comp.clearFilters}
                </button>
              )}
              <span className="rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700 dark:bg-primary-900/30 dark:text-primary-300">
                {hasFilters
                  ? comp.productResultCount.replace("{count}", String(filtered.length))
                  : comp.productListedCount.replace("{count}", String(allProducts.length))}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <input
              type="text"
              placeholder={p.searchInCategory}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 rounded-xl border border-neutral-200 bg-neutral-50/50 px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary-500 focus:ring-2 focus:ring-primary-100 dark:border-neutral-600 dark:bg-neutral-700 sm:min-w-[200px]"
            />

            {neckSizes.length > 0 && (
              <select
                value={neckSize}
                onChange={(e) => setNeckSize(e.target.value)}
                className="rounded-xl border border-neutral-200 bg-neutral-50/50 px-4 py-2.5 text-sm outline-none focus:border-primary-500 dark:border-neutral-600 dark:bg-neutral-700"
              >
                <option value="">{comp.categoryFilterNeckSize}: {comp.categoryFilterAllSizes}</option>
                {neckSizes.map((ns) => (
                  <option key={ns} value={ns}>{ns}</option>
                ))}
              </select>
            )}

            {colors.length > 0 && (
              <select
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="rounded-xl border border-neutral-200 bg-neutral-50/50 px-4 py-2.5 text-sm outline-none focus:border-primary-500 dark:border-neutral-600 dark:bg-neutral-700"
              >
                <option value="">{comp.categoryFilterColor}: {comp.categoryFilterAllColors}</option>
                {colors.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            )}

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOption)}
              className="rounded-xl border border-neutral-200 bg-neutral-50/50 px-4 py-2.5 text-sm outline-none focus:border-primary-500 dark:border-neutral-600 dark:bg-neutral-700"
            >
              <option value="name-asc">{p.sortNameAsc}</option>
              <option value="name-desc">{p.sortNameDesc}</option>
              <option value="volume-asc">{p.sortVolumeAsc}</option>
              <option value="volume-desc">{p.sortVolumeDesc}</option>
            </select>
          </div>
        </div>

        {filtered.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((product, i) => (
              <AnimateOnScroll
                key={product.id}
                animation="fade-up"
                delay={Math.min(i * 60, 300)}
              >
                <ProductCard product={product} />
              </AnimateOnScroll>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-neutral-200 bg-white py-20 text-center dark:border-neutral-700 dark:bg-neutral-800">
            <p className="mb-2 text-lg font-semibold text-neutral-700 dark:text-neutral-200">{p.noResults}</p>
            <p className="text-sm text-neutral-400">{p.noResultsHint}</p>
          </div>
        )}
      </div>

      <QuoteCartBar />
    </section>
  );
}
