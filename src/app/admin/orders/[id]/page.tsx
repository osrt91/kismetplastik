"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Package,
  User,
  MapPin,
  Clock,
  Truck,
  FileText,
  Save,
  CheckCircle2,
  XCircle,
  RefreshCw,
} from "lucide-react";
import type {
  OrderStatus,
  DbOrderItem,
  DbOrderStatusHistory,
} from "@/types/database";

interface OrderProfile {
  full_name: string;
  email: string;
  phone: string | null;
  company_name: string | null;
}

interface OrderDetail {
  id: string;
  order_number: string;
  status: OrderStatus;
  shipping_address: Record<string, string> | null;
  billing_address: Record<string, string> | null;
  subtotal: number;
  tax_amount: number;
  shipping_cost: number;
  total_amount: number;
  payment_method: string | null;
  payment_status: string;
  tracking_number: string | null;
  estimated_delivery: string | null;
  notes: string | null;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
  profiles: OrderProfile | null;
  order_items: DbOrderItem[];
  order_status_history: DbOrderStatusHistory[];
}

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Beklemede",
  confirmed: "Onaylandı",
  production: "Üretimde",
  shipping: "Kargoda",
  delivered: "Teslim Edildi",
  cancelled: "İptal",
};

const STATUS_COLORS: Record<OrderStatus, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  production: "bg-indigo-100 text-indigo-800",
  shipping: "bg-orange-100 text-orange-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

const STATUS_TIMELINE_COLORS: Record<OrderStatus, string> = {
  pending: "bg-yellow-400",
  confirmed: "bg-blue-500",
  production: "bg-indigo-500",
  shipping: "bg-orange-500",
  delivered: "bg-green-500",
  cancelled: "bg-red-500",
};

const ALL_STATUSES: OrderStatus[] = [
  "pending",
  "confirmed",
  "production",
  "shipping",
  "delivered",
  "cancelled",
];

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    minimumFractionDigits: 2,
  }).format(amount);
}

function AddressCard({
  title,
  address,
}: {
  title: string;
  address: Record<string, string> | null;
}) {
  if (!address) {
    return (
      <div className="rounded-xl border border-border bg-card p-4">
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground">Adres bilgisi yok</p>
      </div>
    );
  }

  const lines = [
    address.full_name,
    address.address_line1,
    address.address_line2,
    [address.district, address.city].filter(Boolean).join(", "),
    [address.postal_code, address.country].filter(Boolean).join(" "),
    address.phone,
  ].filter(Boolean);

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <h3 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        <MapPin size={12} />
        {title}
      </h3>
      <div className="space-y-0.5">
        {lines.map((line, i) => (
          <p key={i} className="text-sm text-foreground">
            {line}
          </p>
        ))}
      </div>
    </div>
  );
}

