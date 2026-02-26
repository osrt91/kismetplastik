"use client";

import { useState, useEffect } from "react";
import Link from "@/components/ui/LocaleLink";
import Image from "next/image";
import { Phone, Mail, Factory, Search, Sun, Moon, Menu } from "lucide-react";
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
  const categories = (dict.homeCategories as { name: string }[])?.slice(0, 5) ?? [];

  const productChildren = categoryHrefs.map((href, i) => ({
    name: categories[i]?.name ?? "",
    href,
  }));
  const corporateChildren = [
    { name: nav.about, href: "/hakkimizda" },
    { name: nav.quality, href: "/kalite" },
    { name: nav.production, href: "/uretim" },
    { name: dict.components.sustainability, href: "/surdurulebilirlik" },
    { name: dict.components.gallery, href: "/galeri" },
  ];

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

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
    { name: nav.home, href: "/" },
    { name: nav.products, href: "/urunler", children: productChildren },
    { name: dict.components.corporate, href: "/hakkimizda", children: corporateChildren },
    { name: nav.blog, href: "/blog" },
    { name: nav.contact, href: "/iletisim" },
  ];

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
            <Button variant="ghost" size="icon-xs" onClick={toggleTheme} className="text-primary-foreground/60 hover:bg-primary-foreground/10 hover:text-primary-foreground" aria-label={dict.components.themeToggle}>
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
          <Link href="/" className="flex items-center gap-2">
            <Image src="/images/logo.jpg" alt="Kısmet Plastik" width={44} height={44} className="h-9 w-9 rounded-md object-contain lg:h-11 lg:w-11" priority />
            <div className="flex flex-col leading-none">
              <span className="text-[17px] font-black tracking-tight text-foreground lg:text-[19px]">KİSMET</span>
              <span className="-mt-0.5 text-[9px] font-semibold tracking-[0.2em] text-muted-foreground lg:text-[10px]">PLASTİK</span>
            </div>
          </Link>

          {/* Desktop Nav - Radix NavigationMenu */}
          <NavigationMenu className="hidden lg:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                  <Link href="/">{nav.home}</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger>{nav.products}</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-48 gap-1 p-2">
                    {productChildren.map((child) => (
                      <li key={child.href}>
                        <NavigationMenuLink asChild>
                          <Link href={child.href} className="block rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
                            {child.name}
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger>{dict.components.corporate}</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-48 gap-1 p-2">
                    {corporateChildren.map((child) => (
                      <li key={child.href}>
                        <NavigationMenuLink asChild>
                          <Link href={child.href} className="block rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
                            {child.name}
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                  <Link href="/blog">{nav.blog}</Link>
                </NavigationMenuLink>
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
            <Button variant="ghost" size="icon" onClick={() => setSearchOpen(true)} aria-label={dict.components.searchLabel}>
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
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobileOpen(true)} aria-label={dict.components.menuLabel}>
            <Menu size={22} />
          </Button>
        </div>
      </header>

      {/* Search Modal */}
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Mobile Menu - Radix Sheet */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="right" className="w-[85%] max-w-sm p-0">
          <SheetHeader className="border-b border-border px-5 py-4">
            <SheetTitle className="flex items-center gap-2">
              <Image src="/images/logo.jpg" alt="Kısmet Plastik" width={36} height={36} className="h-9 w-9 rounded-md object-contain" />
              <span className="text-lg font-black text-foreground">KİSMET</span>
            </SheetTitle>
          </SheetHeader>

          <nav className="flex-1 overflow-y-auto px-5 py-4">
            {mobileNavItems.map((item) => (
              <div key={item.name}>
                <SheetClose asChild>
                  <Link href={item.href} className="block border-b border-border/50 py-3 text-[15px] font-medium text-foreground">
                    {item.name}
                  </Link>
                </SheetClose>
                {item.children && (
                  <div className="mb-2 ml-4 border-l-2 border-border pl-4">
                    {item.children.map((child) => (
                      <SheetClose key={child.href} asChild>
                        <Link href={child.href} className="block py-2 text-sm text-muted-foreground hover:text-foreground">
                          {child.name}
                        </Link>
                      </SheetClose>
                    ))}
                  </div>
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
