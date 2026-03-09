"use client";

import { Check, Clock, Package, Truck, CircleCheck, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { OrderStatus } from "@/types/database";

interface StatusHistoryEntry {
  new_status: string;
  note: string | null;
  created_at: string;
}

interface OrderTimelineProps {
  history: StatusHistoryEntry[];
  currentStatus: string;
  locale?: string;
}

const STAGES: { key: OrderStatus; icon: typeof Clock }[] = [
  { key: "pending", icon: Clock },
  { key: "confirmed", icon: Check },
  { key: "production", icon: Package },
  { key: "shipping", icon: Truck },
  { key: "delivered", icon: CircleCheck },
];

const statusLabels: Record<string, Record<string, string>> = {
  tr: {
    pending: "Beklemede",
    confirmed: "Onaylandı",
    production: "Üretimde",
    shipping: "Kargoda",
    delivered: "Teslim Edildi",
    cancelled: "İptal Edildi",
  },
  en: {
    pending: "Pending",
    confirmed: "Confirmed",
    production: "In Production",
    shipping: "Shipping",
    delivered: "Delivered",
    cancelled: "Cancelled",
  },
};

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
  confirmed: "bg-blue-100 text-blue-800 border-blue-300",
  production: "bg-purple-100 text-purple-800 border-purple-300",
  shipping: "bg-orange-100 text-orange-800 border-orange-300",
  delivered: "bg-green-100 text-green-800 border-green-300",
  cancelled: "bg-red-100 text-red-800 border-red-300",
};

const activeCircleColors: Record<string, string> = {
  pending: "bg-yellow-500 border-yellow-600",
  confirmed: "bg-blue-500 border-blue-600",
  production: "bg-purple-500 border-purple-600",
  shipping: "bg-orange-500 border-orange-600",
  delivered: "bg-green-500 border-green-600",
};

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function OrderTimeline({ history, currentStatus, locale = "tr" }: OrderTimelineProps) {
  const t = statusLabels[locale] || statusLabels.tr;
  const isCancelled = currentStatus === "cancelled";

  const historyMap = new Map<string, StatusHistoryEntry>();
  for (const entry of history) {
    historyMap.set(entry.new_status, entry);
  }

  const cancelledEntry = historyMap.get("cancelled");

  const currentStageIndex = STAGES.findIndex((s) => s.key === currentStatus);

  return (
    <div className="w-full">
      {/* Desktop timeline */}
      <div className="hidden sm:block">
        <div className="relative flex items-start justify-between">
          {/* Background line */}
          <div className="absolute left-0 right-0 top-5 h-0.5 bg-neutral-200" />
          {/* Progress line */}
          {currentStageIndex >= 0 && !isCancelled && (
            <div
              className="absolute top-5 h-0.5 bg-primary-600 transition-all duration-500"
              style={{
                left: 0,
                width: `${(currentStageIndex / (STAGES.length - 1)) * 100}%`,
              }}
            />
          )}

          {STAGES.map((stage, idx) => {
            const entry = historyMap.get(stage.key);
            const isCompleted = !isCancelled && currentStageIndex > idx;
            const isActive = !isCancelled && currentStageIndex === idx;
            const isPending = isCancelled || currentStageIndex < idx;
            const Icon = stage.icon;

            return (
              <div key={stage.key} className="relative z-10 flex flex-col items-center" style={{ width: `${100 / STAGES.length}%` }}>
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all",
                    isCompleted && "border-primary-600 bg-primary-600 text-white",
                    isActive && (activeCircleColors[stage.key] || "bg-primary-500 border-primary-600") + " text-white",
                    isPending && "border-neutral-300 bg-white text-neutral-400"
                  )}
                >
                  {isCompleted ? <Check size={18} /> : <Icon size={18} />}
                </div>
                <span
                  className={cn(
                    "mt-2 text-xs font-medium text-center",
                    (isCompleted || isActive) ? "text-primary-900" : "text-neutral-400"
                  )}
                >
                  {t[stage.key]}
                </span>
                {entry && (
                  <span className="mt-1 text-[10px] text-neutral-500 text-center">
                    {formatDate(entry.created_at)}
                  </span>
                )}
                {entry?.note && (
                  <span className="mt-0.5 max-w-[120px] text-[10px] text-neutral-400 text-center truncate">
                    {entry.note}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile timeline (vertical) */}
      <div className="sm:hidden">
        <div className="relative ml-5 space-y-6 border-l-2 border-neutral-200 pl-6">
          {STAGES.map((stage, idx) => {
            const entry = historyMap.get(stage.key);
            const isCompleted = !isCancelled && currentStageIndex > idx;
            const isActive = !isCancelled && currentStageIndex === idx;
            const isPending = isCancelled || currentStageIndex < idx;
            const Icon = stage.icon;

            return (
              <div key={stage.key} className="relative">
                <div
                  className={cn(
                    "absolute -left-[33px] flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all",
                    isCompleted && "border-primary-600 bg-primary-600 text-white",
                    isActive && (activeCircleColors[stage.key] || "bg-primary-500 border-primary-600") + " text-white",
                    isPending && "border-neutral-300 bg-white text-neutral-400"
                  )}
                >
                  {isCompleted ? <Check size={14} /> : <Icon size={14} />}
                </div>
                <div className="pt-0.5">
                  <p
                    className={cn(
                      "text-sm font-medium",
                      (isCompleted || isActive) ? "text-primary-900" : "text-neutral-400"
                    )}
                  >
                    {t[stage.key]}
                  </p>
                  {entry && (
                    <p className="text-xs text-neutral-500">{formatDate(entry.created_at)}</p>
                  )}
                  {entry?.note && (
                    <p className="text-xs text-neutral-400 mt-0.5">{entry.note}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Cancelled state */}
      {isCancelled && cancelledEntry && (
        <div className="mt-6 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
          <XCircle size={20} className="mt-0.5 shrink-0 text-red-600" />
          <div>
            <p className="text-sm font-semibold text-red-800">{t.cancelled}</p>
            <p className="text-xs text-red-600">{formatDate(cancelledEntry.created_at)}</p>
            {cancelledEntry.note && (
              <p className="mt-1 text-sm text-red-700">{cancelledEntry.note}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export function OrderStatusBadge({ status, locale = "tr" }: { status: string; locale?: string }) {
  const t = statusLabels[locale] || statusLabels.tr;
  const color = statusColors[status] || "bg-neutral-100 text-neutral-800 border-neutral-300";

  return (
    <span className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium", color)}>
      {t[status] || status}
    </span>
  );
}

export function PaymentStatusBadge({ status, locale = "tr" }: { status: string; locale?: string }) {
  const paymentLabels: Record<string, Record<string, string>> = {
    tr: { pending: "Beklemede", paid: "Ödendi", partial: "Kısmi", refunded: "İade" },
    en: { pending: "Pending", paid: "Paid", partial: "Partial", refunded: "Refunded" },
  };
  const paymentColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
    paid: "bg-green-100 text-green-800 border-green-300",
    partial: "bg-orange-100 text-orange-800 border-orange-300",
    refunded: "bg-red-100 text-red-800 border-red-300",
  };
  const t = paymentLabels[locale] || paymentLabels.tr;
  const color = paymentColors[status] || "bg-neutral-100 text-neutral-800 border-neutral-300";

  return (
    <span className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium", color)}>
      {t[status] || status}
    </span>
  );
}
