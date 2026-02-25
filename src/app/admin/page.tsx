"use client";

import { Package, Newspaper, Eye, TrendingUp } from "lucide-react";
import Link from "next/link";
import { products, categories } from "@/data/products";

const stats = [
  {
    label: "Toplam Ürün",
    value: products.length,
    icon: Package,
    color: "bg-blue-500/10 text-blue-600",
    href: "/admin/products",
  },
  {
    label: "Kategoriler",
    value: categories.length,
    icon: TrendingUp,
    color: "bg-emerald-500/10 text-emerald-600",
    href: "/admin/products",
  },
  {
    label: "Öne Çıkan",
    value: products.filter((p) => p.featured).length,
    icon: Eye,
    color: "bg-amber-500/10 text-amber-600",
    href: "/admin/products",
  },
  {
    label: "Blog Yazıları",
    value: 8,
    icon: Newspaper,
    color: "bg-purple-500/10 text-purple-600",
    href: "/admin/blog",
  },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Dashboard</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Kısmet Plastik yönetim paneline hoş geldiniz.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="group rounded-xl border border-neutral-200 bg-white p-5 shadow-sm transition-all hover:border-neutral-300 hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.color}`}
              >
                <stat.icon size={20} />
              </div>
              <span className="text-3xl font-bold text-neutral-900">
                {stat.value}
              </span>
            </div>
            <p className="mt-3 text-sm font-medium text-neutral-500">
              {stat.label}
            </p>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-neutral-900">
          Hızlı İşlemler
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/admin/products/new"
            className="flex items-center gap-3 rounded-xl border border-dashed border-neutral-300 bg-white p-4 text-sm font-medium text-neutral-600 transition-all hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700"
          >
            <Package size={18} />
            Yeni Ürün Ekle
          </Link>
          <Link
            href="/admin/blog/new"
            className="flex items-center gap-3 rounded-xl border border-dashed border-neutral-300 bg-white p-4 text-sm font-medium text-neutral-600 transition-all hover:border-purple-400 hover:bg-purple-50 hover:text-purple-700"
          >
            <Newspaper size={18} />
            Yeni Blog Yazısı
          </Link>
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 rounded-xl border border-dashed border-neutral-300 bg-white p-4 text-sm font-medium text-neutral-600 transition-all hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-700"
          >
            <Eye size={18} />
            Siteyi Görüntüle
          </Link>
        </div>
      </div>

      {/* Recent Products */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-neutral-900">
          Son Eklenen Ürünler
        </h2>
        <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-100 bg-neutral-50">
                <th className="px-4 py-3 text-left font-semibold text-neutral-500">
                  Ürün
                </th>
                <th className="hidden px-4 py-3 text-left font-semibold text-neutral-500 sm:table-cell">
                  Kategori
                </th>
                <th className="hidden px-4 py-3 text-left font-semibold text-neutral-500 md:table-cell">
                  Malzeme
                </th>
                <th className="px-4 py-3 text-left font-semibold text-neutral-500">
                  Durum
                </th>
              </tr>
            </thead>
            <tbody>
              {products.slice(0, 8).map((product) => (
                <tr
                  key={product.id}
                  className="border-b border-neutral-50 last:border-0"
                >
                  <td className="px-4 py-3 font-medium text-neutral-800">
                    {product.name}
                  </td>
                  <td className="hidden px-4 py-3 text-neutral-500 sm:table-cell">
                    {categories.find((c) => c.slug === product.category)?.name}
                  </td>
                  <td className="hidden px-4 py-3 text-neutral-500 md:table-cell">
                    {product.material}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        product.inStock
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-red-50 text-red-700"
                      }`}
                    >
                      {product.inStock ? "Stokta" : "Tükendi"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
