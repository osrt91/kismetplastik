"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "@/components/ui/LocaleLink";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  FileText,
  ShoppingCart,
  User,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import { getSupabaseBrowser } from "@/lib/supabase-browser";

const menuItems = [
  { key: "dashboard", icon: LayoutDashboard, href: "/bayi-panel" },
  { key: "products", icon: Package, href: "/bayi-panel/urunler" },
  { key: "quotes", icon: FileText, href: "/bayi-panel/tekliflerim" },
  { key: "orders", icon: ShoppingCart, href: "/bayi-panel/siparislerim" },
  { key: "profile", icon: User, href: "/bayi-panel/profilim" },
];

const labels: Record<string, Record<string, string>> = {
  tr: {
    dashboard: "Dashboard",
    products: "Ürünler",
    quotes: "Tekliflerim",
    orders: "Siparişlerim",
    profile: "Profilim",
    logout: "Çıkış Yap",
    panel: "Bayi Paneli",
  },
  en: {
    dashboard: "Dashboard",
    products: "Products",
    quotes: "My Quotes",
    orders: "My Orders",
    profile: "My Profile",
    logout: "Sign Out",
    panel: "Dealer Panel",
  },
};

export default function BayiPanelLayout({ children }: { children: React.ReactNode }) {
  const { locale } = useLocale();
  const pathname = usePathname();
  const t = labels[locale] || labels.tr;
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- closing sidebar on navigation is a legitimate sync pattern
  useEffect(() => { setSidebarOpen(false); }, [pathname]);

  const handleLogout = async () => {
    const supabase = getSupabaseBrowser();
    await supabase.auth.signOut();
    window.location.href = `/${locale}/bayi-girisi`;
  };

  const isActive = (href: string) => {
    const fullPath = `/${locale}${href}`;
    return pathname === fullPath || (href !== "/bayi-panel" && pathname.startsWith(fullPath));
  };

  return (
    <div className="flex min-h-screen bg-neutral-50">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-neutral-200 bg-white transition-transform duration-300 lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-4">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/images/logo2.svg" alt="Kısmet Plastik" width={36} height={36} className="h-9 w-9" />
            <div className="flex flex-col leading-none">
              <span className="text-sm font-black text-primary-900">KİSMET</span>
              <span className="text-[8px] font-semibold tracking-[0.15em] text-neutral-400">{t.panel}</span>
            </div>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 lg:hidden">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <div className="space-y-1">
            {menuItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                    active
                      ? "bg-primary-50 text-primary-900 shadow-sm"
                      : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
                  }`}
                >
                  <item.icon size={20} className={active ? "text-primary-700" : "text-neutral-400"} />
                  {t[item.key]}
                  {active && <ChevronRight size={14} className="ml-auto text-primary-400" />}
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="border-t border-neutral-100 p-3">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
          >
            <LogOut size={20} />
            {t.logout}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col">
        <header className="flex items-center gap-4 border-b border-neutral-200 bg-white px-4 py-3 lg:px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-2 text-neutral-500 hover:bg-neutral-100 lg:hidden"
          >
            <Menu size={22} />
          </button>
          <h1 className="text-lg font-bold text-primary-900">{t.panel}</h1>
        </header>
        <main className="flex-1 p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
