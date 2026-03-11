"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "@/components/ui/LocaleLink";

export default function BayiPanelError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Bayi panel error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="max-w-md text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 dark:bg-red-900/20">
          <AlertTriangle size={28} className="text-red-500" />
        </div>
        <h2 className="mb-2 text-xl font-bold text-[#0A1628] dark:text-white">
          Bir hata oluştu
        </h2>
        <p className="mb-6 text-sm text-neutral-500 dark:text-neutral-400">
          {error.message || "Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin."}
        </p>
        <div className="flex justify-center gap-3">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-semibold text-[#0A1628] transition-colors hover:bg-amber-400"
          >
            <RefreshCw size={16} />
            Tekrar Dene
          </button>
          <Link
            href="/bayi-panel"
            className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 px-5 py-2.5 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
          >
            <Home size={16} />
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
