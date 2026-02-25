"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Menu,
  X,
  Phone,
  Mail,
  ChevronDown,
  Factory,
  Search,
} from "lucide-react";
import clsx from "clsx";
import { useLocale } from "@/contexts/LocaleContext";
import SearchModal from "@/components/ui/SearchModal";

const categoryHrefs = [
  "/urunler/pet-siseler",
  "/urunler/kavanozlar",
  "/urunler/kapaklar",
  "/urunler/preformlar",
  "/urunler/ozel-uretim",
];

export default function Header() {
  const { locale, setLocale, dict } = useLocale();
  const nav = dict.nav;
  const categories = (dict.homeCategories as { name: string }[])?.slice(0, 5) ?? [];
  const navigation = [
    { name: nav.home, href: "/" },
    {
      name: nav.products,
      href: "/urunler",
      children: categoryHrefs.map((href, i) => ({ name: categories[i]?.name ?? "", href })),
    },
    {
      name: "Kurumsal",
      href: "/hakkimizda",
      children: [
        { name: nav.about, href: "/hakkimizda" },
        { name: nav.quality, href: "/kalite" },
        { name: nav.production, href: "/uretim" },
        { name: "Sürdürülebilirlik", href: "/surdurulebilirlik" },
        { name: "Galeri", href: "/galeri" },
      ],
    },
    { name: nav.blog, href: "/blog" },
    { name: nav.contact, href: "/iletisim" },
  ];

  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  return (
    <>
      {/* Top Bar */}
      <div className="relative hidden overflow-hidden bg-primary-900 text-white lg:block">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.03) 40%, rgba(255,255,255,0.07) 50%, rgba(255,255,255,0.03) 60%, transparent 100%)",
            backgroundSize: "200% 100%",
            animation: "shimmer 8s ease-in-out infinite",
          }}
        />
        <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-accent-400 to-transparent" />

        <div className="relative mx-auto flex max-w-7xl items-center justify-between px-6 py-2 text-sm">
          <div className="flex items-center gap-6">
            <a
              href="tel:+902125498703"
              className="flex items-center gap-2 transition-colors hover:text-accent-400"
            >
              <Phone size={14} />
              <span>0212 549 87 03</span>
            </a>
            <a
              href="mailto:bilgi@kismetplastik.com"
              className="flex items-center gap-2 transition-colors hover:text-accent-400"
            >
              <Mail size={14} />
              <span>bilgi@kismetplastik.com</span>
            </a>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-white/70">
              <Factory size={14} />
              Başakşehir, İstanbul
            </span>
            <div className="h-4 w-px bg-white/20" />
            <div className="flex items-center gap-0.5 rounded-lg border border-white/20 p-0.5">
              <button
                onClick={() => setLocale("tr")}
                className={clsx(
                  "rounded-md px-2.5 py-1 text-xs font-semibold transition-all duration-300 ease-out",
                  locale === "tr"
                    ? "bg-white text-primary-900 shadow-sm shadow-black/10"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                )}
              >
                TR
              </button>
              <button
                onClick={() => setLocale("en")}
                className={clsx(
                  "rounded-md px-2.5 py-1 text-xs font-semibold transition-all duration-300 ease-out",
                  locale === "en"
                    ? "bg-white text-primary-900 shadow-sm shadow-black/10"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                )}
              >
                EN
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header
        className={clsx(
          "sticky top-0 z-50 w-full border-b transition-all duration-300",
          scrolled
            ? "border-neutral-200 bg-white/95 shadow-lg backdrop-blur-md"
            : "border-transparent bg-white"
        )}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 lg:px-6 lg:py-3">
          {/* Logo */}
          <Link href="/" className="group flex items-center gap-2.5">
            <Image
              src="/images/logo.jpg"
              alt="Kısmet Plastik"
              width={48}
              height={48}
              className="h-10 w-10 rounded-lg object-contain transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_0_20px_rgba(0,32,96,0.25)] lg:h-12 lg:w-12"
              priority
            />
            <div className="flex flex-col">
              <span className="text-lg font-black tracking-tight text-primary-900 lg:text-xl">
                KİSMET
              </span>
              <span className="-mt-1 text-[10px] font-semibold tracking-[0.25em] text-neutral-500 lg:text-xs">
                PLASTİK
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-1 lg:flex">
            {navigation.map((item) => (
              <div
                key={item.name}
                className="relative"
                onMouseEnter={() =>
                  item.children && setActiveDropdown(item.name)
                }
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  href={item.href}
                  className="group relative flex items-center gap-1 rounded-lg px-4 py-2.5 text-sm font-semibold text-neutral-700 transition-all duration-200 hover:bg-primary-50 hover:text-primary-900"
                >
                  {item.name}
                  {item.children && (
                    <ChevronDown
                      size={14}
                      className={clsx(
                        "transition-transform duration-200",
                        activeDropdown === item.name && "rotate-180"
                      )}
                    />
                  )}
                  <span className="absolute bottom-1 left-4 right-4 h-[2px] origin-center scale-x-0 rounded-full bg-accent-500 transition-transform duration-300 ease-out group-hover:scale-x-100" />
                </Link>
                {item.children && activeDropdown === item.name && (
                  <div className="absolute left-0 top-full z-50 mt-1 w-56 overflow-hidden rounded-xl border border-neutral-100 bg-white py-2 shadow-xl animate-[scale-in_200ms_ease-out_forwards]">
                    {item.children.map((child) => (
                      <Link
                        key={child.name}
                        href={child.href}
                        className="block border-l-[3px] border-transparent px-4 py-2.5 text-sm text-neutral-700 transition-all duration-200 hover:border-accent-500 hover:bg-primary-50 hover:pl-5 hover:text-primary-900"
                      >
                        {child.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden items-center gap-3 lg:flex">
            <button
              onClick={() => setSearchOpen(true)}
              className="group flex items-center gap-2 rounded-lg px-2.5 py-2 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-700"
              aria-label="Ara"
            >
              <Search size={18} />
              <kbd className="hidden rounded border border-neutral-200 bg-neutral-50 px-1.5 py-0.5 text-[10px] font-medium text-neutral-400 transition-opacity group-hover:inline-flex">
                Ctrl+K
              </kbd>
            </button>
            <Link
              href="/bayi-girisi"
              className="rounded-lg border-2 border-primary-900 px-5 py-2.5 text-sm font-semibold text-primary-900 transition-all duration-200 hover:bg-primary-900 hover:text-white"
            >
              {nav.dealer}
            </Link>
            <Link
              href="/teklif-al"
              className="rounded-lg bg-accent-500 px-5 py-2.5 text-sm font-bold text-primary-900 shadow-md transition-all duration-200 hover:bg-accent-600 hover:shadow-lg active:scale-[0.98]"
            >
              {nav.quote}
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-lg p-2 text-neutral-700 transition-colors hover:bg-neutral-100 lg:hidden"
            aria-label="Menü"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Search Modal */}
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50 animate-[fade-in_200ms_ease-out_forwards]"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute right-0 top-0 flex h-full w-[85%] max-w-sm flex-col bg-white shadow-2xl animate-[slide-in-right_300ms_ease-out_forwards]">
            {/* Mobile Header */}
            <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-4">
              <Link
                href="/"
                className="flex items-center gap-2"
                onClick={() => setMobileOpen(false)}
              >
                <Image
                  src="/images/logo.jpg"
                  alt="Kısmet Plastik"
                  width={36}
                  height={36}
                  className="h-9 w-9 rounded-lg object-contain"
                />
                <span className="text-lg font-black text-primary-900">
                  KİSMET
                </span>
              </Link>
              <button
                onClick={() => setMobileOpen(false)}
                className="rounded-lg p-2 hover:bg-neutral-100"
              >
                <X size={20} />
              </button>
            </div>

            {/* Mobile Nav Links */}
            <nav className="flex-1 overflow-y-auto px-5 py-4">
              {navigation.map((item, i) => (
                <div
                  key={item.name}
                  className="opacity-0"
                  style={{
                    animation: `fade-in-up 400ms ease-out ${i * 80}ms forwards`,
                  }}
                >
                  <Link
                    href={item.href}
                    className="block border-b border-neutral-50 py-3.5 text-base font-semibold text-neutral-800"
                    onClick={() => !item.children && setMobileOpen(false)}
                  >
                    {item.name}
                  </Link>
                  {item.children && (
                    <div className="mb-2 ml-4 border-l-2 border-primary-100 pl-4">
                      {item.children.map((child, j) => (
                        <div
                          key={child.name}
                          className="opacity-0"
                          style={{
                            animation: `fade-in-up 400ms ease-out ${(i * 80) + ((j + 1) * 60)}ms forwards`,
                          }}
                        >
                          <Link
                            href={child.href}
                            className="block py-2.5 text-sm text-neutral-600 hover:text-primary-700"
                            onClick={() => setMobileOpen(false)}
                          >
                            {child.name}
                          </Link>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Gradient Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-primary-300/40 to-transparent" />

            {/* Mobile Contact */}
            <div className="p-5">
              <a
                href="tel:+902125498703"
                className="mb-2 flex items-center gap-2 text-sm text-neutral-600"
              >
                <Phone size={14} />
                0212 549 87 03
              </a>
              <a
                href="mailto:bilgi@kismetplastik.com"
                className="mb-4 flex items-center gap-2 text-sm text-neutral-600"
              >
                <Mail size={14} />
                bilgi@kismetplastik.com
              </a>

              {/* Gradient Divider */}
              <div className="mb-4 h-px bg-gradient-to-r from-transparent via-neutral-200 to-transparent" />

              <div className="flex gap-2">
                <Link
                  href="/bayi-girisi"
                  className="flex-1 rounded-lg border-2 border-primary-900 py-2.5 text-center text-sm font-semibold text-primary-900"
                  onClick={() => setMobileOpen(false)}
                >
                  {nav.dealer}
                </Link>
                <Link
                  href="/teklif-al"
                  className="flex-1 rounded-lg bg-accent-500 py-2.5 text-center text-sm font-bold text-primary-900"
                  onClick={() => setMobileOpen(false)}
                >
                  {nav.quote}
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
