"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Plus,
  Edit3,
  Trash2,
  Milestone,
  X,
  Save,
  Loader2,
  AlertTriangle,
  CalendarDays,
} from "lucide-react";
import type { DbMilestone } from "@/types/database";

// ────────────────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────────────────

interface FormState {
  year: string;
  title_tr: string;
  title_en: string;
  description_tr: string;
  description_en: string;
  icon: string;
  display_order: string;
}

const emptyForm = (): FormState => ({
  year: "",
  title_tr: "",
  title_en: "",
  description_tr: "",
  description_en: "",
  icon: "",
  display_order: "0",
});

// ────────────────────────────────────────────────────────────
// Helper: small labelled input/textarea
// ────────────────────────────────────────────────────────────

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-muted-foreground">
        {label}
        {required && <span className="ml-0.5 text-destructive">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputCls =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20";

// ────────────────────────────────────────────────────────────
// Main page
// ────────────────────────────────────────────────────────────

export default function AdminMilestonesPage() {
  const [milestones, setMilestones] = useState<DbMilestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<DbMilestone | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm());
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Delete confirm
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  // ── Fetch ──────────────────────────────────────────────
  const fetchMilestones = useCallback(async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const res = await fetch((process.env.NEXT_PUBLIC_BASE_PATH || "") + "/api/admin/milestones");
      const json = await res.json();
      if (!json.success) throw new Error(json.error ?? "Yüklenemedi");
      setMilestones(json.data ?? []);
    } catch (err) {
      setFetchError(err instanceof Error ? err.message : "Bilinmeyen hata");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMilestones();
  }, [fetchMilestones]);

  // ── Open modal helpers ─────────────────────────────────
  const openCreate = () => {
    setEditTarget(null);
    setForm(emptyForm());
    setFormError(null);
    setModalOpen(true);
  };

  const openEdit = (m: DbMilestone) => {
    setEditTarget(m);
    setForm({
      year: String(m.year),
      title_tr: m.title_tr,
      title_en: m.title_en,
      description_tr: m.description_tr,
      description_en: m.description_en,
      icon: m.icon ?? "",
      display_order: String(m.display_order),
    });
    setFormError(null);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditTarget(null);
    setFormError(null);
  };

  // ── Save (create / update) ─────────────────────────────
  const handleSave = async () => {
    setFormError(null);

    const yearNum = parseInt(form.year, 10);
    if (!form.year || isNaN(yearNum) || yearNum < 1900 || yearNum > 2100) {
      setFormError("Geçerli bir yıl giriniz (1900–2100)");
      return;
    }
    if (!form.title_tr.trim()) {
      setFormError("Başlık (TR) zorunludur");
      return;
    }
    if (!form.title_en.trim()) {
      setFormError("Başlık (EN) zorunludur");
      return;
    }
    if (!form.description_tr.trim()) {
      setFormError("Açıklama (TR) zorunludur");
      return;
    }
    if (!form.description_en.trim()) {
      setFormError("Açıklama (EN) zorunludur");
      return;
    }

    const payload = {
      year: yearNum,
      title_tr: form.title_tr.trim(),
      title_en: form.title_en.trim(),
      description_tr: form.description_tr.trim(),
      description_en: form.description_en.trim(),
      icon: form.icon.trim() || null,
      display_order: parseInt(form.display_order, 10) || 0,
    };

    setSaving(true);
    try {
      const url = editTarget
        ? `/api/admin/milestones/${editTarget.id}`
        : "/api/admin/milestones";
      const method = editTarget ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();

      if (!json.success) throw new Error(json.error ?? "Kaydedilemedi");

      await fetchMilestones();
      closeModal();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Kaydedilemedi");
    } finally {
      setSaving(false);
    }
  };

  // ── Delete ─────────────────────────────────────────────
  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/milestones/${deleteId}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error ?? "Silinemedi");
      setMilestones((prev) => prev.filter((m) => m.id !== deleteId));
    } catch (e) {
      alert(e instanceof Error ? e.message : "Silme sırasında bir hata oluştu");
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  // ── Render ──────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Tarihçe</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {milestones.length} kilometre taşı kayıtlı
          </p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90"
        >
          <Plus size={16} />
          Yeni Kilometre Taşı
        </button>
      </div>

      {/* Loading / Error */}
      {loading && (
        <div className="flex items-center justify-center py-20 text-muted-foreground">
          <Loader2 size={28} className="animate-spin" />
        </div>
      )}

      {!loading && fetchError && (
        <div className="flex items-center gap-3 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          <AlertTriangle size={16} className="shrink-0" />
          {fetchError}
        </div>
      )}

      {/* Empty state */}
      {!loading && !fetchError && milestones.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <Milestone size={40} className="mb-3 opacity-30" />
          <p className="text-sm font-medium">Henüz kilometre taşı eklenmemiş</p>
          <button
            onClick={openCreate}
            className="mt-4 text-xs text-primary underline-offset-2 hover:underline"
          >
            İlk kaydı ekle
          </button>
        </div>
      )}

      {/* Timeline list */}
      {!loading && !fetchError && milestones.length > 0 && (
        <div className="relative space-y-0">
          {/* Vertical guide line */}
          <div className="absolute left-[5.5rem] top-0 h-full w-px bg-border" aria-hidden="true" />

          {milestones.map((m, idx) => (
            <div key={m.id} className="group relative flex gap-6 pb-8 last:pb-0">
              {/* Year badge */}
              <div className="relative z-10 flex w-20 shrink-0 flex-col items-end">
                <span className="rounded-full bg-primary px-2.5 py-0.5 text-xs font-bold tabular-nums text-primary-foreground">
                  {m.year}
                </span>
                {idx < milestones.length - 1 && (
                  <span className="mt-1 text-[10px] text-muted-foreground/50">
                    #{m.display_order}
                  </span>
                )}
              </div>

              {/* Dot on the timeline */}
              <div className="absolute left-[5.25rem] top-1.5 z-10 h-2.5 w-2.5 rounded-full border-2 border-primary bg-background" />

              {/* Card */}
              <div className="flex-1 rounded-xl border border-border bg-card px-4 py-3 shadow-sm transition-shadow group-hover:shadow-md">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      {m.icon && (
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                          <CalendarDays size={13} />
                        </span>
                      )}
                      <h3 className="truncate text-sm font-semibold text-foreground">
                        {m.title_tr}
                      </h3>
                      <span className="shrink-0 text-xs text-muted-foreground/60">
                        / {m.title_en}
                      </span>
                    </div>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground line-clamp-2">
                      {m.description_tr}
                    </p>
                    {m.icon && (
                      <span className="mt-1 inline-block rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                        {m.icon}
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                    <button
                      onClick={() => openEdit(m)}
                      title="Düzenle"
                      className="flex items-center justify-center rounded-lg border border-border p-1.5 text-muted-foreground transition-colors hover:bg-muted"
                    >
                      <Edit3 size={13} />
                    </button>
                    <button
                      onClick={() => setDeleteId(m.id)}
                      title="Sil"
                      className="flex items-center justify-center rounded-lg border border-border p-1.5 text-muted-foreground transition-colors hover:border-destructive/50 hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Add / Edit Modal ─────────────────────────────── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="flex w-full max-w-lg flex-col rounded-2xl border border-border bg-card shadow-2xl">
            {/* Modal header */}
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <h2 className="text-base font-semibold text-foreground">
                {editTarget ? "Kilometre Taşını Düzenle" : "Yeni Kilometre Taşı"}
              </h2>
              <button
                onClick={closeModal}
                className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal body */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              {formError && (
                <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
                  <AlertTriangle size={13} className="shrink-0" />
                  {formError}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <Field label="Yıl" required>
                  <input
                    type="number"
                    min={1900}
                    max={2100}
                    value={form.year}
                    onChange={(e) => setForm((f) => ({ ...f, year: e.target.value }))}
                    placeholder="2025"
                    className={inputCls}
                  />
                </Field>
                <Field label="Sıra No (display_order)">
                  <input
                    type="number"
                    min={0}
                    value={form.display_order}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, display_order: e.target.value }))
                    }
                    placeholder="0"
                    className={inputCls}
                  />
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Başlık (TR)" required>
                  <input
                    type="text"
                    value={form.title_tr}
                    onChange={(e) => setForm((f) => ({ ...f, title_tr: e.target.value }))}
                    placeholder="Kuruluş"
                    className={inputCls}
                  />
                </Field>
                <Field label="Başlık (EN)" required>
                  <input
                    type="text"
                    value={form.title_en}
                    onChange={(e) => setForm((f) => ({ ...f, title_en: e.target.value }))}
                    placeholder="Foundation"
                    className={inputCls}
                  />
                </Field>
              </div>

              <Field label="Açıklama (TR)" required>
                <textarea
                  rows={3}
                  value={form.description_tr}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, description_tr: e.target.value }))
                  }
                  placeholder="Kısmet Plastik, İstanbul'da kuruldu..."
                  className={inputCls}
                />
              </Field>

              <Field label="Açıklama (EN)" required>
                <textarea
                  rows={3}
                  value={form.description_en}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, description_en: e.target.value }))
                  }
                  placeholder="Kismet Plastik was founded in Istanbul..."
                  className={inputCls}
                />
              </Field>

              <Field label="İkon (Lucide ikon adı, ör: Star, Award, Factory)">
                <input
                  type="text"
                  value={form.icon}
                  onChange={(e) => setForm((f) => ({ ...f, icon: e.target.value }))}
                  placeholder="Award"
                  className={inputCls}
                />
              </Field>
            </div>

            {/* Modal footer */}
            <div className="flex items-center justify-end gap-2 border-t border-border px-5 py-4">
              <button
                onClick={closeModal}
                disabled={saving}
                className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted disabled:opacity-50"
              >
                İptal
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-50"
              >
                {saving ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Save size={14} />
                )}
                {saving ? "Kaydediliyor..." : "Kaydet"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Confirm Dialog ─────────────────────────── */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-2xl">
            <div className="mb-4 flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-destructive/15 text-destructive">
                <Trash2 size={18} />
              </span>
              <div>
                <h3 className="text-sm font-semibold text-foreground">
                  Kilometre Taşını Sil
                </h3>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Bu işlem geri alınamaz.
                </p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setDeleteId(null)}
                disabled={deleting}
                className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted disabled:opacity-50"
              >
                İptal
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="inline-flex items-center gap-2 rounded-lg bg-destructive px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-destructive/90 disabled:opacity-50"
              >
                {deleting ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Trash2 size={14} />
                )}
                {deleting ? "Siliniyor..." : "Sil"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
