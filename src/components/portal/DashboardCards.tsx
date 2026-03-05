"use client";

import {
  ClipboardList,
  FileText,
  AlertCircle,
  TrendingUp,
} from "lucide-react";

interface DashboardCardsProps {
  activeOrders: number;
  pendingQuotes: number;
  unpaidInvoices: number;
  last30DaysRevenue: number;
  locale: string;
  labels: {
    activeOrders: string;
    pendingQuotes: string;
    unpaidInvoices: string;
    last30Revenue: string;
  };
}

export default function DashboardCards({
  activeOrders,
  pendingQuotes,
  unpaidInvoices,
  last30DaysRevenue,
  locale,
  labels,
}: DashboardCardsProps) {
  const cards = [
    {
      label: labels.activeOrders,
      value: activeOrders,
      icon: ClipboardList,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      format: "number" as const,
    },
    {
      label: labels.pendingQuotes,
      value: pendingQuotes,
      icon: FileText,
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
      format: "number" as const,
    },
    {
      label: labels.unpaidInvoices,
      value: unpaidInvoices,
      icon: AlertCircle,
      iconBg: "bg-red-100",
      iconColor: "text-red-600",
      format: "number" as const,
    },
    {
      label: labels.last30Revenue,
      value: last30DaysRevenue,
      icon: TrendingUp,
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
      format: "currency" as const,
    },
  ];

  const formatValue = (value: number, format: "number" | "currency") => {
    if (format === "currency") {
      return `${value.toLocaleString(locale === "tr" ? "tr-TR" : "en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })} TL`;
    }
    return value.toString();
  };

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm transition-all hover:shadow-md dark:border-neutral-700 dark:bg-neutral-800"
        >
          <div className="flex items-center gap-4">
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${card.iconBg}`}
            >
              <card.icon size={22} className={card.iconColor} />
            </div>
            <div className="min-w-0">
              <p className="font-mono text-2xl font-bold text-[#0A1628] dark:text-white">
                {formatValue(card.value, card.format)}
              </p>
              <p className="truncate text-sm text-neutral-500 dark:text-neutral-400">{card.label}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
