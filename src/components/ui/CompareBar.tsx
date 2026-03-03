"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "@/components/ui/LocaleLink";
import { motion, AnimatePresence } from "framer-motion";
import { X, GitCompareArrows, Trash2 } from "lucide-react";
import { useCompareStore } from "@/store/useCompareStore";
import { cn } from "@/lib/utils";

export default function CompareBar() {
  const { items, removeItem, clearAll } = useCompareStore();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch with persisted store
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || items.length === 0) return null;

  return (
    <AnimatePresence>
      {items.length > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className={cn(
            "fixed bottom-0 left-0 right-0 z-50",
            "border-t-2 border-[var(--accent-500)] bg-[#0A1628]/95 backdrop-blur-md",
            "shadow-[0_-4px_20px_rgba(0,0,0,0.3)]"
          )}
        >
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
            {/* Product mini cards */}
            <div className="flex items-center gap-3 overflow-x-auto">
              {/* Badge */}
              <div className="flex shrink-0 items-center gap-2">
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full",
                    "bg-[var(--accent-500)] text-sm font-bold text-[#0A1628]"
                  )}
                >
                  {items.length}
                </div>
                <span className="hidden text-sm font-medium text-white/80 sm:inline">
                  / 3
                </span>
              </div>

              {/* Mini product cards */}
              <div className="flex items-center gap-2">
                {items.map((item) => (
                  <div
                    key={item.slug}
                    className={cn(
                      "group relative flex items-center gap-2 rounded-lg",
                      "bg-white/10 px-3 py-2",
                      "transition-colors hover:bg-white/15"
                    )}
                  >
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={32}
                        height={32}
                        className="h-8 w-8 shrink-0 rounded object-contain"
                      />
                    ) : (
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-white/10">
                        <GitCompareArrows className="h-4 w-4 text-white/50" />
                      </div>
                    )}
                    <span className="max-w-[100px] truncate text-sm text-white sm:max-w-[140px]">
                      {item.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeItem(item.slug)}
                      className={cn(
                        "ml-1 shrink-0 rounded-full p-0.5",
                        "text-white/50 transition-colors hover:bg-white/20 hover:text-white"
                      )}
                      aria-label={`${item.name} kaldır`}
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}

                {/* Empty slots */}
                {Array.from({ length: 3 - items.length }).map((_, i) => (
                  <div
                    key={`empty-${i}`}
                    className={cn(
                      "hidden h-12 w-24 items-center justify-center rounded-lg",
                      "border border-dashed border-white/20",
                      "sm:flex"
                    )}
                  >
                    <span className="text-xs text-white/30">+</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                onClick={clearAll}
                className={cn(
                  "flex items-center gap-1.5 rounded-lg px-3 py-2",
                  "text-sm text-white/60 transition-colors hover:bg-white/10 hover:text-white"
                )}
                aria-label="Temizle"
              >
                <Trash2 className="h-4 w-4" />
                <span className="hidden sm:inline">Temizle</span>
              </button>

              <Link
                href="/karsilastir"
                className={cn(
                  "flex items-center gap-2 rounded-lg px-4 py-2",
                  "bg-[var(--accent-500)] text-sm font-semibold text-[#0A1628]",
                  "transition-all hover:bg-[var(--accent-400)] hover:shadow-lg",
                  "active:scale-95"
                )}
              >
                <GitCompareArrows className="h-4 w-4" />
                <span>Karsilastir</span>
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
