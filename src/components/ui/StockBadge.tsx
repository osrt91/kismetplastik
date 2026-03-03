"use client";

import { cn } from "@/lib/utils";

export type StockStatus = "in_stock" | "low_stock" | "out_of_stock" | "pre_order";

interface StockBadgeProps {
  status: StockStatus;
  size?: "sm" | "md";
  locale?: string;
}

const labels: Record<StockStatus, { tr: string; en: string }> = {
  in_stock: { tr: "Stokta", en: "In Stock" },
  low_stock: { tr: "Sınırlı Stok", en: "Limited Stock" },
  out_of_stock: { tr: "Stokta Yok", en: "Out of Stock" },
  pre_order: { tr: "Ön Sipariş", en: "Pre-Order" },
};

const variantStyles: Record<StockStatus, string> = {
  in_stock:
    "bg-green-50 text-green-700 border-green-200 dark:bg-green-950/30 dark:text-green-400 dark:border-green-800",
  low_stock:
    "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800 animate-pulse",
  out_of_stock:
    "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-800",
  pre_order:
    "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-800",
};

const dotColors: Record<StockStatus, string> = {
  in_stock: "bg-green-500",
  low_stock: "bg-amber-500",
  out_of_stock: "bg-red-500",
  pre_order: "bg-blue-500",
};

export default function StockBadge({
  status,
  size = "md",
  locale = "tr",
}: StockBadgeProps) {
  const lang = locale === "en" ? "en" : "tr";
  const label = labels[status][lang];

  return (
    <span
      role="status"
      aria-label={label}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border font-medium",
        variantStyles[status],
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm"
      )}
    >
      <span
        className={cn(
          "shrink-0 rounded-full",
          dotColors[status],
          size === "sm" ? "h-1.5 w-1.5" : "h-2 w-2"
        )}
      />
      {label}
    </span>
  );
}
