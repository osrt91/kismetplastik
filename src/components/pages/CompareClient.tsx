"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "@/components/ui/LocaleLink";
import {
  GitCompareArrows,
  X,
  ArrowLeft,
  ShoppingCart,
  Package,
} from "lucide-react";
import { useCompareStore, type CompareProduct } from "@/store/useCompareStore";
import { useLocale } from "@/contexts/LocaleContext";
import { cn } from "@/lib/utils";
import { getColorTranslation, getCategoryNameBySlug } from "@/lib/product-i18n";

function getCellValue(product: CompareProduct, key: keyof CompareProduct, dict: Record<string, unknown>): string {
  const val = product[key];
  if (key === "category" && typeof val === "string") {
    return getCategoryNameBySlug(val, dict as never) ?? val;
  }
  if (Array.isArray(val)) {
    return val.map((c) => getColorTranslation(c, dict as never)).join(", ");
  }
  if (val === undefined || val === null || val === "") {
    return "-";
  }
  return String(val);
}

function isDifferent(items: CompareProduct[], key: keyof CompareProduct): boolean {
  if (items.length < 2) return false;
  const values = items.map((item) => {
    const val = item[key];
    if (Array.isArray(val)) return val.sort().join(",");
    return String(val ?? "");
  });
  return new Set(values).size > 1;
}

