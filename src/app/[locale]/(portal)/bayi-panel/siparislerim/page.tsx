"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, ChevronLeft, ChevronRight, ShoppingCart, Eye, Loader2, RotateCcw } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import { supabaseBrowser } from "@/lib/supabase/client";
import { OrderStatusBadge } from "@/components/ui/OrderTimeline";
import LocaleLink from "@/components/ui/LocaleLink";
import type { DbOrder, DbOrderItem, OrderStatus } from "@/types/database";
import { cn } from "@/lib/utils";

type OrderWithItems = DbOrder & { order_items: DbOrderItem[] };

const PAGE_SIZE = 20;

const labels: Record<string, Record<string, string>> = {
  tr: {
    title: "Siparişlerim",
    searchPlaceholder: "Sipariş no veya ürün adı ara...",
    allStatuses: "Tüm Durumlar",
    orderNo: "Sipariş No",
    date: "Tarih",
    productCount: "Ürün Sayısı",
    status: "Durum",
    total: "Toplam",
    action: "İşlem",
    detail: "Detay",
    reorder: "Tekrar Sipariş Ver",
    empty: "Henüz siparişiniz bulunmuyor.",
    emptyDesc: "Sipariş verdiğinizde burada görüntülenecektir.",
    loading: "Yükleniyor...",
    prev: "Önceki",
    next: "Sonraki",
    page: "Sayfa",
    of: "/",
    items: "ürün",
    pending: "Beklemede",
    confirmed: "Onaylandı",
    production: "Üretimde",
    shipping: "Kargoda",
    delivered: "Teslim Edildi",
    cancelled: "İptal",
    error: "Siparişler yüklenirken bir hata oluştu.",
  },
  en: {
    title: "My Orders",
    searchPlaceholder: "Search by order number or product name...",
    allStatuses: "All Statuses",
    orderNo: "Order No",
    date: "Date",
    productCount: "Products",
    status: "Status",
    total: "Total",
    action: "Action",
    detail: "Detail",
    reorder: "Reorder",
    empty: "You don't have any orders yet.",
    emptyDesc: "Your orders will appear here once you place them.",
    loading: "Loading...",
    prev: "Previous",
    next: "Next",
    page: "Page",
    of: "/",
    items: "items",
    pending: "Pending",
    confirmed: "Confirmed",
    production: "In Production",
    shipping: "Shipping",
    delivered: "Delivered",
    cancelled: "Cancelled",
    error: "An error occurred while loading orders.",
  },
};

const statusOptions: OrderStatus[] = ["pending", "confirmed", "production", "shipping", "delivered", "cancelled"];

