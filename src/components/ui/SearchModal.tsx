"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import Link from "@/components/ui/LocaleLink";
import { Search, Package, FileText, ArrowRight } from "lucide-react";
import { products, categories } from "@/data/products";
import { useLocale } from "@/contexts/LocaleContext";

interface SearchResult {
  type: "product" | "category" | "page";
  title: string;
  description: string;
  href: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function SearchModal({ open, onClose }: Props) {
  const { dict } = useLocale();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleClose = useCallback(() => {
    setQuery("");
    onClose();
  }, [onClose]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (open) handleClose();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, handleClose]);

  const staticPages: SearchResult[] = useMemo(() => [
    { type: "page", title: dict.nav.home, description: dict.searchDescriptions.home, href: "/" },
    { type: "page", title: dict.nav.about, description: dict.searchDescriptions.about, href: "/hakkimizda" },
    { type: "page", title: dict.nav.quality, description: dict.searchDescriptions.quality, href: "/kalite" },
    { type: "page", title: dict.nav.production, description: dict.searchDescriptions.production, href: "/uretim" },
    { type: "page", title: dict.nav.contact, description: dict.searchDescriptions.contact, href: "/iletisim" },
    { type: "page", title: dict.nav.quote, description: dict.searchDescriptions.quote, href: "/teklif-al" },
    { type: "page", title: dict.nav.faq, description: dict.searchDescriptions.faq, href: "/sss" },
    { type: "page", title: dict.nav.blog, description: dict.searchDescriptions.blog, href: "/blog" },
    { type: "page", title: dict.nav.career, description: dict.searchDescriptions.career, href: "/kariyer" },
    { type: "page", title: dict.nav.catalog, description: dict.searchDescriptions.catalog, href: "/katalog" },
    { type: "page", title: dict.nav.dealer, description: dict.searchDescriptions.dealer, href: "/bayi-girisi" },
  ], [dict]);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    const out: SearchResult[] = [];

    categories.forEach((cat) => {
      if (cat.name.toLowerCase().includes(q) || cat.description.toLowerCase().includes(q)) {
        out.push({
          type: "category",
          title: cat.name,
          description: cat.description,
          href: `/urunler/${cat.slug}`,
        });
      }
    });

    products.forEach((p) => {
      if (
        p.name.toLowerCase().includes(q) ||
        p.shortDescription.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      ) {
        out.push({
          type: "product",
          title: p.name,
          description: p.shortDescription,
          href: `/urunler/${p.category}/${p.slug}`,
        });
      }
    });

    staticPages.forEach((page) => {
      if (page.title.toLowerCase().includes(q) || page.description.toLowerCase().includes(q)) {
        out.push(page);
      }
    });

    return out.slice(0, 8);
  }, [query, staticPages]);

  if (!open) return null;

  const typeIcon = (type: string) => {
    switch (type) {
      case "product": return <Package size={16} className="text-primary-500" />;
      case "category": return <Package size={16} className="text-accent-500" />;
      default: return <FileText size={16} className="text-neutral-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-[60]">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-[fade-in_200ms_ease-out_forwards]"
        onClick={handleClose}
      />
      <div className="relative mx-auto mt-[15vh] w-full max-w-xl px-4 animate-[fade-in-up_300ms_ease-out_forwards]">
        <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-2xl">
          {/* Search Input */}
          <div className="flex items-center gap-3 border-b border-neutral-100 px-5 py-4">
            <Search size={20} className="shrink-0 text-neutral-400" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={dict.components.searchPlaceholder}
              className="w-full text-base outline-none placeholder:text-neutral-400"
            />
            <button
              onClick={handleClose}
              className="shrink-0 rounded-lg bg-neutral-100 px-2 py-1 text-xs font-medium text-neutral-500 hover:bg-neutral-200"
            >
              ESC
            </button>
          </div>

          {/* Results */}
          {query.trim() && (
            <div className="max-h-[50vh] overflow-y-auto py-2">
              {results.length > 0 ? (
                results.map((result) => (
                  <Link
                    key={result.href}
                    href={result.href}
                    onClick={handleClose}
                    className="flex items-center gap-3 px-5 py-3 transition-colors hover:bg-primary-50"
                  >
                    {typeIcon(result.type)}
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm font-semibold text-primary-900">
                        {result.title}
                      </p>
                      <p className="truncate text-xs text-neutral-500">
                        {result.description}
                      </p>
                    </div>
                    <ArrowRight size={14} className="shrink-0 text-neutral-300" />
                  </Link>
                ))
              ) : (
                <div className="px-5 py-8 text-center text-sm text-neutral-500">
                  {dict.components.noResults}
                </div>
              )}
            </div>
          )}

          {!query.trim() && (
            <div className="px-5 py-6 text-center text-sm text-neutral-400">
              {dict.components.searchHint}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
