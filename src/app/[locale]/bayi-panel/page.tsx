"use client";

import { useState, useEffect } from "react";
import Link from "@/components/ui/LocaleLink";
import {
  FileText,
  Package,
  ArrowRight,
  Clock,
} from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import { supabaseBrowser } from "@/lib/supabase/client";
import DashboardCards from "@/components/portal/DashboardCards";

interface RecentOrder {
  id: string;
  order_number: string;
  created_at: string;
  status: string;
  total_amount: number | null;
}

interface DashboardStats {
  activeOrders: number;
  pendingQuotes: number;
  unpaidInvoices: number;
  last30DaysRevenue: number;
}

const labels: Record<string, Record<string, string>> = {
  tr: {
    welcome: "Hos Geldiniz",
    activeOrders: "Aktif Siparisler",
    pendingQuotes: "Bekleyen Teklifler",
    unpaidInvoices: "Odenmemis Faturalar",
    last30Revenue: "Son 30 Gun Ciro",
    quickActions: "Hizli Islemler",
    newOrder: "Yeni Siparis Ver",
    requestQuote: "Teklif Iste",
    viewProducts: "Urunleri Incele",
    recentOrders: "Son Siparisler",
    noOrders: "Henuz siparis bulunmuyor.",
    loading: "Yukleniyor...",
    orderNo: "Siparis No",
    date: "Tarih",
    status: "Durum",
    amount: "Tutar",
    viewAll: "Tumunu Gor",
    pending: "Beklemede",
    confirmed: "Onaylandi",
    production: "Uretimde",
    shipping: "Kargoda",
    delivered: "Teslim Edildi",
    cancelled: "Iptal",
  },
  en: {
    welcome: "Welcome",
    activeOrders: "Active Orders",
    pendingQuotes: "Pending Quotes",
    unpaidInvoices: "Unpaid Invoices",
    last30Revenue: "Last 30 Days Revenue",
    quickActions: "Quick Actions",
    newOrder: "Place New Order",
    requestQuote: "Request Quote",
    viewProducts: "Browse Products",
    recentOrders: "Recent Orders",
    noOrders: "No orders yet.",
    loading: "Loading...",
    orderNo: "Order No",
    date: "Date",
    status: "Status",
    amount: "Amount",
    viewAll: "View All",
    pending: "Pending",
    confirmed: "Confirmed",
    production: "In Production",
    shipping: "Shipping",
    delivered: "Delivered",
    cancelled: "Cancelled",
  },
};

