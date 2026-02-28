"use client";

import { useState, useEffect } from "react";
import Link from "@/components/ui/LocaleLink";
import {
  Package,
  Search,
  Filter,
  Tag,
  ArrowRight,
  Star,
  Loader2,
} from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import { getSupabaseBrowser } from "@/lib/supabase-browser";

interface Category {
  slug: string;
  name_tr: string;
  name_en: string;
}

interface Product {
  id: string;
  name: string;
  short_description: string;
  category_slug: string;
  material: string;
  volume: string | null;
  weight: string | null;
  min_order: number;
  featured: boolean;
  categories: Category | null;
}

const labels: Record<string, Record<string, string>> = {
  tr: {
    title: "Ürünler",
    search: "Ürün adı ile ara...",
    allCategories: "Tüm Kategoriler",
    material: "Malzeme",
    volume: "Hacim",
    weight: "Ağırlık",
    minOrder: "Min. Sipariş",
    featured: "Öne Çıkan",
    requestQuote: "Teklif Al",
    noProducts: "Ürün bulunamadı.",
    loading: "Yükleniyor...",
    filters: "Filtreler",
    pieces: "adet",
    category: "Kategori",
  },
  en: {
    title: "Products",
    search: "Search by product name...",
    allCategories: "All Categories",
    material: "Material",
    volume: "Volume",
    weight: "Weight",
    minOrder: "Min. Order",
    featured: "Featured",
    requestQuote: "Request Quote",
    noProducts: "No products found.",
    loading: "Loading...",
    filters: "Filters",
    pieces: "pcs",
    category: "Category",
  },
};

export default function UrunlerPage() {
  const { locale } = useLocale();
  const t = labels[locale] || labels.tr;

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const supabase = getSupabaseBrowser();

        const [productsRes, categoriesRes] = await Promise.all([
          supabase
            .from("products")
            .select("*, categories!category_slug(*)")
            .order("featured", { ascending: false })
            .order("name", { ascending: true }),
          supabase.from("categories").select("*").order("name_tr"),
        ]);

        setProducts((productsRes.data as Product[]) || []);
        setCategories((categoriesRes.data as Category[]) || []);
      } catch (err) {
        console.error("Products load error:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const filtered = products.filter((p) => {
    const matchesSearch = p.name
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || p.category_slug === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryName = (cat: Category | null) => {
    if (!cat) return "—";
    return locale === "en" ? cat.name_en : cat.name_tr;
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex items-center gap-3 text-neutral-500">
          <Loader2 size={24} className="animate-spin text-primary-500" />
          {t.loading}
        </div>
      </div>
    );
  }

  const categoryList = (
    <div className="space-y-1">
      <button
        onClick={() => setSelectedCategory("all")}
        className={`w-full rounded-lg px-3 py-2 text-left text-sm font-medium transition-all ${
          selectedCategory === "all"
            ? "bg-primary-900 text-white"
            : "text-neutral-600 hover:bg-neutral-100"
        }`}
      >
        {t.allCategories}
      </button>
      {categories.map((cat) => (
        <button
          key={cat.slug}
          onClick={() => setSelectedCategory(cat.slug)}
          className={`w-full rounded-lg px-3 py-2 text-left text-sm font-medium transition-all ${
            selectedCategory === cat.slug
              ? "bg-primary-900 text-white"
              : "text-neutral-600 hover:bg-neutral-100"
          }`}
        >
          {getCategoryName(cat)}
        </button>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-primary-900">{t.title}</h2>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t.search}
            className="w-full rounded-lg border border-neutral-200 py-2.5 pl-10 pr-4 text-sm outline-none transition-colors focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 rounded-lg border border-neutral-200 px-4 py-2.5 text-sm font-medium text-neutral-600 transition-all hover:bg-neutral-50 lg:hidden"
        >
          <Filter size={16} />
          {t.filters}
        </button>
      </div>

      {showFilters && (
        <div className="rounded-xl border border-neutral-200 bg-white p-4 lg:hidden">
          {categoryList}
        </div>
      )}

      <div className="flex gap-6">
        <aside className="hidden w-56 shrink-0 lg:block">
          <div className="sticky top-24 rounded-xl border border-neutral-200 bg-white p-4">
            <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-neutral-400">
              {t.category}
            </h3>
            {categoryList}
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          {filtered.length === 0 ? (
            <div className="rounded-xl border border-neutral-200 bg-white py-16 text-center">
              <Package size={48} className="mx-auto mb-4 text-neutral-300" />
              <p className="text-neutral-500">{t.noProducts}</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((product) => (
                <div
                  key={product.id}
                  className="group flex flex-col rounded-xl border border-neutral-200 bg-white transition-all hover:shadow-md"
                >
                  <div className="flex-1 p-5">
                    <div className="mb-3 flex items-start justify-between gap-2">
                      <h3 className="text-sm font-bold leading-snug text-primary-900">
                        {product.name}
                      </h3>
                      {product.featured && (
                        <span className="flex shrink-0 items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700 border border-amber-200">
                          <Star size={10} />
                          {t.featured}
                        </span>
                      )}
                    </div>

                    {product.short_description && (
                      <p className="mb-3 line-clamp-2 text-xs leading-relaxed text-neutral-500">
                        {product.short_description}
                      </p>
                    )}

                    <div className="space-y-1.5">
                      {product.categories && (
                        <div className="flex items-center gap-2 text-xs text-neutral-500">
                          <Tag size={12} className="shrink-0 text-neutral-400" />
                          {getCategoryName(product.categories)}
                        </div>
                      )}
                      {product.material && (
                        <div className="flex items-center gap-2 text-xs text-neutral-500">
                          <Package
                            size={12}
                            className="shrink-0 text-neutral-400"
                          />
                          <span className="text-neutral-400">
                            {t.material}:
                          </span>
                          {product.material}
                        </div>
                      )}
                      {(product.volume || product.weight) && (
                        <div className="flex items-center gap-2 text-xs text-neutral-500">
                          <Package
                            size={12}
                            className="shrink-0 text-neutral-400"
                          />
                          {product.volume && (
                            <span>
                              <span className="text-neutral-400">
                                {t.volume}:
                              </span>{" "}
                              {product.volume}
                            </span>
                          )}
                          {product.weight && (
                            <span>
                              <span className="text-neutral-400">
                                {t.weight}:
                              </span>{" "}
                              {product.weight}
                            </span>
                          )}
                        </div>
                      )}
                      {product.min_order > 0 && (
                        <div className="flex items-center gap-2 text-xs text-neutral-500">
                          <Package
                            size={12}
                            className="shrink-0 text-neutral-400"
                          />
                          <span className="text-neutral-400">
                            {t.minOrder}:
                          </span>
                          {product.min_order.toLocaleString()} {t.pieces}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="border-t border-neutral-100 p-4">
                    <Link
                      href="/teklif-al"
                      className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent-500 px-4 py-2.5 text-sm font-semibold text-primary-900 transition-all hover:bg-accent-600"
                    >
                      {t.requestQuote}
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
