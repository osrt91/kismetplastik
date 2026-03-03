"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "@/components/ui/LocaleLink";
import { ShoppingCart, X, FileText } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import { useQuoteCart } from "@/store/useQuoteCart";

const emptySubscribe = () => () => {};

export default function QuoteCartBar() {
  const { dict } = useLocale();
  const comp = dict.components;
  const items = useQuoteCart((s) => s.items);
  const [dismissed, setDismissed] = useState(false);

  const isClient = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  if (!isClient || items.length === 0 || dismissed) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 animate-[slide-up_300ms_ease-out_forwards]">
      <div className="border-t border-amber-200 bg-gradient-to-r from-amber-50 via-white to-amber-50 shadow-[0_-4px_20px_-4px_rgba(0,0,0,0.1)]">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 lg:px-6">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100">
              <ShoppingCart size={20} className="text-amber-700" />
            </div>
            <span className="text-sm font-bold text-primary-900 sm:text-base">
              {comp.quoteCartItemsSelected.replace("{count}", String(items.length))}
            </span>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <Link
              href="/teklif-al"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent-500 px-5 py-2.5 text-sm font-bold text-primary-900 shadow-md shadow-accent-500/25 transition-all duration-300 hover:bg-accent-400 hover:shadow-lg active:scale-[0.98] sm:px-6 sm:py-3 sm:text-base"
            >
              <FileText size={18} />
              {comp.quoteCartCta}
            </Link>
          </div>

          <button
            onClick={() => setDismissed(true)}
            className="-mr-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600"
            aria-label={comp.closeLabel}
          >
            <X size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
