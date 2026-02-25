"use client";
import { useEffect } from "react";

export default function AdminError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("Admin error:", error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h2 className="text-2xl font-bold text-neutral-900 mb-3">Admin Hatası</h2>
        <p className="text-neutral-600 mb-4">{error.message || "Beklenmeyen bir hata oluştu."}</p>
        <div className="flex gap-3 justify-center">
          <button onClick={reset} className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Tekrar Dene
          </button>
          <a href="/admin" className="px-5 py-2.5 border border-neutral-300 rounded-lg hover:bg-neutral-100 transition-colors">
            Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}
