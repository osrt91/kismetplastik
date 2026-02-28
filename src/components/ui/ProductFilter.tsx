"use client";

import { memo, useState, useMemo } from "react";
import { Search, SlidersHorizontal, X, ChevronDown, Check } from "lucide-react";
import { categories, products } from "@/data/products";
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
  selectedColors: string[];
  onColorsChange: (colors: string[]) => void;
  selectedVolumes: string[];
  onVolumesChange: (volumes: string[]) => void;
  selectedNeckDiameters: string[];
  onNeckDiametersChange: (diameters: string[]) => void;
  selectedWeights: string[];
  onWeightsChange: (weights: string[]) => void;
}

function CheckboxFilterSection({
  title,
  isOpen,
  onToggle,
  options,
  selectedValues,
  onToggleValue,
}: {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  options: [string, number][];
  selectedValues: string[];
  onToggleValue: (value: string) => void;
}) {
  if (options.length === 0) return null;

  return (
    <div className="rounded-2xl border border-neutral-200/80 bg-white shadow-sm dark:border-neutral-700 dark:bg-neutral-800">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between px-4 py-3"
      >
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
            {title}
          </span>
          {selectedValues.length > 0 && (
            <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-primary-500 px-1 text-[9px] font-bold text-white">
              {selectedValues.length}
            </span>
          )}
        </div>
        <ChevronDown
          size={14}
          className={`text-neutral-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      {isOpen && (
        <div className="max-h-52 space-y-0.5 overflow-y-auto px-3 pb-3">
          {options.map(([value, count]) => (
            <button
              key={value}
              type="button"
              onClick={() => onToggleValue(value)}
              className="flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left text-sm transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-700"
            >
              <div
                className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors ${
                  selectedValues.includes(value)
                    ? "border-primary-500 bg-primary-500"
                    : "border-neutral-300 dark:border-neutral-600"
                }`}
              >
                {selectedValues.includes(value) && (
                  <Check size={10} className="text-white" strokeWidth={3} />
                )}
              </div>
              <span className="flex-1 truncate text-neutral-600 dark:text-neutral-300">
                {value}
              </span>
              <span className="text-[10px] tabular-nums text-neutral-400">
                ({count})
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
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
  selectedColors,
  onColorsChange,
  selectedVolumes,
  onVolumesChange,
  selectedNeckDiameters,
  onNeckDiametersChange,
  selectedWeights,
  onWeightsChange,
}: ProductFilterProps) {
  const { dict } = useLocale();
  const [catOpen, setCatOpen] = useState(true);
  const [matOpen, setMatOpen] = useState(true);
  const [colorOpen, setColorOpen] = useState(false);
  const [volumeOpen, setVolumeOpen] = useState(false);
  const [neckOpen, setNeckOpen] = useState(false);
  const [weightOpen, setWeightOpen] = useState(false);

  const colorOptions = useMemo(() => {
    const counts = new Map<string, number>();
    products.forEach((p) =>
      p.colors.forEach((c) => counts.set(c, (counts.get(c) || 0) + 1))
    );
    return [...counts.entries()].sort(([a], [b]) => a.localeCompare(b, "tr"));
  }, []);

  const volumeOptions = useMemo(() => {
    const counts = new Map<string, number>();
    products.forEach((p) => {
      if (p.volume) counts.set(p.volume, (counts.get(p.volume) || 0) + 1);
    });
    return [...counts.entries()].sort(
      ([a], [b]) => (parseInt(a) || 0) - (parseInt(b) || 0)
    );
  }, []);

  const neckDiameterOptions = useMemo(() => {
    const counts = new Map<string, number>();
    products.forEach((p) => {
      if (p.neckDiameter)
        counts.set(p.neckDiameter, (counts.get(p.neckDiameter) || 0) + 1);
    });
    return [...counts.entries()].sort(
      ([a], [b]) => (parseInt(a) || 0) - (parseInt(b) || 0)
    );
  }, []);

  const weightOptions = useMemo(() => {
    const counts = new Map<string, number>();
    products.forEach((p) => {
      if (p.weight) counts.set(p.weight, (counts.get(p.weight) || 0) + 1);
    });
    return [...counts.entries()].sort(
      ([a], [b]) => (parseFloat(a) || 0) - (parseFloat(b) || 0)
    );
  }, []);

  const toggleArrayValue = (
    arr: string[],
    value: string,
    setter: (v: string[]) => void
  ) => {
    setter(
      arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value]
    );
  };

  const hasFilters =
    search !== "" ||
    selectedCategory !== "all" ||
    selectedMaterial !== "" ||
    selectedColors.length > 0 ||
    selectedVolumes.length > 0 ||
    selectedNeckDiameters.length > 0 ||
    selectedWeights.length > 0;

  const activeFilterCount = [
    search !== "",
    selectedCategory !== "all",
    selectedMaterial !== "",
    selectedColors.length > 0,
    selectedVolumes.length > 0,
    selectedNeckDiameters.length > 0,
    selectedWeights.length > 0,
  ].filter(Boolean).length;

  const clearFilters = () => {
    onSearchChange("");
    onCategoryChange("all");
    onMaterialChange("");
    onColorsChange([]);
    onVolumesChange([]);
    onNeckDiametersChange([]);
    onWeightsChange([]);
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
                {dict.components.clearAllFilters}
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

        <CheckboxFilterSection
          title={dict.components.color}
          isOpen={colorOpen}
          onToggle={() => setColorOpen(!colorOpen)}
          options={colorOptions}
          selectedValues={selectedColors}
          onToggleValue={(v) => toggleArrayValue(selectedColors, v, onColorsChange)}
        />

        <CheckboxFilterSection
          title={dict.components.volume}
          isOpen={volumeOpen}
          onToggle={() => setVolumeOpen(!volumeOpen)}
          options={volumeOptions}
          selectedValues={selectedVolumes}
          onToggleValue={(v) => toggleArrayValue(selectedVolumes, v, onVolumesChange)}
        />

        <CheckboxFilterSection
          title={dict.components.neckDiameter}
          isOpen={neckOpen}
          onToggle={() => setNeckOpen(!neckOpen)}
          options={neckDiameterOptions}
          selectedValues={selectedNeckDiameters}
          onToggleValue={(v) => toggleArrayValue(selectedNeckDiameters, v, onNeckDiametersChange)}
        />

        <CheckboxFilterSection
          title={dict.components.weight}
          isOpen={weightOpen}
          onToggle={() => setWeightOpen(!weightOpen)}
          options={weightOptions}
          selectedValues={selectedWeights}
          onToggleValue={(v) => toggleArrayValue(selectedWeights, v, onWeightsChange)}
        />

        {hasFilters && (
          <button
            onClick={clearFilters}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10 dark:border-destructive/30 dark:bg-destructive/10 dark:hover:bg-destructive/20"
          >
            <X size={14} />
            {dict.components.clearAllFilters}
          </button>
        )}
      </div>
    </aside>
  );
});

export default ProductFilter;
