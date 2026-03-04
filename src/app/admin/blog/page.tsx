"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Search,
  Plus,
  Edit3,
  Trash2,
  Calendar,
  Clock,
  Star,
  Newspaper,
  ChevronLeft,
  ChevronRight,
  Filter,
  Loader2,
} from "lucide-react";
import type { DbBlogPost } from "@/types/database";

const CATEGORIES = ["Üretim", "Sektör", "Bilgi", "Kalite", "Sürdürülebilirlik", "Rehber", "Kurumsal"];

interface Pagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<DbBlogPost[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    pageSize: 12,
    total: 0,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [deletingSlug, setDeletingSlug] = useState<string | null>(null);
  const [togglingSlug, setTogglingSlug] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = useCallback(
    async (page = 1) => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({ page: String(page) });
        if (search) params.set("search", search);
        if (categoryFilter) params.set("category", categoryFilter);
        if (statusFilter) params.set("status", statusFilter);

        const res = await fetch(`/api/admin/blog?${params}`);
        const json = await res.json();

        if (!res.ok || !json.success) {
          setError(json.error ?? "Yazılar yüklenemedi");
          return;
        }

        setPosts(json.data.posts ?? []);
        setPagination(json.pagination ?? { page: 1, pageSize: 12, total: 0, totalPages: 1 });
      } catch {
        setError("Bağlantı hatası");
      } finally {
        setLoading(false);
      }
    },
    [search, categoryFilter, statusFilter]
  );

  useEffect(() => {
    fetchPosts(1);
  }, [fetchPosts]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
  };

  const handleDelete = async (slug: string, title: string) => {
    if (!confirm(`"${title}" başlıklı yazıyı silmek istediğinizden emin misiniz?`)) return;
    setDeletingSlug(slug);
    try {
      const res = await fetch(`/api/admin/blog/${slug}`, { method: "DELETE" });
      const json = await res.json();
      if (res.ok && json.success) {
        await fetchPosts(pagination.page);
      } else {
        alert(json.error ?? "Silme işlemi başarısız");
      }
    } catch {
      alert("Bağlantı hatası");
    } finally {
      setDeletingSlug(null);
    }
  };

  const handleToggleFeatured = async (post: DbBlogPost) => {
    setTogglingSlug(post.slug);
    try {
      const res = await fetch(`/api/admin/blog/${post.slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featured: !post.featured }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setPosts((prev) =>
          prev.map((p) => (p.slug === post.slug ? { ...p, featured: !p.featured } : p))
        );
      } else {
        alert(json.error ?? "Güncelleme başarısız");
      }
    } catch {
      alert("Bağlantı hatası");
    } finally {
      setTogglingSlug(null);
    }
  };

  const handleToggleStatus = async (post: DbBlogPost) => {
    const newStatus = post.status === "published" ? "draft" : "published";
    setTogglingSlug(post.slug);
    try {
      const res = await fetch(`/api/admin/blog/${post.slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setPosts((prev) =>
          prev.map((p) => (p.slug === post.slug ? { ...p, status: newStatus } : p))
        );
      } else {
        alert(json.error ?? "Güncelleme başarısız");
      }
    } catch {
      alert("Bağlantı hatası");
    } finally {
      setTogglingSlug(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Blog Yazıları</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {loading ? "Yükleniyor..." : `${pagination.total} yazı kayıtlı`}
          </p>
        </div>
        <Link
          href="/admin/blog/new"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90"
        >
          <Plus size={16} />
          Yeni Yazı
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <form onSubmit={handleSearch} className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Başlık veya özet ile ara..."
            className="w-full rounded-lg border border-border bg-card py-2.5 pl-9 pr-20 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
          >
            Ara
          </button>
        </form>

        {/* Category filter */}
        <div className="relative">
          <button
            onClick={() => {
              setShowCategoryMenu(!showCategoryMenu);
              setShowStatusMenu(false);
            }}
            className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted"
          >
            <Filter size={14} />
            {categoryFilter || "Kategori"}
          </button>
          {showCategoryMenu && (
            <div className="absolute right-0 top-full z-20 mt-1 w-52 rounded-lg border border-border bg-card py-1 shadow-lg">
              <button
                onClick={() => {
                  setCategoryFilter("");
                  setShowCategoryMenu(false);
                }}
                className={`block w-full px-4 py-2 text-left text-sm ${
                  !categoryFilter
                    ? "bg-primary/10 font-medium text-primary"
                    : "text-muted-foreground hover:bg-muted"
                }`}
              >
                Tümü
              </button>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setCategoryFilter(cat);
                    setShowCategoryMenu(false);
                  }}
                  className={`block w-full px-4 py-2 text-left text-sm ${
                    categoryFilter === cat
                      ? "bg-primary/10 font-medium text-primary"
                      : "text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Status filter */}
        <div className="relative">
          <button
            onClick={() => {
              setShowStatusMenu(!showStatusMenu);
              setShowCategoryMenu(false);
            }}
            className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted"
          >
            {statusFilter === "published"
              ? "Yayında"
              : statusFilter === "draft"
              ? "Taslak"
              : "Durum"}
          </button>
          {showStatusMenu && (
            <div className="absolute right-0 top-full z-20 mt-1 w-40 rounded-lg border border-border bg-card py-1 shadow-lg">
              {[
                { value: "", label: "Tümü" },
                { value: "published", label: "Yayında" },
                { value: "draft", label: "Taslak" },
              ].map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => {
                    setStatusFilter(value);
                    setShowStatusMenu(false);
                  }}
                  className={`block w-full px-4 py-2 text-left text-sm ${
                    statusFilter === value
                      ? "bg-primary/10 font-medium text-primary"
                      : "text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Active filter tags */}
      {(categoryFilter || statusFilter || search) && (
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-muted-foreground">Filtreler:</span>
          {search && (
            <span className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-primary">
              {search}
              <button onClick={() => { setSearch(""); setSearchInput(""); }} className="ml-1 opacity-60 hover:opacity-100">×</button>
            </span>
          )}
          {categoryFilter && (
            <span className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-primary">
              {categoryFilter}
              <button onClick={() => setCategoryFilter("")} className="ml-1 opacity-60 hover:opacity-100">×</button>
            </span>
          )}
          {statusFilter && (
            <span className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-primary">
              {statusFilter === "published" ? "Yayında" : "Taslak"}
              <button onClick={() => setStatusFilter("")} className="ml-1 opacity-60 hover:opacity-100">×</button>
            </span>
          )}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-52 animate-pulse rounded-xl border border-border bg-muted" />
          ))}
        </div>
      )}

      {/* Blog Cards */}
      {!loading && posts.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <div
              key={post.slug}
              className="group flex flex-col rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:shadow-md"
            >
              {/* Card Header */}
              <div className="mb-3 flex items-center justify-between gap-2">
                <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary truncate max-w-[140px]">
                  {post.category}
                </span>
                <div className="flex items-center gap-1.5">
                  {/* Status badge */}
                  <button
                    onClick={() => handleToggleStatus(post)}
                    disabled={togglingSlug === post.slug}
                    title={post.status === "published" ? "Taslağa al" : "Yayınla"}
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium transition-colors ${
                      post.status === "published"
                        ? "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-amber-100 text-amber-700 hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-400"
                    }`}
                  >
                    {togglingSlug === post.slug ? (
                      <Loader2 size={10} className="animate-spin" />
                    ) : post.status === "published" ? (
                      "Yayında"
                    ) : (
                      "Taslak"
                    )}
                  </button>
                  {/* Featured star */}
                  <button
                    onClick={() => handleToggleFeatured(post)}
                    disabled={togglingSlug === post.slug}
                    title={post.featured ? "Öne çıkanı kaldır" : "Öne çıkar"}
                    className="rounded p-0.5 transition-colors hover:bg-muted"
                  >
                    <Star
                      size={14}
                      className={
                        post.featured
                          ? "fill-amber-400 text-amber-400"
                          : "text-muted-foreground"
                      }
                    />
                  </button>
                </div>
              </div>

              {/* Title */}
              <h3 className="mb-2 text-sm font-semibold text-foreground line-clamp-2 leading-snug">
                {post.title}
              </h3>

              {/* Excerpt */}
              <p className="mb-4 flex-1 text-xs text-muted-foreground line-clamp-2">
                {post.excerpt}
              </p>

              {/* Meta */}
              <div className="mb-4 flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar size={11} />
                  {new Date(post.date).toLocaleDateString("tr-TR")}
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={11} />
                  {post.read_time}
                </span>
              </div>

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="mb-3 flex flex-wrap gap-1">
                  {post.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                  {post.tags.length > 3 && (
                    <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                      +{post.tags.length - 3}
                    </span>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-2 border-t border-border pt-3">
                <Link
                  href={`/admin/blog/${post.slug}`}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-border py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <Edit3 size={12} />
                  Düzenle
                </Link>
                <button
                  onClick={() => handleDelete(post.slug, post.title)}
                  disabled={deletingSlug === post.slug}
                  className="flex items-center justify-center rounded-lg border border-border p-2 text-muted-foreground transition-colors hover:border-destructive/50 hover:bg-destructive/10 hover:text-destructive disabled:opacity-40"
                  title="Sil"
                >
                  {deletingSlug === post.slug ? (
                    <Loader2 size={12} className="animate-spin" />
                  ) : (
                    <Trash2 size={12} />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && posts.length === 0 && !error && (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <Newspaper size={44} className="mb-4 opacity-25" />
          <p className="text-sm font-medium">Yazı bulunamadı</p>
          <p className="mt-1 text-xs">
            {search || categoryFilter || statusFilter
              ? "Farklı filtreler deneyebilirsiniz"
              : "Henüz blog yazısı eklenmemiş"}
          </p>
          {!search && !categoryFilter && !statusFilter && (
            <Link
              href="/admin/blog/new"
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
            >
              <Plus size={14} />
              İlk yazıyı oluştur
            </Link>
          )}
        </div>
      )}

      {/* Pagination */}
      {!loading && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-border pt-4">
          <p className="text-xs text-muted-foreground">
            Sayfa {pagination.page} / {pagination.totalPages} &mdash; toplam {pagination.total} yazı
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchPosts(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className="rounded-lg border border-border p-2 text-muted-foreground transition-colors hover:bg-muted disabled:opacity-40"
            >
              <ChevronLeft size={14} />
            </button>
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
              .filter(
                (p) =>
                  p === 1 ||
                  p === pagination.totalPages ||
                  Math.abs(p - pagination.page) <= 1
              )
              .reduce<(number | "...")[]>((acc, p, idx, arr) => {
                if (idx > 0 && (arr[idx - 1] as number) !== p - 1) acc.push("...");
                acc.push(p);
                return acc;
              }, [])
              .map((item, idx) =>
                item === "..." ? (
                  <span key={`ellipsis-${idx}`} className="px-1 text-xs text-muted-foreground">
                    ...
                  </span>
                ) : (
                  <button
                    key={item}
                    onClick={() => fetchPosts(item as number)}
                    className={`min-w-[32px] rounded-lg border px-2 py-1 text-xs font-medium transition-colors ${
                      pagination.page === item
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    {item}
                  </button>
                )
              )}
            <button
              onClick={() => fetchPosts(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages}
              className="rounded-lg border border-border p-2 text-muted-foreground transition-colors hover:bg-muted disabled:opacity-40"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
