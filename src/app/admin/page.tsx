"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Package,
  Newspaper,
  Eye,
  TrendingUp,
  Image as ImageIcon,
  Users,
  Mail,
  Star,
  RefreshCw,
  Loader2,
  ArrowUpRight,
  BarChart3,
  Clock,
} from "lucide-react";
import Link from "next/link";
import { products as staticProducts, categories as staticCategories } from "@/data/products";
import { blogPosts } from "@/data/blog";

interface DashboardData {
  totalProducts: number;
  totalCategories: number;
  featuredCount: number;
  blogCount: number;
  inStockCount: number;
  outOfStockCount: number;
  newsletterCount: number;
  dealerCount: number;
  galleryCount: number;
  materialBreakdown: Record<string, number>;
  categoryBreakdown: Array<{ name: string; count: number }>;
  recentProducts: Array<{
    id: string;
    name: string;
    category: string;
    material: string;
    inStock: boolean;
    featured: boolean;
  }>;
  source: "supabase" | "static";
}

function getStaticDashboard(): DashboardData {
  const materialBreakdown: Record<string, number> = {};
  staticProducts.forEach((p) => {
    materialBreakdown[p.material] = (materialBreakdown[p.material] || 0) + 1;
  });

  const categoryBreakdown = staticCategories.map((c) => ({
    name: c.name,
    count: staticProducts.filter((p) => p.category === c.slug).length,
  }));

  return {
    totalProducts: staticProducts.length,
    totalCategories: staticCategories.length,
    featuredCount: staticProducts.filter((p) => p.featured).length,
    blogCount: blogPosts.length,
    inStockCount: staticProducts.filter((p) => p.inStock).length,
    outOfStockCount: staticProducts.filter((p) => !p.inStock).length,
    newsletterCount: 0,
    dealerCount: 0,
    galleryCount: 0,
    materialBreakdown,
    categoryBreakdown,
    recentProducts: staticProducts.slice(0, 8).map((p) => ({
      id: p.id,
      name: p.name,
      category: staticCategories.find((c) => c.slug === p.category)?.name || p.category,
      material: p.material,
      inStock: p.inStock,
      featured: p.featured,
    })),
    source: "static",
  };
}

