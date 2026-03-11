"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Plus,
  Trash2,
  Edit3,
  Link2,
  Search,
  X,
  Loader2,
  AlertCircle,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import type { DbProductCompatibility, CompatibilityType } from "@/types/database";

// ─── constants ────────────────────────────────────────────────────────────────

const CATEGORIES = [
  { value: "pet-siseler", label: "PET Şişeler" },
  { value: "plastik-siseler", label: "Plastik Şişeler" },
  { value: "kapaklar", label: "Kapaklar" },
  { value: "tipalar", label: "Tipalar" },
  { value: "parmak-spreyler", label: "Parmak Spreyler" },
  { value: "pompalar", label: "Pompalar" },
  { value: "tetikli-pusturtuculer", label: "Tetikli Püskürtücüler" },
  { value: "huniler", label: "Huniler" },
];

const COMPAT_TYPES: { value: CompatibilityType; label: string; color: string }[] = [
  { value: "fits", label: "Uyumlu", color: "bg-emerald-500/10 text-emerald-600" },
  { value: "recommended", label: "Önerilen", color: "bg-blue-500/10 text-blue-600" },
  { value: "alternative", label: "Alternatif", color: "bg-amber-500/10 text-amber-600" },
];

function getCategoryLabel(slug: string) {
  return CATEGORIES.find((c) => c.value === slug)?.label ?? slug;
}

function getCompatBadge(type: string) {
  return COMPAT_TYPES.find((t) => t.value === type) ?? COMPAT_TYPES[0];
}

// ─── form modal ─────────────────────────────────────────────────────────────

interface FormData {
  source_stock_kodu: string;
  source_category: string;
  compatible_stock_kodu: string;
  compatible_category: string;
  compatibility_type: CompatibilityType;
  notes: string;
}

const EMPTY_FORM: FormData = {
  source_stock_kodu: "",
  source_category: "pet-siseler",
  compatible_stock_kodu: "",
  compatible_category: "kapaklar",
  compatibility_type: "fits",
  notes: "",
};

interface ModalProps {
  initial?: DbProductCompatibility | null;
  onClose: () => void;
  onSaved: (item: DbProductCompatibility) => void;
}

