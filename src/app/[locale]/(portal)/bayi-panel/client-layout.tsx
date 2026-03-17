"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { usePortalLocale } from "@/hooks/usePortalLocale";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import Sidebar from "@/components/portal/Sidebar";

export default function BayiPanelClientLayout({ children }: { children: React.ReactNode }) {
  const { locale, dict: portalDict } = usePortalLocale();
  const t = portalDict.layout;
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { loading: authLoading } = useRequireAuth();

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-50">
        <div className="flex items-center gap-3 text-neutral-500">
          <span className="h-6 w-6 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
          {t.authLoading}
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-neutral-50">
      <Sidebar
        mobileOpen={sidebarOpen}
        onMobileClose={() => setSidebarOpen(false)}
      />

      {/* Main content */}
      <div className="flex flex-1 flex-col">
        <header className="flex items-center gap-4 border-b border-neutral-200 bg-white px-4 py-3 lg:px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-2 text-neutral-500 hover:bg-neutral-100 lg:hidden"
            aria-label={locale === "tr" ? "Menu" : "Menu"}
          >
            <Menu size={22} />
          </button>
          <h1 className="font-display text-lg font-bold text-[#0A1628]">{t.panel}</h1>
        </header>
        <main className="flex-1 p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
