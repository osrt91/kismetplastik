"use client";

import { useState, useEffect } from "react";
import Link from "@/components/ui/LocaleLink";
import {
  ShoppingCart,
  FileText,
  TrendingUp,
  Package,
  ArrowRight,
  Clock,
} from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import { getSupabaseBrowser } from "@/lib/supabase-browser";

interface DashboardStats {
  activeOrders: number;
  pendingQuotes: number;
  totalOrders: number;
  totalProducts: number;
}

const labels: Record<string, Record<string, string>> = {
  tr: {
    welcome: "Hoş Geldiniz",
    activeOrders: "Aktif Siparişler",
    pendingQuotes: "Bekleyen Teklifler",
    totalOrders: "Toplam Sipariş",
    totalProducts: "Ürün Çeşidi",
    quickActions: "Hızlı İşlemler",
    newQuote: "Yeni Teklif Al",
    viewProducts: "Ürünleri İncele",
    viewOrders: "Siparişlerimi Gör",
    recentActivity: "Son Aktiviteler",
    noActivity: "Henüz aktivite bulunmuyor.",
    loading: "Yükleniyor...",
  },
  en: {
    welcome: "Welcome",
    activeOrders: "Active Orders",
    pendingQuotes: "Pending Quotes",
    totalOrders: "Total Orders",
    totalProducts: "Product Varieties",
    quickActions: "Quick Actions",
    newQuote: "Request Quote",
    viewProducts: "Browse Products",
    viewOrders: "View My Orders",
    recentActivity: "Recent Activity",
    noActivity: "No activity yet.",
    loading: "Loading...",
  },
};

export default function BayiPanelDashboard() {
  const { locale } = useLocale();
  const t = labels[locale] || labels.tr;

  const [stats, setStats] = useState<DashboardStats>({
    activeOrders: 0,
    pendingQuotes: 0,
    totalOrders: 0,
    totalProducts: 0,
  });
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const supabase = getSupabaseBrowser();
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("full_name, company_name")
            .eq("id", user.id)
            .single();

          setUserName(profile?.company_name || profile?.full_name || user.email || "");

          const { count: activeOrders } = await supabase
            .from("orders")
            .select("*", { count: "exact", head: true })
            .eq("profile_id", user.id)
            .in("status", ["pending", "confirmed", "production", "shipping"]);

          const { count: pendingQuotes } = await supabase
            .from("quote_requests")
            .select("*", { count: "exact", head: true })
            .eq("profile_id", user.id)
            .in("status", ["pending", "reviewing"]);

          const { count: totalOrders } = await supabase
            .from("orders")
            .select("*", { count: "exact", head: true })
            .eq("profile_id", user.id);

          const { count: totalProducts } = await supabase
            .from("products")
            .select("*", { count: "exact", head: true });

          setStats({
            activeOrders: activeOrders || 0,
            pendingQuotes: pendingQuotes || 0,
            totalOrders: totalOrders || 0,
            totalProducts: totalProducts || 0,
          });
        }
      } catch (err) {
        console.error("Dashboard load error:", err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  const statCards = [
    { label: t.activeOrders, value: stats.activeOrders, icon: ShoppingCart, color: "bg-blue-50 text-blue-700" },
    { label: t.pendingQuotes, value: stats.pendingQuotes, icon: FileText, color: "bg-amber-50 text-amber-700" },
    { label: t.totalOrders, value: stats.totalOrders, icon: TrendingUp, color: "bg-emerald-50 text-emerald-700" },
    { label: t.totalProducts, value: stats.totalProducts, icon: Package, color: "bg-purple-50 text-purple-700" },
  ];

  const quickActions = [
    { label: t.newQuote, href: "/teklif-al", icon: FileText, color: "bg-accent-500 text-primary-900 hover:bg-accent-600" },
    { label: t.viewProducts, href: "/urunler", icon: Package, color: "bg-primary-900 text-white hover:bg-primary-700" },
    { label: t.viewOrders, href: "/bayi-panel/siparislerim", icon: ShoppingCart, color: "bg-white text-primary-900 border border-neutral-200 hover:bg-neutral-50" },
  ];

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex items-center gap-3 text-neutral-500">
          <span className="h-6 w-6 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
          {t.loading}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="rounded-2xl bg-gradient-to-r from-primary-900 to-primary-700 p-6 text-white lg:p-8">
        <h2 className="text-2xl font-bold">{t.welcome}, {userName}</h2>
        <p className="mt-1 text-white/60">
          <Clock size={14} className="mr-1 inline" />
          {new Date().toLocaleDateString(locale === "tr" ? "tr-TR" : "en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <div key={card.label} className="rounded-xl border border-neutral-200 bg-white p-5 transition-all hover:shadow-md">
            <div className="flex items-center gap-3">
              <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${card.color}`}>
                <card.icon size={22} />
              </div>
              <div>
                <p className="text-2xl font-bold text-primary-900">{card.value}</p>
                <p className="text-xs text-neutral-500">{card.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-neutral-400">{t.quickActions}</h3>
        <div className="flex flex-wrap gap-3">
          {quickActions.map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className={`inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-all ${action.color}`}
            >
              <action.icon size={18} />
              {action.label}
              <ArrowRight size={14} />
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity placeholder */}
      <div className="rounded-xl border border-neutral-200 bg-white p-6">
        <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-neutral-400">{t.recentActivity}</h3>
        <p className="text-sm text-neutral-500">{t.noActivity}</p>
      </div>
    </div>
  );
}
