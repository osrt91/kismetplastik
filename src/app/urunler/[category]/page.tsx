"use client";

import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import {
  getProductsByCategory,
  getCategoryBySlug,
} from "@/data/products";
import { CategorySlug, SortOption } from "@/types/product";
import ProductCard from "@/components/ui/ProductCard";
import AnimateOnScroll from "@/components/ui/AnimateOnScroll";
import { useLocale } from "@/contexts/LocaleContext";

export default function CategoryPage() {
  const { dict } = useLocale();
  const p = dict.products;

  const params = useParams();
  const categorySlug = params.category as string;
  const category = getCategoryBySlug(categorySlug);
  const allProducts = getProductsByCategory(categorySlug as CategorySlug);

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOption>("name-asc");

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
  }, [search, sort, allProducts]);

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
    <section className="bg-neutral-50 py-12 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <nav className="mb-6 flex items-center gap-1.5 text-sm text-neutral-400">
          <Link href="/" className="hover:text-primary-700">{p.breadcrumbHome}</Link>
          <ChevronRight size={14} />
          <Link href="/urunler" className="hover:text-primary-700">{p.breadcrumbProducts}</Link>
          <ChevronRight size={14} />
          <span className="font-medium text-primary-900">{category.name}</span>
        </nav>

        <AnimateOnScroll animation="fade-up">
          <div className="mb-10">
            <h1 className="mb-3 text-3xl font-extrabold text-primary-900 sm:text-4xl">
              {category.name}
            </h1>
            <p className="max-w-2xl text-neutral-500">{category.description}</p>
          </div>
        </AnimateOnScroll>

        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <input
            type="text"
            placeholder={p.searchInCategory}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
          />
          <div className="flex items-center gap-3">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOption)}
              className="rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none"
            >
              <option value="name-asc">{p.sortNameAsc}</option>
              <option value="name-desc">{p.sortNameDesc}</option>
              <option value="volume-asc">{p.sortVolumeAsc}</option>
              <option value="volume-desc">{p.sortVolumeDesc}</option>
            </select>
            <span className="text-sm text-neutral-400">
              {filtered.length} {p.resultCount}
            </span>
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
          <div className="flex flex-col items-center justify-center rounded-2xl border border-neutral-200 bg-white py-20 text-center">
            <p className="mb-2 text-lg font-semibold text-neutral-700">{p.noResults}</p>
            <p className="text-sm text-neutral-400">{p.noResultsHint}</p>
          </div>
        )}
      </div>
    </section>
  );
}
