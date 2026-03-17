"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft, Package, Calendar, CreditCard, Hash, Truck, Loader2, AlertTriangle } from "lucide-react";
import { usePortalLocale } from "@/hooks/usePortalLocale";
import { supabaseBrowser } from "@/lib/supabase/client";
import OrderTimeline, { OrderStatusBadge, PaymentStatusBadge } from "@/components/ui/OrderTimeline";
import LocaleLink from "@/components/ui/LocaleLink";
import type { DbOrder, DbOrderItem, DbOrderStatusHistory } from "@/types/database";

type OrderDetail = DbOrder & {
  order_items: DbOrderItem[];
  order_status_history: DbOrderStatusHistory[];
};

export default function SiparisDetayPage() {
  const params = useParams();
  const { locale, dict: portalDict } = usePortalLocale();
  const t = portalDict.orderDetail;
  const orderId = params?.id as string;

  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOrder() {
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

        const { data, error: fetchError } = await supabase
          .from("orders")
          .select("*, order_items(*), order_status_history(*)")
          .eq("id", orderId)
          .single();

        if (fetchError || !data) {
          setError(t.notFound);
          setLoading(false);
          return;
        }

        const orderData = data as OrderDetail;

        // Verify ownership
        if (orderData.profile_id !== user.id) {
          setError(t.notFound);
          setLoading(false);
          return;
        }

        // Sort history by created_at ascending
        orderData.order_status_history.sort(
          (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );

        setOrder(orderData);
      } catch {
        setError(t.error);
      } finally {
        setLoading(false);
      }
    }

    if (orderId) {
      fetchOrder();
    }
  }, [orderId, t.error, t.notFound]);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(locale === "en" ? "en-US" : "tr-TR", {
      day: "2-digit",
      month: "long",
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

  // Loading
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={32} className="animate-spin text-primary-600" />
        <span className="ml-3 text-sm text-neutral-500">{t.loading}</span>
      </div>
    );
  }

  // Error / not found
  if (error || !order) {
    return (
      <div className="space-y-4">
        <LocaleLink
          href="/bayi-panel/siparislerim"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-700 transition-colors hover:text-primary-900"
        >
          <ArrowLeft size={16} />
          {t.back}
        </LocaleLink>
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-neutral-200 py-20 dark:border-neutral-700">
          <AlertTriangle size={48} className="text-neutral-300 dark:text-neutral-600" />
          <p className="mt-4 text-lg font-medium text-neutral-600 dark:text-neutral-300">{error || t.notFound}</p>
          <p className="mt-1 text-sm text-neutral-400 dark:text-neutral-500">{t.notFoundDesc}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back button */}
      <LocaleLink
        href="/bayi-panel/siparislerim"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-700 transition-colors hover:text-primary-900"
      >
        <ArrowLeft size={16} />
        {t.back}
      </LocaleLink>

      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-primary-900 dark:text-white">{t.orderDetail}</h1>
        <OrderStatusBadge status={order.status} locale={locale} />
      </div>

      {/* Info cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-700 dark:bg-neutral-800">
          <div className="flex items-center gap-2 text-neutral-500">
            <Hash size={16} />
            <span className="text-xs font-medium uppercase tracking-wider">{t.orderNo}</span>
          </div>
          <p className="mt-2 text-lg font-bold text-primary-900 dark:text-white">#{order.order_number}</p>
        </div>

        <div className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-700 dark:bg-neutral-800">
          <div className="flex items-center gap-2 text-neutral-500">
            <Calendar size={16} />
            <span className="text-xs font-medium uppercase tracking-wider">{t.orderDate}</span>
          </div>
          <p className="mt-2 text-lg font-bold text-primary-900 dark:text-white">{formatDate(order.created_at)}</p>
        </div>

        <div className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-700 dark:bg-neutral-800">
          <div className="flex items-center gap-2 text-neutral-500">
            <CreditCard size={16} />
            <span className="text-xs font-medium uppercase tracking-wider">{t.total}</span>
          </div>
          <p className="mt-2 text-lg font-bold text-primary-900 dark:text-white">{formatCurrency(order.total_amount)}</p>
        </div>

        <div className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-700 dark:bg-neutral-800">
          <div className="flex items-center gap-2 text-neutral-500">
            <CreditCard size={16} />
            <span className="text-xs font-medium uppercase tracking-wider">{t.paymentStatus}</span>
          </div>
          <div className="mt-2">
            <PaymentStatusBadge status={order.payment_status} locale={locale} />
          </div>
        </div>
      </div>

      {/* Tracking & delivery info */}
      {(order.tracking_number || order.estimated_delivery) && (
        <div className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-700 dark:bg-neutral-800">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
            {order.tracking_number && (
              <div className="flex items-center gap-3">
                <Truck size={20} className="text-primary-600" />
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">{t.trackingNumber}</p>
                  <p className="mt-0.5 text-sm font-semibold text-primary-900 dark:text-white">{order.tracking_number}</p>
                </div>
              </div>
            )}
            {order.estimated_delivery && (
              <div className="flex items-center gap-3">
                <Calendar size={20} className="text-primary-600" />
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">{t.estimatedDelivery}</p>
                  <p className="mt-0.5 text-sm font-semibold text-primary-900 dark:text-white">{formatDate(order.estimated_delivery)}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Timeline */}
      <div className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-700 dark:bg-neutral-800">
        <h2 className="mb-6 text-lg font-bold text-primary-900 dark:text-white">{t.timeline}</h2>
        <OrderTimeline
          history={order.order_status_history}
          currentStatus={order.status}
          locale={locale}
        />
      </div>

      {/* Products table */}
      <div className="rounded-lg border border-neutral-200 bg-white shadow-sm dark:border-neutral-700 dark:bg-neutral-800">
        <div className="border-b border-neutral-100 px-6 py-4">
          <h2 className="flex items-center gap-2 text-lg font-bold text-primary-900 dark:text-white">
            <Package size={20} />
            {t.products}
          </h2>
        </div>

        {/* Desktop table */}
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-100 bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900">
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">
                  {t.productName}
                </th>
                <th className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider text-neutral-500">
                  {t.quantity}
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-neutral-500">
                  {t.unitPrice}
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-neutral-500">
                  {t.lineTotal}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-700">
              {order.order_items.map((item) => (
                <tr key={item.id} className="transition-colors hover:bg-neutral-50/50 dark:hover:bg-neutral-700/50">
                  <td className="px-6 py-3.5">
                    <p className="text-sm font-medium text-neutral-900 dark:text-white">{item.product_name}</p>
                    {item.notes && (
                      <p className="mt-0.5 text-xs text-neutral-400">{item.notes}</p>
                    )}
                  </td>
                  <td className="px-6 py-3.5 text-center text-sm text-neutral-600">
                    {item.quantity.toLocaleString(locale === "en" ? "en-US" : "tr-TR")}
                  </td>
                  <td className="px-6 py-3.5 text-right text-sm text-neutral-600">
                    {formatCurrency(item.unit_price)}
                  </td>
                  <td className="px-6 py-3.5 text-right text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                    {formatCurrency(item.total_price)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="border-t-2 border-neutral-200 dark:border-neutral-600">
              <tr>
                <td colSpan={3} className="px-6 py-2.5 text-right text-sm text-neutral-500">
                  {t.subtotal}
                </td>
                <td className="px-6 py-2.5 text-right text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  {formatCurrency(order.subtotal)}
                </td>
              </tr>
              <tr>
                <td colSpan={3} className="px-6 py-2.5 text-right text-sm text-neutral-500">
                  {t.tax}
                </td>
                <td className="px-6 py-2.5 text-right text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  {formatCurrency(order.tax_amount)}
                </td>
              </tr>
              {order.shipping_cost > 0 && (
                <tr>
                  <td colSpan={3} className="px-6 py-2.5 text-right text-sm text-neutral-500">
                    {t.shipping}
                  </td>
                  <td className="px-6 py-2.5 text-right text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    {formatCurrency(order.shipping_cost)}
                  </td>
                </tr>
              )}
              <tr className="border-t border-neutral-200 dark:border-neutral-700">
                <td colSpan={3} className="px-6 py-3 text-right text-sm font-bold text-primary-900">
                  {t.total}
                </td>
                <td className="px-6 py-3 text-right text-lg font-bold text-primary-900 dark:text-white">
                  {formatCurrency(order.total_amount)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Mobile product cards */}
        <div className="divide-y divide-neutral-100 dark:divide-neutral-700 md:hidden">
          {order.order_items.map((item) => (
            <div key={item.id} className="p-4">
              <p className="text-sm font-medium text-neutral-900 dark:text-white">{item.product_name}</p>
              {item.notes && (
                <p className="mt-0.5 text-xs text-neutral-400">{item.notes}</p>
              )}
              <div className="mt-2 flex items-center justify-between text-sm">
                <span className="text-neutral-500">
                  {item.quantity.toLocaleString(locale === "en" ? "en-US" : "tr-TR")} x {formatCurrency(item.unit_price)}
                </span>
                <span className="font-semibold text-neutral-900">{formatCurrency(item.total_price)}</span>
              </div>
            </div>
          ))}
          <div className="space-y-2 bg-neutral-50 p-4 dark:bg-neutral-900">
            <div className="flex justify-between text-sm">
              <span className="text-neutral-500">{t.subtotal}</span>
              <span className="font-medium text-neutral-700 dark:text-neutral-300">{formatCurrency(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-neutral-500">{t.tax}</span>
              <span className="font-medium text-neutral-700 dark:text-neutral-300">{formatCurrency(order.tax_amount)}</span>
            </div>
            {order.shipping_cost > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500">{t.shipping}</span>
                <span className="font-medium text-neutral-700 dark:text-neutral-300">{formatCurrency(order.shipping_cost)}</span>
              </div>
            )}
            <div className="flex justify-between border-t border-neutral-200 dark:border-neutral-700 pt-2">
              <span className="text-sm font-bold text-primary-900">{t.total}</span>
              <span className="text-lg font-bold text-primary-900 dark:text-white">{formatCurrency(order.total_amount)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Order notes */}
      {order.notes && (
        <div className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-700 dark:bg-neutral-800">
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wider text-neutral-500">{t.notes}</h2>
          <p className="text-sm text-neutral-700 dark:text-neutral-300">{order.notes}</p>
        </div>
      )}
    </div>
  );
}
