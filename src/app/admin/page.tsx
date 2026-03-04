"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ShoppingCart,
  ClipboardList,
  Mail,
  Users,
  Package,
  Newspaper,
  Plus,
  Image as ImageIcon,
  Eye,
  Clock,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  TrendingUp,
  BarChart3,
} from "lucide-react";

interface DashboardStats {
  ordersTotal: number;
  ordersPending: number;
  quotesTotal: number;
  quotesPending: number;
  messagesUnread: number;
  dealersActive: number;
  dealersPending: number;
  productsTotal: number;
  blogTotal: number;
}

interface ActivityItem {
  id: string;
  type: "order" | "quote" | "message";
  title: string;
  subtitle: string;
  status: string;
  amount: number | null;
  date: string;
  href: string;
}

interface DashboardData {
  stats: DashboardStats;
  recentActivity: ActivityItem[];
}

const ORDER_STATUS_LABELS: Record<string, string> = {
  pending: "Bekliyor",
  confirmed: "Onaylandı",
  production: "Üretimde",
  shipping: "Kargoda",
  delivered: "Teslim Edildi",
  cancelled: "İptal",
};

const QUOTE_STATUS_LABELS: Record<string, string> = {
  pending: "Bekliyor",
  reviewing: "İnceleniyor",
  quoted: "Tekliflandı",
  accepted: "Kabul Edildi",
  rejected: "Reddedildi",
};

const MESSAGE_STATUS_LABELS: Record<string, string> = {
  unread: "Okunmadı",
  read: "Okundu",
  replied: "Yanıtlandı",
};

function statusLabel(type: ActivityItem["type"], status: string): string {
  if (type === "order") return ORDER_STATUS_LABELS[status] ?? status;
  if (type === "quote") return QUOTE_STATUS_LABELS[status] ?? status;
  return MESSAGE_STATUS_LABELS[status] ?? status;
}

function statusColor(type: ActivityItem["type"], status: string): string {
  if (type === "message") {
    if (status === "unread") return "bg-destructive/10 text-destructive";
    if (status === "replied") return "bg-success/10 text-success";
    return "bg-muted text-muted-foreground";
  }
  if (status === "pending") return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
  if (status === "confirmed" || status === "accepted" || status === "quoted")
    return "bg-success/10 text-success";
  if (status === "cancelled" || status === "rejected")
    return "bg-destructive/10 text-destructive";
  return "bg-primary/10 text-primary";
}

function typeIcon(type: ActivityItem["type"]) {
  if (type === "order") return <ShoppingCart size={14} />;
  if (type === "quote") return <ClipboardList size={14} />;
  return <Mail size={14} />;
}

