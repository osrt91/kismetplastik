"use client";

import { memo } from "react";
import Link from "@/components/ui/LocaleLink";
import { ArrowRight, Package, GitCompareArrows } from "lucide-react";
import { Product, CategorySlug } from "@/types/product";
import { useLocale } from "@/contexts/LocaleContext";
import { toIntlLocale } from "@/lib/locales";
import StockBadge from "@/components/ui/StockBadge";
import { useCompareStore } from "@/store/useCompareStore";
import { getProductTranslation, getCategoryNameBySlug, getColorTranslation } from "@/lib/product-i18n";

const categoryConfig: Record<
  CategorySlug,
  { bg: string; pattern: string; badge: string; badgeText: string }
> = {
  "pet-siseler": { bg: "#EDF1F5", pattern: "#1E3A6E", badge: "#D6DFE8", badgeText: "#152B55" },
  "plastik-siseler": { bg: "#FFFBEB", pattern: "#D97706", badge: "#FEF3C7", badgeText: "#92610A" },
  "kapaklar": { bg: "#FEF2F2", pattern: "#EF4444", badge: "#FEE2E2", badgeText: "#991B1B" },
  "tipalar": { bg: "#EBF0F7", pattern: "#152B55", badge: "#E0E8F5", badgeText: "#0A1628" },
  "parmak-spreyler": { bg: "#EBF0F7", pattern: "#152B55", badge: "#E0E8F5", badgeText: "#152B55" },
  "pompalar": { bg: "#E8EDF5", pattern: "#0F2040", badge: "#E0E8F5", badgeText: "#0F2040" },
  "tetikli-pusturtuculer": { bg: "#FEF9E7", pattern: "#D97706", badge: "#FEF3D1", badgeText: "#92610A" },
  "huniler": { bg: "#EBF3FB", pattern: "#0A1628", badge: "#E0E8F5", badgeText: "#0A1628" },
};

/** Fallback Turkish category names */
const categoryNamesFallback: Record<CategorySlug, string> = {
  "pet-siseler": "PET Şişeler",
  "plastik-siseler": "Plastik Şişeler",
  "kapaklar": "Kapaklar",
  "tipalar": "Tıpalar",
  "parmak-spreyler": "Parmak Spreyler",
  "pompalar": "Pompalar",
  "tetikli-pusturtuculer": "Tetikli Püskürtücüler",
  "huniler": "Huniler",
};

const colorHexMap: Record<string, string> = {
  Şeffaf: "#E8F4FD",
  Mavi: "#3B82F6",
  Yeşil: "#22C55E",
  Amber: "#F59E0B",
  Beyaz: "#F9FAFB",
  Siyah: "#1F2937",
  Kırmızı: "#EF4444",
  Sarı: "#EAB308",
  Altın: "#D97706",
  Gümüş: "#9CA3AF",
  Füme: "#616161",
  Pembe: "#EC407A",
  Mor: "#7B1FA2",
  Turuncu: "#FF9800",
  Lacivert: "#1A237E",
  Gri: "#9E9E9E",
};

