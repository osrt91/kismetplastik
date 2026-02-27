"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  Upload,
  Trash2,
  Image as ImageIcon,
  X,
  Check,
  Loader2,
  Eye,
  EyeOff,
  GripVertical,
  Search,
  Filter,
} from "lucide-react";

interface GalleryImage {
  id: string;
  category: string;
  title_tr: string;
  title_en: string;
  description_tr: string | null;
  description_en: string | null;
  image_url: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
}

type Category = "uretim" | "urunler" | "etkinlikler";

const categoryLabels: Record<Category, string> = {
  uretim: "Üretim Tesisi",
  urunler: "Ürünlerimiz",
  etkinlikler: "Etkinlikler",
};

const categoryColors: Record<Category, string> = {
  uretim: "bg-blue-100 text-blue-700",
  urunler: "bg-emerald-100 text-emerald-700",
  etkinlikler: "bg-purple-100 text-purple-700",
};

function getAdminToken(): string {
  const match = document.cookie.match(/(?:^|;\s*)admin-token=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : "";
}

export default function AdminGalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [filterCat, setFilterCat] = useState<Category | "all">("all");
  const [search, setSearch] = useState("");
  const [dragOver, setDragOver] = useState(false);

  const [formCategory, setFormCategory] = useState<Category>("uretim");
  const [formTitleTr, setFormTitleTr] = useState("");
  const [formTitleEn, setFormTitleEn] = useState("");
  const [formDescTr, setFormDescTr] = useState("");
  const [formDescEn, setFormDescEn] = useState("");
  const [formOrder, setFormOrder] = useState(0);
  const [formFile, setFormFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const fetchImages = useCallback(async () => {
    try {
      const res = await fetch("/api/gallery");
      const json = await res.json();
      if (json.success) setImages(json.data || []);
    } catch (err) {
      console.error("Galeri yüklenemedi:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchImages(); }, [fetchImages]);

  const handleFileSelect = (file: File) => {
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      alert("Sadece JPEG, PNG, WebP desteklenir.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      alert("Dosya boyutu 10MB'ı aşamaz.");
      return;
    }
    setFormFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!formFile || !formTitleTr.trim()) return;
    setUploading(true);

    try {
      const fd = new FormData();
      fd.append("file", formFile);
      fd.append("category", formCategory);
      fd.append("title_tr", formTitleTr);
      fd.append("title_en", formTitleEn || formTitleTr);
      fd.append("description_tr", formDescTr);
      fd.append("description_en", formDescEn);
      fd.append("display_order", String(formOrder));

      const res = await fetch("/api/gallery", {
        method: "POST",
        headers: { "x-admin-secret": getAdminToken() },
        body: fd,
      });

      const json = await res.json();
      if (json.success) {
        resetForm();
        setShowUpload(false);
        fetchImages();
      } else {
        alert(json.error || "Yükleme başarısız.");
      }
    } catch {
      alert("Yükleme sırasında hata oluştu.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bu görseli silmek istediğinize emin misiniz?")) return;
    try {
      const res = await fetch(`/api/gallery/${id}`, {
        method: "DELETE",
        headers: { "x-admin-secret": getAdminToken() },
      });
      const json = await res.json();
      if (json.success) {
        setImages((prev) => prev.filter((img) => img.id !== id));
      }
    } catch {
      alert("Silme işlemi başarısız.");
    }
  };

  const handleToggleActive = async (id: string, currentActive: boolean) => {
    try {
      const res = await fetch(`/api/gallery/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-admin-secret": getAdminToken(),
        },
        body: JSON.stringify({ is_active: !currentActive }),
      });
      const json = await res.json();
      if (json.success) {
        setImages((prev) =>
          prev.map((img) => (img.id === id ? { ...img, is_active: !currentActive } : img))
        );
      }
    } catch {
      alert("Güncelleme başarısız.");
    }
  };

  const resetForm = () => {
    setFormCategory("uretim");
    setFormTitleTr("");
    setFormTitleEn("");
    setFormDescTr("");
    setFormDescEn("");
    setFormOrder(0);
    setFormFile(null);
    setPreview(null);
  };

  const filtered = images.filter((img) => {
    if (filterCat !== "all" && img.category !== filterCat) return false;
    if (search) {
      const q = search.toLowerCase();
      return img.title_tr.toLowerCase().includes(q) || img.title_en.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Galeri Yönetimi</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {images.length} görsel kayıtlı
          </p>
        </div>
        <button
          onClick={() => { setShowUpload(!showUpload); if (showUpload) resetForm(); }}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90"
        >
          {showUpload ? <X size={16} /> : <Upload size={16} />}
          {showUpload ? "İptal" : "Görsel Yükle"}
        </button>
      </div>

      {/* Upload Form */}
      {showUpload && (
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-foreground">Yeni Görsel Ekle</h2>
          <div className="grid gap-5 lg:grid-cols-2">
            {/* Left: File Upload */}
            <div>
              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOver(false);
                  const file = e.dataTransfer.files[0];
                  if (file) handleFileSelect(file);
                }}
                onClick={() => document.getElementById("gallery-file-input")?.click()}
                className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 transition-all ${
                  dragOver
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50 hover:bg-muted/50"
                }`}
              >
                {preview ? (
                  <div className="relative w-full">
                    <img src={preview} alt="Önizleme" className="mx-auto max-h-48 rounded-lg object-contain" />
                    <button
                      onClick={(e) => { e.stopPropagation(); setFormFile(null); setPreview(null); }}
                      className="absolute right-0 top-0 rounded-full bg-destructive p-1 text-white"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <>
                    <Upload size={32} className="mb-3 text-muted-foreground" />
                    <p className="text-sm font-medium text-foreground">Görsel sürükleyip bırakın</p>
                    <p className="mt-1 text-xs text-muted-foreground">veya tıklayarak seçin (JPEG, PNG, WebP — max 10MB)</p>
                  </>
                )}
              </div>
              <input
                id="gallery-file-input"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileSelect(file);
                }}
              />
            </div>

            {/* Right: Form Fields */}
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">Kategori *</label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value as Category)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                >
                  {(Object.keys(categoryLabels) as Category[]).map((k) => (
                    <option key={k} value={k}>{categoryLabels[k]}</option>
                  ))}
                </select>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">Başlık (TR) *</label>
                  <input
                    type="text"
                    value={formTitleTr}
                    onChange={(e) => setFormTitleTr(e.target.value)}
                    placeholder="Enjeksiyon Hattı"
                    className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">Başlık (EN)</label>
                  <input
                    type="text"
                    value={formTitleEn}
                    onChange={(e) => setFormTitleEn(e.target.value)}
                    placeholder="Injection Line"
                    className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">Açıklama (TR)</label>
                  <textarea
                    value={formDescTr}
                    onChange={(e) => setFormDescTr(e.target.value)}
                    rows={2}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">Açıklama (EN)</label>
                  <textarea
                    value={formDescEn}
                    onChange={(e) => setFormDescEn(e.target.value)}
                    rows={2}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">Sıralama</label>
                <input
                  type="number"
                  value={formOrder}
                  onChange={(e) => setFormOrder(parseInt(e.target.value) || 0)}
                  className="w-32 rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <button
                onClick={handleUpload}
                disabled={uploading || !formFile || !formTitleTr.trim()}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {uploading ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                {uploading ? "Yükleniyor..." : "Yükle"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Başlık ile ara..."
            className="w-full rounded-lg border border-border bg-card py-2.5 pl-9 pr-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-muted-foreground" />
          <div className="flex gap-1">
            {(["all", ...Object.keys(categoryLabels)] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCat(cat as Category | "all")}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                  filterCat === cat
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {cat === "all" ? "Tümü" : categoryLabels[cat as Category]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Gallery Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={32} className="animate-spin text-muted-foreground" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
          <ImageIcon size={40} className="mb-3 opacity-30" />
          <p className="text-sm font-medium">
            {images.length === 0 ? "Henüz görsel eklenmemiş" : "Sonuç bulunamadı"}
          </p>
          {images.length === 0 && (
            <p className="mt-1 text-xs">Yukarıdaki &ldquo;Görsel Yükle&rdquo; butonuyla başlayın.</p>
          )}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((img) => (
            <div
              key={img.id}
              className={`group relative flex flex-col overflow-hidden rounded-xl border bg-card shadow-sm transition-all hover:shadow-md ${
                img.is_active ? "border-border" : "border-destructive/30 opacity-60"
              }`}
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                <Image
                  src={img.image_url}
                  alt={img.title_tr}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute left-2 top-2 flex gap-1.5">
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${categoryColors[img.category as Category]}`}>
                    {categoryLabels[img.category as Category]}
                  </span>
                </div>
                <div className="absolute right-2 top-2">
                  <GripVertical size={14} className="text-white/60 drop-shadow" />
                  <span className="mt-0.5 block text-center text-[10px] font-bold text-white drop-shadow">
                    #{img.display_order}
                  </span>
                </div>
              </div>
              <div className="flex flex-1 flex-col p-4">
                <h3 className="mb-1 text-sm font-semibold text-foreground line-clamp-1">
                  {img.title_tr}
                </h3>
                {img.description_tr && (
                  <p className="mb-3 text-xs text-muted-foreground line-clamp-2">
                    {img.description_tr}
                  </p>
                )}
                <div className="mt-auto flex items-center gap-2 border-t border-border pt-3">
                  <button
                    onClick={() => handleToggleActive(img.id, img.is_active)}
                    className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg border py-2 text-xs font-medium transition-colors ${
                      img.is_active
                        ? "border-border text-muted-foreground hover:bg-muted"
                        : "border-success/50 text-success hover:bg-success/10"
                    }`}
                  >
                    {img.is_active ? <EyeOff size={12} /> : <Eye size={12} />}
                    {img.is_active ? "Gizle" : "Göster"}
                  </button>
                  <button
                    onClick={() => handleDelete(img.id)}
                    className="flex items-center justify-center rounded-lg border border-border p-2 text-muted-foreground transition-colors hover:border-destructive/50 hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
