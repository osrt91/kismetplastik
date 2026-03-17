"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import { ArrowLeft, Save, Trash2, Upload, X, Eye, EyeOff, Loader2 } from "lucide-react";
import type { DbBlogPost } from "@/types/database";

const RichTextEditor = dynamic(() => import("@/components/admin/RichTextEditor"), { ssr: false });

const CATEGORIES = [
  "Üretim",
  "Sektör",
  "Bilgi",
  "Kalite",
  "Sürdürülebilirlik",
  "Rehber",
  "Kurumsal",
];

interface FormState {
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string;
  image_url: string;
  read_time: string;
  featured: boolean;
  status: "draft" | "published";
}

function postToForm(post: DbBlogPost): FormState {
  // Prefer content_html (rich text), fall back to joining content array
  const htmlContent = post.content_html
    ? post.content_html
    : Array.isArray(post.content)
    ? post.content.map((p) => `<p>${p}</p>`).join("")
    : String(post.content ?? "");

  return {
    title: post.title,
    excerpt: post.excerpt,
    content: htmlContent,
    category: post.category,
    tags: Array.isArray(post.tags) ? post.tags.join(", ") : "",
    image_url: post.image_url ?? "",
    read_time: post.read_time,
    featured: post.featured,
    status: post.status,
  };
}

export default function EditBlogPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  const [form, setForm] = useState<FormState>({
    title: "",
    excerpt: "",
    content: "",
    category: "Bilgi",
    tags: "",
    image_url: "",
    read_time: "5 dk",
    featured: false,
    status: "draft",
  });

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setFetchError(null);

    fetch(`/api/admin/blog/${slug}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          setForm(postToForm(json.data as DbBlogPost));
        } else {
          setFetchError(json.error ?? "Yazı yüklenemedi");
        }
      })
      .catch(() => setFetchError("Bağlantı hatası"))
      .finally(() => setLoading(false));
  }, [slug]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);

      const res = await fetch((process.env.NEXT_PUBLIC_BASE_PATH || "") + "/api/admin/blog/upload", { method: "POST", body: fd });
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
      const res = await fetch(`/api/admin/blog/${slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          excerpt: form.excerpt,
          content: form.content,
          content_html: form.content,
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

  const handleDelete = async () => {
    if (!confirm(`"${form.title}" başlıklı yazıyı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.`)) return;
    setDeleting(true);

    try {
      const res = await fetch(`/api/admin/blog/${slug}`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok && data.success) {
        router.push("/admin/blog");
      } else {
        alert(data.error ?? "Silme işlemi başarısız");
      }
    } catch {
      alert("Bağlantı hatası");
    } finally {
      setDeleting(false);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20";

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/blog"
            className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <ArrowLeft size={18} />
          </Link>
          <div className="h-8 w-48 animate-pulse rounded-lg bg-muted" />
        </div>
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-32 animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/blog"
            className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <ArrowLeft size={18} />
          </Link>
          <h1 className="text-xl font-bold text-foreground">Yazı Düzenle</h1>
        </div>
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-6 text-center text-sm text-destructive">
          <p className="font-medium">{fetchError}</p>
          <Link
            href="/admin/blog"
            className="mt-3 inline-block text-xs underline opacity-80 hover:opacity-100"
          >
            Blog listesine dön
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/blog"
            className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Yazıyı Düzenle</h1>
            <p className="font-mono text-xs text-muted-foreground">{slug}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleDelete}
          disabled={deleting}
          className="flex items-center gap-2 rounded-lg border border-destructive/30 px-3 py-2 text-sm text-destructive transition-colors hover:bg-destructive/10 disabled:opacity-40"
        >
          {deleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
          Sil
        </button>
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
                onChange={handleChange}
                required
                className={inputClass}
                placeholder="Blog yazısı başlığı"
              />
            </div>

            {/* Category */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Kategori</label>
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
                placeholder="Yazının kısa özeti..."
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
                <div
                  className="prose prose-invert prose-sm min-h-[200px] max-w-none rounded-lg border border-border bg-background px-4 py-3 text-sm leading-relaxed text-foreground"
                  dangerouslySetInnerHTML={{ __html: form.content || "<p>İçerik yok</p>" }}
                />
              ) : (
                <RichTextEditor
                  content={form.content}
                  onChange={(html) => setForm((prev) => ({ ...prev, content: html }))}
                  placeholder="Yazı içeriğini buraya yazın..."
                />
              )}
            </div>

            {/* Tags */}
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-foreground">Etiketler</label>
              <input
                type="text"
                name="tags"
                value={form.tags}
                onChange={handleChange}
                className={inputClass}
                placeholder="etiket1, etiket2, etiket3"
              />
              <p className="mt-1 text-xs text-muted-foreground">Virgülle ayırın</p>
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
                  id="blog-image-edit-upload"
                />
                <label
                  htmlFor="blog-image-edit-upload"
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
            {/* Status */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Durum</label>
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
            <div className="flex items-center">
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
                    Ana sayfada gösterilir
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
            disabled={saving || uploading || deleting || !form.title.trim() || !form.excerpt.trim()}
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
                Değişiklikleri Kaydet
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
