"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  Newspaper,
  Image as ImageIcon,
  Users,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Ürünler", href: "/admin/products", icon: Package },
  { name: "Blog", href: "/admin/blog", icon: Newspaper },
  { name: "Galeri", href: "/admin/gallery", icon: ImageIcon },
  { name: "Bayiler", href: "/admin/dealers", icon: Users },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
            <div className="flex h-16 items-center gap-3 border-b border-white/10 px-5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent font-black text-sm text-accent-foreground">
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
                <X size={20} />
              </button>
            </div>

            <nav className="flex-1 space-y-1 p-3">
              {navItems.map((item) => {
                const active =
                  item.href === "/admin"
                    ? pathname === "/admin"
                    : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                      active
                        ? "bg-white/10 text-white"
                        : "text-white/50 hover:bg-white/5 hover:text-white/80"
                    }`}
                  >
                    <item.icon size={18} />
                    {item.name}
                    {active && (
                      <ChevronRight size={14} className="ml-auto opacity-60" />
                    )}
                  </Link>
                );
              })}
            </nav>

            <div className="border-t border-white/10 p-3">
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-destructive/70 transition-colors hover:bg-destructive/10 hover:text-destructive"
              >
                <LogOut size={18} />
                Çıkış Yap
              </button>
            </div>
          </aside>

          {/* Main content */}
          <div className="flex flex-1 flex-col overflow-hidden">
            <header className="flex h-16 shrink-0 items-center gap-3 border-b border-border bg-card px-4 lg:px-6">
              <button
                onClick={() => setSidebarOpen(true)}
                className="rounded-lg p-2 text-muted-foreground hover:bg-muted lg:hidden"
              >
                <Menu size={20} />
              </button>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Admin</span>
                <ChevronRight size={14} />
                <span className="font-medium text-foreground">
                  {navItems.find(
                    (n) =>
                      n.href === "/admin"
                        ? pathname === "/admin"
                        : pathname.startsWith(n.href)
                  )?.name ?? "Sayfa"}
                </span>
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