function CompatibilityModal({ initial, onClose, onSaved }: ModalProps) {
  const isEdit = Boolean(initial);
  const [form, setForm] = useState<FormData>(
    initial
      ? {
          source_stock_kodu: initial.source_stock_kodu,
          source_category: initial.source_category,
          compatible_stock_kodu: initial.compatible_stock_kodu,
          compatible_category: initial.compatible_category,
          compatibility_type: initial.compatibility_type as CompatibilityType,
          notes: initial.notes ?? "",
        }
      : EMPTY_FORM
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);

    try {
      const url = isEdit
        ? `/api/admin/compatibility/${initial!.id}`
        : "/api/admin/compatibility";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          notes: form.notes.trim() || null,
        }),
      });
      const json = await res.json();

      if (!json.success) {
        setError(json.error ?? "Bir hata oluştu.");
        return;
      }

      onSaved(json.data);
    } catch {
      setError("Sunucuya bağlanılamadı.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-2xl border border-border bg-card shadow-xl">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="text-base font-semibold text-foreground">
            {isEdit ? "Uyumluluk Kuralını Düzenle" : "Yeni Uyumluluk Kuralı"}
          </h2>
          <button onClick={onClose} className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          {error && (
            <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2.5 text-sm text-destructive">
              <AlertCircle size={15} className="shrink-0" />
              {error}
            </div>
          )}

          {/* Source product */}
          <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Kaynak Ürün</p>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                Stok Kodu <span className="text-destructive">*</span>
              </label>
              <input
                value={form.source_stock_kodu}
                onChange={(e) => setForm((p) => ({ ...p, source_stock_kodu: e.target.value }))}
                placeholder="Örn: KP-PET-100"
                required
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Kategori</label>
              <select
                value={form.source_category}
                onChange={(e) => setForm((p) => ({ ...p, source_category: e.target.value }))}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Compatible product */}
          <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Uyumlu Ürün</p>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                Stok Kodu <span className="text-destructive">*</span>
              </label>
              <input
                value={form.compatible_stock_kodu}
                onChange={(e) => setForm((p) => ({ ...p, compatible_stock_kodu: e.target.value }))}
                placeholder="Örn: KP-KPK-28"
                required
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Kategori</label>
              <select
                value={form.compatible_category}
                onChange={(e) => setForm((p) => ({ ...p, compatible_category: e.target.value }))}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Type & Notes */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Uyumluluk Tipi</label>
              <select
                value={form.compatibility_type}
                onChange={(e) => setForm((p) => ({ ...p, compatibility_type: e.target.value as CompatibilityType }))}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              >
                {COMPAT_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Not</label>
              <input
                value={form.notes}
                onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
                placeholder="Opsiyonel açıklama"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 border-t border-border pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
            >
              {saving && <Loader2 size={14} className="animate-spin" />}
              {isEdit ? "Kaydet" : "Ekle"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── delete confirm ──────────────────────────────────────────────────────────

function DeleteConfirm({
  label,
  onCancel,
  onConfirm,
  deleting,
}: {
  label: string;
  onCancel: () => void;
  onConfirm: () => void;
  deleting: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-xl">
        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
          <Trash2 size={18} className="text-destructive" />
        </div>
        <h3 className="mb-1.5 text-base font-semibold text-foreground">Kuralı Sil</h3>
        <p className="mb-5 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{label}</span> uyumluluk kuralini silmek
          istediğinize emin misiniz?
        </p>
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={onCancel}
            disabled={deleting}
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted disabled:opacity-60"
          >
            İptal
          </button>
          <button
            onClick={onConfirm}
            disabled={deleting}
            className="inline-flex items-center gap-2 rounded-lg bg-destructive px-4 py-2 text-sm font-semibold text-destructive-foreground hover:bg-destructive/90 disabled:opacity-60"
          >
            {deleting && <Loader2 size={14} className="animate-spin" />}
            Sil
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── main page ───────────────────────────────────────────────────────────────

export default function AdminCompatibilityPage() {
  const [rules, setRules] = useState<DbProductCompatibility[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<DbProductCompatibility | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<DbProductCompatibility | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const fetchRules = useCallback(async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const res = await fetch("/api/admin/compatibility");
      const json = await res.json();
      if (json.success) {
        setRules(json.data);
      } else {
        setFetchError(json.error ?? "Yüklenemedi.");
      }
    } catch {
      setFetchError("Sunucuya bağlanılamadı.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRules();
  }, [fetchRules]);

  const handleSaved = (saved: DbProductCompatibility) => {
    setRules((prev) => {
      const idx = prev.findIndex((r) => r.id === saved.id);
      if (idx !== -1) {
        const next = [...prev];
        next[idx] = saved;
        return next;
      }
      return [saved, ...prev];
    });
    setModalOpen(false);
    setEditTarget(null);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/compatibility/${deleteTarget.id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        setRules((prev) => prev.filter((r) => r.id !== deleteTarget.id));
        setDeleteTarget(null);
      }
    } catch {
      /* ignore */
    } finally {
      setDeleting(false);
    }
  };

  const handleToggleActive = async (rule: DbProductCompatibility) => {
    setTogglingId(rule.id);
    try {
      const res = await fetch(`/api/admin/compatibility/${rule.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !rule.is_active }),
      });
      const json = await res.json();
      if (json.success) {
        setRules((prev) => prev.map((r) => (r.id === rule.id ? json.data : r)));
      }
    } catch {
      /* ignore */
    } finally {
      setTogglingId(null);
    }
  };

  // Filter
  const filtered = rules.filter((r) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      r.source_stock_kodu.toLowerCase().includes(q) ||
      r.compatible_stock_kodu.toLowerCase().includes(q) ||
      r.source_category.toLowerCase().includes(q) ||
      r.compatible_category.toLowerCase().includes(q)
    );
  });

  const activeCount = rules.filter((r) => r.is_active).length;

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Ürün Uyumluluk</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {rules.length} kural · {activeCount} aktif
            </p>
          </div>
          <button
            onClick={() => {
              setEditTarget(null);
              setModalOpen(true);
            }}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90"
          >
            <Plus size={16} />
            Yeni Kural
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Stok kodu veya kategori ile ara..."
            className="w-full rounded-lg border border-border bg-background py-2.5 pl-10 pr-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-20 text-muted-foreground">
            <Loader2 size={28} className="animate-spin" />
          </div>
        ) : fetchError ? (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <AlertCircle size={36} className="mb-3 text-destructive opacity-60" />
            <p className="text-sm font-medium text-destructive">{fetchError}</p>
            <button
              onClick={fetchRules}
              className="mt-3 rounded-lg border border-border px-4 py-2 text-xs hover:bg-muted"
            >
              Tekrar Dene
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <Link2 size={44} className="mb-3 opacity-20" />
            <p className="text-sm font-medium">
              {search ? "Aramayla eşleşen kural bulunamadı" : "Henüz uyumluluk kuralı eklenmemiş"}
            </p>
            {!search && (
              <button
                onClick={() => {
                  setEditTarget(null);
                  setModalOpen(true);
                }}
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
              >
                <Plus size={14} />
                İlk Kuralı Ekle
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Kaynak Ürün</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Kategori</th>
                  <th className="px-4 py-3 text-center font-medium text-muted-foreground">Tip</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Uyumlu Ürün</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Kategori</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Not</th>
                  <th className="px-4 py-3 text-center font-medium text-muted-foreground">Durum</th>
                  <th className="px-4 py-3 text-right font-medium text-muted-foreground">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((rule) => {
                  const badge = getCompatBadge(rule.compatibility_type);
                  const isToggling = togglingId === rule.id;

                  return (
                    <tr
                      key={rule.id}
                      className={`border-b border-border last:border-0 transition-colors hover:bg-muted/30 ${
                        !rule.is_active ? "opacity-50" : ""
                      }`}
                    >
                      <td className="px-4 py-3 font-mono text-xs font-medium">
                        {rule.source_stock_kodu}
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">
                        {getCategoryLabel(rule.source_category)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${badge.color}`}>
                          {badge.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs font-medium">
                        {rule.compatible_stock_kodu}
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">
                        {getCategoryLabel(rule.compatible_category)}
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground max-w-[200px] truncate">
                        {rule.notes ?? "—"}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => handleToggleActive(rule)}
                          disabled={isToggling}
                          className="inline-flex items-center justify-center rounded-lg p-1 text-muted-foreground hover:bg-muted disabled:opacity-50"
                        >
                          {isToggling ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : rule.is_active ? (
                            <ToggleRight size={18} className="text-emerald-500" />
                          ) : (
                            <ToggleLeft size={18} />
                          )}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => {
                              setEditTarget(rule);
                              setModalOpen(true);
                            }}
                            title="Düzenle"
                            className="rounded-lg p-1.5 text-muted-foreground hover:bg-primary/10 hover:text-primary"
                          >
                            <Edit3 size={14} />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(rule)}
                            title="Sil"
                            className="rounded-lg p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modalOpen && (
        <CompatibilityModal
          initial={editTarget}
          onClose={() => {
            setModalOpen(false);
            setEditTarget(null);
          }}
          onSaved={handleSaved}
        />
      )}

      {deleteTarget && (
        <DeleteConfirm
          label={`${deleteTarget.source_stock_kodu} → ${deleteTarget.compatible_stock_kodu}`}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
          deleting={deleting}
        />
      )}
    </>
  );
}
