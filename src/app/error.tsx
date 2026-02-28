"use client";
import { useEffect } from "react";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-900 px-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 bg-destructive/10 dark:bg-destructive/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-3">
          Bir hata oluştu
        </h2>
        <p className="text-neutral-600 dark:text-neutral-400 mb-6">
          Beklenmeyen bir hata meydana geldi. Lütfen tekrar deneyin.
        </p>
        <button
          onClick={reset}
          className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-semibold transition-colors"
        >
          Tekrar Dene
        </button>
      </div>
    </div>
  );
}
