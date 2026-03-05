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
    } catch (e) {
      if (process.env.NODE_ENV === "development") console.warn("sessionStorage unavailable", e);
    }

    const onScroll = () => {
      try {
        if (sessionStorage.getItem(DISMISS_STORAGE_KEY)) return;
      } catch { /* sessionStorage unavailable */ }
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
    } catch { /* sessionStorage unavailable */ }
    setVisible(false);
  };

  if (!mounted || !visible) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 animate-[slide-up_300ms_ease-out_forwards]"
      role="banner"
      aria-label={dict.components.quoteBarLabel}
    >
      <div className="border-t border-neutral-200 bg-white/95 shadow-[0_-4px_30px_-4px_rgba(10,22,40,0.12)] backdrop-blur-md dark:border-neutral-700 dark:bg-[#0A1628]/95 dark:shadow-[0_-4px_30px_-4px_rgba(0,0,0,0.4)]">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 lg:px-6">
          {/* Left: Product name (desktop: + specs badges) */}
          <div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
            <span className="truncate text-sm font-bold text-[#0A1628] sm:text-base dark:text-white">
              {productName}
            </span>
            <div className="hidden flex-wrap gap-1.5 sm:flex sm:gap-2">
              {volume && (
                <span className="rounded-md bg-[#0A1628]/5 px-2 py-0.5 text-xs font-semibold text-[#0A1628] dark:bg-white/10 dark:text-neutral-300">
                  {volume}
                </span>
              )}
              <span className="rounded-md bg-[#0A1628]/5 px-2 py-0.5 text-xs font-semibold text-[#0A1628] dark:bg-white/10 dark:text-neutral-300">
                {material}
              </span>
            </div>
          </div>

          {/* Right: CTA buttons with amber glow */}
          <div className="flex shrink-0 items-center gap-2">
            <Link
              href="/teklif-al"
              className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#F59E0B] px-4 py-2.5 text-sm font-bold text-[#0A1628] shadow-md shadow-[#F59E0B]/30 transition-all duration-300 hover:bg-[#FBBF24] hover:shadow-lg hover:shadow-[#F59E0B]/40 active:scale-[0.98] sm:gap-2 sm:px-5 sm:py-3 sm:text-base"
            >
              <FileText size={16} className="sm:hidden" />
              <FileText size={18} className="hidden sm:block" />
              {dict.components.requestQuote}
            </Link>
            <a
              href="tel:+902125498703"
              className="inline-flex items-center justify-center rounded-xl border-2 border-[#0A1628] p-2.5 text-[#0A1628] transition-all duration-300 hover:bg-[#0A1628] hover:text-white sm:p-3 dark:border-neutral-400 dark:text-neutral-300 dark:hover:bg-white dark:hover:text-[#0A1628]"
              aria-label={dict.components.callNow}
            >
              <Phone size={18} />
              <span className="ml-1.5 hidden sm:inline">{dict.components.callNow}</span>
            </a>
          </div>

          {/* Dismiss button */}
          <button
            onClick={handleDismiss}
            className="-mr-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600 dark:hover:bg-neutral-800 dark:hover:text-neutral-300"
            aria-label={dict.components.closeLabel}
          >
            <X size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
