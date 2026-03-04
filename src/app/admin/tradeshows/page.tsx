"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Plus,
  MapPin,
  Calendar,
  Edit3,
  Trash2,
  X,
  ExternalLink,
  Loader2,
  AlertCircle,
} from "lucide-react";
import type { DbTradeShow, TradeShowStatus } from "@/types/database";

// ─── Types ────────────────────────────────────────────────────────────────────

type StatusTab = "all" | TradeShowStatus;

interface FormState {
  name_tr: string;
  name_en: string;
  description_tr: string;
  description_en: string;
  location_tr: string;
  location_en: string;
  start_date: string;
  end_date: string;
  booth: string;
  website: string;
  status: TradeShowStatus | "";
  is_active: boolean;
}

const EMPTY_FORM: FormState = {
  name_tr: "",
  name_en: "",
  description_tr: "",
  description_en: "",
  location_tr: "",
  location_en: "",
  start_date: "",
  end_date: "",
  booth: "",
  website: "",
  status: "",
  is_active: true,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function computeAutoStatus(start_date: string, end_date: string): TradeShowStatus {
  if (!start_date || !end_date) return "upcoming";
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const start = new Date(start_date);
  const end = new Date(end_date);
  if (end < today) return "past";
  if (start > today) return "upcoming";
  return "active";
}

function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const STATUS_LABELS: Record<TradeShowStatus, string> = {
  upcoming: "Yaklaşan",
  active: "Aktif",
  past: "Geçmiş",
};

const STATUS_STYLES: Record<TradeShowStatus, string> = {
  upcoming: "bg-blue-500/10 text-blue-600",
  active: "bg-emerald-500/10 text-emerald-600",
  past: "bg-muted text-muted-foreground",
};

const TAB_LIST: { key: StatusTab; label: string }[] = [
  { key: "all", label: "Tümü" },
  { key: "upcoming", label: "Yaklaşan" },
  { key: "active", label: "Aktif" },
  { key: "past", label: "Geçmiş" },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function AdminTradeShowsPage() {
  const [shows, setShows] = useState<DbTradeShow[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<StatusTab>("all");

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<DbTradeShow | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Delete confirm
  const [deleteTarget, setDeleteTarget] = useState<DbTradeShow | null>(null);
  const [deleting, setDeleting] = useState(false);

  // ── Fetch ──────────────────────────────────────────────────────────────────

  const fetchShows = useCallback(async (status: StatusTab) => {
    setLoading(true);
    setFetchError(null);
    try {
      const url =
        status === "all"
          ? "/api/admin/tradeshows"
          : `/api/admin/tradeshows?status=${status}`;
      const res = await fetch(url);
      const json = await res.json();
      if (!json.success) throw new Error(json.error ?? "Veri alınamadı");
      setShows(json.data ?? []);
    } catch (err) {
      setFetchError(err instanceof Error ? err.message : "Sunucu hatası");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchShows(activeTab);
  }, [activeTab, fetchShows]);

  // ── Modal helpers ──────────────────────────────────────────────────────────

  function openCreate() {
    setEditTarget(null);
    setForm(EMPTY_FORM);
    setFormError(null);
    setModalOpen(true);
  }

  function openEdit(show: DbTradeShow) {
    setEditTarget(show);
    setForm({
      name_tr: show.name_tr,
      name_en: show.name_en,
      description_tr: show.description_tr,
      description_en: show.description_en,
      location_tr: show.location_tr,
      location_en: show.location_en,
      start_date: show.start_date,
      end_date: show.end_date,
      booth: show.booth ?? "",
      website: show.website ?? "",
      status: show.status,
      is_active: show.is_active,
    });
    setFormError(null);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditTarget(null);
    setFormError(null);
  }

  function handleField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  // ── Submit ─────────────────────────────────────────────────────────────────

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);

    if (!form.name_tr.trim()) {
      setFormError("Türkçe ad zorunludur.");
      return;
    }
    if (!form.location_tr.trim()) {
      setFormError("Türkçe konum zorunludur.");
      return;
    }
    if (!form.start_date) {
      setFormError("Başlangıç tarihi zorunludur.");
      return;
    }
    if (!form.end_date) {
      setFormError("Bitiş tarihi zorunludur.");
      return;
    }

    // Auto-compute status when not manually set
    const resolvedStatus: TradeShowStatus =
      form.status !== ""
        ? form.status
        : computeAutoStatus(form.start_date, form.end_date);

    const payload = {
      name_tr: form.name_tr.trim(),
      name_en: form.name_en.trim(),
      description_tr: form.description_tr.trim(),
      description_en: form.description_en.trim(),
      location_tr: form.location_tr.trim(),
      location_en: form.location_en.trim(),
      start_date: form.start_date,
      end_date: form.end_date,
      booth: form.booth.trim() || null,
      website: form.website.trim() || null,
      status: resolvedStatus,
      is_active: form.is_active,
    };

    setSubmitting(true);
    try {
      const url = editTarget
        ? `/api/admin/tradeshows/${editTarget.id}`
        : "/api/admin/tradeshows";
      const method = editTarget ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error ?? "İşlem başarısız");
      closeModal();
      fetchShows(activeTab);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Sunucu hatası");
    } finally {
      setSubmitting(false);
    }
  }

  // ── Delete ─────────────────────────────────────────────────────────────────

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/tradeshows/${deleteTarget.id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error ?? "Silinemedi");
      setDeleteTarget(null);
      fetchShows(activeTab);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Silme hatası");
    } finally {
      setDeleting(false);
    }
  }

  // ── Counts per tab ─────────────────────────────────────────────────────────

  const tabCounts = {
    all: shows.length,
    upcoming: shows.filter((s) => s.status === "upcoming").length,
    active: shows.filter((s) => s.status === "active").length,
    past: shows.filter((s) => s.status === "past").length,
  };

  // When a specific tab is active, filter locally for instant response
  const displayed =
    activeTab === "all" ? shows : shows.filter((s) => s.status === activeTab);

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Fuarlar</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {shows.length} fuar kayıtlı
          </p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90"
        >
          <Plus size={16} />
          Yeni Fuar
        </button>
      </div>

      {/* Status Tabs */}
      <div className="flex gap-1 rounded-lg border border-border bg-muted p-1 w-fit">
        {TAB_LIST.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-all ${
              activeTab === tab.key
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
            {activeTab === "all" && (
              <span className="ml-1.5 text-xs opacity-60">
                ({tabCounts[tab.key]})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-20 text-muted-foreground">
          <Loader2 size={28} className="animate-spin" />
        </div>
      ) : fetchError ? (
        <div className="flex items-center gap-3 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          <AlertCircle size={18} />
          {fetchError}
        </div>
      ) : displayed.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <MapPin size={40} className="mb-3 opacity-30" />
          <p className="text-sm font-medium">Fuar bulunamadı</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {displayed.map((show) => (
            <TradeShowCard
              key={show.id}
              show={show}
              onEdit={() => openEdit(show)}
              onDelete={() => setDeleteTarget(show)}
            />
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      {modalOpen && (
        <Modal
          title={editTarget ? "Fuarı Düzenle" : "Yeni Fuar Ekle"}
          onClose={closeModal}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            {formError && (
              <div className="flex items-center gap-2 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
                <AlertCircle size={14} />
                {formError}
              </div>
            )}

            {/* Names */}
            <div className="grid grid-cols-2 gap-3">
              <Field label="Ad (TR) *">
                <input
                  type="text"
                  value={form.name_tr}
                  onChange={(e) => handleField("name_tr", e.target.value)}
                  placeholder="Türkçe ad"
                  className={inputClass}
                  required
                />
              </Field>
              <Field label="Ad (EN)">
                <input
                  type="text"
                  value={form.name_en}
                  onChange={(e) => handleField("name_en", e.target.value)}
                  placeholder="English name"
                  className={inputClass}
                />
              </Field>
            </div>

            {/* Locations */}
            <div className="grid grid-cols-2 gap-3">
              <Field label="Konum (TR) *">
                <input
                  type="text"
                  value={form.location_tr}
                  onChange={(e) => handleField("location_tr", e.target.value)}
                  placeholder="İstanbul, Türkiye"
                  className={inputClass}
                  required
                />
              </Field>
              <Field label="Konum (EN)">
                <input
                  type="text"
                  value={form.location_en}
                  onChange={(e) => handleField("location_en", e.target.value)}
                  placeholder="Istanbul, Turkey"
                  className={inputClass}
                />
              </Field>
            </div>

            {/* Descriptions */}
            <div className="grid grid-cols-2 gap-3">
              <Field label="Açıklama (TR)">
                <textarea
                  value={form.description_tr}
                  onChange={(e) => handleField("description_tr", e.target.value)}
                  placeholder="Türkçe açıklama"
                  rows={3}
                  className={`${inputClass} resize-none`}
                />
              </Field>
              <Field label="Açıklama (EN)">
                <textarea
                  value={form.description_en}
                  onChange={(e) => handleField("description_en", e.target.value)}
                  placeholder="English description"
                  rows={3}
                  className={`${inputClass} resize-none`}
                />
              </Field>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-3">
              <Field label="Başlangıç Tarihi *">
                <input
                  type="date"
                  value={form.start_date}
                  onChange={(e) => handleField("start_date", e.target.value)}
                  className={inputClass}
                  required
                />
              </Field>
              <Field label="Bitiş Tarihi *">
                <input
                  type="date"
                  value={form.end_date}
                  onChange={(e) => handleField("end_date", e.target.value)}
                  className={inputClass}
                  required
                />
              </Field>
            </div>

            {/* Booth & Website */}
            <div className="grid grid-cols-2 gap-3">
              <Field label="Stand No">
                <input
                  type="text"
                  value={form.booth}
                  onChange={(e) => handleField("booth", e.target.value)}
                  placeholder="Hall 4, C-22"
                  className={inputClass}
                />
              </Field>
              <Field label="Web Sitesi">
                <input
                  type="url"
                  value={form.website}
                  onChange={(e) => handleField("website", e.target.value)}
                  placeholder="https://fuar.com"
                  className={inputClass}
                />
              </Field>
            </div>

            {/* Status & is_active */}
            <div className="grid grid-cols-2 gap-3">
              <Field label="Durum">
                <select
                  value={form.status}
                  onChange={(e) =>
                    handleField("status", e.target.value as TradeShowStatus | "")
                  }
                  className={inputClass}
                >
                  <option value="">Otomatik (tarih bazlı)</option>
                  <option value="upcoming">Yaklaşan</option>
                  <option value="active">Aktif</option>
                  <option value="past">Geçmiş</option>
                </select>
              </Field>
              <Field label="Yayın Durumu">
                <label className="mt-1.5 flex cursor-pointer items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={form.is_active}
                    onChange={(e) => handleField("is_active", e.target.checked)}
                    className="h-4 w-4 rounded border-border accent-primary"
                  />
                  <span className="text-foreground">Aktif (yayında)</span>
                </label>
              </Field>
            </div>

            {/* Auto-status preview */}
            {form.start_date && form.end_date && form.status === "" && (
              <p className="text-xs text-muted-foreground">
                Otomatik durum:{" "}
                <span className="font-medium text-foreground">
                  {STATUS_LABELS[computeAutoStatus(form.start_date, form.end_date)]}
                </span>
              </p>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-2 border-t border-border pt-4">
              <button
                type="button"
                onClick={closeModal}
                disabled={submitting}
                className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted disabled:opacity-50"
              >
                İptal
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-60"
              >
                {submitting && <Loader2 size={14} className="animate-spin" />}
                {editTarget ? "Kaydet" : "Ekle"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Confirm Modal */}
      {deleteTarget && (
        <Modal title="Fuarı Sil" onClose={() => setDeleteTarget(null)}>
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">
              {deleteTarget.name_tr}
            </span>{" "}
            fuarını kalıcı olarak silmek istediğinizden emin misiniz?
          </p>
          <div className="mt-5 flex justify-end gap-2">
            <button
              onClick={() => setDeleteTarget(null)}
              disabled={deleting}
              className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted disabled:opacity-50"
            >
              İptal
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="inline-flex items-center gap-2 rounded-lg bg-destructive px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-destructive/90 disabled:opacity-60"
            >
              {deleting && <Loader2 size={14} className="animate-spin" />}
              Sil
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

const inputClass =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-muted-foreground">{label}</label>
      {children}
    </div>
  );
}

function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4 pt-16">
      <div className="w-full max-w-2xl rounded-xl border border-border bg-card shadow-xl">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="text-base font-semibold text-foreground">{title}</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-muted-foreground transition-colors hover:bg-muted"
          >
            <X size={18} />
          </button>
        </div>
        <div className="px-5 py-4">{children}</div>
      </div>
    </div>
  );
}

function TradeShowCard({
  show,
  onEdit,
  onDelete,
}: {
  show: DbTradeShow;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="flex flex-col rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:shadow-md">
      {/* Status badge + active indicator */}
      <div className="mb-3 flex items-center justify-between">
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[show.status]}`}
        >
          {STATUS_LABELS[show.status]}
        </span>
        {!show.is_active && (
          <span className="text-xs text-muted-foreground">Pasif</span>
        )}
      </div>

      {/* Name */}
      <h3 className="mb-1 text-sm font-semibold text-foreground line-clamp-2">
        {show.name_tr}
      </h3>

      {/* Location */}
      <div className="mb-2 flex items-center gap-1.5 text-xs text-muted-foreground">
        <MapPin size={12} />
        <span className="line-clamp-1">{show.location_tr}</span>
      </div>

      {/* Dates */}
      <div className="mb-1 flex items-center gap-1.5 text-xs text-muted-foreground">
        <Calendar size={12} />
        <span>
          {formatDate(show.start_date)} — {formatDate(show.end_date)}
        </span>
      </div>

      {/* Booth */}
      {show.booth && (
        <p className="mb-3 text-xs text-muted-foreground">
          Stand: <span className="font-medium text-foreground">{show.booth}</span>
        </p>
      )}

      {/* Spacer */}
      <div className="flex-1" />

      {/* Actions */}
      <div className="flex items-center gap-2 border-t border-border pt-3">
        {show.website && (
          <a
            href={show.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted"
            title="Web sitesini aç"
          >
            <ExternalLink size={12} />
            Site
          </a>
        )}
        <button
          onClick={onEdit}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-border py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted"
        >
          <Edit3 size={12} />
          Düzenle
        </button>
        <button
          onClick={onDelete}
          className="flex items-center justify-center rounded-lg border border-border p-1.5 text-muted-foreground transition-colors hover:border-destructive/50 hover:bg-destructive/10 hover:text-destructive"
          title="Sil"
        >
          <Trash2 size={12} />
        </button>
      </div>
    </div>
  );
}
