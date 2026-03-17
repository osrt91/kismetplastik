"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import {
  Search,
  Plus,
  Edit3,
  Trash2,
  Star,
  Package,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Upload,
  ToggleLeft,
  ToggleRight,
  Loader2,
  AlertCircle,
  CheckSquare,
  Square,
  X,
} from "lucide-react";
import type { DbProduct, DbCategory } from "@/types/database";

const PAGE_SIZE = 20;
const SORT_OPTIONS = [
  { value: "created_at", label: "Eklenme Tarihi" },
  { value: "name", label: "Ürün Adı" },
  { value: "category_slug", label: "Kategori" },
  { value: "updated_at", label: "Güncellenme" },
];

export default function AdminProductsPage() {
  const [products, setProducts] = useState<DbProduct[]>([]);
  const [categories, setCategories] = useState<DbCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & pagination
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("created_at");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  // Selection
  const [selected, setSelected] = useState<Set<string>>(new Set());

  // UI state
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [bulkDeleting, setBulkDeleting] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadTargetRef = useRef<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const sortDropdownRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounce search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 350);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [search]);

  // Close dropdowns on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowCategoryDropdown(false);
      }
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(e.target as Node)) {
        setShowSortDropdown(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(PAGE_SIZE),
        sort: sortBy,
        dir: sortDir,
      });
      if (categoryFilter !== "all") params.set("category", categoryFilter);
      if (debouncedSearch) params.set("search", debouncedSearch);

      const res = await fetch(`/api/admin/products?${params}`);
      const json = await res.json();

      if (!res.ok || !json.success) {
        setError(json.error ?? "Veriler alınamadı");
        return;
      }

      setProducts(json.data.products ?? []);
      setCategories(json.data.categories ?? []);
      setTotal(json.pagination?.total ?? 0);
      setSelected(new Set());
    } catch {
      setError("Bağlantı hatası");
    } finally {
      setLoading(false);
    }
  }, [page, sortBy, sortDir, categoryFilter, debouncedSearch]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  // --- Selection helpers ---
  const allSelected = products.length > 0 && products.every((p) => selected.has(p.id));
  const someSelected = selected.size > 0;

  function toggleAll() {
    if (allSelected) {
      setSelected(new Set());
    } else {
      setSelected(new Set(products.map((p) => p.id)));
    }
  }

  function toggleOne(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function showActionError(msg: string) {
    setActionError(msg);
    setTimeout(() => setActionError(null), 5000);
  }

  function showActionSuccess(msg: string) {
    setActionSuccess(msg);
    setTimeout(() => setActionSuccess(null), 3000);
  }

  // --- Delete single ---
  async function deleteProduct(id: string) {
    if (!confirm("Bu ürünü silmek istediğinize emin misiniz?")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok || !json.success) {
        showActionError(json.error ?? "Silme başarısız");
        return;
      }
      showActionSuccess("Ürün başarıyla silindi.");
      await fetchProducts();
    } catch {
      showActionError("Bağlantı hatası");
    } finally {
      setDeletingId(null);
    }
  }

  // --- Bulk delete ---
  async function bulkDelete() {
    if (selected.size === 0) return;
    if (!confirm(`${selected.size} ürün silinecek. Emin misiniz?`)) return;
    setBulkDeleting(true);
    try {
      await Promise.all(
        [...selected].map((id) =>
          fetch(`/api/admin/products/${id}`, { method: "DELETE" })
        )
      );
      showActionSuccess(`${selected.size} ürün başarıyla silindi.`);
      await fetchProducts();
    } catch {
      showActionError("Toplu silme sırasında hata oluştu");
    } finally {
      setBulkDeleting(false);
    }
  }

  // --- Stock toggle ---
  async function toggleStock(product: DbProduct) {
    setTogglingId(product.id);
    try {
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ in_stock: !product.in_stock }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        showActionError(json.error ?? "Güncelleme başarısız");
        return;
      }
      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? { ...p, in_stock: !p.in_stock } : p))
      );
    } catch {
      showActionError("Bağlantı hatası");
    } finally {
      setTogglingId(null);
    }
  }

  // --- Image upload ---
  function openUpload(productId: string) {
    uploadTargetRef.current = productId;
    fileInputRef.current?.click();
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !uploadTargetRef.current) return;

    const productId = uploadTargetRef.current;
    setUploadingId(productId);
    e.target.value = "";

    try {
      const fd = new FormData();
      fd.append("file", file);

      const uploadRes = await fetch("/api/admin/products/upload", {
        method: "POST",
        body: fd,
      });
      const uploadJson = await uploadRes.json();
      if (!uploadRes.ok || !uploadJson.success) {
        showActionError(uploadJson.error ?? "Yükleme başarısız");
        return;
      }

      const updateRes = await fetch(`/api/admin/products/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image_url: uploadJson.data.url }),
      });
      const updateJson = await updateRes.json();
      if (!updateRes.ok || !updateJson.success) {
        showActionError(updateJson.error ?? "Görsel kaydedilemedi");
        return;
      }

      setProducts((prev) =>
        prev.map((p) =>
          p.id === productId ? { ...p, image_url: uploadJson.data.url } : p
        )
      );
    } catch {
      showActionError("Yükleme sırasında hata oluştu");
    } finally {
      setUploadingId(null);
      uploadTargetRef.current = null;
    }
  }

  const categoryName = (slug: string) =>
    categories.find((c) => c.slug === slug)?.name ?? slug;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Ürünler</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {loading ? "Yükleniyor..." : `${total} ürün kayıtlı`}
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

      {/* Filters row */}
      <div className="flex flex-col gap-3 sm:flex-row">
        {/* Search */}
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Ürün adı veya slug ile ara..."
            className="w-full rounded-lg border border-border bg-card py-2.5 pl-9 pr-4 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Category dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowCategoryDropdown((v) => !v)}
            className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted"
          >
            {categoryFilter === "all" ? "Kategori" : categoryName(categoryFilter)}
            <ChevronDown size={14} />
          </button>
          {showCategoryDropdown && (
            <div className="absolute right-0 top-full z-10 mt-1 w-60 rounded-lg border border-border bg-card py-1 shadow-lg">
              <button
                onClick={() => { setCategoryFilter("all"); setPage(1); setShowCategoryDropdown(false); }}
                className={`block w-full px-4 py-2 text-left text-sm ${categoryFilter === "all" ? "bg-primary/10 font-medium text-primary" : "text-muted-foreground hover:bg-muted"}`}
              >
                Tümü
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.slug}
                  onClick={() => { setCategoryFilter(cat.slug); setPage(1); setShowCategoryDropdown(false); }}
                  className={`block w-full px-4 py-2 text-left text-sm ${categoryFilter === cat.slug ? "bg-primary/10 font-medium text-primary" : "text-muted-foreground hover:bg-muted"}`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Sort dropdown */}
        <div className="relative" ref={sortDropdownRef}>
          <button
            onClick={() => setShowSortDropdown((v) => !v)}
            className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted"
          >
            {SORT_OPTIONS.find((s) => s.value === sortBy)?.label ?? "Sırala"}
            <ChevronDown size={14} />
          </button>
          {showSortDropdown && (
            <div className="absolute right-0 top-full z-10 mt-1 w-52 rounded-lg border border-border bg-card py-1 shadow-lg">
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => {
                    if (sortBy === opt.value) {
                      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
                    } else {
                      setSortBy(opt.value);
                      setSortDir("desc");
                    }
                    setPage(1);
                    setShowSortDropdown(false);
                  }}
                  className={`flex w-full items-center justify-between px-4 py-2 text-left text-sm ${sortBy === opt.value ? "bg-primary/10 font-medium text-primary" : "text-muted-foreground hover:bg-muted"}`}
                >
                  {opt.label}
                  {sortBy === opt.value && (
                    <span className="text-xs">{sortDir === "asc" ? "↑" : "↓"}</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bulk actions bar */}
      {someSelected && (
        <div className="flex items-center gap-3 rounded-lg border border-border bg-muted px-4 py-2.5 text-sm">
          <span className="font-medium text-foreground">{selected.size} ürün seçili</span>
          <button
            onClick={bulkDelete}
            disabled={bulkDeleting}
            className="ml-auto inline-flex items-center gap-1.5 rounded-lg bg-destructive px-3 py-1.5 text-xs font-semibold text-destructive-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {bulkDeleting ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
            {bulkDeleting ? "Siliniyor..." : "Seçilenleri Sil"}
          </button>
          <button
            onClick={() => setSelected(new Set())}
            className="text-muted-foreground hover:text-foreground"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          <AlertCircle size={16} />
          {error}
          <button onClick={fetchProducts} className="ml-auto underline hover:no-underline">
            Tekrar dene
          </button>
        </div>
      )}

      {/* Action error banner */}
      {actionError && (
        <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          <AlertCircle size={16} />
          {actionError}
          <button onClick={() => setActionError(null)} className="ml-auto text-destructive/60 hover:text-destructive">
            <X size={14} />
          </button>
        </div>
      )}

      {/* Action success banner */}
      {actionSuccess && (
        <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          <CheckSquare size={16} />
          {actionSuccess}
        </div>
      )}

      {/* Results count */}
      {!loading && !error && (
        <p className="text-xs text-muted-foreground">
          {total} sonuçtan {Math.min((page - 1) * PAGE_SIZE + 1, total)}–{Math.min(page * PAGE_SIZE, total)} gösteriliyor
        </p>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted">
                <th className="px-4 py-3 text-left">
                  <button onClick={toggleAll} className="flex items-center text-muted-foreground hover:text-foreground">
                    {allSelected ? <CheckSquare size={15} /> : <Square size={15} />}
                  </button>
                </th>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">
                  Ürün
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
                  Stok
                </th>
                <th className="px-4 py-3 text-right font-semibold text-muted-foreground">
                  İşlem
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-muted-foreground">
                    <Loader2 size={24} className="mx-auto mb-2 animate-spin" />
                    <p className="text-sm">Yükleniyor...</p>
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={7}>
                    <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                      <Package size={40} className="mb-3 opacity-30" />
                      <p className="text-sm font-medium">Ürün bulunamadı</p>
                      <p className="text-xs">Arama kriterlerini değiştirmeyi deneyin</p>
                    </div>
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr
                    key={product.id}
                    className={`border-b border-border transition-colors last:border-0 hover:bg-muted/40 ${selected.has(product.id) ? "bg-primary/5" : ""}`}
                  >
                    {/* Checkbox */}
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleOne(product.id)}
                        className="flex items-center text-muted-foreground hover:text-foreground"
                      >
                        {selected.has(product.id) ? (
                          <CheckSquare size={15} className="text-primary" />
                        ) : (
                          <Square size={15} />
                        )}
                      </button>
                    </td>

                    {/* Product name + image indicator */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        {/* Thumbnail or placeholder */}
                        <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded border border-border bg-muted">
                          {product.image_url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={product.image_url}
                              alt={product.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <Package size={16} className="m-auto mt-1.5 text-muted-foreground opacity-40" />
                          )}
                          {uploadingId === product.id && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                              <Loader2 size={12} className="animate-spin text-white" />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-medium text-foreground">{product.name}</span>
                            {product.featured && (
                              <Star size={11} className="fill-accent text-accent" />
                            )}
                          </div>
                          <p className="mt-0.5 font-mono text-[10px] text-muted-foreground">
                            {product.slug}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="hidden px-4 py-3 text-muted-foreground md:table-cell">
                      {categoryName(product.category_slug)}
                    </td>

                    {/* Volume */}
                    <td className="hidden px-4 py-3 text-muted-foreground lg:table-cell">
                      {product.volume ?? "-"}
                    </td>

                    {/* Material */}
                    <td className="hidden px-4 py-3 text-muted-foreground lg:table-cell">
                      {product.material}
                    </td>

                    {/* Stock toggle */}
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleStock(product)}
                        disabled={togglingId === product.id}
                        title={product.in_stock ? "Stokta — tıklayarak kapat" : "Tükendi — tıklayarak aç"}
                        className="flex items-center gap-1.5 disabled:opacity-50"
                      >
                        {togglingId === product.id ? (
                          <Loader2 size={16} className="animate-spin text-muted-foreground" />
                        ) : product.in_stock ? (
                          <ToggleRight size={20} className="text-green-500" />
                        ) : (
                          <ToggleLeft size={20} className="text-muted-foreground" />
                        )}
                        <span
                          className={`text-xs font-medium ${product.in_stock ? "text-green-600" : "text-muted-foreground"}`}
                        >
                          {product.in_stock ? "Stokta" : "Tükendi"}
                        </span>
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        {/* Upload image */}
                        <button
                          onClick={() => openUpload(product.id)}
                          disabled={uploadingId === product.id}
                          className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-blue-50 hover:text-blue-600 disabled:opacity-50"
                          title="Görsel Yükle"
                        >
                          <Upload size={15} />
                        </button>

                        {/* Edit */}
                        <Link
                          href={`/admin/products/${product.id}`}
                          className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
                          title="Düzenle"
                        >
                          <Edit3 size={15} />
                        </Link>

                        {/* Delete */}
                        <button
                          onClick={() => deleteProduct(product.id)}
                          disabled={deletingId === product.id}
                          className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive disabled:opacity-50"
                          title="Sil"
                        >
                          {deletingId === product.id ? (
                            <Loader2 size={15} className="animate-spin" />
                          ) : (
                            <Trash2 size={15} />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-wrap items-center justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1 || loading}
            className="flex h-10 items-center gap-1 rounded-lg border border-border px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted disabled:opacity-40"
          >
            <ChevronLeft size={14} />
            <span className="hidden sm:inline">Önceki</span>
          </button>

          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let p: number;
              if (totalPages <= 5) {
                p = i + 1;
              } else if (page <= 3) {
                p = i + 1;
              } else if (page >= totalPages - 2) {
                p = totalPages - 4 + i;
              } else {
                p = page - 2 + i;
              }
              return (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  disabled={loading}
                  className={`h-10 w-10 rounded-lg text-sm font-medium transition-colors ${
                    p === page
                      ? "bg-primary text-primary-foreground"
                      : "border border-border text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {p}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages || loading}
            className="flex h-10 items-center gap-1 rounded-lg border border-border px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted disabled:opacity-40"
          >
            <span className="hidden sm:inline">Sonraki</span>
            <ChevronRight size={14} />
          </button>
        </div>
      )}

      {/* Hidden file input for image upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
