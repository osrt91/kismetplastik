"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import {
  Plus,
  Trash2,
  Edit3,
  Building,
  Globe,
  ChevronUp,
  ChevronDown,
  X,
  Upload,
  Loader2,
  ToggleLeft,
  ToggleRight,
  AlertCircle,
} from "lucide-react";
import type { DbReference } from "@/types/database";

// ─── helpers ────────────────────────────────────────────────────────────────

function Badge({ active }: { active: boolean }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
        active ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"
      }`}
    >
      {active ? "Aktif" : "Pasif"}
    </span>
  );
}

// ─── form modal ─────────────────────────────────────────────────────────────

interface FormData {
  name: string;
  website: string;
  sector_tr: string;
  sector_en: string;
  display_order: string;
}

const EMPTY_FORM: FormData = {
  name: "",
  website: "",
  sector_tr: "",
  sector_en: "",
  display_order: "0",
};

interface ReferenceModalProps {
  initial?: DbReference | null;
  onClose: () => void;
  onSaved: (ref: DbReference) => void;
}

function ReferenceModal({ initial, onClose, onSaved }: ReferenceModalProps) {
  const isEdit = Boolean(initial);
  const [form, setForm] = useState<FormData>(
    initial
      ? {
          name: initial.name,
          website: initial.website ?? "",
          sector_tr: initial.sector_tr,
          sector_en: initial.sector_en,
          display_order: String(initial.display_order),
        }
      : EMPTY_FORM
  );
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>(initial?.logo_url ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setLogoFile(file);
    if (file) {
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isEdit && !logoFile) {
      setError("Logo görseli zorunludur.");
      return;
    }

    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("name", form.name.trim());
      fd.append("website", form.website.trim());
      fd.append("sector_tr", form.sector_tr.trim());
      fd.append("sector_en", form.sector_en.trim());
      fd.append("display_order", form.display_order);
      if (logoFile) fd.append("logo", logoFile);

      const url = isEdit
        ? `/api/admin/references/${initial!.id}`
        : "/api/admin/references";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, { method, body: fd });
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

  const field = (
    key: keyof FormData,
    label: string,
    opts?: { placeholder?: string; type?: string; required?: boolean }
  ) => (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
        {label}
        {opts?.required && <span className="ml-0.5 text-destructive">*</span>}
      </label>
      <input
        type={opts?.type ?? "text"}
        value={form[key]}
        onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
        placeholder={opts?.placeholder}
        required={opts?.required}
        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
      />
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-2xl border border-border bg-card shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="text-base font-semibold text-foreground">
            {isEdit ? "Referansı Düzenle" : "Yeni Referans Ekle"}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          {error && (
            <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2.5 text-sm text-destructive">
              <AlertCircle size={15} className="shrink-0" />
              {error}
            </div>
          )}

          {field("name", "Referans Adı", { placeholder: "Örn: Aygaz A.Ş.", required: true })}

          {/* Logo upload */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
              Logo Görseli
              {!isEdit && <span className="ml-0.5 text-destructive">*</span>}
            </label>
            <div className="flex items-center gap-3">
              {logoPreview && (
                <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-lg border border-border bg-muted">
                  <Image
                    src={logoPreview}
                    alt="Logo önizleme"
                    fill
                    className="object-contain p-1"
                    unoptimized
                  />
                </div>
              )}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 rounded-lg border border-dashed border-border bg-muted/50 px-4 py-2.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/50 hover:bg-primary/5 hover:text-primary"
              >
                <Upload size={14} />
                {logoPreview ? "Logoyu Değiştir" : "Logo Yükle"}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/svg+xml,image/gif"
                onChange={handleFileChange}
                className="hidden"
              />
              <span className="text-[11px] text-muted-foreground">JPEG, PNG, WebP, SVG · max 5MB</span>
            </div>
          </div>

          {field("website", "Web Sitesi", { placeholder: "https://firma.com", type: "url" })}

          <div className="grid grid-cols-2 gap-3">
            {field("sector_tr", "Sektör (TR)", { placeholder: "Kozmetik", required: true })}
            {field("sector_en", "Sektör (EN)", { placeholder: "Cosmetics", required: true })}
          </div>

          {field("display_order", "Sıra", { type: "number", placeholder: "0" })}

          {/* Footer */}
          <div className="flex items-center justify-end gap-2 border-t border-border pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-60"
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

interface DeleteConfirmProps {
  name: string;
  onCancel: () => void;
  onConfirm: () => void;
  deleting: boolean;
}

function DeleteConfirm({ name, onCancel, onConfirm, deleting }: DeleteConfirmProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-xl">
        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
          <Trash2 size={18} className="text-destructive" />
        </div>
        <h3 className="mb-1.5 text-base font-semibold text-foreground">Referansı Sil</h3>
        <p className="mb-5 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{name}</span> referansını silmek istediğinize
          emin misiniz? Bu işlem geri alınamaz ve logosu da depodan kaldırılacaktır.
        </p>
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={onCancel}
            disabled={deleting}
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted disabled:opacity-60"
          >
            İptal
          </button>
          <button
            onClick={onConfirm}
            disabled={deleting}
            className="inline-flex items-center gap-2 rounded-lg bg-destructive px-4 py-2 text-sm font-semibold text-destructive-foreground transition-all hover:bg-destructive/90 disabled:opacity-60"
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

export default function AdminReferencesPage() {
  const [references, setReferences] = useState<DbReference[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<DbReference | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<DbReference | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [reorderingId, setReorderingId] = useState<string | null>(null);

  // ── fetch ──────────────────────────────────────────────────────────────────

  const fetchReferences = useCallback(async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const res = await fetch("/api/admin/references");
      const json = await res.json();
      if (json.success) {
        setReferences(json.data);
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
    fetchReferences();
  }, [fetchReferences]);

  // ── handlers ───────────────────────────────────────────────────────────────

  const handleSaved = (saved: DbReference) => {
    setReferences((prev) => {
      const idx = prev.findIndex((r) => r.id === saved.id);
      if (idx !== -1) {
        const next = [...prev];
        next[idx] = saved;
        return next;
      }
      return [...prev, saved].sort((a, b) => a.display_order - b.display_order);
    });
    setModalOpen(false);
    setEditTarget(null);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/references/${deleteTarget.id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        setReferences((prev) => prev.filter((r) => r.id !== deleteTarget.id));
        setDeleteTarget(null);
      } else {
        alert(json.error ?? "Silme başarısız.");
      }
    } catch {
      alert("Sunucuya bağlanılamadı.");
    } finally {
      setDeleting(false);
    }
  };

  const handleToggleActive = async (ref: DbReference) => {
    setTogglingId(ref.id);
    try {
      const res = await fetch(`/api/admin/references/${ref.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !ref.is_active }),
      });
      const json = await res.json();
      if (json.success) {
        setReferences((prev) => prev.map((r) => (r.id === ref.id ? json.data : r)));
      } else {
        alert(json.error ?? "Güncelleme başarısız.");
      }
    } catch {
      alert("Sunucuya bağlanılamadı.");
    } finally {
      setTogglingId(null);
    }
  };

  const handleReorder = async (ref: DbReference, direction: "up" | "down") => {
    const sorted = [...references].sort((a, b) => a.display_order - b.display_order);
    const idx = sorted.findIndex((r) => r.id === ref.id);
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= sorted.length) return;

    const swap = sorted[swapIdx];
    setReorderingId(ref.id);

    try {
      const [res1, res2] = await Promise.all([
        fetch(`/api/admin/references/${ref.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ display_order: swap.display_order }),
        }),
        fetch(`/api/admin/references/${swap.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ display_order: ref.display_order }),
        }),
      ]);

      const [j1, j2] = await Promise.all([res1.json(), res2.json()]);

      if (j1.success && j2.success) {
        setReferences((prev) =>
          prev.map((r) => {
            if (r.id === ref.id) return j1.data;
            if (r.id === swap.id) return j2.data;
            return r;
          })
        );
      } else {
        alert("Sıralama güncellenemedi.");
      }
    } catch {
      alert("Sunucuya bağlanılamadı.");
    } finally {
      setReorderingId(null);
    }
  };

  // ── derived ────────────────────────────────────────────────────────────────

  const sorted = [...references].sort((a, b) => a.display_order - b.display_order);
  const activeCount = references.filter((r) => r.is_active).length;

  // ── render ─────────────────────────────────────────────────────────────────

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Referanslar</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {references.length} referans kayıtlı · {activeCount} aktif
            </p>
          </div>
          <button
            onClick={() => {
              setEditTarget(null);
              setModalOpen(true);
            }}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90"
          >
            <Plus size={16} />
            Yeni Referans
          </button>
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
              onClick={fetchReferences}
              className="mt-3 rounded-lg border border-border px-4 py-2 text-xs hover:bg-muted"
            >
              Tekrar Dene
            </button>
          </div>
        ) : sorted.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <Building size={44} className="mb-3 opacity-20" />
            <p className="text-sm font-medium">Henüz referans eklenmemiş</p>
            <button
              onClick={() => {
                setEditTarget(null);
                setModalOpen(true);
              }}
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
            >
              <Plus size={14} />
              İlk Referansı Ekle
            </button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {sorted.map((ref, idx) => {
              const isFirst = idx === 0;
              const isLast = idx === sorted.length - 1;
              const isReordering = reorderingId === ref.id;
              const isToggling = togglingId === ref.id;

              return (
                <div
                  key={ref.id}
                  className={`group flex flex-col rounded-xl border bg-card shadow-sm transition-all hover:shadow-md ${
                    ref.is_active ? "border-border" : "border-dashed border-border opacity-60"
                  }`}
                >
                  {/* Logo area */}
                  <div className="flex h-28 items-center justify-center rounded-t-xl bg-muted/40 p-4">
                    {ref.logo_url ? (
                      <Image
                        src={ref.logo_url}
                        alt={ref.name}
                        width={120}
                        height={72}
                        className="max-h-full max-w-full object-contain"
                        unoptimized
                      />
                    ) : (
                      <Building size={36} className="text-muted-foreground/30" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex flex-1 flex-col gap-2 p-4">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-sm font-semibold text-foreground leading-tight line-clamp-2">
                        {ref.name}
                      </h3>
                      <Badge active={ref.is_active} />
                    </div>

                    <p className="text-xs text-muted-foreground">{ref.sector_tr}</p>

                    {ref.website && (
                      <a
                        href={ref.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                      >
                        <Globe size={11} />
                        {ref.website.replace(/^https?:\/\/(www\.)?/, "")}
                      </a>
                    )}

                    <p className="text-[11px] text-muted-foreground/60">
                      Sıra: {ref.display_order}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 border-t border-border p-3">
                    {/* Reorder */}
                    <button
                      onClick={() => handleReorder(ref, "up")}
                      disabled={isFirst || isReordering}
                      title="Yukarı taşı"
                      className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      {isReordering ? (
                        <Loader2 size={13} className="animate-spin" />
                      ) : (
                        <ChevronUp size={13} />
                      )}
                    </button>
                    <button
                      onClick={() => handleReorder(ref, "down")}
                      disabled={isLast || isReordering}
                      title="Aşağı taşı"
                      className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      <ChevronDown size={13} />
                    </button>

                    {/* Toggle active */}
                    <button
                      onClick={() => handleToggleActive(ref)}
                      disabled={isToggling}
                      title={ref.is_active ? "Pasife al" : "Aktife al"}
                      className="ml-auto rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted disabled:opacity-50"
                    >
                      {isToggling ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : ref.is_active ? (
                        <ToggleRight size={16} className="text-success" />
                      ) : (
                        <ToggleLeft size={16} />
                      )}
                    </button>

                    {/* Edit */}
                    <button
                      onClick={() => {
                        setEditTarget(ref);
                        setModalOpen(true);
                      }}
                      title="Düzenle"
                      className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
                    >
                      <Edit3 size={14} />
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => setDeleteTarget(ref)}
                      title="Sil"
                      className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add / Edit modal */}
      {modalOpen && (
        <ReferenceModal
          initial={editTarget}
          onClose={() => {
            setModalOpen(false);
            setEditTarget(null);
          }}
          onSaved={handleSaved}
        />
      )}

      {/* Delete confirm */}
      {deleteTarget && (
        <DeleteConfirm
          name={deleteTarget.name}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
          deleting={deleting}
        />
      )}
    </>
  );
}