export default function SiparislerimPage() {
  const { locale } = useLocale();
  const t = labels[locale] || labels.en || labels.tr;

  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const supabase = supabaseBrowser();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setError(t.error);
        setLoading(false);
        return;
      }

      let query = supabase
        .from("orders")
        .select("*, order_items(*)", { count: "exact" })
        .eq("profile_id", user.id)
        .order("created_at", { ascending: false });

      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter);
      }

      if (search.trim()) {
        query = query.or(`order_number.ilike.%${search.trim()}%`);
      }

      const from = (page - 1) * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;
      query = query.range(from, to);

      const { data, error: fetchError, count } = await query;

      if (fetchError) {
        setError(t.error);
        setLoading(false);
        return;
      }

      let filteredData = (data || []) as OrderWithItems[];

      // Client-side filtering by product name if search is active
      if (search.trim()) {
        const searchLower = search.trim().toLowerCase();
        filteredData = filteredData.filter(
          (order) =>
            order.order_number.toLowerCase().includes(searchLower) ||
            order.order_items.some((item) =>
              item.product_name.toLowerCase().includes(searchLower)
            )
        );
      }

      setOrders(filteredData);
      setTotalCount(count || 0);
    } catch {
      setError(t.error);
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, search, t.error]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(locale === "en" ? "en-US" : "tr-TR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(locale === "en" ? "en-US" : "tr-TR", {
      style: "currency",
      currency: "TRY",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold text-[#0A1628]">{t.title}</h1>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full rounded-lg border border-neutral-200 bg-white py-2.5 pl-10 pr-4 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-neutral-200 bg-white px-4 py-2.5 text-sm text-neutral-700 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
        >
          <option value="all">{t.allStatuses}</option>
          {statusOptions.map((s) => (
            <option key={s} value={s}>
              {t[s]}
            </option>
          ))}
        </select>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={32} className="animate-spin text-amber-500" />
          <span className="ml-3 text-sm text-neutral-500">{t.loading}</span>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && orders.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-neutral-200 bg-white py-20">
          <ShoppingCart size={48} className="text-neutral-300" />
          <p className="mt-4 text-lg font-medium text-neutral-600">{t.empty}</p>
          <p className="mt-1 text-sm text-neutral-400">{t.emptyDesc}</p>
        </div>
      )}

      {/* Desktop table */}
      {!loading && !error && orders.length > 0 && (
        <>
          <div className="hidden overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-sm md:block dark:border-neutral-700 dark:bg-neutral-800">
            <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-neutral-100 bg-neutral-50">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">
                    {t.orderNo}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">
                    {t.date}
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-neutral-500">
                    {t.productCount}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">
                    {t.status}
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-neutral-500">
                    {t.total}
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-neutral-500">
                    {t.action}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {orders.map((order) => (
                  <tr key={order.id} className="transition-colors hover:bg-neutral-50/50 dark:hover:bg-neutral-700/50">
                    <td className="px-4 py-3.5">
                      <span className="font-mono text-sm font-semibold text-[#0A1628]">
                        #{order.order_number}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-sm text-neutral-600">
                      {formatDate(order.created_at)}
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <span className="font-mono text-sm text-neutral-700">
                        {order.order_items.length}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <OrderStatusBadge status={order.status} locale={locale} />
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <span className="font-mono text-sm font-semibold text-neutral-900">
                        {formatCurrency(order.total_amount)}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <LocaleLink
                          href={`/bayi-panel/siparislerim/${order.id}`}
                          className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3 text-xs font-medium text-neutral-700 transition-colors hover:bg-neutral-50"
                        >
                          <Eye size={14} />
                          {t.detail}
                        </LocaleLink>
                        {order.status === "delivered" && (
                          <LocaleLink
                            href="/bayi-panel/urunler"
                            className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-amber-500 px-3 text-xs font-medium text-white transition-colors hover:bg-amber-600"
                          >
                            <RotateCcw size={14} />
                            {t.reorder}
                          </LocaleLink>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </div>

          {/* Mobile cards */}
          <div className="space-y-3 md:hidden">
            {orders.map((order) => (
              <div
                key={order.id}
                className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-700 dark:bg-neutral-800"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-mono text-sm font-semibold text-[#0A1628]">
                      #{order.order_number}
                    </p>
                    <p className="mt-0.5 text-xs text-neutral-400">
                      {formatDate(order.created_at)} -{" "}
                      <span className="font-mono">{order.order_items.length}</span> {t.items}
                    </p>
                  </div>
                  <OrderStatusBadge status={order.status} locale={locale} />
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-neutral-100 pt-3">
                  <span className="font-mono text-sm font-semibold text-neutral-900">
                    {formatCurrency(order.total_amount)}
                  </span>
                  <div className="flex items-center gap-2">
                    {order.status === "delivered" && (
                      <LocaleLink
                        href="/bayi-panel/urunler"
                        className="inline-flex h-10 items-center gap-1 rounded-lg bg-amber-500 px-2.5 text-xs font-medium text-white hover:bg-amber-600"
                      >
                        <RotateCcw size={12} />
                      </LocaleLink>
                    )}
                    <LocaleLink
                      href={`/bayi-panel/siparislerim/${order.id}`}
                      className="flex h-10 items-center gap-1 text-xs font-medium text-[#0A1628]"
                    >
                      {t.detail}
                      <ChevronRight size={14} />
                    </LocaleLink>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between rounded-lg border border-neutral-200 bg-white px-4 py-3 dark:border-neutral-700 dark:bg-neutral-800">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className={cn(
                  "flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                  page === 1
                    ? "cursor-not-allowed text-neutral-300"
                    : "text-neutral-600 hover:bg-neutral-100"
                )}
              >
                <ChevronLeft size={16} />
                {t.prev}
              </button>
              <span className="text-sm text-neutral-500">
                {t.page} {page} {t.of} {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className={cn(
                  "flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                  page === totalPages
                    ? "cursor-not-allowed text-neutral-300"
                    : "text-neutral-600 hover:bg-neutral-100"
                )}
              >
                {t.next}
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
