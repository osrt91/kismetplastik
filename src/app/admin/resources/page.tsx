"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  FolderOpen,
  Upload,
  Trash2,
  Edit3,
  Eye,
  EyeOff,
  Download,
  FileText,
  ChevronLeft,
  ChevronRight,
  X,
  Plus,
  ArrowUp,
  ArrowDown,
  Users,
} from "lucide-react";
import type { DbResource, DbCatalogDownload } from "@/types/database";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Pagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

interface ResourcesResponse {
  success: boolean;
  data?: { resources: DbResource[] };
  pagination?: Pagination;
  error?: string;
}

interface DownloadsResponse {
  success: boolean;
  data?: { downloads: DbCatalogDownload[] };
  pagination?: Pagination;
  error?: string;
}

interface EditForm {
  title_tr: string;
  title_en: string;
  description_tr: string;
  description_en: string;
  category_tr: string;
  category_en: string;
  page_count: string;
  is_active: boolean;
  display_order: string;
}

const EMPTY_FORM: EditForm = {
  title_tr: "",
  title_en: "",
  description_tr: "",
  description_en: "",
  category_tr: "",
  category_en: "",
  page_count: "0",
  is_active: true,
  display_order: "0",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fileTypeLabel(url: string): string {
  const lower = url.toLowerCase();
  if (lower.endsWith(".pdf")) return "PDF";
  if (lower.endsWith(".zip")) return "ZIP";
  return "DOSYA";
}

function fileTypeBadgeClass(url: string): string {
  const lower = url.toLowerCase();
  if (lower.endsWith(".pdf")) return "bg-red-100 text-red-700";
  if (lower.endsWith(".zip")) return "bg-yellow-100 text-yellow-700";
  return "bg-muted text-muted-foreground";
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("tr-TR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// ─── Upload Form Modal ────────────────────────────────────────────────────────

interface UploadModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

function UploadModal({ onClose, onSuccess }: UploadModalProps) {
  const [form, setForm] = useState<EditForm & { file: File | null }>({
    ...EMPTY_FORM,
    file: null,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setForm((prev) => ({ ...prev, file: f }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.file) {
      setError("Lütfen bir dosya seçin");
      return;
    }
    if (!form.title_tr.trim()) {
      setError("Başlık (TR) zorunludur");
      return;
    }

    setSubmitting(true);
    setError("");

    const fd = new FormData();
    fd.append("file", form.file);
    fd.append("title_tr", form.title_tr.trim());
    fd.append("title_en", form.title_en.trim() || form.title_tr.trim());
    fd.append("description_tr", form.description_tr.trim());
    fd.append("description_en", form.description_en.trim());
    fd.append("category_tr", form.category_tr.trim());
    fd.append("category_en", form.category_en.trim() || form.category_tr.trim());
    fd.append("page_count", form.page_count || "0");
    fd.append("display_order", form.display_order || "0");
    fd.append("is_active", String(form.is_active));

    try {
      const res = await fetch((process.env.NEXT_PUBLIC_BASE_PATH || "") + "/api/admin/resources", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok || !json.success) {
        setError(json.error ?? "Yükleme başarısız");
      } else {
        onSuccess();
        onClose();
      }
    } catch {
      setError("Bağlantı hatası");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-2xl overflow-y-auto rounded-xl border border-border bg-card shadow-xl max-h-[90vh]">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="text-base font-semibold text-foreground">Yeni Kaynak Yükle</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-6">
          {/* File picker */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
              Dosya (PDF / ZIP) *
            </label>
            <div
              onClick={() => fileRef.current?.click()}
              className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border bg-muted/30 py-8 text-sm text-muted-foreground transition-colors hover:border-primary hover:bg-primary/5"
            >
              <Upload size={24} className="opacity-50" />
              {form.file ? (
                <span className="font-medium text-foreground">{form.file.name}</span>
              ) : (
                <span>Dosya seçmek için tıklayın</span>
              )}
              <input
                ref={fileRef}
                type="file"
                accept=".pdf,.zip"
                className="hidden"
                onChange={handleFile}
              />
            </div>
          </div>

          {/* Titles */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                Başlık (TR) *
              </label>
              <input
                type="text"
                value={form.title_tr}
                onChange={(e) => setForm((p) => ({ ...p, title_tr: e.target.value }))}
                placeholder="Türkçe başlık"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                Başlık (EN)
              </label>
              <input
                type="text"
                value={form.title_en}
                onChange={(e) => setForm((p) => ({ ...p, title_en: e.target.value }))}
                placeholder="İngilizce başlık (boş bırakılırsa TR kullanılır)"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          {/* Descriptions */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                Açıklama (TR)
              </label>
              <textarea
                value={form.description_tr}
                onChange={(e) => setForm((p) => ({ ...p, description_tr: e.target.value }))}
                rows={3}
                placeholder="Türkçe açıklama"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                Açıklama (EN)
              </label>
              <textarea
                value={form.description_en}
                onChange={(e) => setForm((p) => ({ ...p, description_en: e.target.value }))}
                rows={3}
                placeholder="İngilizce açıklama"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none"
              />
            </div>
          </div>

          {/* Categories */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                Kategori (TR)
              </label>
              <input
                type="text"
                value={form.category_tr}
                onChange={(e) => setForm((p) => ({ ...p, category_tr: e.target.value }))}
                placeholder="örn. Katalog, Teknik Doküman"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                Kategori (EN)
              </label>
              <input
                type="text"
                value={form.category_en}
                onChange={(e) => setForm((p) => ({ ...p, category_en: e.target.value }))}
                placeholder="e.g. Catalog, Technical Document"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          {/* Page count / Display order / Active */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                Sayfa Sayısı
              </label>
              <input
                type="number"
                min={0}
                value={form.page_count}
                onChange={(e) => setForm((p) => ({ ...p, page_count: e.target.value }))}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                Sıra No
              </label>
              <input
                type="number"
                min={0}
                value={form.display_order}
                onChange={(e) => setForm((p) => ({ ...p, display_order: e.target.value }))}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="flex flex-col justify-end">
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                Durum
              </label>
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(e) => setForm((p) => ({ ...p, is_active: e.target.checked }))}
                  className="h-4 w-4 rounded border-border accent-primary"
                />
                <span className="text-sm text-foreground">Aktif</span>
              </label>
            </div>
          </div>

          {error && (
            <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-3 border-t border-border pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-50"
            >
              {submitting ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
              ) : (
                <Upload size={14} />
              )}
              {submitting ? "Yükleniyor..." : "Yükle"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Edit Metadata Modal ──────────────────────────────────────────────────────

interface EditModalProps {
  resource: DbResource;
  onClose: () => void;
  onSuccess: () => void;
}

function EditModal({ resource, onClose, onSuccess }: EditModalProps) {
  const [form, setForm] = useState<EditForm>({
    title_tr: resource.title_tr,
    title_en: resource.title_en,
    description_tr: resource.description_tr ?? "",
    description_en: resource.description_en ?? "",
    category_tr: resource.category_tr ?? "",
    category_en: resource.category_en ?? "",
    page_count: String(resource.page_count ?? 0),
    is_active: resource.is_active,
    display_order: String(resource.display_order ?? 0),
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title_tr.trim()) {
      setError("Başlık (TR) zorunludur");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const res = await fetch(`/api/admin/resources/${resource.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title_tr: form.title_tr.trim(),
          title_en: form.title_en.trim() || form.title_tr.trim(),
          description_tr: form.description_tr.trim(),
          description_en: form.description_en.trim(),
          category_tr: form.category_tr.trim(),
          category_en: form.category_en.trim() || form.category_tr.trim(),
          page_count: parseInt(form.page_count || "0", 10),
          is_active: form.is_active,
          display_order: parseInt(form.display_order || "0", 10),
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        setError(json.error ?? "Güncelleme başarısız");
      } else {
        onSuccess();
        onClose();
      }
    } catch {
      setError("Bağlantı hatası");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-2xl overflow-y-auto rounded-xl border border-border bg-card shadow-xl max-h-[90vh]">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="text-base font-semibold text-foreground">Kaynağı Düzenle</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-6">
          {/* Titles */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                Başlık (TR) *
              </label>
              <input
                type="text"
                value={form.title_tr}
                onChange={(e) => setForm((p) => ({ ...p, title_tr: e.target.value }))}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                Başlık (EN)
              </label>
              <input
                type="text"
                value={form.title_en}
                onChange={(e) => setForm((p) => ({ ...p, title_en: e.target.value }))}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          {/* Descriptions */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                Açıklama (TR)
              </label>
              <textarea
                value={form.description_tr}
                onChange={(e) => setForm((p) => ({ ...p, description_tr: e.target.value }))}
                rows={3}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                Açıklama (EN)
              </label>
              <textarea
                value={form.description_en}
                onChange={(e) => setForm((p) => ({ ...p, description_en: e.target.value }))}
                rows={3}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none"
              />
            </div>
          </div>

          {/* Categories */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                Kategori (TR)
              </label>
              <input
                type="text"
                value={form.category_tr}
                onChange={(e) => setForm((p) => ({ ...p, category_tr: e.target.value }))}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                Kategori (EN)
              </label>
              <input
                type="text"
                value={form.category_en}
                onChange={(e) => setForm((p) => ({ ...p, category_en: e.target.value }))}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          {/* Page count / Display order / Active */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                Sayfa Sayısı
              </label>
              <input
                type="number"
                min={0}
                value={form.page_count}
                onChange={(e) => setForm((p) => ({ ...p, page_count: e.target.value }))}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                Sıra No
              </label>
              <input
                type="number"
                min={0}
                value={form.display_order}
                onChange={(e) => setForm((p) => ({ ...p, display_order: e.target.value }))}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="flex flex-col justify-end">
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                Durum
              </label>
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(e) => setForm((p) => ({ ...p, is_active: e.target.checked }))}
                  className="h-4 w-4 rounded border-border accent-primary"
                />
                <span className="text-sm text-foreground">Aktif</span>
              </label>
            </div>
          </div>

          {error && (
            <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-3 border-t border-border pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-50"
            >
              {submitting ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
              ) : (
                <Edit3 size={14} />
              )}
              {submitting ? "Kaydediliyor..." : "Kaydet"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Downloads Section ────────────────────────────────────────────────────────

interface DownloadsSectionProps {
  resourceId?: string;
}

function DownloadsSection({ resourceId }: DownloadsSectionProps) {
  const [downloads, setDownloads] = useState<DbCatalogDownload[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchDownloads = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: "20" });
      if (resourceId) params.set("resource_id", resourceId);
      const res = await fetch(`/api/admin/resources/downloads?${params}`);
      const json: DownloadsResponse = await res.json();
      if (json.success && json.data) {
        setDownloads(json.data.downloads);
        setPagination(json.pagination ?? null);
      }
    } catch {
      // Silently handle fetch error
    } finally {
      setLoading(false);
    }
  }, [page, resourceId]);

  useEffect(() => {
    fetchDownloads();
  }, [fetchDownloads]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Users size={16} />
          İndirme Talepleri
          {pagination && (
            <span className="ml-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
              {pagination.total}
            </span>
          )}
        </h3>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-10">
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      ) : downloads.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
          <Download size={32} className="mb-2 opacity-30" />
          <p className="text-sm">Henüz indirme kaydı yok</p>
        </div>
      ) : (
        <>
          <div className="overflow-hidden rounded-xl border border-border bg-card">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">
                    Ad Soyad
                  </th>
                  <th className="hidden px-4 py-3 text-left text-xs font-semibold text-muted-foreground sm:table-cell">
                    Firma
                  </th>
                  <th className="hidden px-4 py-3 text-left text-xs font-semibold text-muted-foreground md:table-cell">
                    E-posta
                  </th>
                  <th className="hidden px-4 py-3 text-left text-xs font-semibold text-muted-foreground lg:table-cell">
                    Telefon
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">
                    Tarih
                  </th>
                </tr>
              </thead>
              <tbody>
                {downloads.map((dl) => (
                  <tr
                    key={dl.id}
                    className="border-b border-border last:border-0 hover:bg-muted/30"
                  >
                    <td className="px-4 py-3 font-medium text-foreground">
                      {dl.contact_name}
                    </td>
                    <td className="hidden px-4 py-3 text-muted-foreground sm:table-cell">
                      {dl.company_name}
                    </td>
                    <td className="hidden px-4 py-3 text-muted-foreground md:table-cell">
                      <a
                        href={`mailto:${dl.email}`}
                        className="hover:text-primary hover:underline"
                      >
                        {dl.email}
                      </a>
                    </td>
                    <td className="hidden px-4 py-3 text-muted-foreground lg:table-cell">
                      {dl.phone ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {formatDate(dl.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>
                {((pagination.page - 1) * pagination.pageSize) + 1}–
                {Math.min(pagination.page * pagination.pageSize, pagination.total)} / {pagination.total}
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={pagination.page === 1}
                  className="rounded-lg border border-border p-1.5 disabled:opacity-40 hover:bg-muted"
                >
                  <ChevronLeft size={14} />
                </button>
                <span className="px-2 font-medium text-foreground">
                  {pagination.page} / {pagination.totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                  disabled={pagination.page === pagination.totalPages}
                  className="rounded-lg border border-border p-1.5 disabled:opacity-40 hover:bg-muted"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AdminResourcesPage() {
  const [resources, setResources] = useState<DbResource[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showUpload, setShowUpload] = useState(false);
  const [editTarget, setEditTarget] = useState<DbResource | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [reorderingId, setReorderingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"resources" | "downloads">("resources");

  const fetchResources = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({ page: String(page), limit: "20" });
      const res = await fetch(`/api/admin/resources?${params}`);
      const json: ResourcesResponse = await res.json();
      if (json.success && json.data) {
        setResources(json.data.resources);
        setPagination(json.pagination ?? null);
      } else {
        setError(json.error ?? "Kaynaklar yüklenemedi");
      }
    } catch {
      setError("Bağlantı hatası");
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  const handleToggleActive = async (resource: DbResource) => {
    setTogglingId(resource.id);
    try {
      const res = await fetch(`/api/admin/resources/${resource.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !resource.is_active }),
      });
      if (res.ok) {
        setResources((prev) =>
          prev.map((r) =>
            r.id === resource.id ? { ...r, is_active: !resource.is_active } : r
          )
        );
      }
    } catch {
      // Silently handle
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async (resource: DbResource) => {
    if (!confirm(`"${resource.title_tr}" kaynağını silmek istediğinize emin misiniz? Bu işlem geri alınamaz.`)) {
      return;
    }

    setDeletingId(resource.id);
    try {
      const res = await fetch(`/api/admin/resources/${resource.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setResources((prev) => prev.filter((r) => r.id !== resource.id));
        if (pagination) {
          setPagination((p) => p ? { ...p, total: p.total - 1 } : p);
        }
      }
    } catch {
      // Silently handle
    } finally {
      setDeletingId(null);
    }
  };

  const handleReorder = async (resource: DbResource, direction: "up" | "down") => {
    const idx = resources.findIndex((r) => r.id === resource.id);
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= resources.length) return;

    const swapResource = resources[swapIdx];
    const newOrder = swapResource.display_order;
    const swapOrder = resource.display_order;

    setReorderingId(resource.id);
    try {
      await Promise.all([
        fetch(`/api/admin/resources/${resource.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ display_order: newOrder }),
        }),
        fetch(`/api/admin/resources/${swapResource.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ display_order: swapOrder }),
        }),
      ]);

      // Re-fetch to get updated order
      fetchResources();
    } catch {
      // Silently handle
    } finally {
      setReorderingId(null);
    }
  };

  return (
    <>
      {showUpload && (
        <UploadModal
          onClose={() => setShowUpload(false)}
          onSuccess={() => {
            setPage(1);
            fetchResources();
          }}
        />
      )}

      {editTarget && (
        <EditModal
          resource={editTarget}
          onClose={() => setEditTarget(null)}
          onSuccess={fetchResources}
        />
      )}

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Kaynaklar / Katalog</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {pagination
                ? `${pagination.total} kaynak kayıtlı`
                : "Katalog ve teknik doküman yönetimi"}
            </p>
          </div>
          <button
            onClick={() => setShowUpload(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90"
          >
            <Plus size={16} />
            Yeni Kaynak Ekle
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 rounded-lg border border-border bg-muted p-1 w-fit">
          <button
            onClick={() => setActiveTab("resources")}
            className={`flex items-center gap-2 rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
              activeTab === "resources"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <FileText size={14} />
            Kaynaklar
          </button>
          <button
            onClick={() => setActiveTab("downloads")}
            className={`flex items-center gap-2 rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
              activeTab === "downloads"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Download size={14} />
            İndirme Talepleri
          </button>
        </div>

        {/* Resources Tab */}
        {activeTab === "resources" && (
          <>
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <span className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              </div>
            ) : error ? (
              <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
                {error}
              </div>
            ) : resources.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card py-20 text-muted-foreground">
                <FolderOpen size={40} className="mb-3 opacity-30" />
                <p className="text-sm font-medium">Henüz kaynak eklenmedi</p>
                <button
                  onClick={() => setShowUpload(true)}
                  className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
                >
                  <Upload size={12} />
                  İlk kaynağı ekle
                </button>
              </div>
            ) : (
              <>
                <div className="overflow-hidden rounded-xl border border-border bg-card">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-muted">
                        <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">
                          Başlık
                        </th>
                        <th className="hidden px-4 py-3 text-left text-xs font-semibold text-muted-foreground sm:table-cell">
                          Kategori
                        </th>
                        <th className="hidden px-4 py-3 text-left text-xs font-semibold text-muted-foreground md:table-cell">
                          Tür
                        </th>
                        <th className="hidden px-4 py-3 text-right text-xs font-semibold text-muted-foreground lg:table-cell">
                          Sayfa
                        </th>
                        <th className="hidden px-4 py-3 text-right text-xs font-semibold text-muted-foreground lg:table-cell">
                          İndirme
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-semibold text-muted-foreground">
                          Durum
                        </th>
                        <th className="hidden px-4 py-3 text-center text-xs font-semibold text-muted-foreground xl:table-cell">
                          Sıra
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground">
                          İşlemler
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {resources.map((resource, idx) => (
                        <tr
                          key={resource.id}
                          className="border-b border-border last:border-0 hover:bg-muted/30"
                        >
                          {/* Title */}
                          <td className="px-4 py-3">
                            <div className="font-medium text-foreground line-clamp-1">
                              {resource.title_tr}
                            </div>
                            {resource.title_en && resource.title_en !== resource.title_tr && (
                              <div className="text-xs text-muted-foreground line-clamp-1">
                                {resource.title_en}
                              </div>
                            )}
                          </td>

                          {/* Category */}
                          <td className="hidden px-4 py-3 text-muted-foreground sm:table-cell">
                            {resource.category_tr || "—"}
                          </td>

                          {/* File type */}
                          <td className="hidden px-4 py-3 md:table-cell">
                            <span
                              className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold ${fileTypeBadgeClass(resource.file_url)}`}
                            >
                              {fileTypeLabel(resource.file_url)}
                            </span>
                          </td>

                          {/* Page count */}
                          <td className="hidden px-4 py-3 text-right text-muted-foreground lg:table-cell">
                            {resource.page_count > 0 ? resource.page_count : "—"}
                          </td>

                          {/* Download count */}
                          <td className="hidden px-4 py-3 text-right lg:table-cell">
                            <span className="flex items-center justify-end gap-1 text-muted-foreground">
                              <Download size={12} />
                              {resource.download_count}
                            </span>
                          </td>

                          {/* Active toggle */}
                          <td className="px-4 py-3 text-center">
                            <button
                              onClick={() => handleToggleActive(resource)}
                              disabled={togglingId === resource.id}
                              title={resource.is_active ? "Pasif yap" : "Aktif yap"}
                              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors ${
                                resource.is_active
                                  ? "bg-success/10 text-success hover:bg-success/20"
                                  : "bg-muted text-muted-foreground hover:bg-muted/80"
                              } disabled:opacity-40`}
                            >
                              {togglingId === resource.id ? (
                                <span className="h-3 w-3 animate-spin rounded-full border border-current border-t-transparent" />
                              ) : resource.is_active ? (
                                <Eye size={11} />
                              ) : (
                                <EyeOff size={11} />
                              )}
                              {resource.is_active ? "Aktif" : "Pasif"}
                            </button>
                          </td>

                          {/* Display order controls */}
                          <td className="hidden px-4 py-3 xl:table-cell">
                            <div className="flex items-center justify-center gap-1">
                              <button
                                onClick={() => handleReorder(resource, "up")}
                                disabled={idx === 0 || reorderingId === resource.id}
                                className="rounded p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-30"
                                title="Yukarı taşı"
                              >
                                <ArrowUp size={12} />
                              </button>
                              <span className="min-w-[2rem] text-center text-xs text-muted-foreground">
                                {resource.display_order}
                              </span>
                              <button
                                onClick={() => handleReorder(resource, "down")}
                                disabled={idx === resources.length - 1 || reorderingId === resource.id}
                                className="rounded p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-30"
                                title="Aşağı taşı"
                              >
                                <ArrowDown size={12} />
                              </button>
                            </div>
                          </td>

                          {/* Actions */}
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-end gap-1">
                              <a
                                href={resource.file_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="rounded-lg border border-border p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                                title="Dosyayı görüntüle"
                              >
                                <FileText size={13} />
                              </a>
                              <button
                                onClick={() => setEditTarget(resource)}
                                className="rounded-lg border border-border p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                                title="Düzenle"
                              >
                                <Edit3 size={13} />
                              </button>
                              <button
                                onClick={() => handleDelete(resource)}
                                disabled={deletingId === resource.id}
                                className="rounded-lg border border-border p-1.5 text-muted-foreground transition-colors hover:border-destructive/50 hover:bg-destructive/10 hover:text-destructive disabled:opacity-40"
                                title="Sil"
                              >
                                {deletingId === resource.id ? (
                                  <span className="h-3 w-3 animate-spin rounded-full border border-current border-t-transparent" />
                                ) : (
                                  <Trash2 size={13} />
                                )}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {pagination && pagination.totalPages > 1 && (
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>
                      {((pagination.page - 1) * pagination.pageSize) + 1}–
                      {Math.min(pagination.page * pagination.pageSize, pagination.total)} / {pagination.total} kaynak
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={pagination.page === 1}
                        className="rounded-lg border border-border p-1.5 disabled:opacity-40 hover:bg-muted"
                      >
                        <ChevronLeft size={14} />
                      </button>
                      <span className="px-2 font-medium text-foreground">
                        {pagination.page} / {pagination.totalPages}
                      </span>
                      <button
                        onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                        disabled={pagination.page === pagination.totalPages}
                        className="rounded-lg border border-border p-1.5 disabled:opacity-40 hover:bg-muted"
                      >
                        <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        )}

        {/* Downloads Tab */}
        {activeTab === "downloads" && <DownloadsSection />}
      </div>
    </>
  );
}
