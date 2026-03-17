"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Plus,
  Edit3,
  Trash2,
  Award,
  Shield,
  ShieldCheck,
  BadgeCheck,
  CheckCircle,
  FlaskConical,
  ChevronUp,
  ChevronDown,
  X,
  Loader2,
  FileText,
  ToggleLeft,
  ToggleRight,
  Calendar,
  Building2,
} from "lucide-react";
import type { DbCertificate } from "@/types/database";

const ICON_OPTIONS = [
  { value: "Shield", label: "Shield", component: Shield },
  { value: "ShieldCheck", label: "ShieldCheck", component: ShieldCheck },
  { value: "BadgeCheck", label: "BadgeCheck", component: BadgeCheck },
  { value: "Award", label: "Award", component: Award },
  { value: "CheckCircle", label: "CheckCircle", component: CheckCircle },
  { value: "FlaskConical", label: "FlaskConical", component: FlaskConical },
] as const;

function CertIcon({ name, size = 20 }: { name: string; size?: number }) {
  const found = ICON_OPTIONS.find((o) => o.value === name);
  if (!found) return <Award size={size} />;
  const Comp = found.component;
  return <Comp size={size} />;
}

const EMPTY_FORM = {
  name_tr: "",
  name_en: "",
  description_tr: "",
  description_en: "",
  icon: "Shield",
  issuer: "",
  valid_until: "",
  pdf_url: "",
  is_active: true,
};

type FormState = typeof EMPTY_FORM;

interface ModalState {
  open: boolean;
  mode: "add" | "edit";
  cert: DbCertificate | null;
}

