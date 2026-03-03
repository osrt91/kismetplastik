"use client";

import { useMemo } from "react";
import { Package } from "lucide-react";
import { products, categories } from "@/data/products";
import type { Product, CategorySlug } from "@/types/product";
import { useLocale } from "@/contexts/LocaleContext";
import { cn } from "@/lib/utils";

interface Props {
  selectedProductId: string;
  selectedCategory: CategorySlug | "all";
  onProductSelect: (product: Product) => void;
  onCategoryChange: (category: CategorySlug | "all") => void;
}

export default function ProductSelector({
  selectedProductId,
  selectedCategory,
  onProductSelect,
  onCategoryChange,
}: Props) {
  const { dict } = useLocale();
  const v = dict.visualizer;

  const filteredProducts = useMemo(() => {
    if (selectedCategory === "all") return products;
    return products.filter((p) => p.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-400">
        <Package size={14} />
        <span>{v.selectProduct}</span>
      </div>

      {/* Category filter */}
      <select
        value={selectedCategory}
        onChange={(e) => onCategoryChange(e.target.value as CategorySlug | "all")}
        className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-neutral-200 outline-none transition-colors focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30"
      >
        <option value="all">{v.allCategories}</option>
        {categories.map((cat) => (
          <option key={cat.slug} value={cat.slug}>
            {cat.name}
          </option>
        ))}
      </select>

      {/* Product list */}
      <div className="flex max-h-[200px] flex-col gap-1 overflow-y-auto pr-1">
        {filteredProducts.length === 0 ? (
          <p className="py-3 text-center text-xs text-neutral-500">
            {v.noProducts}
          </p>
        ) : (
          filteredProducts.map((product) => (
            <button
              key={product.id}
              onClick={() => onProductSelect(product)}
              className={cn(
                "flex flex-col rounded-lg px-3 py-2 text-left transition-colors",
                selectedProductId === product.id
                  ? "bg-amber-500/15 text-amber-400"
                  : "text-neutral-300 hover:bg-neutral-700/50"
              )}
            >
              <span className="text-sm font-medium leading-tight">
                {product.name}
              </span>
              <span className="text-[11px] text-neutral-500">
                {product.volume && `${product.volume} · `}
                {product.material}
              </span>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
