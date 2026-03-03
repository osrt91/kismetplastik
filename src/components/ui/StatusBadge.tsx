import * as React from "react"

import { cn } from "@/lib/utils"

type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"

const statusConfig: Record<OrderStatus, { label: string; className: string }> = {
  pending: {
    label: "Beklemede",
    className: "bg-amber-500/15 text-amber-600 border-amber-500/25",
  },
  confirmed: {
    label: "Onaylandı",
    className: "bg-sky-500/15 text-sky-600 border-sky-500/25",
  },
  processing: {
    label: "Hazırlanıyor",
    className: "bg-navy-900/10 text-navy-900 border-navy-700/20 dark:bg-cream-50/10 dark:text-cream-50 dark:border-cream-50/20",
  },
  shipped: {
    label: "Kargoda",
    className: "bg-navy-700/15 text-navy-700 border-navy-700/25",
  },
  delivered: {
    label: "Teslim Edildi",
    className: "bg-amber-500/15 text-amber-700 border-amber-500/25",
  },
  cancelled: {
    label: "İptal Edildi",
    className: "bg-red-500/15 text-red-600 border-red-500/25",
  },
}

function StatusBadge({
  status,
  label,
  className,
  ...props
}: React.ComponentProps<"span"> & {
  status: OrderStatus
  label?: string
}) {
  const config = statusConfig[status]

  return (
    <span
      data-slot="status-badge"
      data-status={status}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium whitespace-nowrap",
        config.className,
        className
      )}
      {...props}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {label ?? config.label}
    </span>
  )
}

export { StatusBadge, statusConfig }
export type { OrderStatus }
