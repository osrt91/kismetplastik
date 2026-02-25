"use client";

import { useState, useEffect } from "react";
import Link from "@/components/ui/LocaleLink";
import { FileText, X, Phone } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";

const DISMISS_STORAGE_KEY = "kismetplastik-sticky-quote-dismissed";
const SCROLL_THRESHOLD = 500;

interface StickyQuoteBarProps {
  productName: string;
  volume?: string;
  material: string;
  category: string;
}

export default function StickyQuoteBar({
  productName,
  volume,
  material,
  category,
}: StickyQuoteBarProps) {
  const { dict } = useLocale();
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    try {
      const dismissed = sessionStorage.getItem(DISMISS_STORAGE_KEY);
      if (dismissed) return;
    } catch {}

    const onScroll = () => {
      try {
        if (sessionStorage.getItem(DISMISS_STORAGE_KEY)) return;
      } catch {}
      const pastThreshold = window.scrollY > SCROLL_THRESHOLD;
      setVisible(pastThreshold);
    };

    onScroll(); // initial check
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [mounted]);

  const handleDismiss = () => {
    try {
      sessionStorage.setItem(DISMISS_STORAGE_KEY, "true");
    } catch {}
    setVisible(false);
  };

  if (!mounted || !visible) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 animate-[slide-up_300ms_ease-out_forwards]"
      role="banner"
      aria-label={dict.components.quoteBarLabel}
    >
      <div className="border-t border-neutral-200 bg-white shadow-[0_-4px_20px_-4px_rgba(0,0,0,0.1)]">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 lg:px-6">
          {/* Left: Product name (desktop: + specs badges) */}
          <div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
            <span className="truncate text-sm font-bold text-primary-900 sm:text-base">
              {productName}
            </span>
            <div className="hidden flex-wrap gap-1.5 sm:flex sm:gap-2">
              {volume && (
                <span className="rounded-md bg-primary-50 px-2 py-0.5 text-xs font-semibold text-primary-700">
                  {volume}
                </span>
              )}
              <span className="rounded-md bg-primary-50 px-2 py-0.5 text-xs font-semibold text-primary-700">
                {material}
              </span>
            </div>
          </div>

          {/* Right: CTA buttons */}
          <div className="flex shrink-0 items-center gap-2">
            <Link
              href="/teklif-al"
              className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-accent-500 px-4 py-2.5 text-sm font-bold text-primary-900 shadow-md shadow-accent-500/25 transition-all duration-300 hover:bg-accent-400 hover:shadow-lg active:scale-[0.98] sm:gap-2 sm:px-5 sm:py-3 sm:text-base"
            >
              <FileText size={16} className="sm:hidden" />
              <FileText size={18} className="hidden sm:block" />
              {dict.components.requestQuote}
            </Link>
            <a
              href="tel:+902125498703"
              className="inline-flex items-center justify-center rounded-xl border-2 border-primary-900 p-2.5 text-primary-900 transition-all duration-300 hover:bg-primary-900 hover:text-white sm:p-3"
              aria-label={dict.components.callNow}
            >
              <Phone size={18} />
              <span className="ml-1.5 hidden sm:inline">{dict.components.callNow}</span>
            </a>
          </div>

          {/* Dismiss button */}
          <button
            onClick={handleDismiss}
            className="-mr-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600"
            aria-label={dict.components.closeLabel}
          >
            <X size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
