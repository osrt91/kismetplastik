"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Save, Trash2, Plus, X } from "lucide-react";
import { products, categories } from "@/data/products";
import type { CategorySlug } from "@/types/product";

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const product = products.find((p) => p.id === id);

  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(
    product
      ? {
          name: product.name,
          slug: product.slug,
          category: product.category as CategorySlug,
          description: product.description,
          shortDescription: product.shortDescription,
          volume: product.volume || "",
          weight: product.weight || "",
          neckDiameter: product.neckDiameter || "",
          height: product.height || "",
          diameter: product.diameter || "",
          material: product.material,
          colors: [...product.colors],
          model: product.model || "",
          minOrder: product.minOrder,
          inStock: product.inStock,
          featured: product.featured,
        }
      : null
  );
  const [newColor, setNewColor] = useState("");

  if (!product || !form) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-neutral-400">
        <p className="text-lg font-medium">Ürün bulunamadı</p>
        <Link
          href="/admin/products"
          className="mt-3 text-sm text-blue-500 hover:underline"
        >
          Ürün listesine dön
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
            className="rounded-lg p-2 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">
              Ürünü Düzenle
            </h1>
            <p className="text-sm text-neutral-500">
              ID: {product.id}
            </p>
          </div>
        </div>
        <button
          onClick={handleDelete}
          className="rounded-lg p-2.5 text-red-400 transition-colors hover:bg-red-50 hover:text-red-600"
          title="Ürünü Sil"
        >
          <Trash2 size={18} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-neutral-400">
            Temel Bilgiler
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                Ürün Adı *
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-neutral-200 px-3.5 py-2.5 text-sm outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                Slug
              </label>
              <input
                type="text"
                name="slug"
                value={form.slug}
                onChange={handleChange}
                className="w-full rounded-lg border border-neutral-200 px-3.5 py-2.5 text-sm text-neutral-500 outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                Kategori *
              </label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full rounded-lg border border-neutral-200 px-3.5 py-2.5 text-sm outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
              >
                {categories.map((cat) => (
                  <option key={cat.slug} value={cat.slug}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                Kısa Açıklama
              </label>
              <input
                type="text"
                name="shortDescription"
                value={form.shortDescription}
                onChange={handleChange}
                className="w-full rounded-lg border border-neutral-200 px-3.5 py-2.5 text-sm outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                Detaylı Açıklama
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={3}
                className="w-full rounded-lg border border-neutral-200 px-3.5 py-2.5 text-sm outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-neutral-400">
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
                <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                  {field.label}
                </label>
                <input
                  type="text"
                  name={field.name}
                  value={(form as Record<string, unknown>)[field.name] as string}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  className="w-full rounded-lg border border-neutral-200 px-3.5 py-2.5 text-sm outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            ))}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                Malzeme
              </label>
              <select
                name="material"
                value={form.material}
                onChange={handleChange}
                className="w-full rounded-lg border border-neutral-200 px-3.5 py-2.5 text-sm outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
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
        <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-neutral-400">
            Renkler
          </h2>
          <div className="mb-3 flex flex-wrap gap-2">
            {form.colors.map((color) => (
              <span
                key={color}
                className="inline-flex items-center gap-1 rounded-full bg-neutral-100 px-3 py-1 text-sm text-neutral-700"
              >
                {color}
                <button
                  type="button"
                  onClick={() => removeColor(color)}
                  className="ml-1 text-neutral-400 hover:text-red-500"
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
              className="flex-1 rounded-lg border border-neutral-200 px-3.5 py-2 text-sm outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
            />
            <button
              type="button"
              onClick={addColor}
              className="rounded-lg border border-neutral-200 px-3 py-2 text-neutral-500 hover:bg-neutral-50"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>

        {/* Status */}
        <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-neutral-400">
            Durum
          </h2>
          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-2 text-sm text-neutral-700">
              <input
                type="checkbox"
                name="inStock"
                checked={form.inStock}
                onChange={handleChange}
                className="h-4 w-4 rounded border-neutral-300 text-blue-600"
              />
              Stokta
            </label>
            <label className="flex items-center gap-2 text-sm text-neutral-700">
              <input
                type="checkbox"
                name="featured"
                checked={form.featured}
                onChange={handleChange}
                className="h-4 w-4 rounded border-neutral-300 text-blue-600"
              />
              Öne Çıkan
            </label>
            <div className="flex items-center gap-2">
              <label className="text-sm text-neutral-700">Min. Sipariş:</label>
              <input
                type="number"
                name="minOrder"
                value={form.minOrder}
                onChange={handleChange}
                className="w-28 rounded-lg border border-neutral-200 px-3 py-1.5 text-sm outline-none focus:border-blue-300"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          <Link
            href="/admin/products"
            className="rounded-lg border border-neutral-200 px-5 py-2.5 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-50"
          >
            İptal
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700 disabled:opacity-50"
          >
            <Save size={16} />
            {saving ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
          </button>
        </div>
      </form>
    </div>
  );
}