export default function AdminCertificatesPage() {
  const [certificates, setCertificates] = useState<DbCertificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [modal, setModal] = useState<ModalState>({ open: false, mode: "add", cert: null });
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchCertificates = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch((process.env.NEXT_PUBLIC_BASE_PATH || "") + "/api/admin/certificates");
      const json = await res.json();
      if (!json.success) throw new Error(json.error ?? "Yüklenemedi");
      setCertificates(json.data ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCertificates();
  }, [fetchCertificates]);

  function openAdd() {
    setForm(EMPTY_FORM);
    setPdfFile(null);
    setFormError(null);
    setModal({ open: true, mode: "add", cert: null });
  }

  function openEdit(cert: DbCertificate) {
    setForm({
      name_tr: cert.name_tr,
      name_en: cert.name_en,
      description_tr: cert.description_tr,
      description_en: cert.description_en,
      icon: cert.icon,
      issuer: cert.issuer,
      valid_until: cert.valid_until ? cert.valid_until.slice(0, 10) : "",
      pdf_url: cert.pdf_url ?? "",
      is_active: cert.is_active,
    });
    setPdfFile(null);
    setFormError(null);
    setModal({ open: true, mode: "edit", cert });
  }

  function closeModal() {
    setModal({ open: false, mode: "add", cert: null });
    setFormError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name_tr.trim()) {
      setFormError("Türkçe ad zorunludur.");
      return;
    }
    if (!form.name_en.trim()) {
      setFormError("İngilizce ad zorunludur.");
      return;
    }

    setSubmitting(true);
    setFormError(null);

    try {
      if (modal.mode === "add") {
        const fd = new FormData();
        fd.append("name_tr", form.name_tr.trim());
        fd.append("name_en", form.name_en.trim());
        fd.append("description_tr", form.description_tr.trim());
        fd.append("description_en", form.description_en.trim());
        fd.append("icon", form.icon);
        fd.append("issuer", form.issuer.trim());
        fd.append("valid_until", form.valid_until.trim());
        fd.append("pdf_url", form.pdf_url.trim());
        fd.append("is_active", String(form.is_active));
        fd.append(
          "display_order",
          String(certificates.length > 0 ? Math.max(...certificates.map((c) => c.display_order)) + 1 : 0)
        );
        if (pdfFile) fd.append("file", pdfFile);

        const res = await fetch((process.env.NEXT_PUBLIC_BASE_PATH || "") + "/api/admin/certificates", { method: "POST", body: fd });
        const json = await res.json();
        if (!json.success) throw new Error(json.error ?? "Oluşturulamadı");
      } else if (modal.cert) {
        const payload: Record<string, unknown> = {
          name_tr: form.name_tr.trim(),
          name_en: form.name_en.trim(),
          description_tr: form.description_tr.trim(),
          description_en: form.description_en.trim(),
          icon: form.icon,
          issuer: form.issuer.trim(),
          valid_until: form.valid_until.trim(),
          pdf_url: form.pdf_url.trim(),
          is_active: form.is_active,
        };

        const res = await fetch(`/api/admin/certificates/${modal.cert.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const json = await res.json();
        if (!json.success) throw new Error(json.error ?? "Güncellenemedi");
      }

      await fetchCertificates();
      closeModal();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Bir hata oluştu");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/certificates/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (!json.success) throw new Error(json.error ?? "Silinemedi");
      setCertificates((prev) => prev.filter((c) => c.id !== id));
      setDeleteConfirm(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Silme işlemi başarısız");
    } finally {
      setDeleting(false);
    }
  }

  async function handleToggleActive(cert: DbCertificate) {
    try {
      const res = await fetch(`/api/admin/certificates/${cert.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !cert.is_active }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error ?? "Güncellenemedi");
      setCertificates((prev) =>
        prev.map((c) => (c.id === cert.id ? { ...c, is_active: !c.is_active } : c))
      );
    } catch (err) {
      alert(err instanceof Error ? err.message : "Güncelleme başarısız");
    }
  }

  async function handleReorder(cert: DbCertificate, direction: "up" | "down") {
    const sorted = [...certificates].sort((a, b) => a.display_order - b.display_order);
    const idx = sorted.findIndex((c) => c.id === cert.id);
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= sorted.length) return;

    const current = sorted[idx];
    const swap = sorted[swapIdx];
    const newOrderCurrent = swap.display_order;
    const newOrderSwap = current.display_order;

    try {
      await Promise.all([
        fetch(`/api/admin/certificates/${current.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ display_order: newOrderCurrent }),
        }),
        fetch(`/api/admin/certificates/${swap.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ display_order: newOrderSwap }),
        }),
      ]);

      setCertificates((prev) =>
        prev.map((c) => {
          if (c.id === current.id) return { ...c, display_order: newOrderCurrent };
          if (c.id === swap.id) return { ...c, display_order: newOrderSwap };
          return c;
        })
      );
    } catch (err) {
      alert(err instanceof Error ? err.message : "Sıralama güncellenemedi");
    }
  }

  const sorted = [...certificates].sort((a, b) => a.display_order - b.display_order);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Sertifikalar</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {certificates.length} sertifika kayıtlı
          </p>
        </div>
        <button
          onClick={openAdd}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90"
        >
          <Plus size={16} />
          Yeni Sertifika
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-16 text-muted-foreground">
          <Loader2 size={24} className="animate-spin" />
        </div>
      )}

      {/* Certificate Cards */}
      {!loading && sorted.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sorted.map((cert, idx) => (
            <div
              key={cert.id}
              className="flex flex-col rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:shadow-md"
            >
              {/* Icon + badge row */}
              <div className="mb-3 flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <CertIcon name={cert.icon} size={20} />
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                      cert.is_active
                        ? "bg-emerald-500/10 text-emerald-600"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {cert.is_active ? "Aktif" : "Pasif"}
                  </span>
                </div>
              </div>

              {/* Name */}
              <h3 className="mb-1 text-sm font-semibold text-foreground line-clamp-2">
                {cert.name_tr}
              </h3>
              {cert.name_en && (
                <p className="mb-2 text-xs text-muted-foreground">{cert.name_en}</p>
              )}

              {/* Description */}
              {cert.description_tr && (
                <p className="mb-3 flex-1 text-xs text-muted-foreground line-clamp-2">
                  {cert.description_tr}
                </p>
              )}

              {/* Meta */}
              <div className="mb-4 space-y-1.5">
                {cert.issuer && (
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Building2 size={12} />
                    <span className="truncate">{cert.issuer}</span>
                  </div>
                )}
                {cert.valid_until && (
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Calendar size={12} />
                    <span>
                      Geçerlilik:{" "}
                      {new Date(cert.valid_until).toLocaleDateString("tr-TR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                )}
                {cert.pdf_url && (
                  <div className="flex items-center gap-1.5 text-xs text-primary">
                    <FileText size={12} />
                    <a
                      href={cert.pdf_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="truncate underline-offset-2 hover:underline"
                    >
                      PDF Görüntüle
                    </a>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1.5 border-t border-border pt-3">
                {/* Reorder */}
                <button
                  onClick={() => handleReorder(cert, "up")}
                  disabled={idx === 0}
                  className="rounded-lg border border-border p-1.5 text-muted-foreground transition-colors hover:bg-muted disabled:opacity-30"
                  title="Yukarı taşı"
                >
                  <ChevronUp size={12} />
                </button>
                <button
                  onClick={() => handleReorder(cert, "down")}
                  disabled={idx === sorted.length - 1}
                  className="rounded-lg border border-border p-1.5 text-muted-foreground transition-colors hover:bg-muted disabled:opacity-30"
                  title="Aşağı taşı"
                >
                  <ChevronDown size={12} />
                </button>

                {/* Toggle active */}
                <button
                  onClick={() => handleToggleActive(cert)}
                  className="rounded-lg border border-border p-1.5 text-muted-foreground transition-colors hover:bg-muted"
                  title={cert.is_active ? "Pasife al" : "Aktif et"}
                >
                  {cert.is_active ? <ToggleRight size={14} className="text-emerald-600" /> : <ToggleLeft size={14} />}
                </button>

                {/* Spacer */}
                <div className="flex-1" />

                {/* Edit */}
                <button
                  onClick={() => openEdit(cert)}
                  className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted"
                >
                  <Edit3 size={12} />
                  Düzenle
                </button>

                {/* Delete */}
                <button
                  onClick={() => setDeleteConfirm(cert.id)}
                  className="rounded-lg border border-border p-1.5 text-muted-foreground transition-colors hover:border-destructive/50 hover:bg-destructive/10 hover:text-destructive"
                  title="Sil"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && sorted.length === 0 && !error && (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
          <Award size={40} className="mb-3 opacity-30" />
          <p className="text-sm font-medium">Henüz sertifika eklenmemiş</p>
          <p className="text-xs">Yeni sertifika eklemek için butona tıklayın</p>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-xl bg-card p-6 shadow-xl">
            <h2 className="mb-2 text-base font-semibold text-foreground">Sertifikayı Sil</h2>
            <p className="mb-6 text-sm text-muted-foreground">
              Bu sertifikayı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                disabled={deleting}
                className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted"
              >
                İptal
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                disabled={deleting}
                className="inline-flex items-center gap-2 rounded-lg bg-destructive px-4 py-2 text-sm font-semibold text-destructive-foreground transition-all hover:bg-destructive/90 disabled:opacity-70"
              >
                {deleting && <Loader2 size={14} className="animate-spin" />}
                Sil
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      {modal.open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4 py-8">
          <div className="w-full max-w-lg rounded-xl bg-card shadow-xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <h2 className="text-base font-semibold text-foreground">
                {modal.mode === "add" ? "Yeni Sertifika Ekle" : "Sertifikayı Düzenle"}
              </h2>
              <button
                onClick={closeModal}
                className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="space-y-5 p-6">
              {formError && (
                <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {formError}
                </div>
              )}

              {/* Name TR / EN */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">
                    Ad (Türkçe) <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.name_tr}
                    onChange={(e) => setForm((f) => ({ ...f, name_tr: e.target.value }))}
                    placeholder="ISO 9001:2015"
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">
                    Ad (İngilizce) <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.name_en}
                    onChange={(e) => setForm((f) => ({ ...f, name_en: e.target.value }))}
                    placeholder="ISO 9001:2015"
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    required
                  />
                </div>
              </div>

              {/* Description TR / EN */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">Açıklama (TR)</label>
                  <textarea
                    value={form.description_tr}
                    onChange={(e) => setForm((f) => ({ ...f, description_tr: e.target.value }))}
                    rows={3}
                    placeholder="Kalite yönetim sistemi sertifikası..."
                    className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">Açıklama (EN)</label>
                  <textarea
                    value={form.description_en}
                    onChange={(e) => setForm((f) => ({ ...f, description_en: e.target.value }))}
                    rows={3}
                    placeholder="Quality management system certificate..."
                    className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              {/* Icon */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">Simge</label>
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
                  {ICON_OPTIONS.map((opt) => {
                    const Comp = opt.component;
                    const selected = form.icon === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setForm((f) => ({ ...f, icon: opt.value }))}
                        className={`flex flex-col items-center gap-1 rounded-lg border p-2.5 text-xs transition-all ${
                          selected
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border text-muted-foreground hover:border-primary/50 hover:bg-muted"
                        }`}
                      >
                        <Comp size={18} />
                        <span className="text-[10px]">{opt.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Issuer + Valid Until */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">Veren Kurum</label>
                  <input
                    type="text"
                    value={form.issuer}
                    onChange={(e) => setForm((f) => ({ ...f, issuer: e.target.value }))}
                    placeholder="Bureau Veritas"
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">Geçerlilik Tarihi</label>
                  <input
                    type="date"
                    value={form.valid_until}
                    onChange={(e) => setForm((f) => ({ ...f, valid_until: e.target.value }))}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              {/* PDF URL (direct) — only show if no file selected */}
              {!pdfFile && (
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">PDF URL (varsa)</label>
                  <input
                    type="url"
                    value={form.pdf_url}
                    onChange={(e) => setForm((f) => ({ ...f, pdf_url: e.target.value }))}
                    placeholder="https://..."
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              )}

              {/* PDF File Upload */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">
                  {modal.mode === "edit" ? "PDF Dosyasını Değiştir" : "PDF Yükle"}
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => {
                      const f = e.target.files?.[0] ?? null;
                      setPdfFile(f);
                      if (f) setForm((prev) => ({ ...prev, pdf_url: "" }));
                    }}
                    className="w-full cursor-pointer rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none file:mr-3 file:rounded file:border-0 file:bg-primary/10 file:px-2 file:py-1 file:text-xs file:font-medium file:text-primary focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                {pdfFile && (
                  <div className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2 text-xs text-muted-foreground">
                    <FileText size={12} />
                    <span className="truncate">{pdfFile.name}</span>
                    <button
                      type="button"
                      onClick={() => setPdfFile(null)}
                      className="ml-auto text-muted-foreground hover:text-destructive"
                    >
                      <X size={12} />
                    </button>
                  </div>
                )}
                {modal.mode === "edit" && modal.cert?.pdf_url && !pdfFile && (
                  <p className="text-xs text-muted-foreground">
                    Mevcut PDF:{" "}
                    <a
                      href={modal.cert.pdf_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary underline-offset-2 hover:underline"
                    >
                      Görüntüle
                    </a>
                  </p>
                )}
              </div>

              {/* Active toggle */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, is_active: !f.is_active }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    form.is_active ? "bg-emerald-500" : "bg-muted-foreground/30"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 translate-x-1 rounded-full bg-white shadow transition-transform ${
                      form.is_active ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
                <span className="text-sm font-medium text-foreground">
                  {form.is_active ? "Aktif" : "Pasif"}
                </span>
              </div>

              {/* Form actions */}
              <div className="flex justify-end gap-3 border-t border-border pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={submitting}
                  className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 disabled:opacity-70"
                >
                  {submitting && <Loader2 size={14} className="animate-spin" />}
                  {modal.mode === "add" ? "Ekle" : "Kaydet"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
