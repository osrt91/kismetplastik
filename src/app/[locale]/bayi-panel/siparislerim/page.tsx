"use client";

import { useState, useEffect } from "react";
import {
  ShoppingCart,
  Search,
  Clock,
  CheckCircle2,
  Factory,
  Truck,
  Package,
  XCircle,
  ChevronDown,
  ChevronUp,
  MapPin,
  Calendar,
} from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import { getSupabaseBrowser } from "@/lib/supabase-browser";

interface OrderItem {
  id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

interface Order {
  id: string;
  order_number: string;
  status: string;
  total_amount: number;
  payment_status: string;
  tracking_number: string | null;
  created_at: string;
  order_items: OrderItem[];
}

const statusConfig: Record<string, { icon: typeof Clock; color: string; bg: string }> = {
  pending: { icon: Clock, color: "text-amber-600", bg: "bg-amber-50 border-amber-200" },
  confirmed: { icon: CheckCircle2, color: "text-blue-600", bg: "bg-blue-50 border-blue-200" },
  production: { icon: Factory, color: "text-indigo-600", bg: "bg-indigo-50 border-indigo-200" },
  shipping: { icon: Truck, color: "text-orange-600", bg: "bg-orange-50 border-orange-200" },
  delivered: { icon: Package, color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-200" },
  cancelled: { icon: XCircle, color: "text-red-600", bg: "bg-red-50 border-red-200" },
};

const labels: Record<string, Record<string, string>> = {
  tr: {
    title: "Siparişlerim",
    search: "Sipariş no ile ara...",
    all: "Tümü",
    pending: "Bekliyor",
    confirmed: "Onaylandı",
    production: "Üretimde",
    shipping: "Kargoda",
    delivered: "Teslim Edildi",
    cancelled: "İptal",
    orderNo: "Sipariş No",
    date: "Tarih",
    items: "Ürünler",
    total: "Toplam",
    status: "Durum",
    tracking: "Kargo Takip",
    noOrders: "Henüz siparişiniz bulunmuyor.",
    loading: "Yükleniyor...",
    quantity: "adet",
    paymentPending: "Ödeme Bekleniyor",
    paymentPaid: "Ödendi",
  },
  en: {
    title: "My Orders",
    search: "Search by order no...",
    all: "All",
    pending: "Pending",
    confirmed: "Confirmed",
    production: "In Production",
    shipping: "Shipping",
    delivered: "Delivered",
    cancelled: "Cancelled",
    orderNo: "Order No",
    date: "Date",
    items: "Products",
    total: "Total",
    status: "Status",
    tracking: "Track Shipment",
    noOrders: "You don't have any orders yet.",
    loading: "Loading...",
    quantity: "pcs",
    paymentPending: "Payment Pending",
    paymentPaid: "Paid",
  },
};

const statusSteps = ["pending", "confirmed", "production", "shipping", "delivered"];

export default function SiparislerimPage() {
  const { locale } = useLocale();
  const t = labels[locale] || labels.tr;

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    async function loadOrders() {
      try {
        const supabase = getSupabaseBrowser();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        let query = supabase
          .from("orders")
          .select("*, order_items(*)")
          .eq("profile_id", user.id)
          .order("created_at", { ascending: false });

        if (filter !== "all") {
          query = query.eq("status", filter);
        }

        const { data } = await query;
        setOrders((data as Order[]) || []);
      } catch (err) {
        console.error("Orders load error:", err);
      } finally {
        setLoading(false);
      }
    }

    loadOrders();
  }, [filter]);

  const filtered = search
    ? orders.filter((o) => o.order_number.toLowerCase().includes(search.toLowerCase()))
    : orders;

