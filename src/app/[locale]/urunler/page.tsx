"use client";

import { useState, useMemo } from "react";
import { products, getAllMaterials } from "@/data/products";
import { CategorySlug, SortOption } from "@/types/product";
import ProductCard from "@/components/ui/ProductCard";
import ProductFilter from "@/components/ui/ProductFilter";
import AnimateOnScroll from "@/components/ui/AnimateOnScroll";
import { useLocale } from "@/contexts/LocaleContext";
import { SlidersHorizontal } from "lucide-react";

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
    <section className="bg-neutral-50 py-12 dark:bg-neutral-900 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <AnimateOnScroll animation="fade-up">
          <div className="mb-10">
            <span className="mb-2 inline-block text-sm font-bold uppercase tracking-widest text-accent-500">
              {p.overline}
            </span>
            <h1 className="mb-3 text-3xl font-extrabold text-primary-900 dark:text-white sm:text-4xl">
              {p.title}
            </h1>
            <p className="max-w-2xl text-neutral-500 dark:text-neutral-400">{p.subtitle}</p>
          </div>
        </AnimateOnScroll>

        {/* Mobile filter toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="mb-4 flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-medium text-neutral-700 shadow-sm transition-colors hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 lg:hidden"
        >
          <SlidersHorizontal size={16} />
          {dict.components.filters}
          {(search || category !== "all" || material) && (
            <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary-500 text-[10px] font-bold text-white">
              {[search !== "", category !== "all", material !== ""].filter(Boolean).length}
            </span>
          )}
        </button>

        <div className="flex gap-8">
          {/* Sidebar — desktop always visible, mobile toggleable */}
          <div className={`${sidebarOpen ? "block" : "hidden"} lg:block`}>
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
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
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
        </div>
      </div>
    </section>
  );
}