export default function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Editable fields
  const [newStatus, setNewStatus] = useState<OrderStatus>("pending");
  const [statusNote, setStatusNote] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [adminNotes, setAdminNotes] = useState("");

  // Save states
  const [savingStatus, setSavingStatus] = useState(false);
  const [savingTracking, setSavingTracking] = useState(false);
  const [savingNotes, setSavingNotes] = useState(false);
  const [saveResult, setSaveResult] = useState<{
    field: string;
    ok: boolean;
    msg: string;
  } | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/admin/orders/${id}`);
        const json = await res.json();
        if (!json.success) {
          setError(json.error ?? "Sipariş yüklenemedi");
          return;
        }
        const o: OrderDetail = json.data;
        setOrder(o);
        setNewStatus(o.status);
        setTrackingNumber(o.tracking_number ?? "");
        setAdminNotes(o.admin_notes ?? "");
      } catch {
        setError("Sunucuya bağlanılamadı");
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  const showResult = (field: string, ok: boolean, msg: string) => {
    setSaveResult({ field, ok, msg });
    setTimeout(() => setSaveResult(null), 3000);
  };

  const handleStatusUpdate = async () => {
    if (!order || newStatus === order.status) return;
    setSavingStatus(true);
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus, status_note: statusNote }),
      });
      const json = await res.json();
      if (json.success) {
        setOrder((prev) =>
          prev ? { ...prev, status: newStatus } : prev
        );
        setStatusNote("");
        showResult("status", true, "Durum güncellendi");
        // Re-fetch to get updated history
        const r2 = await fetch(`/api/admin/orders/${id}`);
        const j2 = await r2.json();
        if (j2.success) setOrder(j2.data);
      } else {
        showResult("status", false, json.error ?? "Hata oluştu");
      }
    } catch {
      showResult("status", false, "Sunucuya bağlanılamadı");
    } finally {
      setSavingStatus(false);
    }
  };

  const handleTrackingSave = async () => {
    setSavingTracking(true);
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tracking_number: trackingNumber }),
      });
      const json = await res.json();
      if (json.success) {
        setOrder((prev) =>
          prev
            ? { ...prev, tracking_number: trackingNumber || null }
            : prev
        );
        showResult("tracking", true, "Takip numarası kaydedildi");
      } else {
        showResult("tracking", false, json.error ?? "Hata oluştu");
      }
    } catch {
      showResult("tracking", false, "Sunucuya bağlanılamadı");
    } finally {
      setSavingTracking(false);
    }
  };

  const handleNotesSave = async () => {
    setSavingNotes(true);
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ admin_notes: adminNotes }),
      });
      const json = await res.json();
      if (json.success) {
        setOrder((prev) =>
          prev ? { ...prev, admin_notes: adminNotes || null } : prev
        );
        showResult("notes", true, "Notlar kaydedildi");
      } else {
        showResult("notes", false, json.error ?? "Hata oluştu");
      }
    } catch {
      showResult("notes", false, "Sunucuya bağlanılamadı");
    } finally {
      setSavingNotes(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-muted-foreground">
        <RefreshCw size={24} className="animate-spin" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="space-y-4">
        <button
          onClick={() => router.push("/admin/orders")}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft size={14} />
          Siparişlere Dön
        </button>
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error ?? "Sipariş bulunamadı"}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back + header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <button
            onClick={() => router.push("/admin/orders")}
            className="mb-3 flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft size={14} />
            Siparişlere Dön
          </button>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-foreground">
              {order.order_number || `#${order.id.slice(0, 8).toUpperCase()}`}
            </h1>
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                STATUS_COLORS[order.status]
              }`}
            >
              {STATUS_LABELS[order.status]}
            </span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Oluşturulma: {formatDate(order.created_at)}
          </p>
        </div>
      </div>

      {/* Save result toast */}
      {saveResult && (
        <div
          className={`flex items-center gap-2 rounded-lg px-4 py-3 text-sm ${
            saveResult.ok
              ? "border border-green-200 bg-green-50 text-green-700"
              : "border border-destructive/30 bg-destructive/10 text-destructive"
          }`}
        >
          {saveResult.ok ? (
            <CheckCircle2 size={14} />
          ) : (
            <XCircle size={14} />
          )}
          {saveResult.msg}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left column (2/3) */}
        <div className="space-y-6 lg:col-span-2">
          {/* Order items */}
          <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
            <div className="flex items-center gap-2 border-b border-border px-4 py-3">
              <Package size={16} className="text-muted-foreground" />
              <h2 className="font-semibold text-foreground">Sipariş Kalemleri</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted">
                    <th className="px-4 py-2.5 text-left font-semibold text-muted-foreground">
                      Ürün
                    </th>
                    <th className="px-4 py-2.5 text-right font-semibold text-muted-foreground">
                      Miktar
                    </th>
                    <th className="hidden px-4 py-2.5 text-right font-semibold text-muted-foreground sm:table-cell">
                      Birim Fiyat
                    </th>
                    <th className="px-4 py-2.5 text-right font-semibold text-muted-foreground">
                      Toplam
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {order.order_items.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-4 py-6 text-center text-sm text-muted-foreground"
                      >
                        Kalem bulunamadı
                      </td>
                    </tr>
                  ) : (
                    order.order_items.map((item) => (
                      <tr
                        key={item.id}
                        className="border-b border-border last:border-0"
                      >
                        <td className="px-4 py-3">
                          <p className="font-medium text-foreground">
                            {item.product_name}
                          </p>
                          {item.notes && (
                            <p className="text-xs text-muted-foreground">
                              {item.notes}
                            </p>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right text-muted-foreground">
                          {item.quantity.toLocaleString("tr-TR")}
                        </td>
                        <td className="hidden px-4 py-3 text-right text-muted-foreground sm:table-cell">
                          {formatCurrency(item.unit_price)}
                        </td>
                        <td className="px-4 py-3 text-right font-medium text-foreground">
                          {formatCurrency(item.total_price)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="border-t border-border bg-muted/50 px-4 py-3">
              <div className="ml-auto max-w-xs space-y-1.5 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Ara Toplam</span>
                  <span>{formatCurrency(order.subtotal)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>KDV (%20)</span>
                  <span>{formatCurrency(order.tax_amount)}</span>
                </div>
                {order.shipping_cost > 0 && (
                  <div className="flex justify-between text-muted-foreground">
                    <span>Kargo</span>
                    <span>{formatCurrency(order.shipping_cost)}</span>
                  </div>
                )}
                <div className="flex justify-between border-t border-border pt-1.5 font-semibold text-foreground">
                  <span>Genel Toplam</span>
                  <span>{formatCurrency(order.total_amount)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Status history timeline */}
          <div className="rounded-xl border border-border bg-card shadow-sm">
            <div className="flex items-center gap-2 border-b border-border px-4 py-3">
              <Clock size={16} className="text-muted-foreground" />
              <h2 className="font-semibold text-foreground">Durum Geçmişi</h2>
            </div>
            <div className="p-4">
              {order.order_status_history.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Durum geçmişi yok
                </p>
              ) : (
                <ol className="relative space-y-4 border-l border-border pl-6">
                  {order.order_status_history.map((h, i) => (
                    <li key={h.id} className="relative">
                      <span
                        className={`absolute -left-[1.625rem] flex h-4 w-4 items-center justify-center rounded-full border-2 border-card ${
                          STATUS_TIMELINE_COLORS[h.new_status]
                        } ${i === 0 ? "ring-2 ring-primary/20" : ""}`}
                      />
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            {h.old_status
                              ? `${STATUS_LABELS[h.old_status]} → ${STATUS_LABELS[h.new_status]}`
                              : STATUS_LABELS[h.new_status]}
                          </p>
                          {h.note && (
                            <p className="text-xs text-muted-foreground">
                              {h.note}
                            </p>
                          )}
                        </div>
                        <time className="shrink-0 text-xs text-muted-foreground">
                          {formatDate(h.created_at)}
                        </time>
                      </div>
                    </li>
                  ))}
                </ol>
              )}
            </div>
          </div>

          {/* Addresses */}
          <div className="grid gap-4 sm:grid-cols-2">
            <AddressCard
              title="Teslimat Adresi"
              address={order.shipping_address as Record<string, string> | null}
            />
            <AddressCard
              title="Fatura Adresi"
              address={order.billing_address as Record<string, string> | null}
            />
          </div>
        </div>

        {/* Right column (1/3) */}
        <div className="space-y-6">
          {/* Customer info */}
          <div className="rounded-xl border border-border bg-card shadow-sm">
            <div className="flex items-center gap-2 border-b border-border px-4 py-3">
              <User size={16} className="text-muted-foreground" />
              <h2 className="font-semibold text-foreground">Müşteri Bilgileri</h2>
            </div>
            <div className="space-y-3 p-4 text-sm">
              {order.profiles ? (
                <>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Ad Soyad
                    </p>
                    <p className="mt-0.5 font-medium text-foreground">
                      {order.profiles.full_name}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      E-posta
                    </p>
                    <p className="mt-0.5 text-foreground">
                      {order.profiles.email}
                    </p>
                  </div>
                  {order.profiles.phone && (
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Telefon
                      </p>
                      <p className="mt-0.5 text-foreground">
                        {order.profiles.phone}
                      </p>
                    </div>
                  )}
                  {order.profiles.company_name && (
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Firma
                      </p>
                      <p className="mt-0.5 text-foreground">
                        {order.profiles.company_name}
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-muted-foreground">Müşteri bilgisi yok</p>
              )}

              {order.notes && (
                <div className="border-t border-border pt-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Müşteri Notu
                  </p>
                  <p className="mt-0.5 text-foreground">{order.notes}</p>
                </div>
              )}
            </div>
          </div>

          {/* Status update */}
          <div className="rounded-xl border border-border bg-card shadow-sm">
            <div className="flex items-center gap-2 border-b border-border px-4 py-3">
              <RefreshCw size={16} className="text-muted-foreground" />
              <h2 className="font-semibold text-foreground">Durum Güncelle</h2>
            </div>
            <div className="space-y-3 p-4">
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value as OrderStatus)}
                className="w-full rounded-lg border border-border bg-muted py-2 px-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              >
                {ALL_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {STATUS_LABELS[s]}
                  </option>
                ))}
              </select>
              <input
                type="text"
                value={statusNote}
                onChange={(e) => setStatusNote(e.target.value)}
                placeholder="Durum notu (isteğe bağlı)..."
                className="w-full rounded-lg border border-border bg-muted py-2 px-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
              <button
                onClick={handleStatusUpdate}
                disabled={savingStatus || newStatus === order.status}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {savingStatus ? (
                  <RefreshCw size={14} className="animate-spin" />
                ) : (
                  <Save size={14} />
                )}
                Durumu Kaydet
              </button>
              {newStatus === order.status && (
                <p className="text-center text-xs text-muted-foreground">
                  Mevcut durum zaten{" "}
                  <span className="font-medium">{STATUS_LABELS[order.status]}</span>
                </p>
              )}
            </div>
          </div>

          {/* Tracking number */}
          <div className="rounded-xl border border-border bg-card shadow-sm">
            <div className="flex items-center gap-2 border-b border-border px-4 py-3">
              <Truck size={16} className="text-muted-foreground" />
              <h2 className="font-semibold text-foreground">Kargo Takip</h2>
            </div>
            <div className="space-y-3 p-4">
              <input
                type="text"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="Takip numarası..."
                className="w-full rounded-lg border border-border bg-muted py-2 px-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
              <button
                onClick={handleTrackingSave}
                disabled={savingTracking}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-card py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted disabled:opacity-50"
              >
                {savingTracking ? (
                  <RefreshCw size={14} className="animate-spin" />
                ) : (
                  <Save size={14} />
                )}
                Takip Numarasını Kaydet
              </button>
            </div>
          </div>

          {/* Admin notes */}
          <div className="rounded-xl border border-border bg-card shadow-sm">
            <div className="flex items-center gap-2 border-b border-border px-4 py-3">
              <FileText size={16} className="text-muted-foreground" />
              <h2 className="font-semibold text-foreground">Admin Notları</h2>
            </div>
            <div className="space-y-3 p-4">
              <textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="İç notlar (müşteriye gösterilmez)..."
                rows={4}
                className="w-full resize-none rounded-lg border border-border bg-muted py-2 px-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
              <button
                onClick={handleNotesSave}
                disabled={savingNotes}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-card py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted disabled:opacity-50"
              >
                {savingNotes ? (
                  <RefreshCw size={14} className="animate-spin" />
                ) : (
                  <Save size={14} />
                )}
                Notları Kaydet
              </button>
            </div>
          </div>

          {/* Payment info */}
          <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Ödeme Bilgileri
            </h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Yöntem</span>
                <span className="font-medium text-foreground capitalize">
                  {order.payment_method ?? "-"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Durum</span>
                <span
                  className={`font-medium ${
                    order.payment_status === "paid"
                      ? "text-green-600"
                      : order.payment_status === "refunded"
                      ? "text-orange-600"
                      : "text-yellow-600"
                  }`}
                >
                  {order.payment_status === "paid"
                    ? "Ödendi"
                    : order.payment_status === "partial"
                    ? "Kısmi Ödeme"
                    : order.payment_status === "refunded"
                    ? "İade Edildi"
                    : "Bekliyor"}
                </span>
              </div>
              {order.estimated_delivery && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tahmini Teslim</span>
                  <span className="font-medium text-foreground">
                    {new Date(order.estimated_delivery).toLocaleDateString(
                      "tr-TR"
                    )}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
