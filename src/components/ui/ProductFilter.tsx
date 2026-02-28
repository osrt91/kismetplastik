"use client";

import { memo, useState } from "react";
import { Search, SlidersHorizontal, X, ChevronDown } from "lucide-react";
import { categories } from "@/data/products";
import { CategorySlug, SortOption } from "@/types/product";
import { useLocale } from "@/contexts/LocaleContext";

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
  layout?: "sidebar" | "top";
}

const ProductFilter = memo(function ProductFilter({
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
  layout = "sidebar",
}: ProductFilterProps) {
  const { dict } = useLocale();
  const [catOpen, setCatOpen] = useState(true);
  const [matOpen, setMatOpen] = useState(true);

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

  if (layout === "top") {
    return (
      <div className="mb-8 rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-sm shadow-neutral-900/5 dark:border-neutral-700 dark:bg-neutral-800 md:p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-50 dark:bg-primary-900/30">
              <SlidersHorizontal size={16} className="text-primary-500" />
            </div>
            <span className="text-sm font-bold text-primary-900 dark:text-primary-100">{dict.components.filters}</span>
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
                className="flex items-center gap-1 rounded-full bg-destructive/10 px-3 py-1.5 text-xs font-medium text-destructive transition-colors hover:bg-destructive/20"
              >
                <X size={12} />
                {dict.components.clearFilters}
              </button>
            )}
            <span className="inline-flex items-center rounded-full bg-primary-50 px-3 py-1.5 text-xs font-semibold text-primary-700 dark:bg-primary-900/30 dark:text-primary-300">
              {dict.components.productCount.replace("{count}", String(resultCount))}
            </span>
          </div>
        </div>
        <div className="mb-4 h-px bg-gradient-to-r from-transparent via-neutral-200 to-transparent dark:via-neutral-600" />
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder={dict.components.searchProducts}
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50/50 py-3 pl-11 pr-4 text-sm outline-none transition-all focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-100 dark:border-neutral-600 dark:bg-neutral-700 dark:focus:bg-neutral-700"
            />
          </div>
          <select
            value={sort}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="cursor-pointer rounded-xl border border-neutral-200 bg-neutral-50/50 px-4 py-3 text-sm outline-none focus:border-primary-500 dark:border-neutral-600 dark:bg-neutral-700"
          >
            <option value="name-asc">{dict.components.sortNameAsc}</option>
            <option value="name-desc">{dict.components.sortNameDesc}</option>
            <option value="volume-asc">{dict.components.sortVolumeAsc}</option>
            <option value="volume-desc">{dict.components.sortVolumeDesc}</option>
          </select>
        </div>
      </div>
    );
  }

  return (
    <aside className="w-full shrink-0 lg:w-72">
      <div className="sticky top-20 space-y-4">
        {/* Search */}
        <div className="rounded-2xl border border-neutral-200/80 bg-white p-4 shadow-sm dark:border-neutral-700 dark:bg-neutral-800">
          <div className="relative">
            <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder={dict.components.searchProducts}
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50/50 py-2.5 pl-9 pr-3 text-sm outline-none transition-all focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-100 dark:border-neutral-600 dark:bg-neutral-700 dark:focus:bg-neutral-700"
            />
          </div>
        </div>

        {/* Sort + Count */}
        <div className="rounded-2xl border border-neutral-200/80 bg-white p-4 shadow-sm dark:border-neutral-700 dark:bg-neutral-800">
          <div className="mb-3 flex items-center justify-between">
            <span className="inline-flex items-center rounded-full bg-primary-50 px-2.5 py-1 text-[11px] font-semibold text-primary-700 dark:bg-primary-900/30 dark:text-primary-300">
              {dict.components.productCount.replace("{count}", String(resultCount))}
            </span>
            {hasFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 text-[11px] font-medium text-destructive transition-colors hover:text-destructive/80"
              >
                <X size={11} />
                {dict.components.clearFilters}
              </button>
            )}
          </div>
          <select
            value={sort}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="w-full cursor-pointer rounded-xl border border-neutral-200 bg-neutral-50/50 px-3 py-2.5 text-sm outline-none focus:border-primary-500 dark:border-neutral-600 dark:bg-neutral-700"
          >
            <option value="name-asc">{dict.components.sortNameAsc}</option>
            <option value="name-desc">{dict.components.sortNameDesc}</option>
            <option value="volume-asc">{dict.components.sortVolumeAsc}</option>
            <option value="volume-desc">{dict.components.sortVolumeDesc}</option>
          </select>
        </div>

        {/* Categories */}
        <div className="rounded-2xl border border-neutral-200/80 bg-white shadow-sm dark:border-neutral-700 dark:bg-neutral-800">
          <button
            onClick={() => setCatOpen(!catOpen)}
            className="flex w-full items-center justify-between px-4 py-3"
          >
            <span className="text-[11px] font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
              {dict.components.category}
            </span>
            <ChevronDown size={14} className={`text-neutral-400 transition-transform ${catOpen ? "rotate-180" : ""}`} />
          </button>
          {catOpen && (
            <div className="space-y-0.5 px-3 pb-3">
              <button
                onClick={() => onCategoryChange("all")}
                className={`w-full rounded-lg px-3 py-2 text-left text-sm font-medium transition-all ${
                  selectedCategory === "all"
                    ? "bg-primary-500 text-white shadow-sm"
                    : "text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-700"
                }`}
              >
                {dict.components.allCategories}
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.slug}
                  onClick={() => onCategoryChange(cat.slug)}
                  className={`w-full rounded-lg px-3 py-2 text-left text-sm font-medium transition-all ${
                    selectedCategory === cat.slug
                      ? "bg-primary-500 text-white shadow-sm"
                      : "text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-700"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Materials */}
        {materials.length > 0 && (
          <div className="rounded-2xl border border-neutral-200/80 bg-white shadow-sm dark:border-neutral-700 dark:bg-neutral-800">
            <button
              onClick={() => setMatOpen(!matOpen)}
              className="flex w-full items-center justify-between px-4 py-3"
            >
              <span className="text-[11px] font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
                {dict.components.material}
              </span>
              <ChevronDown size={14} className={`text-neutral-400 transition-transform ${matOpen ? "rotate-180" : ""}`} />
            </button>
            {matOpen && (
              <div className="space-y-0.5 px-3 pb-3">
                <button
                  onClick={() => onMaterialChange("")}
                  className={`w-full rounded-lg px-3 py-2 text-left text-sm font-medium transition-all ${
                    selectedMaterial === ""
                      ? "bg-primary-500 text-white shadow-sm"
                      : "text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-700"
                  }`}
                >
                  {dict.components.allMaterials}
                </button>
                {materials.map((mat) => (
                  <button
                    key={mat}
                    onClick={() => onMaterialChange(mat)}
                    className={`w-full rounded-lg px-3 py-2 text-left text-sm font-medium transition-all ${
                      selectedMaterial === mat
                        ? "bg-primary-500 text-white shadow-sm"
                        : "text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-700"
                    }`}
                  >
                    {mat}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
});

export default ProductFilter;
