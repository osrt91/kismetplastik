"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "@/components/ui/LocaleLink";
import {
  Phone,
  Mail,
  Factory,
  Search,
  Sun,
  Moon,
  Menu,
  ChevronRight,
  Package,
  Building2,
  Globe2,
  Newspaper,
  Download,
  FlaskConical,
  Award,
  Leaf,
  Image as ImageIcon,
  Eye,
  Sparkles,
} from "lucide-react";
import clsx from "clsx";
import { useLocale } from "@/contexts/LocaleContext";
import { useTheme } from "@/contexts/ThemeContext";
import { allLocales, localeNames } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";
import SearchModal from "@/components/ui/SearchModal";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { categoryIconList } from "@/components/ui/CategoryIcons";

const categoryHrefs = [
  "/urunler/pet-siseler",
  "/urunler/plastik-siseler",
  "/urunler/kapaklar",
  "/urunler/tipalar",
  "/urunler/parmak-spreyler",
];

export default function Header() {
  const { locale, setLocale, dict } = useLocale();
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const nav = dict.nav;
  const comp = dict.components;
  const categories = (dict.homeCategories as { name: string; description: string }[])?.slice(0, 5) ?? [];
  const sectors = (dict.homeSectors as { name: string; description: string }[]) ?? [];

  const productChildren = categoryHrefs.map((href, i) => ({
    name: categories[i]?.name ?? "",
    desc: categories[i]?.description ?? "",
    href,
    icon: categoryIconList[i] || Package,
  }));

  const corporateChildren = [
    { name: nav.about, href: "/hakkimizda", icon: Building2 },
    { name: nav.quality, href: "/kalite", icon: Award },
    { name: nav.production, href: "/uretim", icon: Factory },
    { name: nav.visionMission, href: "/vizyon-misyon", icon: Eye },
    { name: nav.rAndD, href: "/arge", icon: FlaskConical },
    { name: comp.sustainability, href: "/surdurulebilirlik", icon: Leaf },
    { name: comp.gallery, href: "/galeri", icon: ImageIcon },
    { name: nav.references, href: "/referanslar", icon: Sparkles },
  ];

  const sectorChildren = sectors.slice(0, 6).map((s) => ({
    name: s.name,
    desc: s.description,
    href: "/sektorler",
  }));

  const mediaChildren = [
    { name: nav.blog, href: "/blog", icon: Newspaper },
    { name: nav.fairs, href: "/fuarlar", icon: Globe2 },
    { name: nav.glossary, href: "/ambalaj-sozlugu", icon: Package },
  ];

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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

  const mobileNavItems = [
    { name: nav.home, href: "/", children: undefined },
    { name: nav.products, href: "/urunler", children: productChildren.map(c => ({ name: c.name, href: c.href })) },
    { name: comp.corporate, href: "/hakkimizda", children: corporateChildren.map(c => ({ name: c.name, href: c.href })) },
    { name: nav.sectors, href: "/sektorler", children: sectorChildren.map(s => ({ name: s.name, href: s.href })) },
    { name: nav.media, href: "/blog", children: mediaChildren.map(m => ({ name: m.name, href: m.href })) },
    { name: nav.contact, href: "/iletisim", children: undefined },
  ];

  const toggleMobileSection = (name: string) => {
    setMobileExpanded(prev => prev === name ? null : name);
  };

  // Check if a path is active (strip locale prefix for comparison)
  const isActive = (href: string) => {
    const stripped = pathname.replace(/^\/(tr|en|de|fr|es|it|pt|ru|ar|zh|ja)/, "") || "/";
    if (href === "/") return stripped === "/";
    return stripped.startsWith(href);
  };

  return (
    <>
      {/* Top Bar */}
      <div className="hidden border-b border-border/50 bg-primary text-primary-foreground lg:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-1.5 text-[13px]">
          <div className="flex items-center gap-5">
            <a href="tel:+902125498703" className="inline-flex items-center gap-1.5 opacity-80 transition-opacity hover:opacity-100">
              <Phone size={13} strokeWidth={1.8} />
              <span>0212 549 87 03</span>
            </a>
            <span className="h-3 w-px bg-primary-foreground/20" />
            <a href="mailto:bilgi@kismetplastik.com" className="inline-flex items-center gap-1.5 opacity-80 transition-opacity hover:opacity-100">
              <Mail size={13} strokeWidth={1.8} />
              <span>bilgi@kismetplastik.com</span>
            </a>
            <span className="h-3 w-px bg-primary-foreground/20" />
            <span className="inline-flex items-center gap-1.5 opacity-60">
              <Factory size={13} strokeWidth={1.8} />
              Başakşehir, İstanbul
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon-xs" onClick={toggleTheme} className="text-primary-foreground/60 hover:bg-primary-foreground/10 hover:text-primary-foreground" aria-label={comp.themeToggle}>
              {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
            </Button>
            <span className="h-3 w-px bg-primary-foreground/20" />
            <select
              value={locale}
              onChange={(e) => setLocale(e.target.value as Locale)}
              className="rounded-md border border-primary-foreground/15 bg-transparent px-2 py-0.5 text-xs font-semibold text-primary-foreground/80 outline-none transition-colors hover:text-primary-foreground [&>option]:bg-primary [&>option]:text-primary-foreground"
            >
              {allLocales.map((l) => (
                <option key={l} value={l}>
                  {localeNames[l]}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Mobile sticky phone bar */}
      <div className="flex items-center justify-between border-b border-border/50 bg-primary px-4 py-1.5 text-[12px] text-primary-foreground lg:hidden">
        <a href="tel:+902125498703" className="inline-flex items-center gap-1.5 font-medium">
          <Phone size={12} />
          0212 549 87 03
        </a>
        <select
          value={locale}
          onChange={(e) => setLocale(e.target.value as Locale)}
          className="rounded border border-primary-foreground/20 bg-transparent px-1.5 py-0.5 text-[11px] font-semibold text-primary-foreground/80 outline-none [&>option]:bg-primary [&>option]:text-primary-foreground"
        >
          {allLocales.map((l) => (
            <option key={l} value={l}>
              {l.toUpperCase()}
            </option>
          ))}
        </select>
      </div>

      {/* Main Header */}
      <header className={clsx("sticky top-0 z-50 w-full transition-all duration-500 ease-in-out", scrolled ? "border-b border-amber-500/20 bg-background/80 shadow-[0_1px_12px_rgba(245,158,11,0.08)] backdrop-blur-xl" : "border-b border-transparent bg-background")}>
        {/* Subtle amber gradient line at top */}
        <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-amber-500/70 to-transparent" />
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2.5 lg:px-6">
          {/* Logo */}
          <Link href="/" className="flex items-center transition-transform duration-300 ease-out hover:scale-105">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/logo1.svg" alt="Kısmet Plastik" className="h-8 w-auto lg:h-10 dark:brightness-0 dark:invert" />
          </Link>

          {/* Desktop Nav — Mega Menu */}
          <NavigationMenu className="hidden lg:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink asChild className={clsx(navigationMenuTriggerStyle(), "relative transition-colors duration-200 hover:bg-amber-500/10 hover:text-foreground")}>
                  <Link href="/">
                    {nav.home}
                    {isActive("/") && <span className="absolute bottom-1 left-1/2 h-0.5 w-5 -translate-x-1/2 rounded-full bg-amber-500" />}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              {/* ÜRÜNLER Mega */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className={clsx("relative transition-colors duration-200 hover:bg-amber-500/10 hover:text-foreground", isActive("/urunler") && "text-foreground")}>
                  {nav.products}
                  {isActive("/urunler") && <span className="absolute bottom-1 left-1/2 h-0.5 w-5 -translate-x-1/2 rounded-full bg-amber-500" />}
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid w-[520px] grid-cols-[1fr_180px] gap-0 rounded-xl border border-border/60 bg-background p-0 shadow-xl shadow-black/[0.08]">
                    <ul className="grid gap-0.5 p-3">
                      {productChildren.map((child) => {
                        const Icon = child.icon;
                        return (
                          <li key={child.href}>
                            <NavigationMenuLink asChild>
                              <Link
                                href={child.href}
                                className="group flex items-start gap-3 rounded-lg px-3 py-2.5 transition-all duration-200 hover:bg-amber-500/[0.06] hover:shadow-sm"
                              >
                                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary-50 text-primary-600 transition-colors group-hover:bg-primary-100">
                                  <Icon size={16} strokeWidth={1.8} />
                                </div>
                                <div>
                                  <div className="text-sm font-semibold text-foreground">{child.name}</div>
                                  <div className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">{child.desc}</div>
                                </div>
                              </Link>
                            </NavigationMenuLink>
                          </li>
                        );
                      })}
                    </ul>
                    <div className="flex flex-col justify-between border-l border-border/60 bg-secondary/30 p-4">
                      <div>
                        <Link href="/urunler" className="group mb-3 flex items-center gap-1 text-sm font-bold text-primary-700 transition-colors hover:text-primary-900">
                          {nav.allProducts}
                          <ChevronRight size={14} className="transition-transform group-hover:translate-x-0.5" />
                        </Link>
                        <p className="text-[11px] leading-relaxed text-muted-foreground">
                          {comp.megaProductsDesc}
                        </p>
                      </div>
                      <Link
                        href="/katalog"
                        className="mt-4 flex items-center gap-2 rounded-lg bg-primary-50 px-3 py-2 text-xs font-semibold text-primary-700 transition-colors hover:bg-primary-100"
                      >
                        <Download size={14} />
                        {comp.megaCatalogCta}
                      </Link>
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* KURUMSAL Mega */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className={clsx("relative transition-colors duration-200 hover:bg-amber-500/10 hover:text-foreground", isActive("/hakkimizda") && "text-foreground")}>
                  {comp.corporate}
                  {(isActive("/hakkimizda") || isActive("/kalite") || isActive("/uretim") || isActive("/vizyon-misyon") || isActive("/arge") || isActive("/surdurulebilirlik") || isActive("/galeri") || isActive("/referanslar")) && <span className="absolute bottom-1 left-1/2 h-0.5 w-5 -translate-x-1/2 rounded-full bg-amber-500" />}
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="w-[420px] rounded-xl border border-border/60 bg-background p-3 shadow-xl shadow-black/[0.08]">
                    <div className="mb-2 px-3">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">{comp.megaCorporateDesc}</p>
                    </div>
                    <ul className="grid grid-cols-2 gap-0.5">
                      {corporateChildren.map((child) => {
                        const Icon = child.icon;
                        return (
                          <li key={child.href}>
                            <NavigationMenuLink asChild>
                              <Link
                                href={child.href}
                                className="group flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-all duration-200 hover:bg-amber-500/[0.06] hover:text-foreground"
                              >
                                <Icon size={15} strokeWidth={1.8} className="shrink-0 text-primary-500 opacity-60 transition-all duration-200 group-hover:text-amber-500 group-hover:opacity-100" />
                                {child.name}
                              </Link>
                            </NavigationMenuLink>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* SEKTÖRLER Mega */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className={clsx("relative transition-colors duration-200 hover:bg-amber-500/10 hover:text-foreground", isActive("/sektorler") && "text-foreground")}>
                  {nav.sectors}
                  {isActive("/sektorler") && <span className="absolute bottom-1 left-1/2 h-0.5 w-5 -translate-x-1/2 rounded-full bg-amber-500" />}
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="w-[480px] rounded-xl border border-border/60 bg-background p-3 shadow-xl shadow-black/[0.08]">
                    <div className="mb-2 px-3">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">{comp.megaSectorsDesc}</p>
                    </div>
                    <ul className="grid grid-cols-2 gap-1">
                      {sectorChildren.map((sector, i) => (
                        <li key={i}>
                          <NavigationMenuLink asChild>
                            <Link
                              href={sector.href}
                              className="group block rounded-lg px-3 py-2.5 transition-all duration-200 hover:bg-amber-500/[0.06] hover:shadow-sm"
                            >
                              <div className="text-sm font-semibold text-foreground">{sector.name}</div>
                              <div className="mt-0.5 line-clamp-1 text-[11px] text-muted-foreground">{sector.desc}</div>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* MEDYA Mega */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className={clsx("relative transition-colors duration-200 hover:bg-amber-500/10 hover:text-foreground", (isActive("/blog") || isActive("/fuarlar") || isActive("/ambalaj-sozlugu")) && "text-foreground")}>
                  {nav.media}
                  {(isActive("/blog") || isActive("/fuarlar") || isActive("/ambalaj-sozlugu")) && <span className="absolute bottom-1 left-1/2 h-0.5 w-5 -translate-x-1/2 rounded-full bg-amber-500" />}
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="w-[280px] rounded-xl border border-border/60 bg-background p-3 shadow-xl shadow-black/[0.08]">
                    <ul className="grid gap-0.5">
                      {mediaChildren.map((child) => {
                        const Icon = child.icon;
                        return (
                          <li key={child.href}>
                            <NavigationMenuLink asChild>
                              <Link
                                href={child.href}
                                className="group flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-all duration-200 hover:bg-amber-500/[0.06] hover:text-foreground"
                              >
                                <Icon size={16} strokeWidth={1.8} className="shrink-0 text-primary-500 opacity-60 transition-all duration-200 group-hover:text-amber-500 group-hover:opacity-100" />
                                {child.name}
                              </Link>
                            </NavigationMenuLink>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink asChild className={clsx(navigationMenuTriggerStyle(), "relative transition-colors duration-200 hover:bg-amber-500/10 hover:text-foreground")}>
                  <Link href="/iletisim">
                    {nav.contact}
                    {isActive("/iletisim") && <span className="absolute bottom-1 left-1/2 h-0.5 w-5 -translate-x-1/2 rounded-full bg-amber-500" />}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* Desktop CTA */}
          <div className="hidden items-center gap-2 lg:flex">
            <Button variant="ghost" size="icon" onClick={() => setSearchOpen(true)} aria-label={comp.searchLabel}>
              <Search size={18} strokeWidth={1.8} />
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href="/bayi-girisi">{nav.dealer}</Link>
            </Button>
            <Button variant="outline" size="sm" className="border-amber-500/30 text-amber-600 hover:bg-amber-50 hover:text-amber-700 dark:border-amber-500/30 dark:text-amber-400 dark:hover:bg-amber-900/20" asChild>
              <Link href="/bayi-panel/odeme">{locale === "tr" ? "Bayi Odeme" : "Dealer Payment"}</Link>
            </Button>
            <Button size="sm" className="bg-amber-500 text-white shadow-sm shadow-amber-500/20 transition-all duration-200 hover:bg-amber-600 hover:shadow-md hover:shadow-amber-500/25" asChild>
              <Link href="/teklif-al">{nav.quote}</Link>
            </Button>
          </div>

          {/* Mobile Toggle */}
          <Button variant="ghost" size="icon" className="transition-colors duration-200 hover:bg-amber-500/10 lg:hidden" onClick={() => setMobileOpen(true)} aria-label={comp.menuLabel}>
            <Menu size={22} />
          </Button>
        </div>
      </header>

      {/* Search Modal */}
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Mobile Menu */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="right" className="w-[85%] max-w-sm overflow-y-auto p-0 [&>div]:duration-500 [&>div]:ease-out">
          <SheetHeader className="border-b border-border px-5 py-4">
            <SheetTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/logo2.svg" alt="Kısmet Plastik" className="h-9 w-9 dark:brightness-0 dark:invert" />
                <span className="text-sm font-bold text-foreground">Kısmet Plastik</span>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={toggleTheme} className="rounded-md p-1.5 text-muted-foreground hover:bg-secondary">
                  {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
                </button>
                <select
                  value={locale}
                  onChange={(e) => setLocale(e.target.value as Locale)}
                  className="rounded-md border border-border bg-background px-2 py-0.5 text-[11px] font-semibold text-foreground outline-none"
                >
                  {allLocales.map((l) => (
                    <option key={l} value={l}>
                      {localeNames[l]}
                    </option>
                  ))}
                </select>
              </div>
            </SheetTitle>
          </SheetHeader>

          <nav className="px-5 py-4">
            {mobileNavItems.map((item) => (
              <div key={item.name} className="border-b border-border/30">
                {item.children ? (
                  <>
                    <button
                      onClick={() => toggleMobileSection(item.name)}
                      className="flex w-full items-center justify-between py-4 text-[15px] font-medium text-foreground transition-colors duration-200 hover:text-amber-600"
                    >
                      {item.name}
                      <ChevronRight
                        size={16}
                        className={clsx("text-muted-foreground transition-transform duration-200", mobileExpanded === item.name && "rotate-90")}
                      />
                    </button>
                    <div
                      className={clsx(
                        "overflow-hidden transition-all duration-300 ease-in-out",
                        mobileExpanded === item.name ? "max-h-96 pb-3 opacity-100" : "max-h-0 opacity-0"
                      )}
                    >
                      <div className="ml-2 space-y-0.5 border-l-2 border-amber-400/50 pl-4">
                        {item.children.map((child) => (
                          <SheetClose key={child.href + child.name} asChild>
                            <Link href={child.href} className={clsx("block rounded-md px-2 py-2.5 text-sm transition-colors duration-200 hover:bg-amber-500/[0.06] hover:text-foreground", isActive(child.href) ? "font-medium text-amber-600" : "text-muted-foreground")}>
                              {child.name}
                            </Link>
                          </SheetClose>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <SheetClose asChild>
                    <Link href={item.href} className={clsx("block py-4 text-[15px] font-medium transition-colors duration-200 hover:text-amber-600", isActive(item.href) ? "text-amber-600" : "text-foreground")}>
                      {item.name}
                      {isActive(item.href) && <span className="ml-2 inline-block h-1.5 w-1.5 rounded-full bg-amber-500" />}
                    </Link>
                  </SheetClose>
                )}
              </div>
            ))}
          </nav>

          <div className="border-t border-border p-5">
            <a href="tel:+902125498703" className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
              <Phone size={14} /> 0212 549 87 03
            </a>
            <a href="mailto:bilgi@kismetplastik.com" className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
              <Mail size={14} /> bilgi@kismetplastik.com
            </a>
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" asChild>
                  <Link href="/bayi-girisi" onClick={() => setMobileOpen(false)}>{nav.dealer}</Link>
                </Button>
                <Button className="flex-1 bg-amber-500 text-white shadow-sm shadow-amber-500/20 hover:bg-amber-600" asChild>
                  <Link href="/teklif-al" onClick={() => setMobileOpen(false)}>{nav.quote}</Link>
                </Button>
              </div>
              <Button variant="outline" className="w-full border-amber-500/30 text-amber-600 hover:bg-amber-50" asChild>
                <Link href="/bayi-panel/odeme" onClick={() => setMobileOpen(false)}>
                  {locale === "tr" ? "Bayi Odeme" : "Dealer Payment"}
                </Link>
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
