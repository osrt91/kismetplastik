"use client";

import { useState, useEffect } from "react";
import Link from "@/components/ui/LocaleLink";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Zap,
  ShoppingCart,
  ClipboardList,
  FileText,
  Receipt,
  User,
  HelpCircle,
  LogOut,
  X,
  ChevronsLeft,
  ChevronsRight,
  CreditCard,
} from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import { supabaseBrowser } from "@/lib/supabase/client";

const menuItems = [
  { key: "dashboard", icon: LayoutDashboard, href: "/bayi-panel" },
  { key: "products", icon: Package, href: "/bayi-panel/urunler" },
  { key: "quickOrder", icon: Zap, href: "/bayi-panel/hizli-siparis" },
  { key: "cart", icon: ShoppingCart, href: "/bayi-panel/sepetim", disabled: true },
  { key: "orders", icon: ClipboardList, href: "/bayi-panel/siparislerim" },
  { key: "quotes", icon: FileText, href: "/bayi-panel/tekliflerim" },
  { key: "invoices", icon: Receipt, href: "/bayi-panel/faturalarim" },
  { key: "payment", icon: CreditCard, href: "/bayi-panel/odeme" },
  { key: "profile", icon: User, href: "/bayi-panel/profilim" },
  { key: "support", icon: HelpCircle, href: "/iletisim" },
];

const labels: Record<string, Record<string, string>> = {
  tr: {
    dashboard: "Dashboard",
    products: "Urunler",
    quickOrder: "Hizli Siparis",
    cart: "Sepetim",
    orders: "Siparislerim",
    quotes: "Tekliflerim",
    invoices: "Faturalarim",
    payment: "Odeme",
    profile: "Profilim",
    support: "Destek",
    logout: "Cikis Yap",
    panel: "Bayi Paneli",
    collapse: "Daralt",
    expand: "Genislet",
    comingSoon: "Yakinda",
  },
  en: {
    dashboard: "Dashboard",
    products: "Products",
    quickOrder: "Quick Order",
    cart: "My Cart",
    orders: "My Orders",
    quotes: "My Quotes",
    invoices: "My Invoices",
    payment: "Payment",
    profile: "My Profile",
    support: "Support",
    logout: "Sign Out",
    panel: "Dealer Panel",
    collapse: "Collapse",
    expand: "Expand",
    comingSoon: "Coming Soon",
  },
};

interface SidebarProps {
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export default function Sidebar({ mobileOpen, onMobileClose }: SidebarProps) {
  const { locale } = useLocale();
  const pathname = usePathname();
  const t = labels[locale] || labels.tr;
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    onMobileClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const handleLogout = async () => {
    const supabase = supabaseBrowser();
    await supabase.auth.signOut();
    window.location.href = `/${locale}/bayi-girisi`;
  };

  const isActive = (href: string) => {
    const fullPath = `/${locale}${href}`;
    return pathname === fullPath || (href !== "/bayi-panel" && pathname.startsWith(fullPath));
  };

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onMobileClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col bg-[#0A1628] transition-all duration-300 lg:static lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        } ${collapsed ? "w-16" : "w-60"}`}
      >
        {/* Logo area */}
        <div className={`flex items-center border-b border-white/10 px-4 py-4 ${collapsed ? "justify-center" : "justify-between"}`}>
          {!collapsed && (
            <Link href="/" className="flex items-center gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/logo2.svg" alt="Kismet Plastik" className="h-8 w-8 brightness-0 invert" />
              <div className="flex flex-col leading-none">
                <span className="font-display text-sm font-bold tracking-wide text-white">KISMET</span>
                <span className="text-[9px] font-medium tracking-[0.12em] text-neutral-400">{t.panel}</span>
              </div>
            </Link>
          )}
          {collapsed && (
            <Link href="/">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/logo2.svg" alt="Kismet Plastik" className="h-7 w-7 brightness-0 invert" />
            </Link>
          )}
          <button
            onClick={onMobileClose}
            className="rounded-lg p-1 text-neutral-400 hover:text-white lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-2 py-4">
          <div className="space-y-1">
            {menuItems.map((item) => {
              const active = isActive(item.href);
              const disabled = item.disabled;

              if (disabled) {
                return (
                  <div
                    key={item.key}
                    className={`group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-neutral-600 cursor-not-allowed ${
                      collapsed ? "justify-center" : ""
                    }`}
                    title={collapsed ? `${t[item.key]} (${t.comingSoon})` : undefined}
                  >
                    <item.icon size={20} className="shrink-0 text-neutral-600" />
                    {!collapsed && (
                      <>
                        <span>{t[item.key]}</span>
                        <span className="ml-auto rounded bg-white/5 px-1.5 py-0.5 text-[10px] text-neutral-500">
                          {t.comingSoon}
                        </span>
                      </>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={item.key}
                  href={item.href}
                  className={`group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                    collapsed ? "justify-center" : ""
                  } ${
                    active
                      ? "bg-white/10 text-white"
                      : "text-neutral-400 hover:bg-white/5 hover:text-white"
                  }`}
                  title={collapsed ? t[item.key] : undefined}
                >
                  {/* Active indicator - amber left border */}
                  {active && (
                    <span className="absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-r-full bg-amber-500" />
                  )}
                  <item.icon size={20} className={`shrink-0 ${active ? "text-amber-500" : ""}`} />
                  {!collapsed && <span>{t[item.key]}</span>}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Bottom section */}
        <div className="border-t border-white/10 p-2">
          {/* Collapse toggle - desktop only */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={`hidden w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-neutral-400 transition-colors hover:bg-white/5 hover:text-white lg:flex ${
              collapsed ? "justify-center" : ""
            }`}
            title={collapsed ? t.expand : t.collapse}
          >
            {collapsed ? <ChevronsRight size={20} /> : <ChevronsLeft size={20} />}
            {!collapsed && <span>{t.collapse}</span>}
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/10 hover:text-red-300 ${
              collapsed ? "justify-center" : ""
            }`}
            title={collapsed ? t.logout : undefined}
          >
            <LogOut size={20} className="shrink-0" />
            {!collapsed && <span>{t.logout}</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
