import Link from "next/link";
import { ArrowRight, Package } from "lucide-react";
import { Product } from "@/types/product";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/urunler/${product.category}/${product.slug}`}
      className="group block overflow-hidden rounded-2xl border border-neutral-100 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-primary-100 hover:shadow-xl hover:shadow-primary-900/5"
    >
      {/* Image Placeholder */}
      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-neutral-50 to-neutral-100">
        <div className="absolute inset-0 flex items-center justify-center">
          <Package
            size={48}
            className="text-neutral-300 transition-all duration-300 group-hover:scale-110 group-hover:text-primary-300"
          />
        </div>
        {product.featured && (
          <span className="absolute left-3 top-3 rounded-full bg-accent-500 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-900">
            Öne Çıkan
          </span>
        )}
        {!product.inStock && (
          <span className="absolute right-3 top-3 rounded-full bg-red-500 px-2.5 py-1 text-[10px] font-bold text-white">
            Stokta Yok
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="mb-1.5 text-base font-bold text-primary-900 transition-colors group-hover:text-primary-700">
          {product.name}
        </h3>
        <p className="mb-3 text-sm text-neutral-500 line-clamp-2">
          {product.shortDescription}
        </p>

        {/* Quick Specs */}
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

        {/* Colors */}
        <div className="mb-4 flex items-center gap-1">
          <span className="text-xs text-neutral-400">Renkler:</span>
          <span className="text-xs text-neutral-600">
            {product.colors.slice(0, 3).join(", ")}
            {product.colors.length > 3 && ` +${product.colors.length - 3}`}
          </span>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-neutral-50 pt-3">
          <span className="text-xs text-neutral-400">
            Min. {product.minOrder.toLocaleString("tr-TR")} adet
          </span>
          <span className="flex items-center gap-1 text-sm font-semibold text-primary-700 transition-colors group-hover:text-accent-600">
            Detay
            <ArrowRight
              size={14}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </span>
        </div>
      </div>
    </Link>
  );
}
