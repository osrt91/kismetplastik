"use client";

import { Package, Newspaper, Eye, TrendingUp, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { products, categories } from "@/data/products";
import { blogPosts } from "@/data/blog";

const stats = [
  {
    label: "Toplam Ürün",
    value: products.length,
    icon: Package,
    color: "bg-primary/10 text-primary",
    href: "/admin/products",
  },
  {
    label: "Kategoriler",
    value: categories.length,
    icon: TrendingUp,
    color: "bg-success/10 text-success",
    href: "/admin/products",
  },
  {
    label: "Öne Çıkan",
    value: products.filter((p) => p.featured).length,
    icon: Eye,
    color: "bg-accent/10 text-accent",
    href: "/admin/products",
  },
  {
    label: "Blog Yazıları",
    value: blogPosts.length,
    icon: Newspaper,
    color: "bg-primary/10 text-primary",
    href: "/admin/blog",
  },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Kısmet Plastik yönetim paneline hoş geldiniz.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="group rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:border-border hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.color}`}
              >
                <stat.icon size={20} />
              </div>
              <span className="text-3xl font-bold text-foreground">
                {stat.value}
              </span>
            </div>
            <p className="mt-3 text-sm font-medium text-muted-foreground">
              {stat.label}
            </p>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-foreground">
          Hızlı İşlemler
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/admin/products/new"
            className="flex items-center gap-3 rounded-xl border border-dashed border-border bg-card p-4 text-sm font-medium text-muted-foreground transition-all hover:border-primary hover:bg-primary/10 hover:text-primary"
          >
            <Package size={18} />
            Yeni Ürün Ekle
          </Link>
          <Link
            href="/admin/blog/new"
            className="flex items-center gap-3 rounded-xl border border-dashed border-border bg-card p-4 text-sm font-medium text-muted-foreground transition-all hover:border-primary hover:bg-primary/10 hover:text-primary"
          >
            <Newspaper size={18} />
            Yeni Blog Yazısı
          </Link>
          <Link
            href="/admin/gallery"
            className="flex items-center gap-3 rounded-xl border border-dashed border-border bg-card p-4 text-sm font-medium text-muted-foreground transition-all hover:border-primary hover:bg-primary/10 hover:text-primary"
          >
            <ImageIcon size={18} />
            Galeri Yönetimi
          </Link>
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 rounded-xl border border-dashed border-border bg-card p-4 text-sm font-medium text-muted-foreground transition-all hover:border-success hover:bg-success/10 hover:text-success"
          >
            <Eye size={18} />
            Siteyi Görüntüle
          </Link>
        </div>
      </div>

      {/* Recent Products */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-foreground">
          Son Eklenen Ürünler
        </h2>
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted">
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">
                  Ürün
                </th>
                <th className="hidden px-4 py-3 text-left font-semibold text-muted-foreground sm:table-cell">
                  Kategori
                </th>
                <th className="hidden px-4 py-3 text-left font-semibold text-muted-foreground md:table-cell">
                  Malzeme
                </th>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">
                  Durum
                </th>
              </tr>
            </thead>
            <tbody>
              {products.slice(0, 8).map((product) => (
                <tr
                  key={product.id}
                  className="border-b border-border last:border-0"
                >
                  <td className="px-4 py-3 font-medium text-foreground">
                    {product.name}
                  </td>
                  <td className="hidden px-4 py-3 text-muted-foreground sm:table-cell">
                    {categories.find((c) => c.slug === product.category)?.name}
                  </td>
                  <td className="hidden px-4 py-3 text-muted-foreground md:table-cell">
                    {product.material}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        product.inStock
                          ? "bg-success/10 text-success"
                          : "bg-destructive/10 text-destructive"
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
