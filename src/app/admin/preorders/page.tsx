"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Search,
  ChevronDown,
  ChevronUp,
  ClipboardList,
  Loader2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Save,
  User,
  Calendar,
  Package,
  Hash,
} from "lucide-react";
import type { DbPreOrder, DbProfile, PreOrderStatus } from "@/types/database";

// ─── Types ────────────────────────────────────────────────────────────────────

interface PreOrderWithProfile extends DbPreOrder {
  profiles: Pick<DbProfile, "full_name" | "email" | "company_name"> | null;
}

interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

// ─── Constants ─────────────────────────────────────────────────────────────────

const STATUS_LABELS: Record<PreOrderStatus, string> = {
  pending: "Beklemede",
  confirmed: "Onaylandı",
  production: "Üretimde",
  ready: "Hazır",
  delivered: "Teslim",
  cancelled: "İptal",
};

const STATUS_COLORS: Record<PreOrderStatus, string> = {
  pending:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  confirmed:
    "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  production:
    "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  ready:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
  delivered:
    "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  cancelled: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

const ALL_STATUSES: Array<{ value: string; label: string }> = [
  { value: "", label: "Tümü" },
  { value: "pending", label: "Beklemede" },
  { value: "confirmed", label: "Onaylandı" },
  { value: "production", label: "Üretimde" },
  { value: "ready", label: "Hazır" },
  { value: "delivered", label: "Teslim" },
  { value: "cancelled", label: "İptal" },
];

// ─── Status Badge ──────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: PreOrderStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[status]}`}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}

// ─── Expanded Row Detail ───────────────────────────────────────────────────────

function ExpandedDetail({
  preorder,
  onUpdate,
  onDelete,
}: {
  preorder: PreOrderWithProfile;
  onUpdate: (id: string, status: PreOrderStatus, adminNotes: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}) {
  const [status, setStatus] = useState<PreOrderStatus>(preorder.status);
  const [adminNotes, setAdminNotes] = useState(preorder.admin_notes ?? "");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onUpdate(preorder.id, status, adminNotes);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Bu ön siparişi silmek istediğinizden emin misiniz?")) return;
    setDeleting(true);
    try {
      await onDelete(preorder.id);
    } finally {
      setDeleting(false);
    }
  };

  const profile = preorder.profiles;

  return (
    <div className="border-t border-border bg-muted/30 px-4 py-5 sm:px-6">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Ürün Bilgileri */}
        <div className="space-y-3">
          <h4 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <Package size={12} />
            Ürün Bilgileri
          </h4>
          <dl className="space-y-1.5 text-sm">
            <div className="flex gap-2">
              <dt className="w-24 shrink-0 text-muted-foreground">Ürün Adı</dt>
              <dd className="font-medium text-foreground">
                {preorder.product_name}
              </dd>
            </div>
            {preorder.product_id && (
              <div className="flex gap-2">
                <dt className="w-24 shrink-0 text-muted-foreground">
                  Ürün ID
                </dt>
                <dd className="font-mono text-xs text-muted-foreground">
                  {preorder.product_id}
                </dd>
              </div>
            )}
            <div className="flex gap-2">
              <dt className="w-24 shrink-0 text-muted-foreground">Miktar</dt>
              <dd className="font-medium text-foreground">
                {preorder.quantity.toLocaleString("tr-TR")} adet
              </dd>
            </div>
            {preorder.desired_date && (
              <div className="flex gap-2">
                <dt className="w-24 shrink-0 text-muted-foreground">
                  İstenen Tarih
                </dt>
                <dd className="font-medium text-foreground">
                  {new Date(preorder.desired_date).toLocaleDateString("tr-TR")}
                </dd>
              </div>
            )}
          </dl>
          {preorder.notes && (
            <div className="mt-2 rounded-lg border border-border bg-card p-3">
              <p className="mb-1 text-xs font-medium text-muted-foreground">
                Müşteri Notu
              </p>
              <p className="text-sm text-foreground">{preorder.notes}</p>
            </div>
          )}
        </div>

        {/* Müşteri Bilgileri */}
        <div className="space-y-3">
          <h4 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <User size={12} />
            Müşteri Bilgileri
          </h4>
          {profile ? (
            <dl className="space-y-1.5 text-sm">
              <div className="flex gap-2">
                <dt className="w-24 shrink-0 text-muted-foreground">Ad Soyad</dt>
                <dd className="font-medium text-foreground">
                  {profile.full_name}
                </dd>
              </div>
              <div className="flex gap-2">
                <dt className="w-24 shrink-0 text-muted-foreground">E-posta</dt>
                <dd className="break-all text-foreground">{profile.email}</dd>
              </div>
              {profile.company_name && (
                <div className="flex gap-2">
                  <dt className="w-24 shrink-0 text-muted-foreground">Firma</dt>
                  <dd className="font-medium text-foreground">
                    {profile.company_name}
                  </dd>
                </div>
              )}
            </dl>
          ) : (
            <p className="text-sm text-muted-foreground">
              Profil bilgisi bulunamadı
            </p>
          )}
          <dl className="space-y-1.5 text-sm">
            <div className="flex gap-2">
              <dt className="w-24 shrink-0 text-muted-foreground">
                Oluşturulma
              </dt>
              <dd className="text-foreground">
                {new Date(preorder.created_at).toLocaleString("tr-TR")}
              </dd>
            </div>
            <div className="flex gap-2">
              <dt className="w-24 shrink-0 text-muted-foreground">
                Güncelleme
              </dt>
              <dd className="text-foreground">
                {new Date(preorder.updated_at).toLocaleString("tr-TR")}
              </dd>
            </div>
          </dl>
        </div>

        {/* Admin İşlemleri */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Admin İşlemleri
          </h4>
          <div className="space-y-3">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                Durum Güncelle
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as PreOrderStatus)}
                className="w-full rounded-lg border border-border bg-card py-2 pl-3 pr-8 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              >
                {ALL_STATUSES.filter((s) => s.value !== "").map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                Admin Notu
              </label>
              <textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                rows={3}
                placeholder="İç notlar buraya..."
                className="w-full resize-none rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-primary py-2 text-xs font-semibold text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-60"
              >
                {saving ? (
                  <Loader2 size={12} className="animate-spin" />
                ) : (
                  <Save size={12} />
                )}
                {saved ? "Kaydedildi!" : "Kaydet"}
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex items-center justify-center rounded-lg border border-border p-2 text-muted-foreground transition-colors hover:border-destructive/50 hover:bg-destructive/10 hover:text-destructive disabled:opacity-60"
                title="Sil"
              >
                {deleting ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Trash2 size={14} />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function AdminPreOrdersPage() {
  const [preorders, setPreorders] = useState<PreOrderWithProfile[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>({
    page: 1,
    pageSize: 20,
    total: 0,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Fetch with debounced search
  const fetchPreorders = useCallback(
    async (page: number, searchVal: string, statusVal: string) => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({
          page: String(page),
          search: searchVal,
          status: statusVal,
        });
        const res = await fetch(`/api/admin/preorders?${params.toString()}`);
        const json = await res.json();
        if (!json.success) {
          setError(json.error ?? "Veri yüklenemedi");
          return;
        }
        setPreorders(json.data.preorders);
        setPagination(json.pagination);
      } catch {
        setError("Sunucu bağlantı hatası");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Initial load and when filters change
  useEffect(() => {
    fetchPreorders(1, search, statusFilter);
  }, [search, statusFilter, fetchPreorders]);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const handlePageChange = (newPage: number) => {
    fetchPreorders(newPage, search, statusFilter);
  };

  const handleUpdate = async (
    id: string,
    status: PreOrderStatus,
    adminNotes: string
  ) => {
    const res = await fetch(`/api/admin/preorders/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, admin_notes: adminNotes }),
    });
    const json = await res.json();
    if (json.success) {
      setPreorders((prev) =>
        prev.map((p) =>
          p.id === id
            ? { ...p, status: json.data.status, admin_notes: json.data.admin_notes, updated_at: json.data.updated_at }
            : p
        )
      );
    }
  };

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/admin/preorders/${id}`, {
      method: "DELETE",
    });
    const json = await res.json();
    if (json.success) {
      setPreorders((prev) => prev.filter((p) => p.id !== id));
      setPagination((prev) => ({ ...prev, total: prev.total - 1 }));
      setExpandedId(null);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-foreground">Ön Siparişler</h1>
        <p className="text-sm text-muted-foreground">
          {loading ? "Yükleniyor..." : `${pagination.total} ön sipariş`}
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Ürün adıyla ara..."
            className="w-full rounded-lg border border-border bg-card py-2.5 pl-9 pr-4 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {/* Status filter */}
        <div className="flex flex-wrap gap-2">
          {ALL_STATUSES.map((s) => (
            <button
              key={s.value}
              onClick={() => setStatusFilter(s.value)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                statusFilter === s.value
                  ? "bg-primary text-primary-foreground"
                  : "border border-border bg-card text-muted-foreground hover:bg-muted"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-14 animate-pulse rounded-xl bg-muted"
            />
          ))}
        </div>
      )}

      {/* Table */}
      {!loading && !error && (
        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
          {preorders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <ClipboardList size={40} className="mb-3 opacity-30" />
              <p className="text-sm font-medium">Ön sipariş bulunamadı</p>
            </div>
          ) : (
            <div>
              {/* Table header */}
              <div className="hidden grid-cols-[1fr_auto_auto_auto_auto_auto] gap-4 border-b border-border bg-muted/40 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground sm:grid">
                <span>Ürün / Müşteri</span>
                <span className="text-right">Miktar</span>
                <span className="text-center">İstenen Tarih</span>
                <span className="text-center">Durum</span>
                <span className="text-center">Tarih</span>
                <span className="w-6" />
              </div>

              {/* Rows */}
              {preorders.map((preorder) => {
                const isExpanded = expandedId === preorder.id;
                const profile = preorder.profiles;

                return (
                  <div key={preorder.id} className="border-b border-border last:border-0">
                    {/* Row */}
                    <button
                      onClick={() => toggleExpand(preorder.id)}
                      className="grid w-full grid-cols-[1fr_auto] gap-4 px-4 py-3.5 text-left transition-colors hover:bg-muted/30 sm:grid-cols-[1fr_auto_auto_auto_auto_auto] sm:items-center"
                    >
                      {/* Ürün & Müşteri */}
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-foreground">
                          {preorder.product_name}
                        </p>
                        <p className="mt-0.5 truncate text-xs text-muted-foreground">
                          {profile?.company_name
                            ? `${profile.full_name} — ${profile.company_name}`
                            : profile?.full_name ?? (
                                <span className="italic">Profil yok</span>
                              )}
                        </p>
                        {/* Mobile extras */}
                        <div className="mt-1.5 flex items-center gap-3 sm:hidden">
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Hash size={10} />
                            {preorder.quantity.toLocaleString("tr-TR")} adet
                          </span>
                          <StatusBadge status={preorder.status} />
                        </div>
                      </div>

                      {/* Miktar */}
                      <span className="hidden text-right text-sm text-foreground sm:block">
                        {preorder.quantity.toLocaleString("tr-TR")}
                      </span>

                      {/* İstenen Tarih */}
                      <span className="hidden text-center text-sm text-muted-foreground sm:flex sm:items-center sm:gap-1 sm:justify-center">
                        {preorder.desired_date ? (
                          <>
                            <Calendar size={12} />
                            {new Date(preorder.desired_date).toLocaleDateString(
                              "tr-TR"
                            )}
                          </>
                        ) : (
                          <span className="text-xs italic">—</span>
                        )}
                      </span>

                      {/* Durum */}
                      <span className="hidden sm:block">
                        <StatusBadge status={preorder.status} />
                      </span>

                      {/* Oluşturma tarihi */}
                      <span className="hidden text-center text-xs text-muted-foreground sm:block">
                        {new Date(preorder.created_at).toLocaleDateString(
                          "tr-TR"
                        )}
                      </span>

                      {/* Expand icon */}
                      <span className="text-muted-foreground">
                        {isExpanded ? (
                          <ChevronUp size={16} />
                        ) : (
                          <ChevronDown size={16} />
                        )}
                      </span>
                    </button>

                    {/* Expanded detail */}
                    {isExpanded && (
                      <ExpandedDetail
                        preorder={preorder}
                        onUpdate={handleUpdate}
                        onDelete={handleDelete}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Pagination */}
      {!loading && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Sayfa {pagination.page} / {pagination.totalPages} — Toplam{" "}
            {pagination.total} kayıt
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-muted disabled:opacity-40"
            >
              <ChevronLeft size={14} />
            </button>
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
              .filter(
                (p) =>
                  p === 1 ||
                  p === pagination.totalPages ||
                  Math.abs(p - pagination.page) <= 2
              )
              .reduce<Array<number | "...">>((acc, p, idx, arr) => {
                if (idx > 0 && typeof arr[idx - 1] === "number" && (arr[idx - 1] as number) + 1 < p) {
                  acc.push("...");
                }
                acc.push(p);
                return acc;
              }, [])
              .map((item, idx) =>
                item === "..." ? (
                  <span
                    key={`ellipsis-${idx}`}
                    className="px-1 text-muted-foreground"
                  >
                    …
                  </span>
                ) : (
                  <button
                    key={item}
                    onClick={() => handlePageChange(item as number)}
                    className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                      pagination.page === item
                        ? "bg-primary text-primary-foreground"
                        : "border border-border text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    {item}
                  </button>
                )
              )}
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-muted disabled:opacity-40"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
