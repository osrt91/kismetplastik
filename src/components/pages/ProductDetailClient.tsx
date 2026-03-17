"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
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
import type { Product, Category } from "@/types/product";
import AnimateOnScroll from "@/components/ui/AnimateOnScroll";
import ProductViewer from "@/components/ui/ProductViewer";
import StickyQuoteBar from "@/components/ui/StickyQuoteBar";
import RecentProducts from "@/components/sections/RecentProducts";
import { useRecentProducts } from "@/hooks/useRecentProducts";
import { useLocale } from "@/contexts/LocaleContext";
import StockBadge from "@/components/ui/StockBadge";
import { toIntlLocale } from "@/lib/locales";
import { getProductTranslation, getCategoryTranslation, getSpecTranslation } from "@/lib/product-i18n";

const Product3DViewer = dynamic(() => import("@/components/ui/Product3DViewer"), { ssr: false });

export default function ProductDetailClient() {
  const { locale, dict } = useLocale();
  const p = dict.products;
  const cm = dict.common;
  const { addRecent } = useRecentProducts();
  const [viewMode, setViewMode] = useState<"2d" | "3d">("2d");
  const [selectedColor, setSelectedColor] = useState<string | undefined>();
  const [product, setProduct] = useState<Product | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);

  const params = useParams();
  const slug = params.slug as string;
  const categorySlug = params.category as string;

  // Fetch product and category data from API
  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch(`/api/products?search=${encodeURIComponent(slug)}&category=${encodeURIComponent(categorySlug)}&limit=10`);
        const json = await res.json();
        if (!cancelled && json.success && json.data) {
          // Find exact match by slug
          const found = (json.data.products ?? []).find(
            (pr: Product) => pr.slug === slug
          );
          setProduct(found ?? null);

          // Find category
          const cat = (json.data.categories ?? []).find(
            (c: Category) => c.slug === categorySlug
          );
          setCategory(cat ?? null);
        }
      } catch {
        // Failed to load
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [slug, categorySlug]);

  useEffect(() => {
    if (product) addRecent(product.id);
  }, [product, addRecent]);

  const translated = product ? getProductTranslation(product, dict) : { name: "", shortDescription: "", description: "" };
  const catT = category ? getCategoryTranslation(category, dict) : { name: "", description: "" };

  if (loading) {
    return (
      <section className="flex min-h-[60vh] items-center justify-center bg-neutral-50 dark:bg-neutral-900">
        <span className="h-8 w-8 animate-spin rounded-full border-3 border-neutral-200 border-t-[#F59E0B]" />
      </section>
    );
  }

  if (!product || !category) {
    return (
      <section className="flex min-h-[60vh] items-center justify-center bg-neutral-50 dark:bg-neutral-900">
        <div className="text-center">
          <h1 className="mb-2 text-2xl font-bold text-neutral-700 dark:text-neutral-200">{p.productNotFound}</h1>
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
    name: translated.name,
    description: translated.description,
    brand: { "@type": "Brand", name: "Kısmet Plastik" },
    manufacturer: { "@type": "Organization", name: "Kısmet Plastik Kozmetik Ambalaj ve Kalıp San. Tic. Ltd. Şti." },
    material: product.material,
    category: catT.name,
    offers: {
      "@type": "Offer",
      availability: product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      priceCurrency: "TRY",
      seller: { "@type": "Organization", name: "Kısmet Plastik" },
    },
  };

  return (
      <section className="bg-[#FAFAF7] py-8 dark:bg-[#0A1628] lg:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        {/* Breadcrumb with amber category accent */}
        <nav className="mb-6 flex flex-wrap items-center gap-1.5 text-sm text-neutral-400 dark:text-neutral-500">
          <Link href="/" className="transition-colors hover:text-[#0A1628] dark:hover:text-neutral-200">{p.breadcrumbHome}</Link>
          <ChevronRight size={14} />
          <Link href="/urunler" className="transition-colors hover:text-[#0A1628] dark:hover:text-neutral-200">{p.breadcrumbProducts}</Link>
          <ChevronRight size={14} />
          <Link href={`/urunler/${category.slug}`} className="font-medium text-[#F59E0B] transition-colors hover:text-[#D97706]">
            {catT.name}
          </Link>
          <ChevronRight size={14} />
          <span className="font-semibold text-[#0A1628] dark:text-white">{translated.name}</span>
        </nav>

        <Link
          href={`/urunler/${category.slug}`}
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-[#0A1628] transition-colors hover:text-[#F59E0B] dark:text-neutral-300 dark:hover:text-[#F59E0B]"
        >
          <ArrowLeft size={16} />
          {catT.name} {p.backToCategory}
        </Link>

        <div className="grid gap-10 lg:grid-cols-2">
          {/* Left - Product Viewer */}
          <AnimateOnScroll animation="fade-right">
            <div className="flex flex-col gap-3">
              {/* View mode tabs with amber active indicator */}
              <div className="flex items-center justify-end gap-1.5">
                <button
                  onClick={() => setViewMode("2d")}
                  className={`relative inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                    viewMode === "2d"
                      ? "bg-[#0A1628] text-white shadow-md shadow-[#0A1628]/20 dark:bg-white dark:text-[#0A1628]"
                      : "border border-neutral-200 bg-white text-neutral-600 hover:border-[#F59E0B]/50 hover:bg-[#FAFAF7] dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:border-[#F59E0B]/50"
                  }`}
                >
                  {viewMode === "2d" && <span className="absolute -bottom-0.5 left-1/2 h-0.5 w-4 -translate-x-1/2 rounded-full bg-[#F59E0B]" />}
                  <Layers size={14} />
                  {dict.components.view2D}
                </button>
                <button
                  onClick={() => setViewMode("3d")}
                  className={`relative inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                    viewMode === "3d"
                      ? "bg-[#0A1628] text-white shadow-md shadow-[#0A1628]/20 dark:bg-white dark:text-[#0A1628]"
                      : "border border-neutral-200 bg-white text-neutral-600 hover:border-[#F59E0B]/50 hover:bg-[#FAFAF7] dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:border-[#F59E0B]/50"
                  }`}
                >
                  {viewMode === "3d" && <span className="absolute -bottom-0.5 left-1/2 h-0.5 w-4 -translate-x-1/2 rounded-full bg-[#F59E0B]" />}
                  <Box size={14} />
                  {dict.components.view3D}
                </button>
              </div>

              {viewMode === "2d" ? (
                <ProductViewer product={product} onColorChange={setSelectedColor} />
              ) : (
                <Product3DViewer product={product} selectedColor={selectedColor || product.colors[0]} />
              )}
            </div>
          </AnimateOnScroll>

          {/* Right - Details */}
          <AnimateOnScroll animation="fade-left">
            <div>
              {/* Category label */}
              <span className="mb-2 inline-block rounded-full bg-[#F59E0B]/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#F59E0B]">
                {catT.name}
              </span>
              {/* Product title - navy */}
              <h1 className="mb-3 text-2xl font-extrabold tracking-tight text-[#0A1628] dark:text-white sm:text-3xl lg:text-4xl">
                {translated.name}
              </h1>
              <p className="mb-6 text-base leading-relaxed text-neutral-500 dark:text-neutral-400">
                {translated.description}
              </p>

              <div className="mb-6 flex flex-wrap gap-2">
                <span className="rounded-lg bg-[#0A1628]/5 px-3 py-1.5 text-sm font-semibold text-[#0A1628] dark:bg-white/10 dark:text-neutral-200">
                  {product.material}
                </span>
                <StockBadge
                  status={product.inStock ? "in_stock" : "out_of_stock"}
                  size="md"
                  locale={locale}
                />
              </div>

              {/* Specs table - navy header, alternating cream/white rows */}
              <div className="mb-6 overflow-hidden rounded-xl border border-neutral-200 shadow-sm dark:border-neutral-700">
                <div className="bg-[#0A1628] px-5 py-3">
                  <h3 className="flex items-center gap-2 text-sm font-bold text-white">
                    <Info size={16} className="text-[#F59E0B]" />
                    {p.technicalSpecs}
                  </h3>
                </div>
                <div className="divide-y divide-neutral-100 dark:divide-neutral-700/50">
                  {product.specs.map((spec, index) => {
                    const ts = getSpecTranslation(spec, dict);
                    return (
                    <div
                      key={spec.label}
                      className={`flex items-center justify-between px-5 py-3 transition-colors hover:bg-[#F59E0B]/5 ${
                        index % 2 === 0
                          ? "bg-[#FAFAF7] dark:bg-[#0A1628]/50"
                          : "bg-white dark:bg-[#111827]/50"
                      }`}
                    >
                      <span className="text-sm text-neutral-500 dark:text-neutral-400">{ts.label}</span>
                      <span className="text-sm font-semibold text-[#0A1628] dark:text-neutral-100">{ts.value}</span>
                    </div>
                    );
                  })}
                </div>
              </div>

              {/* Min order box */}
              <div className="mb-8 rounded-xl border border-[#F59E0B]/30 bg-[#F59E0B]/5 p-4 dark:border-[#F59E0B]/20 dark:bg-[#F59E0B]/5">
                <p className="text-sm text-[#0A1628] dark:text-neutral-200">
                  <span className="font-bold">{cm.minOrder}:</span>{" "}
                  {product.minOrder.toLocaleString(toIntlLocale(locale))} {cm.pieces}
                </p>
              </div>

              {/* CTA Buttons - amber with glow, prominent */}
              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Link
                  href="/teklif-al"
                  className="group inline-flex items-center justify-center gap-2 rounded-xl bg-[#F59E0B] px-6 py-3.5 text-base font-bold text-[#0A1628] shadow-lg shadow-[#F59E0B]/30 transition-all duration-300 hover:bg-[#FBBF24] hover:shadow-xl hover:shadow-[#F59E0B]/40 hover:-translate-y-0.5 active:scale-[0.98]"
                >
                  <FileText size={18} className="transition-transform group-hover:scale-110" />
                  {p.requestQuoteFor}
                </Link>
                <Link
                  href="/numune-talep"
                  className="group inline-flex items-center justify-center gap-2 rounded-xl border-2 border-[#F59E0B] bg-transparent px-6 py-3.5 text-base font-bold text-[#F59E0B] transition-all duration-300 hover:bg-[#F59E0B] hover:text-[#0A1628] hover:shadow-lg hover:shadow-[#F59E0B]/25 hover:-translate-y-0.5 active:scale-[0.98]"
                >
                  <CheckCircle2 size={18} className="transition-transform group-hover:scale-110" />
                  {p.requestSample}
                </Link>
                {!product.inStock && (
                  <Link
                    href="/on-siparis"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0A1628] px-6 py-3.5 text-base font-bold text-white shadow-lg transition-all duration-300 hover:bg-[#152B55] hover:-translate-y-0.5 active:scale-[0.98] dark:bg-white dark:text-[#0A1628] dark:hover:bg-neutral-200"
                  >
                    {p.preOrder}
                  </Link>
                )}
                <a
                  href="tel:+902125498703"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-[#0A1628] px-6 py-3.5 text-base font-semibold text-[#0A1628] transition-all duration-300 hover:bg-[#0A1628] hover:text-white dark:border-neutral-400 dark:text-neutral-300 dark:hover:bg-white dark:hover:text-[#0A1628]"
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
        productName={translated.name}
        volume={product.volume}
        material={product.material}
      />
    </section>
  );
}
