"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Save, Trash2, Plus, X } from "lucide-react";
import type { Product, Category, CategorySlug } from "@/types/product";

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<{
    name: string;
    slug: string;
    category: CategorySlug;
    description: string;
    shortDescription: string;
    volume: string;
    weight: string;
    neckDiameter: string;
    height: string;
    diameter: string;
    material: string;
    colors: string[];
    model: string;
    minOrder: number;
    inStock: boolean;
    featured: boolean;
  } | null>(null);
  const [newColor, setNewColor] = useState("");

  // Fetch product and categories from API
  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const [prodRes, catRes] = await Promise.all([
          fetch(`/api/products?ids=${encodeURIComponent(id)}&limit=1`),
          fetch("/api/products/categories"),
        ]);
        const prodJson = await prodRes.json();
        const catJson = await catRes.json();

        if (!cancelled) {
          const products = prodJson.data?.products ?? [];
          const p = products[0] ?? null;
          setProduct(p);
          if (p) {
            setForm({
              name: p.name,
              slug: p.slug,
              category: p.category as CategorySlug,
              description: p.description,
              shortDescription: p.shortDescription || p.short_description || "",
              volume: p.volume || "",
              weight: p.weight || "",
              neckDiameter: p.neckDiameter || p.neck_diameter || "",
              height: p.height || "",
              diameter: p.diameter || "",
              material: p.material,
              colors: [...(p.colors || [])],
              model: p.model || "",
              minOrder: p.minOrder || p.min_order || 10000,
              inStock: p.inStock ?? p.in_stock ?? true,
              featured: p.featured ?? false,
            });
          }
          if (catJson.success && catJson.data) {
            setCategories(catJson.data);
          }
        }
      } catch {
        // Failed to load
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <span className="h-8 w-8 animate-spin rounded-full border-3 border-neutral-200 border-t-primary" />
      </div>
    );
  }

  if (!product || !form) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
        <p className="text-lg font-medium">Urun bulunamadi</p>
        <Link
          href="/admin/products"
          className="mt-3 text-sm text-primary hover:underline"
        >
          Urun listesine don
        </Link>
      </div>
    );
  }

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    setForm((prev) =>
      prev
        ? {
            ...prev,
            [name]:
              type === "checkbox"
                ? (e.target as HTMLInputElement).checked
                : type === "number"
                  ? Number(value)
                  : value,
          }
        : prev
    );
  };

  const addColor = () => {
    const trimmed = newColor.trim();
    if (trimmed && !form.colors.includes(trimmed)) {
      setForm((prev) =>
        prev ? { ...prev, colors: [...prev.colors, trimmed] } : prev
      );
      setNewColor("");
    }
  };

  const removeColor = (color: string) => {
    setForm((prev) =>
      prev
        ? { ...prev, colors: prev.colors.filter((c) => c !== color) }
        : prev
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "PUT",
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

  const handleDelete = async () => {
    if (!confirm(`"${product.name}" ürününü silmek istediğinize emin misiniz?`)) return;
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        router.push("/admin/products");
      } else {
        const data = await res.json();
        alert(data.error || "Silme başarısız");
      }
    } catch {
      alert("Bağlantı hatası");
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Ürünü Düzenle
            </h1>
            <p className="text-sm text-muted-foreground">
              ID: {product.id}
            </p>
          </div>
        </div>
        <button
          onClick={handleDelete}
          className="rounded-lg p-2.5 text-destructive transition-colors hover:bg-destructive/10 hover:text-destructive"
          title="Ürünü Sil"
        >
          <Trash2 size={18} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
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
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-border px-3.5 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
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
              />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Teknik Özellikler
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { name: "volume", label: "Hacim", placeholder: "100ml" },
              { name: "weight", label: "Ağırlık", placeholder: "15g" },
              { name: "neckDiameter", label: "Ağız Çapı", placeholder: "24mm" },
              { name: "height", label: "Yükseklik", placeholder: "130mm" },
              { name: "diameter", label: "Çap", placeholder: "42mm" },
            ].map((field) => (
              <div key={field.name}>
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  {field.label}
                </label>
                <input
                  type="text"
                  name={field.name}
                  value={(form as Record<string, unknown>)[field.name] as string}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  className="w-full rounded-lg border border-border px-3.5 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
            ))}
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
              onKeyDown={(e) =>
                e.key === "Enter" && (e.preventDefault(), addColor())
              }
              placeholder="Renk adı ekle"
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

        <div className="flex items-center justify-end gap-3">
          <Link
            href="/admin/products"
            className="rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted"
          >
            İptal
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 disabled:opacity-50"
          >
            <Save size={16} />
            {saving ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
          </button>
        </div>
      </form>
    </div>
  );
}
