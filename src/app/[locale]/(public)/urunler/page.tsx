"use client";

import { useState, useMemo } from "react";
import { products, getAllMaterials } from "@/data/products";
import { CategorySlug, SortOption } from "@/types/product";
import ProductCard from "@/components/ui/ProductCard";
import ProductFilter from "@/components/ui/ProductFilter";
import AnimateOnScroll from "@/components/ui/AnimateOnScroll";
import Link from "@/components/ui/LocaleLink";
import { useLocale } from "@/contexts/LocaleContext";
import { SlidersHorizontal, X, PackageSearch, ChevronRight, Home } from "lucide-react";

export default function ProductsPage() {
  const { dict } = useLocale();
  const p = dict.products;

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<CategorySlug | "all">("all");
  const [material, setMaterial] = useState("");
  const [sort, setSort] = useState<SortOption>("name-asc");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const materials = useMemo(() => getAllMaterials(), []);

  const filtered = useMemo(() => {
    let result = [...products];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (pr) =>
          pr.name.toLowerCase().includes(q) ||
          pr.shortDescription.toLowerCase().includes(q)
      );
    }

    if (category !== "all") {
      result = result.filter((pr) => pr.category === category);
    }

    if (material) {
      result = result.filter((pr) => pr.material === material);
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
  }, [search, category, material, sort]);

  return (
    <section className="min-h-screen bg-[#FAFAF7] dark:bg-[#0A1628]">
      {/* Hero Banner */}
      <div className="relative overflow-hidden bg-[#0A1628] dark:bg-[#060d1a]">
        {/* Background pattern */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(245,158,11,0.08),transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(245,158,11,0.05),transparent_50%)]" />
          <svg className="absolute inset-0 h-full w-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid-products" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#F59E0B" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-products)" />
          </svg>
        </div>

        <div className="relative mx-auto max-w-7xl px-4 pb-10 pt-8 lg:px-6 lg:pb-14 lg:pt-12">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-1.5 text-sm">
              <li>
                <Link
                  href="/"
                  className="flex items-center gap-1 text-neutral-400 transition-colors hover:text-[#F59E0B]"
                >
                  <Home size={14} />
                  <span>{p.breadcrumbHome}</span>
                </Link>
              </li>
              <li>
                <ChevronRight size={12} className="text-neutral-600" />
              </li>
              <li>
                <span className="font-medium text-[#F59E0B]">{p.breadcrumbProducts}</span>
              </li>
            </ol>
          </nav>

          <AnimateOnScroll animation="fade-up">
            <div className="max-w-2xl">
              <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#F59E0B]/20 bg-[#F59E0B]/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-[#F59E0B]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#F59E0B] animate-pulse" />
                {p.overline}
              </span>
              <h1 className="mb-3 text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl">
                {p.title}
              </h1>
              <p className="text-base leading-relaxed text-neutral-400 lg:text-lg">{p.subtitle}</p>
            </div>
          </AnimateOnScroll>
        </div>

        {/* Bottom edge */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#F59E0B]/30 to-transparent" />
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-6 lg:py-12">
        {/* Mobile filter toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="mb-6 flex w-full items-center justify-center gap-2 rounded-xl border border-[#0A1628]/10 bg-white px-4 py-3 text-sm font-semibold text-[#0A1628] shadow-sm transition-all hover:border-[#F59E0B]/40 hover:shadow-md active:scale-[0.98] dark:border-[#F59E0B]/20 dark:bg-[#0A1628] dark:text-neutral-200 dark:hover:border-[#F59E0B]/40 lg:hidden"
        >
          {sidebarOpen ? (
            <>
              <X size={16} className="text-[#F59E0B]" />
              {dict.components.clearFilters}
            </>
          ) : (
            <>
              <SlidersHorizontal size={16} className="text-[#F59E0B]" />
              {dict.components.filters}
              {(search || category !== "all" || material) && (
                <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#F59E0B] text-[10px] font-bold text-[#0A1628]">
                  {[search !== "", category !== "all", material !== ""].filter(Boolean).length}
                </span>
              )}
            </>
          )}
        </button>

        <div className="flex gap-8">
          {/* Sidebar — desktop always visible, mobile toggleable */}
          <div
            className={`${
              sidebarOpen
                ? "fixed inset-0 z-50 block overflow-y-auto bg-[#FAFAF7]/95 p-4 backdrop-blur-sm dark:bg-[#0A1628]/95 lg:static lg:z-auto lg:overflow-visible lg:bg-transparent lg:p-0 lg:backdrop-blur-none"
                : "hidden"
            } lg:block`}
          >
            {/* Mobile close button inside overlay */}
            <div className="mb-4 flex justify-end lg:hidden">
              <button
                onClick={() => setSidebarOpen(false)}
                className="rounded-full bg-white p-2 shadow-md dark:bg-neutral-800"
              >
                <X size={20} className="text-neutral-600 dark:text-neutral-300" />
              </button>
            </div>
            <ProductFilter
              search={search}
              onSearchChange={setSearch}
              selectedCategory={category}
              onCategoryChange={setCategory}
              selectedMaterial={material}
              onMaterialChange={setMaterial}
              sort={sort}
              onSortChange={setSort}
              materials={materials}
              resultCount={filtered.length}
              layout="sidebar"
            />
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            {filtered.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
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
              <div className="flex flex-col items-center justify-center rounded-2xl border border-[#0A1628]/5 bg-white py-24 text-center shadow-sm dark:border-[#F59E0B]/10 dark:bg-[#0A1628]/50">
                <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F59E0B]/10">
                  <PackageSearch size={32} className="text-[#F59E0B]" />
                </div>
                <p className="mb-2 text-lg font-bold text-[#0A1628] dark:text-white">{p.noResults}</p>
                <p className="mb-6 max-w-sm text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">{p.noResultsHint}</p>
                <button
                  onClick={() => {
                    setSearch("");
                    setCategory("all");
                    setMaterial("");
                  }}
                  className="inline-flex items-center gap-2 rounded-lg border border-[#F59E0B]/30 bg-[#F59E0B]/5 px-5 py-2.5 text-sm font-semibold text-[#F59E0B] transition-all hover:bg-[#F59E0B]/10 hover:border-[#F59E0B]/50"
                >
                  <X size={14} />
                  {dict.components.clearFilters}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
