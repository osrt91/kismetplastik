"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Upload, X, Eye, EyeOff, Loader2 } from "lucide-react";

const CATEGORIES = [
  "Üretim",
  "Sektör",
  "Bilgi",
  "Kalite",
  "Sürdürülebilirlik",
  "Rehber",
  "Kurumsal",
];

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

interface FormState {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string;
  image_url: string;
  read_time: string;
  featured: boolean;
  status: "draft" | "published";
}

export default function NewBlogPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const [form, setForm] = useState<FormState>({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    category: "Bilgi",
    tags: "",
    image_url: "",
    read_time: "5 dk",
    featured: false,
    status: "draft",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setForm((prev) => ({ ...prev, title, slug: slugify(title) }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);

      const res = await fetch("/api/admin/blog/upload", { method: "POST", body: fd });
      const json = await res.json();

      if (res.ok && json.success) {
        setForm((prev) => ({ ...prev, image_url: json.data.url }));
      } else {
        alert(json.error ?? "Görsel yüklenemedi");
      }
    } catch {
      alert("Bağlantı hatası");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveError(null);

    try {
      const res = await fetch("/api/admin/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          slug: form.slug,
          excerpt: form.excerpt,
          content: form.content,
          category: form.category,
          tags: form.tags,
          image_url: form.image_url || null,
          read_time: form.read_time,
          featured: form.featured,
          status: form.status,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        router.push("/admin/blog");
      } else {
        setSaveError(data.error ?? "Kaydetme başarısız");
      }
    } catch {
      setSaveError("Bağlantı hatası");
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20";

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/admin/blog"
          className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Yeni Blog Yazısı</h1>
          <p className="text-sm text-muted-foreground">Yeni bir blog yazısı oluşturun</p>
        </div>
      </div>

      {saveError && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {saveError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Yazı Bilgileri
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Title */}
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-foreground">
                Başlık <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleTitleChange}
                required
                className={inputClass}
                placeholder="Blog yazısı başlığı"
              />
            </div>

            {/* Slug */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">
                Slug (URL)
              </label>
              <input
                type="text"
                name="slug"
                value={form.slug}
                onChange={handleChange}
                className={`${inputClass} font-mono text-xs`}
                placeholder="ornek-yazi-basligi"
              />
              <p className="mt-1 text-xs text-muted-foreground">
                Başlıktan otomatik oluşturulur, düzenleyebilirsiniz
              </p>
            </div>

            {/* Category */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">
                Kategori
              </label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className={inputClass}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Excerpt */}
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-foreground">
                Özet <span className="text-destructive">*</span>
              </label>
              <textarea
                name="excerpt"
                value={form.excerpt}
                onChange={handleChange}
                rows={2}
                required
                className={inputClass}
                placeholder="Yazının kısa özeti (liste ve paylaşım görünümünde gösterilir)"
              />
            </div>

            {/* Content */}
            <div className="sm:col-span-2">
              <div className="mb-1.5 flex items-center justify-between">
                <label className="text-sm font-medium text-foreground">
                  İçerik <span className="text-destructive">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowPreview(!showPreview)}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                >
                  {showPreview ? <EyeOff size={13} /> : <Eye size={13} />}
                  {showPreview ? "Düzenle" : "Önizle"}
                </button>
              </div>
              {showPreview ? (
                <div className="min-h-[200px] rounded-lg border border-border bg-background px-4 py-3 text-sm leading-relaxed text-foreground">
                  {form.content ? (
                    form.content.split("\n\n").map((para, i) => (
                      <p key={i} className="mb-4 last:mb-0">
                        {para}
                      </p>
                    ))
                  ) : (
                    <span className="text-muted-foreground">İçerik yok</span>
                  )}
                </div>
              ) : (
                <textarea
                  name="content"
                  value={form.content}
                  onChange={handleChange}
                  rows={14}
                  required
                  className={`${inputClass} leading-relaxed`}
                  placeholder={"Yazı içeriğini buraya yazın.\n\nHer paragraf arasında bir boş satır bırakın.\n\nMarkdown desteklenmez; düz metin kullanın."}
                />
              )}
              <p className="mt-1 text-xs text-muted-foreground">
                Paragrafları ayırmak için iki Enter kullanın (boş satır)
              </p>
            </div>

            {/* Tags */}
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-foreground">
                Etiketler
              </label>
              <input
                type="text"
                name="tags"
                value={form.tags}
                onChange={handleChange}
                className={inputClass}
                placeholder="etiket1, etiket2, etiket3"
              />
              <p className="mt-1 text-xs text-muted-foreground">
                Virgülle ayırın
              </p>
            </div>
          </div>
        </div>

        {/* Image Upload */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Kapak Görseli
          </h2>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
            {form.image_url ? (
              <div className="relative w-full sm:w-48">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={form.image_url}
                  alt="Kapak görseli"
                  className="h-32 w-full rounded-lg border border-border object-cover sm:w-48"
                />
                <button
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, image_url: "" }))}
                  className="absolute right-1 top-1 rounded-full bg-destructive p-1 text-white shadow hover:bg-destructive/90"
                >
                  <X size={12} />
                </button>
              </div>
            ) : (
              <div className="flex h-32 w-full items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/30 sm:w-48">
                {uploading ? (
                  <Loader2 size={24} className="animate-spin text-muted-foreground" />
                ) : (
                  <span className="text-xs text-muted-foreground">Görsel yok</span>
                )}
              </div>
            )}
            <div className="flex flex-1 flex-col gap-3">
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="blog-image-upload"
                />
                <label
                  htmlFor="blog-image-upload"
                  className={`inline-flex cursor-pointer items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground ${
                    uploading ? "pointer-events-none opacity-50" : ""
                  }`}
                >
                  <Upload size={14} />
                  {uploading ? "Yükleniyor..." : "Görsel Yükle"}
                </label>
              </div>
              <div>
                <label className="mb-1 block text-xs text-muted-foreground">
                  veya URL girin
                </label>
                <input
                  type="url"
                  name="image_url"
                  value={form.image_url}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="https://..."
                />
              </div>
              <p className="text-xs text-muted-foreground">JPEG, PNG, WebP &mdash; max 5 MB</p>
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Ayarlar
          </h2>
          <div className="grid gap-5 sm:grid-cols-2">
            {/* Read time */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">
                Okuma Süresi
              </label>
              <input
                type="text"
                name="read_time"
                value={form.read_time}
                onChange={handleChange}
                className={inputClass}
                placeholder="5 dk"
              />
            </div>

            {/* Status */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">
                Durum
              </label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="draft">Taslak</option>
                <option value="published">Yayında</option>
              </select>
            </div>

            {/* Featured */}
            <div className="flex items-center sm:col-span-2">
              <label className="flex cursor-pointer items-center gap-3 text-sm text-foreground">
                <input
                  type="checkbox"
                  name="featured"
                  checked={form.featured}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-border text-primary"
                />
                <span>
                  <span className="font-medium">Öne Çıkan</span>
                  <span className="ml-2 text-xs text-muted-foreground">
                    Ana sayfada ve öne çıkan bölümde gösterilir
                  </span>
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pb-8">
          <Link
            href="/admin/blog"
            className="rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted"
          >
            İptal
          </Link>
          <button
            type="submit"
            disabled={saving || uploading || !form.title.trim() || !form.excerpt.trim() || !form.slug.trim()}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Kaydediliyor...
              </>
            ) : (
              <>
                <Save size={16} />
                {form.status === "published" ? "Yayınla" : "Taslak Kaydet"}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
