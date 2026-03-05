"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ShoppingCart,
  ClipboardList,
  Users,
  Mail,
  Package,
  Download,
  RefreshCw,
  AlertCircle,
  BarChart3,
  TrendingUp,
} from "lucide-react";

interface ThisMonth {
  orders: number;
  quotes: number;
  dealers: number;
  messages: number;
}

interface DailyOrder {
  date: string;
  count: number;
}

interface TopProduct {
  name: string;
  count: number;
}

interface CatalogDownload {
  id: string;
  company_name: string;
  contact_name: string;
  email: string;
  created_at: string;
}

interface AnalyticsData {
  thisMonth: ThisMonth;
  dailyOrders: DailyOrder[];
  topProducts: TopProduct[];
  catalogDownloads: CatalogDownload[];
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("tr-TR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

const SKELETON_BAR_HEIGHTS = [40, 70, 55, 80, 35, 65, 50];

function SkeletonBar() {
  return (
    <div className="flex animate-pulse items-end gap-2">
      {SKELETON_BAR_HEIGHTS.map((h, i) => (
        <div key={i} className="flex flex-1 flex-col items-center gap-1">
          <div
            className="w-full rounded-t-sm bg-muted"
            style={{ height: `${h}px` }}
          />
          <div className="h-3 w-6 rounded bg-muted" />
        </div>
      ))}
    </div>
  );
}

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/analytics");
      const json = await res.json();
      if (!json.success) throw new Error(json.error ?? "Veri alınamadı");
      setData(json.data as AnalyticsData);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const maxDailyCount = data?.dailyOrders
    ? Math.max(...data.dailyOrders.map((d) => d.count), 1)
    : 1;

  const maxProductCount = data?.topProducts
    ? Math.max(...data.topProducts.map((p) => p.count), 1)
    : 1;

  const monthCards = data
    ? [
        {
          label: "Bu Ay Sipariş",
          value: data.thisMonth.orders,
          icon: ShoppingCart,
          iconColor: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
          href: "/admin/orders",
        },
        {
          label: "Bu Ay Teklif",
          value: data.thisMonth.quotes,
          icon: ClipboardList,
          iconColor: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
          href: "/admin/quotes",
        },
        {
          label: "Bu Ay Yeni Bayi",
          value: data.thisMonth.dealers,
          icon: Users,
          iconColor: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
          href: "/admin/dealers",
        },
        {
          label: "Bu Ay Mesaj",
          value: data.thisMonth.messages,
          icon: Mail,
          iconColor: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
          href: "/admin/messages",
        },
      ]
    : [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Analitik</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Platform istatistikleri ve aktivite özeti.
          </p>
        </div>
        <button
          onClick={fetchAnalytics}
          disabled={loading}
          className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium text-muted-foreground transition-all hover:border-primary hover:text-primary disabled:opacity-50"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          Yenile
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {/* This Month Stats */}
      <div>
        <h2 className="mb-4 text-base font-semibold text-foreground">
          Bu Ay Özeti
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse rounded-xl border border-border bg-card p-5"
                >
                  <div className="flex items-center justify-between">
                    <div className="h-10 w-10 rounded-lg bg-muted" />
                    <div className="h-8 w-12 rounded bg-muted" />
                  </div>
                  <div className="mt-3 h-4 w-28 rounded bg-muted" />
                </div>
              ))
            : monthCards.map((card) => (
                <Link
                  key={card.label}
                  href={card.href}
                  className="group rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:border-primary/30 hover:shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-lg ${card.iconColor}`}
                    >
                      <card.icon size={20} />
                    </div>
                    <span className="text-3xl font-bold text-foreground">
                      {card.value}
                    </span>
                  </div>
                  <p className="mt-3 text-sm font-medium text-muted-foreground">
                    {card.label}
                  </p>
                </Link>
              ))}
        </div>
      </div>

      {/* Daily Orders Bar Chart */}
      <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <BarChart3 size={18} className="text-primary" />
          <h2 className="text-base font-semibold text-foreground">
            Son 7 Gün — Günlük Sipariş
          </h2>
        </div>

        {loading ? (
          <SkeletonBar />
        ) : !data?.dailyOrders || data.dailyOrders.every((d) => d.count === 0) ? (
          <div className="flex flex-col items-center justify-center gap-2 py-10">
            <TrendingUp size={28} className="text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">Bu dönem sipariş verisi yok</p>
          </div>
        ) : (
          <div className="flex h-40 items-end gap-2">
            {data.dailyOrders.map((day) => {
              const pct = maxDailyCount > 0 ? (day.count / maxDailyCount) * 100 : 0;
              return (
                <div key={day.date} className="flex flex-1 flex-col items-center gap-1">
                  <span className="text-[10px] font-medium text-muted-foreground">
                    {day.count > 0 ? day.count : ""}
                  </span>
                  <div className="relative w-full flex-1 flex items-end">
                    <div
                      className="w-full rounded-t-sm bg-primary/70 transition-all duration-500"
                      style={{ height: `${Math.max(pct, day.count > 0 ? 4 : 0)}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-muted-foreground">{day.date}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Top Products + Catalog Downloads row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top Products */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <Package size={18} className="text-primary" />
            <h2 className="text-base font-semibold text-foreground">
              En Çok Sipariş Edilen Ürünler
            </h2>
          </div>

          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="animate-pulse flex items-center gap-3">
                  <div className="h-4 w-4 rounded-full bg-muted" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3 w-40 rounded bg-muted" />
                    <div className="h-2 rounded-full bg-muted" style={{ width: `${60 - i * 10}%` }} />
                  </div>
                  <div className="h-4 w-6 rounded bg-muted" />
                </div>
              ))}
            </div>
          ) : !data?.topProducts || data.topProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 py-8">
              <Package size={28} className="text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">Henüz sipariş verisi yok</p>
            </div>
          ) : (
            <div className="space-y-4">
              {data.topProducts.map((product, i) => {
                const pct = maxProductCount > 0 ? (product.count / maxProductCount) * 100 : 0;
                return (
                  <div key={product.name} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-muted text-[10px] font-bold text-muted-foreground">
                          {i + 1}
                        </span>
                        <span className="truncate font-medium text-foreground">
                          {product.name}
                        </span>
                      </div>
                      <span className="ml-2 shrink-0 text-xs font-semibold text-muted-foreground">
                        {product.count}
                      </span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary/60 transition-all duration-700"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent Catalog Downloads */}
        <div className="rounded-xl border border-border bg-card shadow-sm">
          <div className="flex items-center gap-2 border-b border-border px-5 py-4">
            <Download size={18} className="text-primary" />
            <h2 className="text-base font-semibold text-foreground">
              Son Katalog İndirmeleri
            </h2>
          </div>

          {loading ? (
            <div className="divide-y divide-border">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex animate-pulse items-center gap-3 px-5 py-3">
                  <div className="h-8 w-8 rounded-full bg-muted" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3 w-32 rounded bg-muted" />
                    <div className="h-3 w-24 rounded bg-muted" />
                  </div>
                  <div className="h-3 w-16 rounded bg-muted" />
                </div>
              ))}
            </div>
          ) : !data?.catalogDownloads || data.catalogDownloads.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 py-12">
              <Download size={28} className="text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">Katalog indirme kaydı yok</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {data.catalogDownloads.map((dl) => (
                <div key={dl.id} className="flex items-center gap-3 px-5 py-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                    {dl.contact_name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">
                      {dl.contact_name}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {dl.company_name} · {dl.email}
                    </p>
                  </div>
                  <span className="shrink-0 text-[10px] text-muted-foreground">
                    {formatDate(dl.created_at)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