  const getStepIndex = (status: string) => statusSteps.indexOf(status);

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
      <h2 className="text-xl font-bold text-primary-900">{t.title}</h2>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t.search}
            className="w-full rounded-lg border border-neutral-200 py-2.5 pl-10 pr-4 text-sm outline-none transition-colors focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {["all", ...statusSteps, "cancelled"].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                filter === s
                  ? "bg-primary-900 text-white"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
              }`}
            >
              {t[s]}
            </button>
          ))}
        </div>
      </div>

      {/* Orders */}
      {filtered.length === 0 ? (
        <div className="rounded-xl border border-neutral-200 bg-white py-16 text-center">
          <ShoppingCart size={48} className="mx-auto mb-4 text-neutral-300" />
          <p className="text-neutral-500">{t.noOrders}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((order) => {
            const config = statusConfig[order.status] || statusConfig.pending;
            const StatusIcon = config.icon;
            const isExpanded = expandedId === order.id;
            const currentStep = getStepIndex(order.status);

            return (
              <div
                key={order.id}
                className="overflow-hidden rounded-xl border border-neutral-200 bg-white transition-shadow hover:shadow-md"
              >
                {/* Header row */}
                <button
                  onClick={() => setExpandedId(isExpanded ? null : order.id)}
                  className="flex w-full items-center gap-4 p-4 text-left"
                >
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border ${config.bg}`}>
                    <StatusIcon size={20} className={config.color} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-primary-900">{order.order_number}</span>
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${config.bg} ${config.color} border`}>
                        {t[order.status]}
                      </span>
                    </div>
                    <div className="mt-0.5 flex items-center gap-3 text-xs text-neutral-400">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        {new Date(order.created_at).toLocaleDateString(locale === "tr" ? "tr-TR" : "en-US")}
                      </span>
                      <span>{order.order_items?.length || 0} {t.items}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-primary-900">
                      {order.total_amount.toLocaleString("tr-TR", { style: "currency", currency: "TRY" })}
                    </p>
                    <p className="text-[10px] text-neutral-400">
                      {order.payment_status === "paid" ? t.paymentPaid : t.paymentPending}
                    </p>
                  </div>
                  {isExpanded ? <ChevronUp size={18} className="text-neutral-400" /> : <ChevronDown size={18} className="text-neutral-400" />}
                </button>

                {/* Expanded detail */}
                {isExpanded && (
                  <div className="border-t border-neutral-100 bg-neutral-50 p-4">
                    {/* Status timeline */}
                    {order.status !== "cancelled" && (
                      <div className="mb-5">
                        <div className="flex items-center justify-between">
                          {statusSteps.map((step, i) => {
                            const done = i <= currentStep;
                            const StepIcon = statusConfig[step]?.icon || Clock;
                            return (
                              <div key={step} className="flex flex-1 items-center">
                                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${done ? "bg-primary-900 text-white" : "bg-neutral-200 text-neutral-400"}`}>
                                  <StepIcon size={14} />
                                </div>
                                {i < statusSteps.length - 1 && (
                                  <div className={`mx-1 h-0.5 flex-1 ${i < currentStep ? "bg-primary-900" : "bg-neutral-200"}`} />
                                )}
                              </div>
                            );
                          })}
                        </div>
                        <div className="mt-1.5 flex justify-between">
                          {statusSteps.map((step) => (
                            <span key={step} className="text-[9px] text-neutral-400 first-letter:uppercase">{t[step]}</span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Tracking */}
                    {order.tracking_number && (
                      <div className="mb-4 flex items-center gap-2 rounded-lg bg-orange-50 p-3 text-sm">
                        <MapPin size={16} className="text-orange-600" />
                        <span className="font-medium text-orange-800">{t.tracking}: {order.tracking_number}</span>
                      </div>
                    )}

                    {/* Items */}
                    <div className="space-y-2">
                      {order.order_items?.map((item) => (
                        <div key={item.id} className="flex items-center justify-between rounded-lg bg-white p-3">
                          <div>
                            <p className="text-sm font-medium text-primary-900">{item.product_name}</p>
                            <p className="text-xs text-neutral-400">{item.quantity} {t.quantity}</p>
                          </div>
                          <p className="text-sm font-semibold text-primary-900">
                            {item.total_price.toLocaleString("tr-TR", { style: "currency", currency: "TRY" })}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
