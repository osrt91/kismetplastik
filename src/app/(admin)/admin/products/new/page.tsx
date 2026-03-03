"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Plus, X } from "lucide-react";
import { categories } from "@/data/products";
import type { CategorySlug } from "@/types/product";

export default function NewProductPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    slug: "",
    category: "pet-siseler" as CategorySlug,
    description: "",
    shortDescription: "",
    volume: "",
    weight: "",
    neckDiameter: "",
    height: "",
    diameter: "",
    material: "PET",
    colors: ["Şeffaf"],
    model: "",
    minOrder: 10000,
    inStock: true,
    featured: false,
  });
  const [newColor, setNewColor] = useState("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked :
        type === "number" ? Number(value) :
        value,
    }));
  };

  const addColor = () => {
    const trimmed = newColor.trim();
    if (trimmed && !form.colors.includes(trimmed)) {
      setForm((prev) => ({ ...prev, colors: [...prev.colors, trimmed] }));
      setNewColor("");
    }
  };

  const removeColor = (color: string) => {
    setForm((prev) => ({
      ...prev,
      colors: prev.colors.filter((c) => c !== color),
    }));
  };

  const autoSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/ğ/g, "g")
      .replace(/ü/g, "u")
      .replace(/ş/g, "s")
      .replace(/ı/g, "i")
      .replace(/ö/g, "o")
      .replace(/ç/g, "c")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setForm((prev) => ({
      ...prev,
      name,
      slug: autoSlug(name),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        router.push("/admin/products");
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
      <div className="flex items-center gap-3">
        <Link
          href="/admin/products"
          className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Yeni Ürün</h1>
          <p className="text-sm text-muted-foreground">
            Yeni bir ürün kaydı oluşturun
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Temel Bilgiler
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-foreground">
                Ürün Adı *
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleNameChange}
                required
                className="w-full rounded-lg border border-border px-3.5 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                placeholder="PET Şişe 100ml Silindir"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">
                Slug
              </label>
              <input
                type="text"
                name="slug"
                value={form.slug}
                onChange={handleChange}
                className="w-full rounded-lg border border-border px-3.5 py-2.5 text-sm text-muted-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">
                Kategori *
              </label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full rounded-lg border border-border px-3.5 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              >
                {categories.map((cat) => (
                  <option key={cat.slug} value={cat.slug}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-foreground">
                Kısa Açıklama
              </label>
              <input
                type="text"
                name="shortDescription"
                value={form.shortDescription}
                onChange={handleChange}
                className="w-full rounded-lg border border-border px-3.5 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                placeholder="Kısa açıklama"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-foreground">
                Detaylı Açıklama
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={3}
                className="w-full rounded-lg border border-border px-3.5 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                placeholder="Ürün hakkında detaylı bilgi..."
              />
            </div>
          </div>
        </div>

        {/* Technical Specs */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Teknik Özellikler
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">
                Hacim
              </label>
              <input
                type="text"
                name="volume"
                value={form.volume}
                onChange={handleChange}
                placeholder="100ml"
                className="w-full rounded-lg border border-border px-3.5 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">
                Ağırlık
              </label>
              <input
                type="text"
                name="weight"
                value={form.weight}
                onChange={handleChange}
                placeholder="15g"
                className="w-full rounded-lg border border-border px-3.5 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">
                Ağız Çapı
              </label>
              <input
                type="text"
                name="neckDiameter"
                value={form.neckDiameter}
                onChange={handleChange}
                placeholder="24mm"
                className="w-full rounded-lg border border-border px-3.5 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">
                Yükseklik
              </label>
              <input
                type="text"
                name="height"
                value={form.height}
                onChange={handleChange}
                placeholder="130mm"
                className="w-full rounded-lg border border-border px-3.5 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">
                Çap
              </label>
              <input
                type="text"
                name="diameter"
                value={form.diameter}
                onChange={handleChange}
                placeholder="42mm"
                className="w-full rounded-lg border border-border px-3.5 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">
                Malzeme
              </label>
              <select
                name="material"
                value={form.material}
                onChange={handleChange}
                className="w-full rounded-lg border border-border px-3.5 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              >
                <option value="PET">PET</option>
                <option value="HDPE">HDPE</option>
                <option value="PP">PP</option>
                <option value="LDPE">LDPE</option>
              </select>
            </div>
          </div>
        </div>

        {/* Colors */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Renkler
          </h2>
          <div className="mb-3 flex flex-wrap gap-2">
            {form.colors.map((color) => (
              <span
                key={color}
                className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-sm text-foreground"
              >
                {color}
                <button
                  type="button"
                  onClick={() => removeColor(color)}
                  className="ml-1 text-muted-foreground hover:text-destructive"
                >
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={newColor}
              onChange={(e) => setNewColor(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addColor())}
              placeholder="Renk adı (ör: Şeffaf, Amber)"
              className="flex-1 rounded-lg border border-border px-3.5 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
            <button
              type="button"
              onClick={addColor}
              className="rounded-lg border border-border px-3 py-2 text-muted-foreground hover:bg-muted"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>

        {/* Status */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Durum
          </h2>
          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-2 text-sm text-foreground">
              <input
                type="checkbox"
                name="inStock"
                checked={form.inStock}
                onChange={handleChange}
                className="h-4 w-4 rounded border-border text-primary"
              />
              Stokta
            </label>
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
            <div className="flex items-center gap-2">
              <label className="text-sm text-foreground">Min. Sipariş:</label>
              <input
                type="number"
                name="minOrder"
                value={form.minOrder}
                onChange={handleChange}
                className="w-28 rounded-lg border border-border px-3 py-1.5 text-sm outline-none focus:border-primary"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3">
          <Link
            href="/admin/products"
            className="rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted"
          >
            İptal
          </Link>
          <button
            type="submit"
            disabled={saving || !form.name}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 disabled:opacity-50"
          >
            <Save size={16} />
            {saving ? "Kaydediliyor..." : "Kaydet"}
          </button>
        </div>
      </form>
    </div>
  );
}