export default function CompareClient() {
  const { dict } = useLocale();
  const cmp = dict.compare;
  const { items, removeItem, clearAll } = useCompareStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hydration guard for persisted store
    setMounted(true);
  }, []);

  const specRows = [
    { key: "category" as keyof CompareProduct, label: cmp.category },
    { key: "volume" as keyof CompareProduct, label: cmp.volume },
    { key: "weight" as keyof CompareProduct, label: cmp.weight },
    { key: "neckDiameter" as keyof CompareProduct, label: cmp.neckDiameter },
    { key: "material" as keyof CompareProduct, label: cmp.material },
  ];

  if (!mounted) {
    return (
      <section className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--accent-500)] border-t-transparent" />
      </section>
    );
  }

  // Empty state
  if (items.length === 0) {
    return (
      <section className="flex min-h-[70vh] flex-col items-center justify-center bg-[#FAFAF7] px-4">
        <div className="text-center">
          <div
            className={cn(
              "mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full",
              "bg-[#0A1628]/5"
            )}
          >
            <GitCompareArrows className="h-10 w-10 text-[#0A1628]/30" />
          </div>
          <h1 className="mb-3 text-2xl font-bold text-[#0A1628]">
            {cmp.noProducts}
          </h1>
          <p className="mb-8 max-w-md text-[var(--neutral-700)]">
            {cmp.noProductsDesc}
          </p>
          <Link
            href="/urunler"
            className={cn(
              "inline-flex items-center gap-2 rounded-lg px-6 py-3",
              "bg-[#0A1628] text-sm font-semibold text-white",
              "transition-all hover:bg-[#0A1628]/90"
            )}
          >
            <Package className="h-4 w-4" />
            {cmp.browseProducts}
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-[#FAFAF7]">
      {/* Header */}
      <div className="border-b border-[var(--border)] bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-6 sm:px-6">
          <div className="flex items-center gap-3">
            <Link
              href="/urunler"
              className="rounded-lg p-2 text-[var(--neutral-500)] transition-colors hover:bg-[var(--neutral-100)] hover:text-[#0A1628]"
              aria-label={cmp.backToProducts}
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-[#0A1628] sm:text-2xl">
                {cmp.title}
              </h1>
              <p className="text-sm text-[var(--neutral-500)]">
                {cmp.selectedCount.replace("{count}", String(items.length))}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={clearAll}
            className={cn(
              "rounded-lg px-4 py-2 text-sm",
              "text-[var(--neutral-500)] transition-colors hover:bg-[var(--neutral-100)] hover:text-[#0A1628]"
            )}
          >
            {cmp.clearAll}
          </button>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="overflow-x-auto rounded-xl border border-[var(--border)] bg-white shadow-sm">
          <table className="w-full min-w-[600px] border-collapse">
            {/* Product Images & Names */}
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="w-[160px] bg-[var(--neutral-50)] px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--neutral-500)] sm:w-[200px]">
                  {cmp.product}
                </th>
                {items.map((item) => (
                  <th
                    key={item.slug}
                    className="relative min-w-[180px] px-4 py-4 text-center"
                  >
                    {/* Remove button */}
                    <button
                      type="button"
                      onClick={() => removeItem(item.slug)}
                      className={cn(
                        "absolute right-2 top-2 rounded-full p-1",
                        "text-[var(--neutral-300)] transition-colors hover:bg-[var(--neutral-100)] hover:text-[var(--neutral-700)]"
                      )}
                      aria-label={`${item.name} ${cmp.remove}`}
                    >
                      <X className="h-4 w-4" />
                    </button>

                    {/* Product Image */}
                    <div className="mx-auto mb-3 flex h-28 w-28 items-center justify-center rounded-lg bg-[var(--neutral-50)] sm:h-32 sm:w-32">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={120}
                          height={120}
                          className="h-full w-full rounded-lg object-contain p-2"
                        />
                      ) : (
                        <Package className="h-10 w-10 text-[var(--neutral-300)]" />
                      )}
                    </div>

                    {/* Product Name */}
                    <p className="text-sm font-semibold text-[#0A1628]">
                      {item.name}
                    </p>
                  </th>
                ))}
                {/* Empty column placeholders */}
                {Array.from({ length: 3 - items.length }).map((_, i) => (
                  <th
                    key={`empty-header-${i}`}
                    className="min-w-[180px] px-4 py-4 text-center"
                  >
                    <Link
                      href="/urunler"
                      className={cn(
                        "mx-auto flex h-28 w-28 flex-col items-center justify-center rounded-lg",
                        "border-2 border-dashed border-[var(--neutral-200)]",
                        "text-[var(--neutral-300)] transition-colors hover:border-[var(--accent-500)] hover:text-[var(--accent-500)]",
                        "sm:h-32 sm:w-32"
                      )}
                    >
                      <span className="text-2xl">+</span>
                      <span className="mt-1 text-xs">
                        {cmp.add}
                      </span>
                    </Link>
                  </th>
                ))}
              </tr>
            </thead>

            {/* Spec Rows */}
            <tbody>
              {specRows.map((row) => {
                const hasDifference = isDifferent(items, row.key);
                return (
                  <tr
                    key={row.key}
                    className={cn(
                      "border-b border-[var(--border)] last:border-b-0",
                      "transition-colors"
                    )}
                  >
                    <td className="bg-[var(--neutral-50)] px-4 py-3 text-sm font-medium text-[var(--neutral-700)]">
                      {row.label}
                    </td>
                    {items.map((item) => {
                      const value = getCellValue(item, row.key, dict);
                      return (
                        <td
                          key={item.slug}
                          className={cn(
                            "px-4 py-3 text-center text-sm text-[#0A1628]",
                            hasDifference && value !== "-" && "bg-[#F59E0B]/10 font-semibold text-[#92400e]"
                          )}
                        >
                          {value}
                        </td>
                      );
                    })}
                    {/* Empty cells for placeholder columns */}
                    {Array.from({ length: 3 - items.length }).map((_, i) => (
                      <td
                        key={`empty-${row.key}-${i}`}
                        className="px-4 py-3 text-center text-sm text-[var(--neutral-300)]"
                      >
                        -
                      </td>
                    ))}
                  </tr>
                );
              })}

              {/* Colors row (special handling) */}
              <tr className="border-b border-[var(--border)]">
                <td className="bg-[var(--neutral-50)] px-4 py-3 text-sm font-medium text-[var(--neutral-700)]">
                  {cmp.colors}
                </td>
                {items.map((item) => {
                  const hasDifference = isDifferent(items, "colors");
                  const hasColors = item.colors && item.colors.length > 0;
                  return (
                    <td
                      key={item.slug}
                      className={cn(
                        "px-4 py-3 text-center text-sm text-[#0A1628]",
                        hasDifference && hasColors && "bg-[#F59E0B]/10"
                      )}
                    >
                      {hasColors ? (
                        <div className="flex flex-wrap items-center justify-center gap-1.5">
                          {item.colors!.map((color) => (
                            <span
                              key={color}
                              className={cn(
                                "inline-block rounded-full px-2.5 py-0.5 text-xs",
                                "bg-[#0A1628]/5 text-[#0A1628]",
                                hasDifference && "font-semibold text-[#92400e]"
                              )}
                            >
                              {getColorTranslation(color, dict)}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-[var(--neutral-300)]">-</span>
                      )}
                    </td>
                  );
                })}
                {Array.from({ length: 3 - items.length }).map((_, i) => (
                  <td
                    key={`empty-colors-${i}`}
                    className="px-4 py-3 text-center text-sm text-[var(--neutral-300)]"
                  >
                    -
                  </td>
                ))}
              </tr>

              {/* Action row */}
              <tr>
                <td className="bg-[var(--neutral-50)] px-4 py-4" />
                {items.map((item) => (
                  <td key={item.slug} className="px-4 py-4 text-center">
                    <Link
                      href={`/teklif-al?urun=${encodeURIComponent(item.name)}`}
                      className={cn(
                        "inline-flex items-center gap-2 rounded-lg px-4 py-2.5",
                        "bg-[var(--accent-500)] text-sm font-semibold text-[#0A1628]",
                        "transition-all hover:bg-[var(--accent-400)] hover:shadow-md",
                        "active:scale-95"
                      )}
                    >
                      <ShoppingCart className="h-4 w-4" />
                      {cmp.addToQuote}
                    </Link>
                  </td>
                ))}
                {Array.from({ length: 3 - items.length }).map((_, i) => (
                  <td key={`empty-action-${i}`} className="px-4 py-4" />
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        {/* Back to products link */}
        <div className="mt-8 text-center">
          <Link
            href="/urunler"
            className={cn(
              "inline-flex items-center gap-2 text-sm text-[var(--neutral-500)]",
              "transition-colors hover:text-[#0A1628]"
            )}
          >
            <ArrowLeft className="h-4 w-4" />
            {cmp.continueBrowsing}
          </Link>
        </div>
      </div>
    </section>
  );
}
