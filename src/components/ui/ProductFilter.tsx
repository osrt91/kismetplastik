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

  const clearFilters = () => {
    onSearchChange("");
    onCategoryChange("all");
    onMaterialChange("");
  };

  return (
    <div className="mb-8 space-y-4">
      {/* Search + Sort Row */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
          />
          <input
            type="text"
            placeholder="Ürün ara..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full rounded-xl border border-neutral-200 bg-white py-3 pl-11 pr-4 text-sm outline-none transition-colors focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
          />
        </div>
        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value as SortOption)}
          className="rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-primary-500"
        >
          <option value="name-asc">İsim (A-Z)</option>
          <option value="name-desc">İsim (Z-A)</option>
          <option value="volume-asc">Hacim (Küçükten büyüğe)</option>
          <option value="volume-desc">Hacim (Büyükten küçüğe)</option>
        </select>
      </div>

      {/* Filter Chips Row */}
      <div className="flex flex-wrap items-center gap-2">
        <SlidersHorizontal size={16} className="text-neutral-400" />

        {/* Category Filter */}
        <select
          value={selectedCategory}
          onChange={(e) =>
            onCategoryChange(e.target.value as CategorySlug | "all")
          }
          className="rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-primary-500"
        >
          <option value="all">Tüm Kategoriler</option>
          {categories.map((cat) => (
            <option key={cat.slug} value={cat.slug}>
              {cat.name}
            </option>
          ))}
        </select>

        {/* Material Filter */}
        <select
          value={selectedMaterial}
          onChange={(e) => onMaterialChange(e.target.value)}
          className="rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-primary-500"
        >
          <option value="">Tüm Malzemeler</option>
          {materials.map((mat) => (
            <option key={mat} value={mat}>
              {mat}
            </option>
          ))}
        </select>

        {hasFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-100"
          >
            <X size={14} />
            Temizle
          </button>
        )}

        <span className="ml-auto text-sm text-neutral-400">
          {resultCount} ürün bulundu
        </span>
      </div>
    </div>
  );
}