function OrderStatusBadge({ status, t }: { status: string; t: Record<string, string> }) {
  const config: Record<string, { bg: string; label: string }> = {
    pending: { bg: "bg-amber-100 text-amber-800", label: t.pending },
    confirmed: { bg: "bg-blue-100 text-blue-800", label: t.confirmed },
    production: { bg: "bg-indigo-100 text-indigo-800", label: t.production },
    shipping: { bg: "bg-cyan-100 text-cyan-800", label: t.shipping },
    delivered: { bg: "bg-emerald-100 text-emerald-800", label: t.delivered },
    cancelled: { bg: "bg-red-100 text-red-800", label: t.cancelled },
  };
  const c = config[status] || { bg: "bg-neutral-100 text-neutral-800", label: status };
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${c.bg}`}>
      {c.label}
    </span>
  );
}

export default function BayiPanelDashboard() {
  const { locale } = useLocale();
  const t = labels[locale] || labels.tr;

  const [stats, setStats] = useState<DashboardStats>({
    activeOrders: 0,
    pendingQuotes: 0,
    unpaidInvoices: 0,
    last30DaysRevenue: 0,
  });
  const [userName, setUserName] = useState("");
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const supabase = supabaseBrowser();
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

          const { count: unpaidInvoices } = await supabase
            .from("invoices")
            .select("*", { count: "exact", head: true })
            .eq("profile_id", user.id)
            .in("status", ["draft", "issued"]);

          // Last 30 days revenue
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          const { data: revenueData } = await supabase
            .from("orders")
            .select("total_amount")
            .eq("profile_id", user.id)
            .in("status", ["confirmed", "production", "shipping", "delivered"])
            .gte("created_at", thirtyDaysAgo.toISOString());

          const last30DaysRevenue = (revenueData || []).reduce(
            (sum: number, order: { total_amount: number | null }) => sum + (order.total_amount || 0),
            0
          );

          const { data: recentOrdersData } = await supabase
            .from("orders")
            .select("id, order_number, created_at, status, total_amount")
            .eq("profile_id", user.id)
            .order("created_at", { ascending: false })
            .limit(5);

          setRecentOrders(recentOrdersData || []);

          setStats({
            activeOrders: activeOrders || 0,
            pendingQuotes: pendingQuotes || 0,
            unpaidInvoices: unpaidInvoices || 0,
            last30DaysRevenue,
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

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex items-center gap-3 text-neutral-500">
          <span className="h-6 w-6 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
          {t.loading}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <div className="rounded-2xl bg-[#0A1628] p-6 lg:p-8">
        <h2 className="font-display text-2xl font-bold text-white lg:text-3xl">
          {t.welcome}, {userName}
        </h2>
        <p className="mt-2 flex items-center gap-1.5 text-sm text-neutral-400">
          <Clock size={14} />
          {new Date().toLocaleDateString(locale === "tr" ? "tr-TR" : "en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      {/* Stats cards */}
      <DashboardCards
        activeOrders={stats.activeOrders}
        pendingQuotes={stats.pendingQuotes}
        unpaidInvoices={stats.unpaidInvoices}
        last30DaysRevenue={stats.last30DaysRevenue}
        locale={locale}
        labels={{
          activeOrders: t.activeOrders,
          pendingQuotes: t.pendingQuotes,
          unpaidInvoices: t.unpaidInvoices,
          last30Revenue: t.last30Revenue,
        }}
      />

      {/* Quick actions */}
      <div>
        <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-neutral-400">
          {t.quickActions}
        </h3>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/bayi-panel/hizli-siparis"
            className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-3 text-sm font-semibold text-[#0A1628] shadow-sm transition-all hover:bg-amber-400"
          >
            {t.newOrder}
            <ArrowRight size={14} />
          </Link>
          <Link
            href="/teklif-al"
            className="inline-flex items-center gap-2 rounded-xl border border-[#0A1628] bg-transparent px-5 py-3 text-sm font-semibold text-[#0A1628] transition-all hover:bg-[#0A1628] hover:text-white"
          >
            <FileText size={16} />
            {t.requestQuote}
          </Link>
          <Link
            href="/bayi-panel/urunler"
            className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-5 py-3 text-sm font-semibold text-neutral-700 transition-all hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
          >
            <Package size={16} />
            {t.viewProducts}
          </Link>
        </div>
      </div>

      {/* Recent orders */}
      <div className="rounded-xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-700 dark:bg-neutral-800">
        <div className="flex items-center justify-between border-b border-neutral-100 px-6 py-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-400">
            {t.recentOrders}
          </h3>
          {recentOrders.length > 0 && (
            <Link
              href="/bayi-panel/siparislerim"
              className="text-xs font-medium text-amber-600 hover:text-amber-700"
            >
              {t.viewAll} <ArrowRight size={12} className="ml-0.5 inline" />
            </Link>
          )}
        </div>
        <div className="p-6">
          {recentOrders.length === 0 ? (
            <p className="text-sm text-neutral-500">{t.noOrders}</p>
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden sm:block">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-neutral-100 text-left text-xs font-medium uppercase tracking-wider text-neutral-400">
                      <th className="pb-3 pr-4">{t.orderNo}</th>
                      <th className="pb-3 pr-4">{t.date}</th>
                      <th className="pb-3 pr-4">{t.status}</th>
                      <th className="pb-3 text-right">{t.amount}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-50">
                    {recentOrders.map((order) => (
                      <tr key={order.id} className="group">
                        <td className="py-3 pr-4">
                          <Link
                            href={`/bayi-panel/siparislerim/${order.id}`}
                            className="font-medium text-[#0A1628] group-hover:text-amber-600"
                          >
                            {order.order_number}
                          </Link>
                        </td>
                        <td className="py-3 pr-4 text-neutral-500">
                          {new Date(order.created_at).toLocaleDateString(
                            locale === "tr" ? "tr-TR" : "en-US"
                          )}
                        </td>
                        <td className="py-3 pr-4">
                          <OrderStatusBadge status={order.status} t={t} />
                        </td>
                        <td className="py-3 text-right font-mono font-medium text-[#0A1628]">
                          {order.total_amount != null
                            ? `${order.total_amount.toLocaleString(
                                locale === "tr" ? "tr-TR" : "en-US"
                              )} TL`
                            : "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Mobile cards */}
              <div className="space-y-3 sm:hidden">
                {recentOrders.map((order) => (
                  <Link
                    key={order.id}
                    href={`/bayi-panel/siparislerim/${order.id}`}
                    className="block rounded-lg border border-neutral-100 p-4 transition-colors hover:bg-neutral-50"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-[#0A1628]">{order.order_number}</span>
                      <OrderStatusBadge status={order.status} t={t} />
                    </div>
                    <div className="mt-2 flex items-center justify-between text-xs text-neutral-500">
                      <span>
                        {new Date(order.created_at).toLocaleDateString(
                          locale === "tr" ? "tr-TR" : "en-US"
                        )}
                      </span>
                      <span className="font-mono font-medium text-[#0A1628]">
                        {order.total_amount != null
                          ? `${order.total_amount.toLocaleString(
                              locale === "tr" ? "tr-TR" : "en-US"
                            )} TL`
                          : "-"}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
