"use client";
import { useEffect } from "react";

export default function AdminError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("Admin error:", error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h2 className="text-2xl font-bold text-foreground mb-3">Admin Hatası</h2>
        <p className="text-muted-foreground mb-4">{error.message || "Beklenmeyen bir hata oluştu."}</p>
        <div className="flex gap-3 justify-center">
          <button onClick={reset} className="px-5 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
            Tekrar Dene
          </button>
          <a href="/admin" className="px-5 py-2.5 border border-border rounded-lg hover:bg-muted transition-colors">
            Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}
