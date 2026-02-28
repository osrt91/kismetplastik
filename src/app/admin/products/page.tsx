"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  Plus,
  Filter,
  Edit3,
  Trash2,
  Star,
  Package,
  ChevronDown,
} from "lucide-react";
import { products, categories } from "@/data/products";

export default function AdminProductsPage() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [showFilter, setShowFilter] = useState(false);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchSearch =
        !search ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.id.toLowerCase().includes(search.toLowerCase());
      const matchCategory =
        categoryFilter === "all" || p.category === categoryFilter;
      return matchSearch && matchCategory;
    });
  }, [search, categoryFilter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Ürünler</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {products.length} ürün kayıtlı
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90"
        >
          <Plus size={16} />
          Yeni Ürün
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Ürün adı veya ID ile ara..."
            className="w-full rounded-lg border border-border bg-card py-2.5 pl-9 pr-4 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div className="relative">
          <button
            onClick={() => setShowFilter(!showFilter)}
            className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted"
          >
            <Filter size={14} />
            Kategori
            <ChevronDown size={14} />
          </button>
          {showFilter && (
            <div className="absolute right-0 top-full z-10 mt-1 w-56 rounded-lg border border-border bg-card py-1 shadow-lg">
              <button
                onClick={() => {
                  setCategoryFilter("all");
                  setShowFilter(false);
                }}
                className={`block w-full px-4 py-2 text-left text-sm ${
                  categoryFilter === "all"
                    ? "bg-primary/10 font-medium text-primary"
                    : "text-muted-foreground hover:bg-muted"
                }`}
              >
                Tümü
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.slug}
                  onClick={() => {
                    setCategoryFilter(cat.slug);
                    setShowFilter(false);
                  }}
                  className={`block w-full px-4 py-2 text-left text-sm ${
                    categoryFilter === cat.slug
                      ? "bg-primary/10 font-medium text-primary"
                      : "text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {cat.name} ({products.filter((p) => p.category === cat.slug).length})
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Results count */}
      <p className="text-xs text-muted-foreground">
        {filtered.length} sonuç gösteriliyor
      </p>

      {/* Products Table */}
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted">
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">
                  ID
                </th>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">
                  Ürün Adı
                </th>
                <th className="hidden px-4 py-3 text-left font-semibold text-muted-foreground md:table-cell">
                  Kategori
                </th>
                <th className="hidden px-4 py-3 text-left font-semibold text-muted-foreground lg:table-cell">
                  Hacim
                </th>
                <th className="hidden px-4 py-3 text-left font-semibold text-muted-foreground lg:table-cell">
                  Malzeme
                </th>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">
                  Durum
                </th>
                <th className="px-4 py-3 text-right font-semibold text-muted-foreground">
                  İşlem
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((product) => (
                <tr
                  key={product.id}
                  className="border-b border-border transition-colors last:border-0 hover:bg-muted/50"
                >
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                    {product.id}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground">
                        {product.name}
                      </span>
                      {product.featured && (
                        <Star
                          size={12}
                          className="fill-accent text-accent"
                        />
                      )}
                    </div>
                  </td>
                  <td className="hidden px-4 py-3 text-muted-foreground md:table-cell">
                    {categories.find((c) => c.slug === product.category)?.name}
                  </td>
                  <td className="hidden px-4 py-3 text-muted-foreground lg:table-cell">
                    {product.volume || "-"}
                  </td>
                  <td className="hidden px-4 py-3 text-muted-foreground lg:table-cell">
                    {product.material}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                        product.inStock
                          ? "bg-success/10 text-success"
                          : "bg-destructive/10 text-destructive"
                      }`}
                    >
                      {product.inStock ? "Stokta" : "Tükendi"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/admin/products/${product.id}`}
                        className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
                        title="Düzenle"
                      >
                        <Edit3 size={14} />
                      </Link>
                      <button
                        className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                        title="Sil"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <Package size={40} className="mb-3 opacity-30" />
            <p className="text-sm font-medium">Ürün bulunamadı</p>
            <p className="text-xs">Arama kriterlerini değiştirmeyi deneyin</p>
          </div>
        )}
      </div>
    </div>
  );
}