function typeLabel(type: ActivityItem["type"]): string {
  if (type === "order") return "Sipariş";
  if (type === "quote") return "Teklif";
  return "Mesaj";
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("tr-TR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY", minimumFractionDigits: 0 }).format(amount);
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchDashboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/dashboard");
      const json = await res.json();
      if (!json.success) throw new Error(json.error ?? "Veri alınamadı");
      setData(json.data as DashboardData);
      setLastUpdated(new Date());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const stats = data?.stats;

  const statCards = stats
    ? [
        {
          label: "Toplam Sipariş",
          value: stats.ordersTotal,
          badge: stats.ordersPending > 0 ? `${stats.ordersPending} onay bekliyor` : null,
          badgeColor: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
          icon: ShoppingCart,
          iconColor: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
          href: "/admin/orders",
        },
        {
          label: "Toplam Teklif",
          value: stats.quotesTotal,
          badge: stats.quotesPending > 0 ? `${stats.quotesPending} onay bekliyor` : null,
          badgeColor: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
          icon: ClipboardList,
          iconColor: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
          href: "/admin/quotes",
        },
        {
          label: "Yeni Mesajlar",
          value: stats.messagesUnread,
          badge: stats.messagesUnread > 0 ? `${stats.messagesUnread} okunmadı` : null,
          badgeColor: "bg-destructive/10 text-destructive",
          icon: Mail,
          iconColor: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
          href: "/admin/messages",
        },
        {
          label: "Aktif Bayiler",
          value: stats.dealersActive,
          badge: stats.dealersPending > 0 ? `${stats.dealersPending} onay bekliyor` : null,
          badgeColor: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
          icon: Users,
          iconColor: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
          href: "/admin/dealers",
        },
        {
          label: "Toplam Ürün",
          value: stats.productsTotal,
          badge: null,
          badgeColor: "",
          icon: Package,
          iconColor: "bg-primary/10 text-primary",
          href: "/admin/products",
        },
        {
          label: "Blog Yazıları",
          value: stats.blogTotal,
          badge: null,
          badgeColor: "",
          icon: Newspaper,
          iconColor: "bg-accent/10 text-accent",
          href: "/admin/blog",
        },
      ]
    : [];

  const quickActions = [
    {
      label: "Yeni Ürün",
      href: "/admin/products/new",
      icon: Plus,
      color: "hover:border-primary hover:bg-primary/10 hover:text-primary",
    },
    {
      label: "Yeni Blog",
      href: "/admin/blog/new",
      icon: Newspaper,
      color: "hover:border-primary hover:bg-primary/10 hover:text-primary",
    },
    {
      label: "Galeri",
      href: "/admin/gallery",
      icon: ImageIcon,
      color: "hover:border-primary hover:bg-primary/10 hover:text-primary",
    },
    {
      label: "Siparişler",
      href: "/admin/orders",
      icon: ShoppingCart,
      color: "hover:border-violet-500 hover:bg-violet-500/10 hover:text-violet-600",
    },
    {
      label: "Teklifler",
      href: "/admin/quotes",
      icon: ClipboardList,
      color: "hover:border-emerald-500 hover:bg-emerald-500/10 hover:text-emerald-600",
    },
    {
      label: "Mesajlar",
      href: "/admin/messages",
      icon: Mail,
      color: "hover:border-rose-500 hover:bg-rose-500/10 hover:text-rose-600",
    },
    {
      label: "Analitik",
      href: "/admin/analytics",
      icon: BarChart3,
      color: "hover:border-amber-500 hover:bg-amber-500/10 hover:text-amber-600",
    },
    {
      label: "Siteyi Görüntüle",
      href: "/",
      icon: Eye,
      color: "hover:border-success hover:bg-success/10 hover:text-success",
      target: "_blank",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Kısmet Plastik yönetim paneline hoş geldiniz.
          </p>
          {lastUpdated && (
            <p className="mt-0.5 text-xs text-muted-foreground/70 flex items-center gap-1">
              <Clock size={10} />
              Son güncelleme: {lastUpdated.toLocaleTimeString("tr-TR")}
            </p>
          )}
        </div>
        <button
          onClick={fetchDashboard}
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

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="animate-pulse rounded-xl border border-border bg-card p-5 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="h-10 w-10 rounded-lg bg-muted" />
                  <div className="h-8 w-16 rounded bg-muted" />
                </div>
                <div className="mt-3 h-4 w-28 rounded bg-muted" />
              </div>
            ))
          : statCards.map((card) => (
              <Link
                key={card.label}
                href={card.href}
                className="group relative rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:border-primary/30 hover:shadow-md"
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
                {card.badge && (
                  <span
                    className={`mt-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${card.badgeColor}`}
                  >
                    <AlertCircle size={9} />
                    {card.badge}
                  </span>
                )}
              </Link>
            ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-foreground">
          Hızlı İşlemler
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action) => (
            <Link
              key={action.label}
              href={action.href}
              target={action.target}
              className={`flex items-center gap-3 rounded-xl border border-dashed border-border bg-card p-4 text-sm font-medium text-muted-foreground transition-all ${action.color}`}
            >
              <action.icon size={18} />
              {action.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">
            Son Aktiviteler
          </h2>
          <span className="text-xs text-muted-foreground">Son 10 hareket</span>
        </div>
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          {loading ? (
            <div className="divide-y divide-border">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex animate-pulse items-center gap-4 px-4 py-3">
                  <div className="h-8 w-8 rounded-lg bg-muted" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3.5 w-48 rounded bg-muted" />
                    <div className="h-3 w-32 rounded bg-muted" />
                  </div>
                  <div className="h-5 w-16 rounded-full bg-muted" />
                </div>
              ))}
            </div>
          ) : !data?.recentActivity || data.recentActivity.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
              <TrendingUp size={32} className="text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">Henüz aktivite yok</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {data.recentActivity.map((item) => (
                <Link
                  key={`${item.type}-${item.id}`}
                  href={item.href}
                  className="flex items-center gap-4 px-4 py-3 transition-colors hover:bg-muted/50"
                >
                  {/* Type icon */}
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                    {typeIcon(item.type)}
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="truncate text-sm font-medium text-foreground">
                        {item.title}
                      </span>
                      <span className="shrink-0 rounded px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground ring-1 ring-border">
                        {typeLabel(item.type)}
                      </span>
                    </div>
                    <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="truncate">{item.subtitle}</span>
                      {item.amount != null && (
                        <>
                          <span>·</span>
                          <span className="shrink-0 font-medium text-foreground">
                            {formatCurrency(item.amount)}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Status + Date */}
                  <div className="flex shrink-0 flex-col items-end gap-1">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${statusColor(item.type, item.status)}`}
                    >
                      {statusLabel(item.type, item.status)}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {formatDate(item.date)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Approval summary bar */}
        {stats &&
          (stats.ordersPending > 0 || stats.quotesPending > 0 || stats.dealersPending > 0) && (
            <div className="mt-4 flex flex-wrap gap-3">
              {stats.ordersPending > 0 && (
                <Link
                  href="/admin/orders?status=pending"
                  className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-medium text-amber-700 transition-all hover:bg-amber-100 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-400"
                >
                  <AlertCircle size={12} />
                  {stats.ordersPending} sipariş onay bekliyor
                </Link>
              )}
              {stats.quotesPending > 0 && (
                <Link
                  href="/admin/quotes?status=pending"
                  className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-medium text-amber-700 transition-all hover:bg-amber-100 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-400"
                >
                  <AlertCircle size={12} />
                  {stats.quotesPending} teklif onay bekliyor
                </Link>
              )}
              {stats.dealersPending > 0 && (
                <Link
                  href="/admin/dealers?approved=false"
                  className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-medium text-amber-700 transition-all hover:bg-amber-100 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-400"
                >
                  <AlertCircle size={12} />
                  {stats.dealersPending} bayi onay bekliyor
                </Link>
              )}
              {stats.messagesUnread > 0 && (
                <Link
                  href="/admin/messages?status=unread"
                  className="flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-medium text-rose-700 transition-all hover:bg-rose-100 dark:border-rose-800 dark:bg-rose-900/20 dark:text-rose-400"
                >
                  <Mail size={12} />
                  {stats.messagesUnread} okunmamış mesaj
                </Link>
              )}
            </div>
          )}
      </div>

      {/* Status legend */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <CheckCircle2 size={11} className="text-success" />
          Onaylı / Teslim edildi
        </span>
        <span className="flex items-center gap-1.5">
          <Clock size={11} className="text-amber-500" />
          Onay / İşlem bekliyor
        </span>
        <span className="flex items-center gap-1.5">
          <AlertCircle size={11} className="text-destructive" />
          İptal / Okunmadı
        </span>
      </div>
    </div>
  );
}
