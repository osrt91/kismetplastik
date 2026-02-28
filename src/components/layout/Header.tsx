"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
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
            <div className="flex items-center gap-px rounded-md border border-primary-foreground/15 p-px">
              <button
                onClick={() => setLocale("tr")}
                className={clsx("rounded px-2 py-0.5 text-xs font-semibold transition-all duration-200", locale === "tr" ? "bg-primary-foreground text-primary" : "text-primary-foreground/60 hover:text-primary-foreground")}
              >
                TR
              </button>
              <button
                onClick={() => setLocale("en")}
                className={clsx("rounded px-2 py-0.5 text-xs font-semibold transition-all duration-200", locale === "en" ? "bg-primary-foreground text-primary" : "text-primary-foreground/60 hover:text-primary-foreground")}
              >
                EN
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className={clsx("sticky top-0 z-50 w-full border-b transition-all duration-200", scrolled ? "border-border bg-background/95 shadow-sm backdrop-blur-md" : "border-transparent bg-background")}>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2.5 lg:px-6">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image src="/images/logo1.svg" alt="Kısmet Plastik" width={160} height={40} className="h-8 w-auto lg:h-10 dark:brightness-0 dark:invert" />
          </Link>

          {/* Desktop Nav — Mega Menu */}
          <NavigationMenu className="hidden lg:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                  <Link href="/">{nav.home}</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              {/* ÜRÜNLER Mega */}
              <NavigationMenuItem>
                <NavigationMenuTrigger>{nav.products}</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid w-[520px] grid-cols-[1fr_180px] gap-0 p-0">
                    <ul className="grid gap-0.5 p-3">
                      {productChildren.map((child) => {
                        const Icon = child.icon;
                        return (
                          <li key={child.href}>
                            <NavigationMenuLink asChild>
                              <Link
                                href={child.href}
                                className="group flex items-start gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-secondary"
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
                <NavigationMenuTrigger>{comp.corporate}</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="w-[420px] p-3">
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
                                className="group flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                              >
                                <Icon size={15} strokeWidth={1.8} className="shrink-0 text-primary-500 opacity-60 transition-opacity group-hover:opacity-100" />
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
                <NavigationMenuTrigger>{nav.sectors}</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="w-[480px] p-3">
                    <div className="mb-2 px-3">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">{comp.megaSectorsDesc}</p>
                    </div>
                    <ul className="grid grid-cols-2 gap-1">
                      {sectorChildren.map((sector, i) => (
                        <li key={i}>
                          <NavigationMenuLink asChild>
                            <Link
                              href={sector.href}
                              className="group block rounded-lg px-3 py-2.5 transition-colors hover:bg-secondary"
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
                <NavigationMenuTrigger>{nav.media}</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="w-[280px] p-3">
                    <ul className="grid gap-0.5">
                      {mediaChildren.map((child) => {
                        const Icon = child.icon;
                        return (
                          <li key={child.href}>
                            <NavigationMenuLink asChild>
                              <Link
                                href={child.href}
                                className="group flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                              >
                                <Icon size={16} strokeWidth={1.8} className="shrink-0 text-primary-500 opacity-60 transition-opacity group-hover:opacity-100" />
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
                <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                  <Link href="/iletisim">{nav.contact}</Link>
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
            <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90" asChild>
              <Link href="/teklif-al">{nav.quote}</Link>
            </Button>
          </div>

          {/* Mobile Toggle */}
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobileOpen(true)} aria-label={comp.menuLabel}>
            <Menu size={22} />
          </Button>
        </div>
      </header>

      {/* Search Modal */}
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Mobile Menu */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="right" className="w-[85%] max-w-sm overflow-y-auto p-0">
          <SheetHeader className="border-b border-border px-5 py-4">
            <SheetTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Image src="/images/logo2.svg" alt="Kısmet Plastik" width={36} height={36} className="h-9 w-9 dark:brightness-0 dark:invert" />
                <span className="text-sm font-bold text-foreground">Kısmet Plastik</span>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={toggleTheme} className="rounded-md p-1.5 text-muted-foreground hover:bg-secondary">
                  {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
                </button>
                <div className="flex items-center gap-px rounded-md border border-border p-px">
                  <button
                    onClick={() => setLocale("tr")}
                    className={clsx("rounded px-2 py-0.5 text-[11px] font-semibold transition-all", locale === "tr" ? "bg-primary text-primary-foreground" : "text-muted-foreground")}
                  >
                    TR
                  </button>
                  <button
                    onClick={() => setLocale("en")}
                    className={clsx("rounded px-2 py-0.5 text-[11px] font-semibold transition-all", locale === "en" ? "bg-primary text-primary-foreground" : "text-muted-foreground")}
                  >
                    EN
                  </button>
                </div>
              </div>
            </SheetTitle>
          </SheetHeader>

          <nav className="px-5 py-3">
            {mobileNavItems.map((item) => (
              <div key={item.name} className="border-b border-border/40">
                {item.children ? (
                  <>
                    <button
                      onClick={() => toggleMobileSection(item.name)}
                      className="flex w-full items-center justify-between py-3.5 text-[15px] font-medium text-foreground"
                    >
                      {item.name}
                      <ChevronRight
                        size={16}
                        className={clsx("text-muted-foreground transition-transform duration-200", mobileExpanded === item.name && "rotate-90")}
                      />
                    </button>
                    <div
                      className={clsx(
                        "overflow-hidden transition-all duration-200",
                        mobileExpanded === item.name ? "max-h-96 pb-2" : "max-h-0"
                      )}
                    >
                      <div className="ml-2 space-y-0.5 border-l-2 border-primary-200 pl-4">
                        {item.children.map((child) => (
                          <SheetClose key={child.href + child.name} asChild>
                            <Link href={child.href} className="block rounded-md py-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
                              {child.name}
                            </Link>
                          </SheetClose>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <SheetClose asChild>
                    <Link href={item.href} className="block py-3.5 text-[15px] font-medium text-foreground">
                      {item.name}
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
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" asChild>
                <Link href="/bayi-girisi" onClick={() => setMobileOpen(false)}>{nav.dealer}</Link>
              </Button>
              <Button className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90" asChild>
                <Link href="/teklif-al" onClick={() => setMobileOpen(false)}>{nav.quote}</Link>
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
