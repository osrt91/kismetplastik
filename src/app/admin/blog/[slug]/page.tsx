"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Trash2 } from "lucide-react";
import { useState } from "react";

const CATEGORIES = ["Üretim", "Sektör", "Bilgi", "Kalite", "Sürdürülebilirlik", "Rehber", "Kurumsal"];

const demoPosts: Record<string, { title: string; excerpt: string; content: string; category: string; readTime: string; featured: boolean }> = {
  "pet-sise-uretim-sureci": {
    title: "PET Şişe Üretim Süreci: Hammaddeden Ürüne",
    excerpt: "PET şişelerin üretim aşamalarını, kullanılan teknolojileri ve kalite kontrol süreçlerini detaylı olarak inceliyoruz.",
    content: "PET (Polietilen Tereftalat), günümüzde en yaygın kullanılan ambalaj malzemelerinden biridir.\n\nPET şişe üretim süreci temel olarak iki ana aşamadan oluşur: preform üretimi (enjeksiyon kalıplama) ve şişe üretimi (şişirme kalıplama).",
    category: "Üretim",
    readTime: "8 dk",
    featured: true,
  },
};

export default function EditBlogPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const post = demoPosts[slug];

  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(
    post ?? { title: slug, excerpt: "", content: "", category: "Bilgi", readTime: "5 dk", featured: false }
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch(`/api/admin/blog/${slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        router.push("/admin/blog");
      } else {
        alert(data.error || "Kaydetme başarısız");
      }
    } catch {
      alert("Bağlantı hatası");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
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
            <p className="text-sm text-muted-foreground">Slug: {slug}</p>
          </div>
        </div>
        <button className="rounded-lg p-2.5 text-destructive transition-colors hover:bg-destructive/10 hover:text-destructive">
          <Trash2 size={18} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Yazı Bilgileri
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-foreground">Başlık</label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                className="w-full rounded-lg border border-border px-3.5 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Kategori</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full rounded-lg border border-border px-3.5 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Okuma Süresi</label>
              <input
                type="text"
                name="readTime"
                value={form.readTime}
                onChange={handleChange}
                className="w-full rounded-lg border border-border px-3.5 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-foreground">Özet</label>
              <textarea
                name="excerpt"
                value={form.excerpt}
                onChange={handleChange}
                rows={2}
                className="w-full rounded-lg border border-border px-3.5 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-foreground">İçerik</label>
              <textarea
                name="content"
                value={form.content}
                onChange={handleChange}
                rows={12}
                className="w-full rounded-lg border border-border px-3.5 py-2.5 text-sm leading-relaxed outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <label className="flex items-center gap-2 text-sm text-foreground">
            <input
              type="checkbox"
              name="featured"
              checked={form.featured}
              onChange={handleChange}
              className="h-4 w-4 rounded border-border text-primary"
            />
            Öne Çıkan
          </label>
        </div>

        <div className="flex items-center justify-end gap-3">
          <Link
            href="/admin/blog"
            className="rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted"
          >
            İptal
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 disabled:opacity-50"
          >
            <Save size={16} />
            {saving ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
          </button>
        </div>
      </form>
    </div>
  );
}
