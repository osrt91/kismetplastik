"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";
import { categories } from "@/data/products";
import { CategorySlug, SortOption } from "@/types/product";

interface ProductFilterProps {
  search: string;
  onSearchChange: (value: string) => void;
  selectedCategory: CategorySlug | "all";
  onCategoryChange: (value: CategorySlug | "all") => void;
  selectedMaterial: string;
  onMaterialChange: (value: string) => void;
  sort: SortOption;
  onSortChange: (value: SortOption) => void;
  materials: string[];
  resultCount: number;
}

export default function ProductFilter({
  search,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedMaterial,
  onMaterialChange,
  sort,
  onSortChange,
  materials,
  resultCount,
}: ProductFilterProps) {
  const hasFilters =
    search !== "" || selectedCategory !== "all" || selectedMaterial !== "";

  const activeFilterCount = [
    search !== "",
    selectedCategory !== "all",
    selectedMaterial !== "",
  ].filter(Boolean).length;

  const clearFilters = () => {
    onSearchChange("");
    onCategoryChange("all");
    onMaterialChange("");
  };

  return (
    <div className="mb-8 rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-sm shadow-neutral-900/5 md:p-6">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-50">
            <SlidersHorizontal size={16} className="text-primary-500" />
          </div>
          <span className="text-sm font-bold text-primary-900">Filtreler</span>
          {activeFilterCount > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary-500 px-1.5 text-[10px] font-bold text-white">
              {activeFilterCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2.5">
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 rounded-full bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-100"
            >
              <X size={12} />
              Temizle
            </button>
          )}
          <span className="inline-flex items-center rounded-full bg-primary-50 px-3 py-1.5 text-xs font-semibold text-primary-700">
            {resultCount} ürün
          </span>
        </div>
      </div>

      <div className="mb-4 h-px bg-gradient-to-r from-transparent via-neutral-200 to-transparent" />

      {/* Search + Sort */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1 transition-all duration-300 focus-within:scale-[1.01]">
          <Search
            size={18}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
          />
          <input
            type="text"
            placeholder="Ürün ara..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full rounded-xl border border-neutral-200 bg-neutral-50/50 py-3 pl-11 pr-4 text-sm outline-none transition-all duration-300 focus:border-primary-500 focus:bg-white focus:shadow-md focus:shadow-primary-500/5 focus:ring-2 focus:ring-primary-100"
          />
        </div>
        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value as SortOption)}
          className="cursor-pointer rounded-xl border border-neutral-200 bg-neutral-50/50 px-4 py-3 text-sm outline-none transition-all focus:border-primary-500 focus:bg-white"
        >
          <option value="name-asc">İsim (A-Z)</option>
          <option value="name-desc">İsim (Z-A)</option>
          <option value="volume-asc">Hacim (Küçükten büyüğe)</option>
          <option value="volume-desc">Hacim (Büyükten küçüğe)</option>
        </select>
      </div>

      <div className="mb-4 h-px bg-gradient-to-r from-transparent via-neutral-200 to-transparent" />

      {/* Category Pills */}
      <div className="mb-4">
        <span className="mb-2.5 block text-[11px] font-semibold uppercase tracking-widest text-neutral-400">
          Kategori
        </span>
        <div className="flex gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => onCategoryChange("all")}
            className={`shrink-0 cursor-pointer rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
              selectedCategory === "all"
                ? "bg-primary-500 text-white shadow-md shadow-primary-500/25"
                : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
            }`}
          >
            Tümü
          </button>
          {categories.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => onCategoryChange(cat.slug)}
              className={`shrink-0 cursor-pointer rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
                selectedCategory === cat.slug
                  ? "bg-primary-500 text-white shadow-md shadow-primary-500/25"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Material Pills */}
      {materials.length > 0 && (
        <>
          <div className="mb-4 h-px bg-gradient-to-r from-transparent via-neutral-200 to-transparent" />
          <div>
            <span className="mb-2.5 block text-[11px] font-semibold uppercase tracking-widest text-neutral-400">
              Malzeme
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => onMaterialChange("")}
                className={`cursor-pointer rounded-full px-3.5 py-1.5 text-xs font-medium transition-all duration-200 ${
                  selectedMaterial === ""
                    ? "bg-primary-500 text-white shadow-md shadow-primary-500/25"
                    : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                }`}
              >
                Tümü
              </button>
              {materials.map((mat) => (
                <button
                  key={mat}
                  onClick={() => onMaterialChange(mat)}
                  className={`cursor-pointer rounded-full px-3.5 py-1.5 text-xs font-medium transition-all duration-200 ${
                    selectedMaterial === mat
                      ? "bg-primary-500 text-white shadow-md shadow-primary-500/25"
                      : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                  }`}
                >
                  {mat}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