const MATERIAL_COLORS: Record<string, string> = {
  PET: "bg-blue-500",
  HDPE: "bg-emerald-500",
  PP: "bg-amber-500",
  LDPE: "bg-purple-500",
  PE: "bg-rose-500",
};

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData>(getStaticDashboard);
  const [loading, setLoading] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  const fetchLiveData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/products");
      if (!res.ok) throw new Error();
      const json = await res.json();

      if (json.source === "supabase" && json.products) {
        const products = json.products;
        const cats = json.categories || [];

        const materialBreakdown: Record<string, number> = {};
        products.forEach((p: { material: string }) => {
          materialBreakdown[p.material] = (materialBreakdown[p.material] || 0) + 1;
        });

        const categoryBreakdown = cats.map((c: { slug: string; name: string }) => ({
          name: c.name,
          count: products.filter((p: { category_slug: string }) => p.category_slug === c.slug).length,
        }));

        setData({
          totalProducts: products.length,
          totalCategories: cats.length,
          featuredCount: products.filter((p: { featured: boolean }) => p.featured).length,
          blogCount: blogPosts.length,
          inStockCount: products.filter((p: { in_stock: boolean }) => p.in_stock).length,
          outOfStockCount: products.filter((p: { in_stock: boolean }) => !p.in_stock).length,
          newsletterCount: 0,
          dealerCount: 0,
          galleryCount: 0,
          materialBreakdown,
          categoryBreakdown,
          recentProducts: products.slice(0, 8).map((p: { id: string; name: string; category_slug: string; material: string; in_stock: boolean; featured: boolean }) => ({
            id: p.id,
            name: p.name,
            category: cats.find((c: { slug: string }) => c.slug === p.category_slug)?.name || p.category_slug,
            material: p.material,
            inStock: p.in_stock,
            featured: p.featured,
          })),
          source: "supabase",
        });
      }
    } catch {
      /* fallback to static */
    } finally {
      setLoading(false);
      setLastRefresh(new Date());
    }
  }, []);

  useEffect(() => { fetchLiveData(); }, [fetchLiveData]);

  const totalMaterials = Object.values(data.materialBreakdown).reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
            Kısmet Plastik yönetim paneline hoş geldiniz.
            <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${data.source === "supabase" ? "bg-success/10 text-success" : "bg-amber-500/10 text-amber-600"}`}>
              {data.source === "supabase" ? "Canlı Veri" : "Statik Veri"}
            </span>
          </p>
        </div>
        <button
          onClick={fetchLiveData}
          disabled={loading}
          className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-medium text-muted-foreground transition-all hover:bg-muted disabled:opacity-50"
        >
          {loading ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
          Yenile
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Toplam Ürün", value: data.totalProducts, icon: Package, color: "bg-blue-500/10 text-blue-600", href: "/admin/products" },
          { label: "Kategoriler", value: data.totalCategories, icon: TrendingUp, color: "bg-emerald-500/10 text-emerald-600", href: "/admin/products" },
          { label: "Öne Çıkan", value: data.featuredCount, icon: Star, color: "bg-amber-500/10 text-amber-600", href: "/admin/products" },
          { label: "Blog Yazıları", value: data.blogCount, icon: Newspaper, color: "bg-purple-500/10 text-purple-600", href: "/admin/blog" },
        ].map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="group relative overflow-hidden rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.color}`}>
                <stat.icon size={20} />
              </div>
              <span className="text-3xl font-bold text-foreground">{stat.value}</span>
            </div>
            <p className="mt-3 text-sm font-medium text-muted-foreground">{stat.label}</p>
            <ArrowUpRight size={14} className="absolute right-3 top-3 text-muted-foreground/30 transition-all group-hover:text-muted-foreground" />
          </Link>
        ))}
      </div>

      {/* Secondary Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600">
              <Package size={18} />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{data.inStockCount}</p>
              <p className="text-xs text-muted-foreground">Stokta</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
              <Package size={18} />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{data.outOfStockCount}</p>
              <p className="text-xs text-muted-foreground">Stok Dışı</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600">
              <Clock size={14} />
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">{lastRefresh.toLocaleTimeString("tr-TR")}</p>
              <p className="text-xs text-muted-foreground">Son Güncelleme</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Material Distribution */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <BarChart3 size={18} className="text-muted-foreground" />
            <h2 className="text-sm font-semibold text-foreground">Malzeme Dağılımı</h2>
          </div>
          <div className="space-y-3">
            {Object.entries(data.materialBreakdown)
              .sort(([, a], [, b]) => b - a)
              .map(([material, count]) => (
                <div key={material}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="font-medium text-foreground">{material}</span>
                    <span className="text-muted-foreground">{count} ürün ({totalMaterials > 0 ? Math.round((count / totalMaterials) * 100) : 0}%)</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${MATERIAL_COLORS[material] || "bg-neutral-400"}`}
                      style={{ width: `${totalMaterials > 0 ? (count / totalMaterials) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <TrendingUp size={18} className="text-muted-foreground" />
            <h2 className="text-sm font-semibold text-foreground">Kategori Bazlı Ürünler</h2>
          </div>
          <div className="space-y-2.5">
            {data.categoryBreakdown.map((cat) => (
              <div key={cat.name} className="flex items-center justify-between rounded-lg border border-border px-3.5 py-2.5 transition-colors hover:bg-muted/50">
                <span className="text-sm font-medium text-foreground">{cat.name}</span>
                <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-primary/10 px-2 text-xs font-bold text-primary">{cat.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-foreground">Hızlı İşlemler</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { href: "/admin/products/new", icon: Package, label: "Yeni Ürün Ekle", hoverColor: "hover:border-blue-500 hover:bg-blue-500/5 hover:text-blue-600" },
            { href: "/admin/blog/new", icon: Newspaper, label: "Yeni Blog Yazısı", hoverColor: "hover:border-purple-500 hover:bg-purple-500/5 hover:text-purple-600" },
            { href: "/admin/gallery", icon: ImageIcon, label: "Galeri Yönetimi", hoverColor: "hover:border-amber-500 hover:bg-amber-500/5 hover:text-amber-600" },
            { href: "/admin/dealers", icon: Users, label: "Bayi Yönetimi", hoverColor: "hover:border-emerald-500 hover:bg-emerald-500/5 hover:text-emerald-600" },
          ].map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className={`flex items-center gap-3 rounded-xl border border-dashed border-border bg-card p-4 text-sm font-medium text-muted-foreground transition-all ${action.hoverColor}`}
            >
              <action.icon size={18} />
              {action.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Products Table */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Son Ürünler</h2>
          <Link href="/admin/products" className="flex items-center gap-1 text-xs font-medium text-primary transition-colors hover:text-primary/80">
            Tümünü Gör <ArrowUpRight size={12} />
          </Link>
        </div>
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Ürün</th>
                <th className="hidden px-4 py-3 text-left font-semibold text-muted-foreground sm:table-cell">Kategori</th>
                <th className="hidden px-4 py-3 text-left font-semibold text-muted-foreground md:table-cell">Malzeme</th>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Durum</th>
              </tr>
            </thead>
            <tbody>
              {data.recentProducts.map((product) => (
                <tr key={product.id} className="border-b border-border last:border-0 transition-colors hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground">{product.name}</span>
                      {product.featured && <Star size={12} className="shrink-0 fill-amber-400 text-amber-400" />}
                    </div>
                  </td>
                  <td className="hidden px-4 py-3 text-muted-foreground sm:table-cell">{product.category}</td>
                  <td className="hidden px-4 py-3 md:table-cell">
                    <span className="inline-flex items-center gap-1.5">
                      <span className={`h-2 w-2 rounded-full ${MATERIAL_COLORS[product.material] || "bg-neutral-400"}`} />
                      <span className="text-muted-foreground">{product.material}</span>
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${product.inStock ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}`}>
                      {product.inStock ? "Stokta" : "Tükendi"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Site Link */}
      <Link
        href="/"
        target="_blank"
        className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-card py-3 text-sm font-medium text-muted-foreground transition-all hover:border-success hover:bg-success/5 hover:text-success"
      >
        <Eye size={16} />
        Siteyi Görüntüle
        <ArrowUpRight size={12} />
      </Link>
    </div>
  );
}
