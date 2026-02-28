"use client";

import { memo } from "react";
import Link from "@/components/ui/LocaleLink";
import { ArrowRight, Package } from "lucide-react";
import { Product, CategorySlug } from "@/types/product";
import { useLocale } from "@/contexts/LocaleContext";

const categoryConfig: Record<
  CategorySlug,
  { name: string; bg: string; pattern: string; badge: string; badgeText: string }
> = {
  "pet-siseler": { name: "PET Şişeler", bg: "#EBF3FB", pattern: "#2E6AAF", badge: "#D6E7F7", badgeText: "#1F4A7E" },
  "plastik-siseler": { name: "Plastik Şişeler", bg: "#FEF9E7", pattern: "#D9A000", badge: "#FEF3D1", badgeText: "#92610A" },
  "kapaklar": { name: "Kapaklar", bg: "#FEF2F2", pattern: "#EF4444", badge: "#FEE2E2", badgeText: "#991B1B" },
  "tipalar": { name: "Tıpalar", bg: "#F5F3FF", pattern: "#8B5CF6", badge: "#EDE9FE", badgeText: "#5B21B6" },
  "parmak-spreyler": { name: "Parmak Spreyler", bg: "#ECFDF5", pattern: "#22C55E", badge: "#DCFCE7", badgeText: "#166534" },
  "pompalar": { name: "Pompalar", bg: "#F0FDFA", pattern: "#14B8A6", badge: "#CCFBF1", badgeText: "#115E59" },
  "tetikli-pusturtuculer": { name: "Tetikli Püskürtücüler", bg: "#FFF7ED", pattern: "#EA580C", badge: "#FFEDD5", badgeText: "#9A3412" },
  "huniler": { name: "Huniler", bg: "#ECFEFF", pattern: "#0891B2", badge: "#CFFAFE", badgeText: "#155E75" },
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
  const { dict } = useLocale();
  const cat = categoryConfig[product.category];

  return (
    <Link
      href={`/urunler/${product.category}/${product.slug}`}
      className="group relative block overflow-hidden rounded-2xl border border-neutral-100 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-primary-100 hover:shadow-xl hover:shadow-primary-900/5"
    >
      <div
        className="relative aspect-square overflow-hidden"
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
        {!product.inStock && (
          <span className="absolute right-3 top-3 rounded-full bg-red-500 px-2.5 py-1 text-[10px] font-bold text-white">
            {dict.components.outOfStock}
          </span>
        )}

        <span
          className="absolute bottom-3 left-3 rounded-full px-2.5 py-1 text-[10px] font-semibold tracking-wide transition-transform duration-300 group-hover:scale-110"
          style={{ backgroundColor: cat.badge, color: cat.badgeText }}
        >
          {cat.name}
        </span>

        <div className="absolute inset-0 flex items-end justify-center translate-y-full bg-gradient-to-t from-black/50 via-black/15 to-transparent p-5 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <span className="rounded-full bg-white/90 px-4 py-2 text-xs font-bold text-primary-900 shadow-lg backdrop-blur-sm">
            {dict.components.viewDetails}
          </span>
        </div>
      </div>

      <div className="p-5">
        <h3 className="mb-1.5 text-base font-bold text-primary-900 transition-colors group-hover:text-primary-700">
          {product.name}
        </h3>
        <p className="mb-3 text-sm text-neutral-500 line-clamp-2">
          {product.shortDescription}
        </p>

        <div className="mb-4 flex flex-wrap gap-1.5">
          {product.volume && (
            <span className="rounded-md bg-primary-50 px-2 py-0.5 text-xs font-medium text-primary-700">
              {product.volume}
            </span>
          )}
          {product.weight && (
            <span className="rounded-md bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-600">
              {product.weight}
            </span>
          )}
          {product.neckDiameter && (
            <span className="rounded-md bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-600">
              Ø{product.neckDiameter}
            </span>
          )}
        </div>

        <div className="mb-4 flex items-center gap-2">
          <span className="text-xs text-neutral-400">{dict.components.colors}</span>
          <div className="flex items-center gap-1">
            {product.colors.slice(0, 5).map((color) => (
              <span
                key={color}
                className="inline-block h-4 w-4 rounded-full border border-neutral-200 shadow-sm"
                style={{ backgroundColor: colorHexMap[color] || "#D1D5DB" }}
                title={color}
              />
            ))}
            {product.colors.length > 5 && (
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-neutral-100 text-[8px] font-bold text-neutral-500">
                +{product.colors.length - 5}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-neutral-50 pt-3">
          <span className="text-xs text-neutral-400">
            {dict.components.minOrderText.replace("{count}", product.minOrder.toLocaleString("tr-TR"))}
          </span>
          <span className="flex items-center gap-1 text-sm font-semibold text-primary-700 transition-colors group-hover:text-accent-600">
            {dict.components.detail}
            <ArrowRight
              size={14}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </span>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-primary-500 via-accent-400 to-primary-300 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    </Link>
  );
});

export default ProductCard;
