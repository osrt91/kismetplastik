"use client";

import { useState, useMemo } from "react";
import { products, getAllMaterials } from "@/data/products";
import { CategorySlug, SortOption } from "@/types/product";
import ProductCard from "@/components/ui/ProductCard";
import ProductFilter from "@/components/ui/ProductFilter";
import AnimateOnScroll from "@/components/ui/AnimateOnScroll";
import { useLocale } from "@/contexts/LocaleContext";

export default function ProductsPage() {
  const { dict } = useLocale();
  const p = dict.products;

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<CategorySlug | "all">("all");
  const [material, setMaterial] = useState("");
  const [sort, setSort] = useState<SortOption>("name-asc");

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
    <section className="bg-neutral-50 py-12 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <AnimateOnScroll animation="fade-up">
          <div className="mb-10">
            <span className="mb-2 inline-block text-sm font-bold uppercase tracking-widest text-accent-500">
              {p.overline}
            </span>
            <h1 className="mb-3 text-3xl font-extrabold text-primary-900 sm:text-4xl">
              {p.title}
            </h1>
            <p className="max-w-2xl text-neutral-500">{p.subtitle}</p>
          </div>
        </AnimateOnScroll>

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
        />

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
          <div className="flex flex-col items-center justify-center rounded-2xl border border-neutral-200 bg-white py-20 text-center">
            <p className="mb-2 text-lg font-semibold text-neutral-700">{p.noResults}</p>
            <p className="text-sm text-neutral-400">{p.noResultsHint}</p>
          </div>
        )}
      </div>
    </section>
  );
}
