"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Search,
  TestTube,
  ChevronDown,
  ChevronUp,
  Trash2,
  Save,
  X,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
} from "lucide-react";
import type { DbSampleRequest, SampleRequestStatus } from "@/types/database";

// ─── Constants ────────────────────────────────────────────────────────────────

const STATUS_LABELS: Record<SampleRequestStatus, string> = {
  pending: "Beklemede",
  reviewing: "İnceleniyor",
  approved: "Onaylandı",
  shipped: "Gönderildi",
  rejected: "Reddedildi",
};

const STATUS_COLORS: Record<SampleRequestStatus, string> = {
  pending: "bg-amber-500/10 text-amber-600",
  reviewing: "bg-blue-500/10 text-blue-600",
  approved: "bg-emerald-500/10 text-emerald-600",
  shipped: "bg-indigo-500/10 text-indigo-600",
  rejected: "bg-destructive/10 text-destructive",
};

const ALL_STATUSES: Array<{ value: string; label: string }> = [
  { value: "", label: "Tümü" },
  { value: "pending", label: "Beklemede" },
  { value: "reviewing", label: "İnceleniyor" },
  { value: "approved", label: "Onaylandı" },
  { value: "shipped", label: "Gönderildi" },
  { value: "rejected", label: "Reddedildi" },
];

// ─── Types ────────────────────────────────────────────────────────────────────

interface Pagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

interface FetchState {
  samples: DbSampleRequest[];
  pagination: Pagination;
  loading: boolean;
  error: string | null;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function AdminSamplesPage() {
  // Filter & pagination state
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);

  // Data state
  const [state, setState] = useState<FetchState>({
    samples: [],
    pagination: { page: 1, pageSize: 15, total: 0, totalPages: 0 },
    loading: true,
    error: null,
  });

