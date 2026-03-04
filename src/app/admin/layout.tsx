"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  Newspaper,
  Image as ImageIcon,
  LogOut,
  Menu,
  X,
  ChevronRight,
  ChevronDown,
  Users,
  ShoppingCart,
  FileText,
  Mail,
  TestTube,
  ClipboardList,
  FolderOpen,
  Award,
  MapPin,
  Building,
  Milestone,
  Search,
  Settings,
  Languages,
  Bell,
  BarChart3,
} from "lucide-react";
import { useState } from "react";

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ size?: number }>;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    label: "Genel",
    items: [
      { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    ],
  },
  {
    label: "Ürün & İçerik",
    items: [
      { name: "Ürünler", href: "/admin/products", icon: Package },
      { name: "Blog", href: "/admin/blog", icon: Newspaper },
      { name: "Galeri", href: "/admin/gallery", icon: ImageIcon },
      { name: "İçerik", href: "/admin/content", icon: FileText },
    ],
  },
  {
    label: "B2B İşlemler",
    items: [
      { name: "Bayiler", href: "/admin/dealers", icon: Users },
      { name: "Siparişler", href: "/admin/orders", icon: ShoppingCart },
      { name: "Teklifler", href: "/admin/quotes", icon: ClipboardList },
      { name: "Ön Siparişler", href: "/admin/preorders", icon: ClipboardList },
    ],
  },
  {
    label: "Talepler",
    items: [
      { name: "Mesajlar", href: "/admin/messages", icon: Mail },
      { name: "Numune Talepleri", href: "/admin/samples", icon: TestTube },
    ],
  },
  {
    label: "Kurumsal",
    items: [
      { name: "Kaynaklar", href: "/admin/resources", icon: FolderOpen },
      { name: "Sertifikalar", href: "/admin/certificates", icon: Award },
      { name: "Fuarlar", href: "/admin/tradeshows", icon: MapPin },
      { name: "Referanslar", href: "/admin/references", icon: Building },
      { name: "Tarihçe", href: "/admin/milestones", icon: Milestone },
    ],
  },
  {
    label: "Sistem",
    items: [
      { name: "SEO", href: "/admin/seo", icon: Search },
      { name: "Ayarlar", href: "/admin/settings", icon: Settings },
      { name: "Çeviriler", href: "/admin/translations", icon: Languages },
      { name: "Bildirimler", href: "/admin/webhooks", icon: Bell },
      { name: "Analitik", href: "/admin/analytics", icon: BarChart3 },
    ],
  },
];

const allNavItems = navGroups.flatMap((g) => g.items);

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());
  const isLoginPage = pathname === "/admin/login";

  if (isLoginPage) {
    return (
      <html lang="tr">
        <head>
          <meta name="robots" content="noindex, nofollow" />
        </head>
        <body className="antialiased">{children}</body>
      </html>
    );
  }

  const handleLogout = async () => {
    await fetch("/api/admin/auth", { method: "DELETE" });
    router.push("/admin/login");
  };

  const toggleGroup = (label: string) => {
    setCollapsedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  };

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  const currentPage = allNavItems.find((n) => isActive(n.href))?.name ?? "Sayfa";

  return (
    <html lang="tr">
      <head>
        <meta name="robots" content="noindex, nofollow" />
      </head>
      <body className="antialiased bg-muted">
        <div className="flex h-screen">
          {/* Mobile overlay */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 z-30 bg-black/40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Sidebar */}
          <aside
            className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-[#0f172a] transition-transform duration-200 lg:static lg:translate-x-0 ${
              sidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <div className="flex h-14 items-center gap-3 border-b border-white/10 px-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent font-black text-xs text-accent-foreground">
                KP
              </div>
              <div>
                <p className="text-sm font-bold text-white">Kısmet Plastik</p>
                <p className="text-[10px] text-white/40">Admin Panel</p>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="ml-auto text-white/60 lg:hidden"
              >
                <X size={18} />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto p-2">
              {navGroups.map((group) => {
                const isCollapsed = collapsedGroups.has(group.label);
                return (
                  <div key={group.label} className="mb-1">
                    <button
                      onClick={() => toggleGroup(group.label)}
                      className="flex w-full items-center justify-between px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-white/30 hover:text-white/50"
                    >
                      {group.label}
                      <ChevronDown
                        size={12}
                        className={`transition-transform ${isCollapsed ? "-rotate-90" : ""}`}
                      />
                    </button>
                    {!isCollapsed && (
                      <div className="space-y-0.5">
                        {group.items.map((item) => {
                          const active = isActive(item.href);
                          return (
                            <Link
                              key={item.href}
                              href={item.href}
                              onClick={() => setSidebarOpen(false)}
                              className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium transition-all ${
                                active
                                  ? "bg-white/10 text-white"
                                  : "text-white/50 hover:bg-white/5 hover:text-white/80"
                              }`}
                            >
                              <item.icon size={16} />
                              {item.name}
                              {active && (
                                <ChevronRight size={12} className="ml-auto opacity-60" />
                              )}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>

            <div className="border-t border-white/10 p-2">
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium text-destructive/70 transition-colors hover:bg-destructive/10 hover:text-destructive"
              >
                <LogOut size={16} />
                Çıkış Yap
              </button>
            </div>
          </aside>

          {/* Main content */}
          <div className="flex flex-1 flex-col overflow-hidden">
            <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border bg-card px-4 lg:px-6">
              <button
                onClick={() => setSidebarOpen(true)}
                className="rounded-lg p-2 text-muted-foreground hover:bg-muted lg:hidden"
              >
                <Menu size={18} />
              </button>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Admin</span>
                <ChevronRight size={14} />
                <span className="font-medium text-foreground">{currentPage}</span>
              </div>
            </header>

            <main className="flex-1 overflow-y-auto p-4 lg:p-6">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
