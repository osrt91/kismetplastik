"use client";

import { useMemo } from "react";
import { ShoppingCart, Trash2, Plus, Minus, Package } from "lucide-react";
import {
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { useLocale } from "@/contexts/LocaleContext";

/* Re-export Sheet so consumers can import everything from one module */
export { Sheet } from "@/components/ui/sheet";

/* ── Labels ──────────────────────────────────────────────────────── */

const labels: Record<string, Record<string, string>> = {
  tr: {
    title: "Sepetim",
    itemCount: "urun",
    code: "Kod",
    subtotal: "Ara Toplam",
    vat: "KDV (%20)",
    grandTotal: "Genel Toplam",
    checkout: "Siparis Ver",
    requestQuote: "Teklif Iste",
    emptyTitle: "Sepetiniz bos",
    emptyDesc: "Urun eklemek icin katalogdan veya hizli siparis formundan urun secin.",
    remove: "Kaldir",
    quantity: "Adet",
  },
  en: {
    title: "My Cart",
    itemCount: "items",
    code: "Code",
    subtotal: "Subtotal",
    vat: "VAT (20%)",
    grandTotal: "Grand Total",
    checkout: "Place Order",
    requestQuote: "Request Quote",
    emptyTitle: "Your cart is empty",
    emptyDesc: "Add products from the catalog or use the quick order form.",
    remove: "Remove",
    quantity: "Qty",
  },
};

/* ── Types ───────────────────────────────────────────────────────── */

export interface CartItem {
  stokKodu: string;
  stokAdi: string;
  miktar: number;
  birimFiyat: number;
  kdvOrani: number;
}

interface CartSidebarProps {
  items: CartItem[];
  onUpdateQuantity: (stokKodu: string, miktar: number) => void;
  onRemoveItem: (stokKodu: string) => void;
  onCheckout: () => void;
  onRequestQuote: () => void;
}

/* ── Currency formatter ──────────────────────────────────────────── */

const formatCurrency = new Intl.NumberFormat("tr-TR", {
  style: "currency",
  currency: "TRY",
});

/* ── CartTrigger ─────────────────────────────────────────────────── */

export function CartTrigger({ itemCount }: { itemCount: number }) {
  return (
    <SheetTrigger asChild>
      <button
        type="button"
        className="relative inline-flex items-center justify-center rounded-lg p-2 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-[#0A1628] dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-white"
        aria-label="Sepetim"
      >
        <ShoppingCart size={20} />
        {itemCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-500 px-1 text-[10px] font-bold text-[#0A1628]">
            {itemCount > 99 ? "99+" : itemCount}
          </span>
        )}
      </button>
    </SheetTrigger>
  );
}

/* ── CartSidebar ─────────────────────────────────────────────────── */

export default function CartSidebar({
  items,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  onRequestQuote,
}: CartSidebarProps) {
  const { locale } = useLocale();
  const t = labels[locale] || labels.tr;

  /* ── Computed totals ─────────────────────────────────────────── */

  const { subtotal, vatTotal, grandTotal } = useMemo(() => {
    let sub = 0;
    let vat = 0;
    for (const item of items) {
      const lineTotal = item.miktar * item.birimFiyat;
      sub += lineTotal;
      vat += lineTotal * (item.kdvOrani / 100);
    }
    return {
      subtotal: sub,
      vatTotal: vat,
      grandTotal: sub + vat,
    };
  }, [items]);

  const totalItemCount = items.reduce((sum, item) => sum + item.miktar, 0);

  return (
    <SheetContent side="right" className="flex w-full flex-col sm:max-w-md">
      {/* ── Header ───────────────────────────────────────────── */}
      <SheetHeader className="border-b border-neutral-200 pb-4 dark:border-neutral-700">
        <div className="flex items-center gap-3">
          <SheetTitle className="text-lg font-bold text-[#0A1628] dark:text-white">
            {t.title}
          </SheetTitle>
          {items.length > 0 && (
            <Badge variant="amber" className="text-xs">
              {totalItemCount} {t.itemCount}
            </Badge>
          )}
        </div>
      </SheetHeader>

      {/* ── Items list ───────────────────────────────────────── */}
      {items.length === 0 ? (
        /* Empty state */
        <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-neutral-100 dark:bg-neutral-800">
            <Package size={28} className="text-neutral-400" />
          </div>
          <h3 className="mt-4 text-sm font-semibold text-[#0A1628] dark:text-white">
            {t.emptyTitle}
          </h3>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            {t.emptyDesc}
          </p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto py-4">
          <div className="space-y-3 px-1">
            {items.map((item) => {
              const lineTotal = item.miktar * item.birimFiyat;

              return (
                <div
                  key={item.stokKodu}
                  className="group rounded-xl border border-neutral-200 bg-white p-4 transition-colors dark:border-neutral-700 dark:bg-neutral-800"
                >
                  {/* Product info */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <h4 className="truncate text-sm font-medium text-[#0A1628] dark:text-white">
                        {item.stokAdi}
                      </h4>
                      <p className="mt-0.5 font-mono text-xs text-neutral-400">
                        {t.code}: {item.stokKodu}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => onRemoveItem(item.stokKodu)}
                      className="shrink-0 rounded-lg p-1.5 text-neutral-300 transition-colors hover:bg-red-50 hover:text-red-500 dark:text-neutral-500 dark:hover:bg-red-500/10 dark:hover:text-red-400"
                      title={t.remove}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  {/* Quantity controls + line total */}
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() =>
                          onUpdateQuantity(item.stokKodu, Math.max(1, item.miktar - 1))
                        }
                        disabled={item.miktar <= 1}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-200 text-neutral-500 transition-colors hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-neutral-600 dark:text-neutral-400 dark:hover:bg-neutral-700"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="flex h-8 min-w-[3rem] items-center justify-center font-mono text-sm font-medium text-[#0A1628] dark:text-white">
                        {item.miktar}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          onUpdateQuantity(item.stokKodu, item.miktar + 1)
                        }
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-200 text-neutral-500 transition-colors hover:bg-neutral-50 dark:border-neutral-600 dark:text-neutral-400 dark:hover:bg-neutral-700"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    {/* Line total: qty x unit = total */}
                    <div className="text-right">
                      <p className="text-xs text-neutral-400">
                        {item.miktar} x {formatCurrency.format(item.birimFiyat)}
                      </p>
                      <p className="font-mono text-sm font-semibold text-[#0A1628] dark:text-white">
                        {formatCurrency.format(lineTotal)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Footer (totals + CTAs) ───────────────────────────── */}
      {items.length > 0 && (
        <SheetFooter className="border-t border-neutral-200 pt-4 dark:border-neutral-700">
          {/* Totals */}
          <div className="w-full space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-neutral-500 dark:text-neutral-400">{t.subtotal}</span>
              <span className="font-mono text-[#0A1628] dark:text-white">
                {formatCurrency.format(subtotal)}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-neutral-500 dark:text-neutral-400">{t.vat}</span>
              <span className="font-mono text-[#0A1628] dark:text-white">
                {formatCurrency.format(vatTotal)}
              </span>
            </div>
            <div className="border-t border-neutral-100 pt-2 dark:border-neutral-700">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-[#0A1628] dark:text-white">
                  {t.grandTotal}
                </span>
                <span className="font-mono text-lg font-bold text-[#0A1628] dark:text-white">
                  {formatCurrency.format(grandTotal)}
                </span>
              </div>
            </div>
          </div>

          {/* CTA buttons */}
          <div className="mt-4 flex w-full flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={onCheckout}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-amber-500 px-5 py-3 text-sm font-semibold text-[#0A1628] shadow-sm transition-all hover:bg-amber-400 active:scale-[0.98]"
            >
              <ShoppingCart size={16} />
              {t.checkout}
            </button>
            <button
              type="button"
              onClick={onRequestQuote}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#0A1628] bg-transparent px-5 py-3 text-sm font-semibold text-[#0A1628] transition-all hover:bg-[#0A1628] hover:text-white dark:border-neutral-500 dark:text-neutral-300 dark:hover:bg-neutral-700 dark:hover:text-white"
            >
              {t.requestQuote}
            </button>
          </div>
        </SheetFooter>
      )}
    </SheetContent>
  );
}