const ProductCard = memo(function ProductCard({ product }: { product: Product }) {
  const { locale, dict } = useLocale();
  const cat = categoryConfig[product.category];
  const { addItem, removeItem, isInCompare } = useCompareStore();
  const inCompare = isInCompare(product.slug);
  const translated = getProductTranslation(product, dict);
  const catName = getCategoryNameBySlug(product.category, dict) || categoryNamesFallback[product.category];

  const handleCompareToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (inCompare) {
      removeItem(product.slug);
    } else {
      addItem({
        slug: product.slug,
        name: product.name,
        category: product.category,
        volume: product.volume,
        weight: product.weight,
        neckDiameter: product.neckDiameter,
        material: product.material,
        colors: product.colors,
      });
    }
  };

  return (
    <Link
      href={`/urunler/${product.category}/${product.slug}`}
      className="group relative block overflow-hidden rounded-2xl border border-neutral-100 bg-white transition-all duration-400 hover:-translate-y-2 hover:border-amber-200/60 hover:shadow-2xl hover:shadow-primary-900/10 dark:border-neutral-800 dark:bg-[#0A1628] dark:hover:border-amber-500/30 dark:hover:shadow-amber-500/5"
    >
      <div
        className="relative aspect-square overflow-hidden shadow-[inset_0_2px_8px_rgba(0,0,0,0.06)]"
        style={{ backgroundColor: cat.bg }}
      >
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 200 200"
          xmlns="http://www.w3.org/2000/svg"
        >
          {[20, 40, 60, 80, 100, 120, 140].map((r) => (
            <circle
              key={r}
              cx="100"
              cy="100"
              r={r}
              fill="none"
              stroke={cat.pattern}
              strokeWidth="0.6"
              opacity={0.1 - r * 0.0004}
            />
          ))}
        </svg>

        {/* Hover gradient overlay */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0A1628]/10 opacity-0 transition-opacity duration-400 group-hover:opacity-100" />

        {/* Shimmer effect on hover */}
        <div className="pointer-events-none absolute inset-0 -translate-x-full skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/25 to-transparent opacity-0 transition-all duration-700 group-hover:translate-x-full group-hover:opacity-100" />

        <div className="absolute inset-0 flex items-center justify-center">
          <Package
            size={52}
            style={{
              color: `${cat.pattern}50`,
              animation: "float 3s ease-in-out infinite",
            }}
          />
        </div>

        {product.featured && (
          <span className="absolute left-3 top-3 rounded-full bg-accent-500 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-900">
            {dict.components.featuredBadge}
          </span>
        )}
        <div className="absolute right-3 top-3">
          <StockBadge
            status={product.inStock ? "in_stock" : "out_of_stock"}
            size="sm"
            locale={locale}
          />
        </div>

        <span
          className="absolute bottom-3 left-3 rounded-lg px-2.5 py-1 text-[10px] font-semibold tracking-wide shadow-sm shadow-black/10 transition-transform duration-400 group-hover:scale-110"
          style={{ backgroundColor: cat.badge, color: cat.badgeText }}
        >
          {catName}
        </span>

        <div className="absolute inset-0 flex items-end justify-center translate-y-full bg-gradient-to-t from-black/50 via-black/15 to-transparent p-5 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <span className="rounded-full bg-white/90 px-4 py-2 text-xs font-bold text-primary-900 shadow-lg backdrop-blur-sm">
            {dict.components.viewDetails}
          </span>
        </div>
      </div>

      <div className="p-5 dark:text-neutral-200">
        <h3 className="mb-1.5 text-base font-bold text-primary-900 transition-colors group-hover:text-primary-700 dark:text-neutral-100 dark:group-hover:text-amber-400">
          {translated.name}
        </h3>
        <p className="mb-3 text-sm text-neutral-500 line-clamp-2 dark:text-neutral-400">
          {translated.shortDescription}
        </p>

        <div className="mb-4 flex flex-wrap gap-1.5 rounded-lg bg-neutral-50/80 px-2.5 py-2 dark:bg-white/5">
          {product.volume && (
            <span className="rounded-md bg-primary-50 px-2 py-0.5 text-xs font-semibold text-primary-700 dark:bg-primary-900/30 dark:text-primary-300">
              {product.volume}
            </span>
          )}
          {product.weight && (
            <span className="rounded-md bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
              {product.weight}
            </span>
          )}
          {product.neckDiameter && (
            <span className="rounded-md bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
              Ø{product.neckDiameter}
            </span>
          )}
        </div>

        <div className="mb-4 flex items-center gap-2">
          <span className="text-xs text-neutral-400 dark:text-neutral-500">{dict.components.colors}</span>
          <div className="flex items-center gap-1">
            {product.colors.slice(0, 5).map((color) => (
              <span
                key={color}
                className="inline-block h-4 w-4 rounded-full border border-neutral-200 shadow-sm"
                style={{ backgroundColor: colorHexMap[color] || "#D1D5DB" }}
                title={getColorTranslation(color, dict)}
              />
            ))}
            {product.colors.length > 5 && (
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-neutral-100 text-[8px] font-bold text-neutral-500">
                +{product.colors.length - 5}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-neutral-100 pt-3 dark:border-neutral-700/50">
          <span className="text-xs text-neutral-400 dark:text-neutral-500">
            {dict.components.minOrderText.replace("{count}", product.minOrder.toLocaleString(toIntlLocale(locale)))}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCompareToggle}
              className={`flex h-10 w-10 items-center justify-center rounded-lg text-xs font-semibold transition-all duration-300 ${
                inCompare
                  ? "bg-amber-100 text-amber-700 shadow-sm shadow-amber-300/40 dark:bg-amber-900/40 dark:text-amber-400 dark:shadow-amber-500/20"
                  : "bg-neutral-100 text-neutral-500 hover:bg-amber-50 hover:text-amber-700 hover:shadow-sm hover:shadow-amber-300/30 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-amber-900/30 dark:hover:text-amber-400"
              }`}
              title={dict.compare?.compare || (locale === "tr" ? "Karşılaştır" : "Compare")}
              aria-label={dict.compare?.compare || (locale === "tr" ? "Karşılaştır" : "Compare")}
            >
              <GitCompareArrows size={16} />
            </button>
            <span className="flex items-center gap-1 text-sm font-semibold text-primary-700 transition-colors group-hover:text-accent-600 dark:text-primary-300 dark:group-hover:text-amber-400">
              {dict.components.detail}
              <ArrowRight
                size={14}
                className="transition-transform duration-400 group-hover:translate-x-1"
              />
            </span>
          </div>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 h-[3px] bg-gradient-to-r from-primary-600 via-accent-500 to-primary-400 opacity-0 transition-opacity duration-400 group-hover:opacity-100" />
    </Link>
  );
});

export default ProductCard;
