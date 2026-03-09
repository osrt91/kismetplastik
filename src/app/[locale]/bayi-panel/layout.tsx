"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import Sidebar from "@/components/portal/Sidebar";

const labels: Record<string, Record<string, string>> = {
  tr: { panel: "Bayi Paneli" },
  en: { panel: "Dealer Panel" },
};

export default function BayiPanelLayout({ children }: { children: React.ReactNode }) {
  const { locale } = useLocale();
  const t = labels[locale] || labels.tr;
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