  // Expanded row state
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Edit state (per-row edits kept in a map so multiple rows can be "dirty")
  const [editMap, setEditMap] = useState<
    Record<string, { status: SampleRequestStatus; admin_notes: string }>
  >({});
  const [savingId, setSavingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [rowError, setRowError] = useState<Record<string, string>>({});

  // ─── Fetch ──────────────────────────────────────────────────────────────────

  const fetchSamples = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    const params = new URLSearchParams();
    params.set("page", String(page));
    if (search) params.set("search", search);
    if (statusFilter) params.set("status", statusFilter);

    try {
      const res = await fetch(`/api/admin/samples?${params.toString()}`);
      const json = await res.json();

      if (!json.success) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error: json.error ?? "Veriler yüklenemedi",
        }));
        return;
      }

      setState({
        samples: json.data.samples,
        pagination: json.pagination,
        loading: false,
        error: null,
      });
    } catch {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: "Sunucuya bağlanılamadı",
      }));
    }
  }, [page, search, statusFilter]);

  // Debounced search: reset page on filter/search change, then fetch
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [search, statusFilter]);

  useEffect(() => {
    fetchSamples();
  }, [fetchSamples]);

  // ─── Helpers ────────────────────────────────────────────────────────────────

  function getEdit(sample: DbSampleRequest) {
    return (
      editMap[sample.id] ?? {
        status: sample.status,
        admin_notes: sample.admin_notes ?? "",
      }
    );
  }

  function setEdit(
    id: string,
    patch: Partial<{ status: SampleRequestStatus; admin_notes: string }>
  ) {
    setEditMap((prev) => ({
      ...prev,
      [id]: { ...getEdit({ id } as DbSampleRequest), ...prev[id], ...patch },
    }));
  }

  function isDirty(sample: DbSampleRequest) {
    if (!editMap[sample.id]) return false;
    const edit = editMap[sample.id];
    return (
      edit.status !== sample.status ||
      edit.admin_notes !== (sample.admin_notes ?? "")
    );
  }

  function toggleExpand(id: string) {
    setExpandedId((prev) => (prev === id ? null : id));
  }

  // ─── Actions ────────────────────────────────────────────────────────────────

  async function handleSave(sample: DbSampleRequest) {
    const edit = getEdit(sample);
    setSavingId(sample.id);
    setRowError((prev) => ({ ...prev, [sample.id]: "" }));

    try {
      const res = await fetch(`/api/admin/samples/${sample.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: edit.status,
          admin_notes: edit.admin_notes,
        }),
      });
      const json = await res.json();

      if (!json.success) {
        setRowError((prev) => ({
          ...prev,
          [sample.id]: json.error ?? "Kayıt başarısız",
        }));
        return;
      }

      // Update local data with saved values
      setState((prev) => ({
        ...prev,
        samples: prev.samples.map((s) =>
          s.id === sample.id ? { ...s, ...json.data } : s
        ),
      }));
      // Clear dirty state
      setEditMap((prev) => {
        const next = { ...prev };
        delete next[sample.id];
        return next;
      });
    } catch {
      setRowError((prev) => ({
        ...prev,
        [sample.id]: "Sunucuya bağlanılamadı",
      }));
    } finally {
      setSavingId(null);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Bu numune talebini silmek istediğinize emin misiniz?")) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/samples/${id}`, { method: "DELETE" });
      const json = await res.json();

      if (!json.success) {
        alert(json.error ?? "Silme işlemi başarısız");
        return;
      }

      setState((prev) => ({
        ...prev,
        samples: prev.samples.filter((s) => s.id !== id),
        pagination: {
          ...prev.pagination,
          total: prev.pagination.total - 1,
        },
      }));

      if (expandedId === id) setExpandedId(null);
    } catch {
      alert("Sunucuya bağlanılamadı");
    } finally {
      setDeletingId(null);
    }
  }

  // ─── Render ─────────────────────────────────────────────────────────────────

  const { samples, pagination, loading, error } = state;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Numune Talepleri
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {loading ? "Yükleniyor…" : `${pagination.total} talep kayıtlı`}
          </p>
        </div>
      </div>

      {/* Filters */}
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
            placeholder="Firma veya kişi adı ile ara…"
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

        {/* Status filter */}
        <div className="flex gap-1.5 flex-wrap">
          {ALL_STATUSES.map((s) => (
            <button
              key={s.value}
              onClick={() => setStatusFilter(s.value)}
              className={`rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
                statusFilter === s.value
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-card text-muted-foreground hover:bg-muted"
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

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted">
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">
                  Firma
                </th>
                <th className="hidden px-4 py-3 text-left font-semibold text-muted-foreground sm:table-cell">
                  Yetkili
                </th>
                <th className="hidden px-4 py-3 text-left font-semibold text-muted-foreground md:table-cell">
                  E-posta
                </th>
                <th className="hidden px-4 py-3 text-left font-semibold text-muted-foreground lg:table-cell">
                  Telefon
                </th>
                <th className="hidden px-4 py-3 text-left font-semibold text-muted-foreground xl:table-cell">
                  Kategoriler
                </th>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">
                  Durum
                </th>
                <th className="hidden px-4 py-3 text-left font-semibold text-muted-foreground md:table-cell">
                  Tarih
                </th>
                <th className="px-4 py-3 text-right font-semibold text-muted-foreground">
                  İşlem
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center">
                    <Loader2
                      size={28}
                      className="mx-auto animate-spin text-muted-foreground"
                    />
                  </td>
                </tr>
              ) : samples.length === 0 ? (
                <tr>
                  <td colSpan={8}>
                    <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                      <TestTube size={40} className="mb-3 opacity-30" />
                      <p className="text-sm font-medium">Talep bulunamadı</p>
                      <p className="text-xs">
                        Arama kriterlerini değiştirmeyi deneyin
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                samples.map((sample) => {
                  const isExpanded = expandedId === sample.id;
                  const edit = getEdit(sample);
                  const dirty = isDirty(sample);
                  const saving = savingId === sample.id;
                  const deleting = deletingId === sample.id;
                  const err = rowError[sample.id];

                  return (
                    <>
                      {/* Main row */}
                      <tr
                        key={sample.id}
                        className={`border-b border-border transition-colors last:border-0 hover:bg-muted/50 ${
                          isExpanded ? "bg-muted/30" : ""
                        }`}
                      >
                        {/* Firma */}
                        <td className="px-4 py-3">
                          <button
                            onClick={() => toggleExpand(sample.id)}
                            className="flex items-center gap-2 text-left font-medium text-foreground hover:text-primary"
                          >
                            {isExpanded ? (
                              <ChevronUp size={14} className="shrink-0 text-muted-foreground" />
                            ) : (
                              <ChevronDown size={14} className="shrink-0 text-muted-foreground" />
                            )}
                            {sample.company_name}
                          </button>
                        </td>

                        {/* Yetkili */}
                        <td className="hidden px-4 py-3 text-muted-foreground sm:table-cell">
                          {sample.contact_name}
                        </td>

                        {/* E-posta */}
                        <td className="hidden px-4 py-3 md:table-cell">
                          <a
                            href={`mailto:${sample.email}`}
                            className="text-primary hover:underline"
                          >
                            {sample.email}
                          </a>
                        </td>

                        {/* Telefon */}
                        <td className="hidden px-4 py-3 text-muted-foreground lg:table-cell">
                          {sample.phone}
                        </td>

                        {/* Kategoriler */}
                        <td className="hidden px-4 py-3 xl:table-cell">
                          <div className="flex flex-wrap gap-1">
                            {sample.product_categories.slice(0, 2).map((cat) => (
                              <span
                                key={cat}
                                className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary"
                              >
                                {cat}
                              </span>
                            ))}
                            {sample.product_categories.length > 2 && (
                              <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">
                                +{sample.product_categories.length - 2}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Durum */}
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                              STATUS_COLORS[sample.status]
                            }`}
                          >
                            {STATUS_LABELS[sample.status]}
                          </span>
                        </td>

                        {/* Tarih */}
                        <td className="hidden px-4 py-3 text-xs text-muted-foreground md:table-cell">
                          {new Date(sample.created_at).toLocaleDateString(
                            "tr-TR",
                            { day: "2-digit", month: "short", year: "numeric" }
                          )}
                        </td>

                        {/* İşlem */}
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => toggleExpand(sample.id)}
                              className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
                              title={isExpanded ? "Kapat" : "Detay"}
                            >
                              {isExpanded ? (
                                <ChevronUp size={14} />
                              ) : (
                                <ChevronDown size={14} />
                              )}
                            </button>
                            <button
                              onClick={() => handleDelete(sample.id)}
                              disabled={deleting}
                              className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive disabled:opacity-50"
                              title="Sil"
                            >
                              {deleting ? (
                                <Loader2 size={14} className="animate-spin" />
                              ) : (
                                <Trash2 size={14} />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* Expanded detail row */}
                      {isExpanded && (
                        <tr
                          key={`${sample.id}-detail`}
                          className="border-b border-border bg-muted/20"
                        >
                          <td colSpan={8} className="px-4 py-5">
                            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                              {/* Contact info */}
                              <div className="space-y-3">
                                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                  İletişim Bilgileri
                                </h3>
                                <dl className="space-y-2 text-sm">
                                  <div>
                                    <dt className="text-xs text-muted-foreground">
                                      Firma
                                    </dt>
                                    <dd className="font-medium text-foreground">
                                      {sample.company_name}
                                    </dd>
                                  </div>
                                  <div>
                                    <dt className="text-xs text-muted-foreground">
                                      Yetkili
                                    </dt>
                                    <dd className="text-foreground">
                                      {sample.contact_name}
                                    </dd>
                                  </div>
                                  <div>
                                    <dt className="text-xs text-muted-foreground">
                                      E-posta
                                    </dt>
                                    <dd>
                                      <a
                                        href={`mailto:${sample.email}`}
                                        className="text-primary hover:underline"
                                      >
                                        {sample.email}
                                      </a>
                                    </dd>
                                  </div>
                                  <div>
                                    <dt className="text-xs text-muted-foreground">
                                      Telefon
                                    </dt>
                                    <dd>
                                      <a
                                        href={`tel:${sample.phone}`}
                                        className="text-primary hover:underline"
                                      >
                                        {sample.phone}
                                      </a>
                                    </dd>
                                  </div>
                                  <div>
                                    <dt className="text-xs text-muted-foreground">
                                      Tarih
                                    </dt>
                                    <dd className="text-foreground">
                                      {new Date(
                                        sample.created_at
                                      ).toLocaleString("tr-TR")}
                                    </dd>
                                  </div>
                                </dl>
                              </div>

                              {/* Products & message */}
                              <div className="space-y-3">
                                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                  Talep Detayı
                                </h3>
                                <div>
                                  <p className="mb-1.5 text-xs text-muted-foreground">
                                    Ürün Kategorileri
                                  </p>
                                  <div className="flex flex-wrap gap-1.5">
                                    {sample.product_categories.map((cat) => (
                                      <span
                                        key={cat}
                                        className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary"
                                      >
                                        {cat}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                                {sample.message && (
                                  <div>
                                    <p className="mb-1 text-xs text-muted-foreground">
                                      Mesaj
                                    </p>
                                    <p className="rounded-lg border border-border bg-card p-3 text-sm text-foreground">
                                      {sample.message}
                                    </p>
                                  </div>
                                )}
                              </div>

                              {/* Status update + admin notes */}
                              <div className="space-y-3 md:col-span-2 lg:col-span-1">
                                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                  Admin İşlemleri
                                </h3>

                                {/* Status select */}
                                <div>
                                  <label className="mb-1 block text-xs text-muted-foreground">
                                    Durum
                                  </label>
                                  <select
                                    value={edit.status}
                                    onChange={(e) =>
                                      setEdit(sample.id, {
                                        status: e.target
                                          .value as SampleRequestStatus,
                                      })
                                    }
                                    className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                                  >
                                    {(
                                      Object.keys(
                                        STATUS_LABELS
                                      ) as SampleRequestStatus[]
                                    ).map((s) => (
                                      <option key={s} value={s}>
                                        {STATUS_LABELS[s]}
                                      </option>
                                    ))}
                                  </select>
                                </div>

                                {/* Admin notes */}
                                <div>
                                  <label className="mb-1 block text-xs text-muted-foreground">
                                    Admin Notu
                                  </label>
                                  <textarea
                                    value={edit.admin_notes}
                                    onChange={(e) =>
                                      setEdit(sample.id, {
                                        admin_notes: e.target.value,
                                      })
                                    }
                                    rows={3}
                                    placeholder="İç not ekleyin…"
                                    className="w-full resize-none rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                                  />
                                </div>

                                {/* Row error */}
                                {err && (
                                  <div className="flex items-center gap-1.5 text-xs text-destructive">
                                    <AlertCircle size={13} />
                                    {err}
                                  </div>
                                )}

                                {/* Save button */}
                                <button
                                  onClick={() => handleSave(sample)}
                                  disabled={!dirty || saving}
                                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                  {saving ? (
                                    <Loader2 size={14} className="animate-spin" />
                                  ) : (
                                    <Save size={14} />
                                  )}
                                  {saving ? "Kaydediliyor…" : "Kaydet"}
                                </button>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between text-sm">
          <p className="text-muted-foreground">
            Sayfa {pagination.page} / {pagination.totalPages} &middot;{" "}
            {pagination.total} kayıt
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={pagination.page <= 1 || loading}
              className="flex items-center gap-1 rounded-lg border border-border bg-card px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ChevronLeft size={14} />
              Önceki
            </button>

            {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
              const start = Math.max(
                1,
                Math.min(
                  pagination.page - 2,
                  pagination.totalPages - 4
                )
              );
              const p = start + i;
              if (p > pagination.totalPages) return null;
              return (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  disabled={loading}
                  className={`min-w-[2rem] rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
                    p === pagination.page
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-card text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {p}
                </button>
              );
            })}

            <button
              onClick={() =>
                setPage((p) => Math.min(pagination.totalPages, p + 1))
              }
              disabled={pagination.page >= pagination.totalPages || loading}
              className="flex items-center gap-1 rounded-lg border border-border bg-card px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
            >
              Sonraki
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
