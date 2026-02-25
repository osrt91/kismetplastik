"use client";

import Link from "next/link";
import { Clock, X, ArrowRight, Package } from "lucide-react";
import { useRecentProducts } from "@/hooks/useRecentProducts";
import { products, getCategoryBySlug } from "@/data/products";
import AnimateOnScroll from "@/components/ui/AnimateOnScroll";
import { CategorySlug } from "@/types/product";

const categoryBadgeStyles: Record<
  CategorySlug,
  { bg: string; text: string }
> = {
  "pet-siseler": { bg: "#D6E7F7", text: "#1F4A7E" },
  "plastik-siseler": { bg: "#FEF3D1", text: "#92610A" },
  "kolonya": { bg: "#EDE9FE", text: "#5B21B6" },
  "sprey": { bg: "#DCFCE7", text: "#166534" },
  "oda-parfumu": { bg: "#CCFBF1", text: "#115E59" },
  "sivi-sabun": { bg: "#DBEAFE", text: "#1E40AF" },
  "kapaklar": { bg: "#FEE2E2", text: "#991B1B" },
  "ozel-uretim": { bg: "#FFE4E6", text: "#9F1239" },
};

export default function RecentProducts() {
  const { recentIds, clearRecent } = useRecentProducts();

  const recentProducts = recentIds
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is NonNullable<typeof p> => p != null);

  if (recentProducts.length === 0) {
    return null;
  }

  const volumeWeightInfo = (p: (typeof recentProducts)[0]) => {
    const parts: string[] = [];
    if (p.volume) parts.push(p.volume);
    if (p.weight) parts.push(p.weight);
    return parts.join(" • ");
  };

  return (
    <AnimateOnScroll animation="fade-up">
      <section className="border-t border-neutral-100 bg-white py-10 lg:py-14">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          {/* Section header */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
                <Clock size={18} />
              </div>
              <h2 className="text-xl font-bold text-primary-900">
                Son Görüntülenen Ürünler
              </h2>
            </div>
            <button
              onClick={clearRecent}
              className="flex items-center gap-1.5 text-sm text-neutral-500 transition-colors hover:text-neutral-700"
              type="button"
              aria-label="Geçmişi temizle"
            >
              <X size={14} />
              Temizle
            </button>
          </div>

          {/* Horizontal scroll row */}
          <div className="-mx-4 overflow-x-auto px-4 pb-2 lg:-mx-6 lg:px-6">
            <div className="flex gap-4 snap-x snap-mandatory">
              {recentProducts.map((product) => {
                const category = getCategoryBySlug(product.category);
                const badgeStyle = categoryBadgeStyles[product.category];

                return (
                  <Link
                    key={product.id}
                    href={`/urunler/${product.category}/${product.slug}`}
                    className="group flex min-w-[200px] max-w-[200px] shrink-0 snap-start"
                  >
                    <div className="flex h-full w-full flex-col overflow-hidden rounded-xl border border-neutral-100 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-primary-100 hover:shadow-lg hover:shadow-primary-900/5">
                      {/* Placeholder icon area */}
                      <div className="flex h-20 items-center justify-center bg-neutral-50 transition-colors group-hover:bg-primary-50/50">
                        <Package
                          size={32}
                          className="text-neutral-300 transition-colors group-hover:text-primary-400"
                        />
                      </div>

                      <div className="flex flex-1 flex-col p-3">
                        <span
                          className="mb-1.5 inline-block w-fit rounded-full px-2 py-0.5 text-[10px] font-semibold"
                          style={{
                            backgroundColor: badgeStyle.bg,
                            color: badgeStyle.text,
                          }}
                        >
                          {category?.name ?? product.category}
                        </span>
                        <h3 className="mb-1 line-clamp-2 text-sm font-semibold text-primary-900 transition-colors group-hover:text-primary-700">
                          {product.name}
                        </h3>
                        <p className="mb-2 line-clamp-2 text-xs text-neutral-500">
                          {product.shortDescription}
                        </p>
                        {volumeWeightInfo(product) && (
                          <p className="mb-2 text-[11px] text-neutral-400">
                            {volumeWeightInfo(product)}
                          </p>
                        )}
                        <span className="mt-auto flex items-center gap-1 text-xs font-medium text-primary-600 transition-colors group-hover:text-accent-600">
                          Detay
                          <ArrowRight
                            size={12}
                            className="transition-transform duration-300 group-hover:translate-x-0.5"
                          />
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </AnimateOnScroll>
  );
}
