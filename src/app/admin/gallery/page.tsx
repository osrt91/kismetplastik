"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import {
  Image as ImageIcon,
  Plus,
  Trash2,
  Upload,
  X,
  GripVertical,
  CheckSquare,
  Square,
  Eye,
  EyeOff,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import type { DbGalleryImage, GalleryCategory } from "@/types/database";

// ─── Types ────────────────────────────────────────────────────────────────────

type FilterTab = "all" | GalleryCategory;

interface UploadForm {
  files: File[];
  category: GalleryCategory;
  title_tr: string;
  title_en: string;
  description_tr: string;
  description_en: string;
}

const CATEGORY_LABELS: Record<GalleryCategory | "all", string> = {
  all: "Tümü",
  uretim: "Üretim",
  urunler: "Ürünler",
  etkinlikler: "Etkinlikler",
};

const CATEGORY_BADGE: Record<GalleryCategory, string> = {
  uretim: "bg-blue-500/10 text-blue-600",
  urunler: "bg-emerald-500/10 text-emerald-600",
  etkinlikler: "bg-amber-500/10 text-amber-600",
};

const TABS: FilterTab[] = ["all", "uretim", "urunler", "etkinlikler"];

const PAGE_SIZE = 20;

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AdminGalleryPage() {
  const [images, setImages] = useState<DbGalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showUploadPanel, setShowUploadPanel] = useState(false);

  // Pagination
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [uploadForm, setUploadForm] = useState<UploadForm>({
    files: [],
    category: "uretim",
    title_tr: "",
    title_en: "",
    description_tr: "",
    description_en: "",
  });
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const [bulkDeleting, setBulkDeleting] = useState(false);

  // Drag-and-drop reorder state
  const dragItemId = useRef<string | null>(null);
  const dragOverItemId = useRef<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // ─── Data Fetching ──────────────────────────────────────────────────────────

  const fetchImages = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(PAGE_SIZE),
      });
      if (activeTab !== "all") params.set("category", activeTab);
      const res = await fetch(`/api/admin/gallery?${params}`);
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Yüklenemedi.");
      setImages(json.data ?? []);
      setTotal(json.pagination?.total ?? 0);
      setTotalPages(json.pagination?.totalPages ?? 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  }, [activeTab, page]);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  // Clear selection and reset page when tab changes
  useEffect(() => {
    setSelectedIds(new Set());
    setPage(1);
  }, [activeTab]);

  // ─── Selection ──────────────────────────────────────────────────────────────

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === images.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(images.map((img) => img.id)));
    }
  };

  // ─── Active Toggle ──────────────────────────────────────────────────────────

  const toggleActive = async (image: DbGalleryImage) => {
    const optimistic = images.map((img) =>
      img.id === image.id ? { ...img, is_active: !img.is_active } : img
    );
    setImages(optimistic);

    try {
      const res = await fetch(`/api/admin/gallery/${image.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !image.is_active }),
      });
      const json = await res.json();
      if (!json.success) {
        // Revert
        setImages((prev) =>
          prev.map((img) =>
            img.id === image.id ? { ...img, is_active: image.is_active } : img
          )
        );
      }
    } catch {
      setImages((prev) =>
        prev.map((img) =>
          img.id === image.id ? { ...img, is_active: image.is_active } : img
        )
      );
    }
  };

  // ─── Single Delete ──────────────────────────────────────────────────────────

  const deleteImage = async (id: string) => {
    if (!confirm("Bu görsel silinecek. Emin misiniz?")) return;
    try {
      const res = await fetch(`/api/admin/gallery/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      setImages((prev) => prev.filter((img) => img.id !== id));
      setSelectedIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Silme başarısız.");
      setTimeout(() => setError(null), 5000);
    }
  };

  // ─── Bulk Delete ────────────────────────────────────────────────────────────

  const bulkDelete = async () => {
    if (selectedIds.size === 0) return;
    if (!confirm(`${selectedIds.size} görsel silinecek. Emin misiniz?`)) return;
    setBulkDeleting(true);
    try {
      await Promise.all(
        Array.from(selectedIds).map((id) =>
          fetch(`/api/admin/gallery/${id}`, { method: "DELETE" })
        )
      );
      setImages((prev) => prev.filter((img) => !selectedIds.has(img.id)));
      setSelectedIds(new Set());
    } catch {
      setError("Bazı görseller silinemedi.");
      setTimeout(() => setError(null), 5000);
    } finally {
      setBulkDeleting(false);
    }
  };

  // ─── Drag-and-Drop Reorder ──────────────────────────────────────────────────

  const handleDragStart = (id: string) => {
    dragItemId.current = id;
  };

  const handleDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    dragOverItemId.current = id;
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const fromId = dragItemId.current;
    const toId = dragOverItemId.current;
    if (!fromId || !toId || fromId === toId) return;

    const fromIndex = images.findIndex((img) => img.id === fromId);
    const toIndex = images.findIndex((img) => img.id === toId);
    if (fromIndex === -1 || toIndex === -1) return;

    // Store previous order for rollback
    const previousImages = [...images];

    const reordered = [...images];
    const [moved] = reordered.splice(fromIndex, 1);
    reordered.splice(toIndex, 0, moved);

    const withOrder = reordered.map((img, idx) => ({ ...img, display_order: idx }));
    setImages(withOrder);

    dragItemId.current = null;
    dragOverItemId.current = null;

    // Persist new order — revert on failure
    try {
      const res = await fetch("/api/admin/gallery/reorder", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: withOrder.map((img) => ({ id: img.id, display_order: img.display_order })),
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        setImages(previousImages);
        setError("Sıralama kaydedilemedi. Eski sıra geri yüklendi.");
        setTimeout(() => setError(null), 4000);
      }
    } catch {
      setImages(previousImages);
      setError("Sıralama kaydedilemedi. Eski sıra geri yüklendi.");
      setTimeout(() => setError(null), 4000);
    }
  };

  const handleDragEnd = () => {
    dragItemId.current = null;
    dragOverItemId.current = null;
  };

  // ─── File Upload ─────────────────────────────────────────────────────────────

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    setUploadForm((prev) => ({ ...prev, files }));
    setUploadError(null);
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (uploadForm.files.length === 0) {
      setUploadError("En az bir dosya seçin.");
      return;
    }
    if (!uploadForm.title_tr.trim()) {
      setUploadError("Başlık (TR) zorunludur.");
      return;
    }

    setUploading(true);
    setUploadError(null);

    try {
      for (let i = 0; i < uploadForm.files.length; i++) {
        const file = uploadForm.files[i];
        const fd = new FormData();
        fd.append("file", file);
        fd.append("category", uploadForm.category);
        fd.append("title_tr", uploadForm.title_tr.trim());
        fd.append("title_en", uploadForm.title_en.trim() || uploadForm.title_tr.trim());
        fd.append("description_tr", uploadForm.description_tr.trim());
        fd.append("description_en", uploadForm.description_en.trim());
        fd.append("display_order", String(images.length + i));

        const res = await fetch("/api/admin/gallery", { method: "POST", body: fd });
        const json = await res.json();
        if (!json.success) throw new Error(json.error || "Yükleme başarısız.");
      }

      setUploadForm({
        files: [],
        category: "uretim",
        title_tr: "",
        title_en: "",
        description_tr: "",
        description_en: "",
      });
      if (fileInputRef.current) fileInputRef.current.value = "";
      setShowUploadPanel(false);
      await fetchImages();
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Yükleme başarısız.");
    } finally {
      setUploading(false);
    }
  };

  // ─── Render ──────────────────────────────────────────────────────────────────

  const allSelected = images.length > 0 && selectedIds.size === images.length;
  const someSelected = selectedIds.size > 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Galeri</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {loading ? "Yükleniyor..." : `${total} görsel`}
            {someSelected && (
              <span className="ml-2 text-primary font-medium">
                ({selectedIds.size} seçili)
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {someSelected && (
            <button
              onClick={bulkDelete}
              disabled={bulkDeleting}
              className="inline-flex items-center gap-2 rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive/20 disabled:opacity-50"
            >
              {bulkDeleting ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Trash2 size={14} />
              )}
              {selectedIds.size} Görseli Sil
            </button>
          )}
          <button
            onClick={() => setShowUploadPanel((v) => !v)}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90"
          >
            {showUploadPanel ? <X size={16} /> : <Plus size={16} />}
            {showUploadPanel ? "İptal" : "Görsel Ekle"}
          </button>
        </div>
      </div>

      {/* Upload Panel */}
      {showUploadPanel && (
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <h2 className="mb-4 text-base font-semibold text-foreground">
            Yeni Görsel Yükle
          </h2>
          <form onSubmit={handleUpload} className="space-y-4">
            {/* Drop Zone */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/50 p-8 text-center transition-colors hover:border-primary hover:bg-primary/5"
            >
              <Upload size={28} className="mb-2 text-muted-foreground" />
              <p className="text-sm font-medium text-foreground">
                Dosyaları sürükleyin veya tıklayın
              </p>
              <p className="text-xs text-muted-foreground">
                JPEG, PNG, WebP — maks. 10 MB
              </p>
              {uploadForm.files.length > 0 && (
                <p className="mt-2 text-sm font-semibold text-primary">
                  {uploadForm.files.length} dosya seçildi
                </p>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                className="hidden"
                onChange={handleFileChange}
              />
            </div>

            {/* Selected file previews */}
            {uploadForm.files.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {uploadForm.files.map((file, idx) => (
                  <div
                    key={idx}
                    className="relative h-16 w-16 overflow-hidden rounded-lg border border-border bg-muted"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              {/* Category */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                  Kategori *
                </label>
                <select
                  value={uploadForm.category}
                  onChange={(e) =>
                    setUploadForm((prev) => ({
                      ...prev,
                      category: e.target.value as GalleryCategory,
                    }))
                  }
                  className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                >
                  <option value="uretim">Üretim</option>
                  <option value="urunler">Ürünler</option>
                  <option value="etkinlikler">Etkinlikler</option>
                </select>
              </div>

              {/* Title TR */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                  Başlık (TR) *
                </label>
                <input
                  type="text"
                  value={uploadForm.title_tr}
                  onChange={(e) =>
                    setUploadForm((prev) => ({ ...prev, title_tr: e.target.value }))
                  }
                  placeholder="Türkçe başlık"
                  className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {/* Title EN */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                  Başlık (EN)
                </label>
                <input
                  type="text"
                  value={uploadForm.title_en}
                  onChange={(e) =>
                    setUploadForm((prev) => ({ ...prev, title_en: e.target.value }))
                  }
                  placeholder="English title (opsiyonel)"
                  className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {/* Description TR */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                  Açıklama (TR)
                </label>
                <input
                  type="text"
                  value={uploadForm.description_tr}
                  onChange={(e) =>
                    setUploadForm((prev) => ({ ...prev, description_tr: e.target.value }))
                  }
                  placeholder="Kısa açıklama (opsiyonel)"
                  className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {/* Description EN */}
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                  Açıklama (EN)
                </label>
                <input
                  type="text"
                  value={uploadForm.description_en}
                  onChange={(e) =>
                    setUploadForm((prev) => ({ ...prev, description_en: e.target.value }))
                  }
                  placeholder="Short description (optional)"
                  className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            {uploadError && (
              <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {uploadError}
              </p>
            )}

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowUploadPanel(false)}
                className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted"
              >
                İptal
              </button>
              <button
                type="submit"
                disabled={uploading || uploadForm.files.length === 0}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-50"
              >
                {uploading ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Yükleniyor...
                  </>
                ) : (
                  <>
                    <Upload size={14} />
                    {uploadForm.files.length > 1
                      ? `${uploadForm.files.length} Görsel Yükle`
                      : "Yükle"}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Category Filter Tabs */}
      <div className="flex gap-1 rounded-xl border border-border bg-card p-1 w-fit">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-all ${
              activeTab === tab
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {CATEGORY_LABELS[tab]}
          </button>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
          <button
            onClick={fetchImages}
            className="ml-3 font-semibold underline underline-offset-2"
          >
            Tekrar dene
          </button>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 size={32} className="animate-spin text-muted-foreground" />
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && images.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <ImageIcon size={44} className="mb-3 opacity-25" />
          <p className="text-sm font-medium">Görsel bulunamadı</p>
          <p className="text-xs">Görsel eklemek için &ldquo;Görsel Ekle&rdquo; butonunu kullanın</p>
        </div>
      )}

      {/* Grid */}
      {!loading && images.length > 0 && (
        <>
          {/* Select All Bar */}
          <div className="flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-2.5">
            <button
              onClick={toggleSelectAll}
              className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {allSelected ? (
                <CheckSquare size={16} className="text-primary" />
              ) : (
                <Square size={16} />
              )}
              {allSelected ? "Seçimi Kaldır" : "Tümünü Seç"}
            </button>
            {someSelected && (
              <span className="text-xs text-muted-foreground">
                {selectedIds.size} / {images.length} seçili
              </span>
            )}
            <span className="ml-auto text-xs text-muted-foreground">
              Sıralamak için sürükleyin
            </span>
          </div>

          {/* Results count */}
          {!loading && total > 0 && (
            <p className="text-xs text-muted-foreground">
              {total} sonuçtan {Math.min((page - 1) * PAGE_SIZE + 1, total)}–{Math.min(page * PAGE_SIZE, total)} gösteriliyor
            </p>
          )}

          {/* Image Cards Grid */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {images.map((image) => (
              <div
                key={image.id}
                draggable
                onDragStart={() => handleDragStart(image.id)}
                onDragOver={(e) => handleDragOver(e, image.id)}
                onDrop={handleDrop}
                onDragEnd={handleDragEnd}
                className={`group relative flex flex-col overflow-hidden rounded-xl border bg-card shadow-sm transition-all hover:shadow-md ${
                  selectedIds.has(image.id)
                    ? "border-primary ring-2 ring-primary/30"
                    : "border-border"
                } ${!image.is_active ? "opacity-60" : ""}`}
              >
                {/* Thumbnail */}
                <div className="relative aspect-square w-full overflow-hidden bg-muted">
                  <Image
                    src={image.image_url}
                    alt={image.title_tr}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    unoptimized
                  />
                  {/* Drag handle overlay */}
                  <div className="absolute left-1 top-1 cursor-grab opacity-0 transition-opacity group-hover:opacity-100">
                    <GripVertical
                      size={20}
                      className="rounded bg-black/50 p-0.5 text-white"
                    />
                  </div>
                  {/* Select checkbox */}
                  <button
                    onClick={() => toggleSelect(image.id)}
                    className="absolute right-1.5 top-1.5 opacity-0 transition-opacity group-hover:opacity-100"
                    title="Seç"
                  >
                    {selectedIds.has(image.id) ? (
                      <CheckSquare size={18} className="text-primary drop-shadow" />
                    ) : (
                      <Square size={18} className="text-white drop-shadow" />
                    )}
                  </button>
                  {/* Inactive overlay */}
                  {!image.is_active && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                      <EyeOff size={20} className="text-white/80" />
                    </div>
                  )}
                </div>

                {/* Card Body */}
                <div className="flex flex-1 flex-col p-2.5">
                  <span
                    className={`mb-1.5 inline-block w-fit rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                      CATEGORY_BADGE[image.category]
                    }`}
                  >
                    {CATEGORY_LABELS[image.category]}
                  </span>
                  <p className="line-clamp-2 text-xs font-medium text-foreground leading-snug">
                    {image.title_tr}
                  </p>
                  <p className="mt-0.5 text-[10px] text-muted-foreground">
                    #{image.display_order}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between border-t border-border px-2.5 py-2">
                  {/* Active toggle */}
                  <button
                    onClick={() => toggleActive(image)}
                    title={image.is_active ? "Devre dışı bırak" : "Etkinleştir"}
                    className={`flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium transition-colors ${
                      image.is_active
                        ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    {image.is_active ? (
                      <>
                        <Eye size={11} />
                        Aktif
                      </>
                    ) : (
                      <>
                        <EyeOff size={11} />
                        Pasif
                      </>
                    )}
                  </button>
                  {/* Delete */}
                  <button
                    onClick={() => deleteImage(image.id)}
                    title="Sil"
                    className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
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
        </>
      )}
    </div>
  );
}
