"use client";

import { useEffect, useState, lazy, Suspense } from "react";
import { useParams } from "next/navigation";
import Link from "@/components/ui/LocaleLink";
import {
  ChevronRight,
  Phone,
  FileText,
  ArrowLeft,
  CheckCircle2,
  Info,
  Box,
  Layers,
} from "lucide-react";
import { getProductBySlug, getCategoryBySlug } from "@/data/products";
import AnimateOnScroll from "@/components/ui/AnimateOnScroll";
import ProductViewer from "@/components/ui/ProductViewer";
import StickyQuoteBar from "@/components/ui/StickyQuoteBar";
import RecentProducts from "@/components/sections/RecentProducts";
import { useRecentProducts } from "@/hooks/useRecentProducts";
import { useLocale } from "@/contexts/LocaleContext";

const Product3DViewer = lazy(() => import("@/components/ui/Product3DViewer"));

export default function ProductDetailClient() {
  const { dict } = useLocale();
  const p = dict.products;
  const cm = dict.common;
  const { addRecent } = useRecentProducts();
  const [viewMode, setViewMode] = useState<"2d" | "3d">("2d");
  const [selectedColor, setSelectedColor] = useState<string | undefined>();

  const params = useParams();
  const slug = params.slug as string;
  const categorySlug = params.category as string;
  const product = getProductBySlug(slug);
  const category = getCategoryBySlug(categorySlug);

  useEffect(() => {
    if (product) addRecent(product.id);
  }, [product, addRecent]);

  if (!product || !category) {
    return (
      <section className="flex min-h-[60vh] items-center justify-center bg-neutral-50">
        <div className="text-center">
          <h1 className="mb-2 text-2xl font-bold text-neutral-700">{p.productNotFound}</h1>
          <Link href="/urunler" className="text-primary-700 hover:underline">
            {p.backToAll}
          </Link>
        </div>
      </section>
    );
  }

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    brand: { "@type": "Brand", name: "Kısmet Plastik" },
    manufacturer: { "@type": "Organization", name: "Kısmet Plastik Kozmetik Ambalaj ve Kalıp San. Tic. Ltd. Şti." },
    material: product.material,
    category: category.name,
    offers: {
      "@type": "Offer",
      availability: product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      priceCurrency: "TRY",
      seller: { "@type": "Organization", name: "Kısmet Plastik" },
    },
  };

  return (
    <section className="bg-neutral-50 py-8 lg:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <nav className="mb-6 flex flex-wrap items-center gap-1.5 text-sm text-neutral-400">
          <Link href="/" className="hover:text-primary-700">{p.breadcrumbHome}</Link>
          <ChevronRight size={14} />
          <Link href="/urunler" className="hover:text-primary-700">{p.breadcrumbProducts}</Link>
          <ChevronRight size={14} />
          <Link href={`/urunler/${category.slug}`} className="hover:text-primary-700">
            {category.name}
          </Link>
          <ChevronRight size={14} />
          <span className="font-medium text-primary-900">{product.name}</span>
        </nav>

        <Link
          href={`/urunler/${category.slug}`}
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-primary-700 transition-colors hover:text-primary-900"
        >
          <ArrowLeft size={16} />
          {category.name} {p.backToCategory}
        </Link>

        <div className="grid gap-10 lg:grid-cols-2">
          {/* Left - Product Viewer */}
          <AnimateOnScroll animation="fade-right">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-end gap-1.5">
                <button
                  onClick={() => setViewMode("2d")}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                    viewMode === "2d"
                      ? "bg-primary-600 text-white shadow-sm"
                      : "bg-neutral-100 text-neutral-500 hover:bg-neutral-200"
                  }`}
                >
                  <Layers size={14} />
                  {dict.components.view2D}
                </button>
                <button
                  onClick={() => setViewMode("3d")}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                    viewMode === "3d"
                      ? "bg-primary-600 text-white shadow-sm"
                      : "bg-neutral-100 text-neutral-500 hover:bg-neutral-200"
                  }`}
                >
                  <Box size={14} />
                  {dict.components.view3D}
                </button>
              </div>

              {viewMode === "2d" ? (
                <ProductViewer product={product} onColorChange={setSelectedColor} />
              ) : (
                <Suspense
                  fallback={
                    <div className="flex min-h-[420px] items-center justify-center rounded-2xl border border-slate-200/60 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">
                      <div className="flex flex-col items-center gap-2">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
                        <span className="text-xs text-neutral-400">3D...</span>
                      </div>
                    </div>
                  }
                >
                  <Product3DViewer product={product} selectedColor={selectedColor || product.colors[0]} />
                </Suspense>
              )}
            </div>
          </AnimateOnScroll>

          {/* Right - Details */}
          <AnimateOnScroll animation="fade-left">
            <div>
              <h1 className="mb-3 text-2xl font-extrabold text-primary-900 sm:text-3xl">
                {product.name}
              </h1>
              <p className="mb-6 text-base leading-relaxed text-neutral-500">
                {product.description}
              </p>

              <div className="mb-6 flex flex-wrap gap-2">
                <span className="rounded-lg bg-primary-50 px-3 py-1.5 text-sm font-semibold text-primary-700">
                  {product.material}
                </span>
                {product.inStock ? (
                  <span className="flex items-center gap-1 rounded-lg bg-green-50 px-3 py-1.5 text-sm font-semibold text-green-700">
                    <CheckCircle2 size={14} />
                    {cm.inStock}
                  </span>
                ) : (
                  <span className="rounded-lg bg-red-50 px-3 py-1.5 text-sm font-semibold text-red-700">
                    {cm.outOfStock}
                  </span>
                )}
              </div>

              <div className="mb-6 overflow-hidden rounded-xl border border-neutral-200">
                <div className="bg-neutral-50 px-5 py-3">
                  <h3 className="flex items-center gap-2 text-sm font-bold text-primary-900">
                    <Info size={16} />
                    {p.technicalSpecs}
                  </h3>
                </div>
                <div className="divide-y divide-neutral-100">
                  {product.specs.map((spec) => (
                    <div key={spec.label} className="flex items-center justify-between px-5 py-3">
                      <span className="text-sm text-neutral-500">{spec.label}</span>
                      <span className="text-sm font-semibold text-neutral-900">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-8 rounded-xl border border-accent-200 bg-accent-100/50 p-4">
                <p className="text-sm text-neutral-700">
                  <span className="font-bold">{cm.minOrder}:</span>{" "}
                  {product.minOrder.toLocaleString("tr-TR")} {cm.pieces}
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/teklif-al"
                  className="group inline-flex items-center justify-center gap-2 rounded-xl bg-accent-500 px-6 py-3.5 text-base font-bold text-primary-900 shadow-lg shadow-accent-500/25 transition-all duration-300 hover:bg-accent-400 hover:shadow-xl hover:-translate-y-0.5 active:scale-[0.98]"
                >
                  <FileText size={18} />
                  {p.requestQuoteFor}
                </Link>
                <a
                  href="tel:+902125498703"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-primary-900 px-6 py-3.5 text-base font-semibold text-primary-900 transition-all duration-300 hover:bg-primary-900 hover:text-white"
                >
                  <Phone size={18} />
                  {p.callNow}
                </a>
              </div>
            </div>
          </AnimateOnScroll>
        </div>

        <RecentProducts />
      </div>

      <StickyQuoteBar
        productName={product.name}
        volume={product.volume}
        material={product.material}
        category={category.name}
      />
    </section>
  );
}
