"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { Search, ShoppingCart, Plus, Minus, ArrowUpDown, Package, X } from "lucide-react";
import { usePortalLocale } from "@/hooks/usePortalLocale";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import LocaleLink from "@/components/ui/LocaleLink";
import type { Product, Category, CategorySlug } from "@/types/product";

// -- Cart types & helpers --

interface CartItem {
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number;
}

const CART_KEY = "kismet_cart";

function loadCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveCart(items: CartItem[]) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

// Placeholder B2B unit prices based on minOrder (lower minOrder = higher price)
function getUnitPrice(p: Product): number {
  if (p.minOrder >= 100000) return 0.05;
  if (p.minOrder >= 50000) return 0.12;
  if (p.minOrder >= 30000) return 0.25;
  if (p.minOrder >= 20000) return 0.45;
  if (p.minOrder >= 15000) return 0.65;
  if (p.minOrder >= 10000) return 0.85;
  if (p.minOrder >= 8000) return 1.1;
  if (p.minOrder >= 5000) return 1.35;
  return 1.5;
}

type SortMode = "az" | "za";

export default function UrunlerPage() {
  const { locale, dict: portalDict } = usePortalLocale();
  const t = portalDict.products;

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<Set<CategorySlug>>(new Set());
  const [sort, setSort] = useState<SortMode>("az");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [showCartModal, setShowCartModal] = useState(false);

  // Fetch products and categories from API
  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch("/api/products?limit=200");
        const json = await res.json();
        if (!cancelled && json.success && json.data) {
          setProducts(json.data.products ?? []);
          setCategories(json.data.categories ?? []);
        }
      } catch {
        // Failed to load
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  // Load cart from localStorage on mount
  useEffect(() => {
    setCart(loadCart());
  }, []);

  // Persist cart
  useEffect(() => {
    saveCart(cart);
  }, [cart]);

  const toggleCategory = (slug: CategorySlug) => {
    setSelectedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  };

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Category filter
    if (selectedCategories.size > 0) {
      result = result.filter((p) => selectedCategories.has(p.category));
    }

    // Search filter
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.id.toLowerCase().includes(q) ||
          p.slug.toLowerCase().includes(q) ||
          (p.material && p.material.toLowerCase().includes(q))
      );
    }

    // Sort
    result.sort((a, b) =>
      sort === "az"
        ? a.name.localeCompare(b.name, "tr")
        : b.name.localeCompare(a.name, "tr")
    );

    return result;
  }, [products, search, selectedCategories, sort]);

  const getQuantity = (productId: string) => quantities[productId] || 1;

  const setQuantity = (productId: string, val: number) => {
    setQuantities((prev) => ({ ...prev, [productId]: Math.max(1, val) }));
  };

  const addToCart = useCallback(
    (product: Product) => {
      const qty = getQuantity(product.id);
      const price = getUnitPrice(product);

      setCart((prev) => {
        const existing = prev.find((item) => item.productId === product.id);
        if (existing) {
          return prev.map((item) =>
            item.productId === product.id
              ? { ...item, quantity: item.quantity + qty }
              : item
          );
        }
        return [
          ...prev,
          { productId: product.id, name: product.name, quantity: qty, unitPrice: price },
        ];
      });
      toast.success(t.added);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [quantities, t.added]
  );

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.productId !== productId));
    toast.success(t.removed);
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const formatPrice = (val: number) =>
    new Intl.NumberFormat(locale === "en" ? "en-US" : "tr-TR", {
      style: "currency",
      currency: "TRY",
      minimumFractionDigits: 2,
    }).format(val);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <span className="h-8 w-8 animate-spin rounded-full border-3 border-neutral-200 border-t-amber-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="font-display text-2xl font-bold text-[#0A1628]">{t.title}</h1>
        <div className="flex items-center gap-3">
          {/* Sort */}
          <div className="flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-2">
            <ArrowUpDown size={14} className="text-neutral-400" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortMode)}
              className="bg-transparent text-sm text-neutral-700 focus:outline-none"
            >
              <option value="az">{t.sortAZ}</option>
              <option value="za">{t.sortZA}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t.search}
          className="w-full rounded-lg border border-neutral-200 bg-white py-2.5 pl-10 pr-4 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
        />
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Sidebar: Category Filter */}
        <aside className="w-full shrink-0 lg:w-56">
          <div className="rounded-lg border border-neutral-200 bg-white p-4">
            <h3 className="font-display text-sm font-semibold text-[#0A1628]">
              {t.allCategories}
            </h3>
            <div className="mt-3 space-y-2">
              {categories.map((cat) => (
                <label
                  key={cat.slug}
                  className="flex cursor-pointer items-center gap-2 text-sm text-neutral-700 hover:text-[#0A1628]"
                >
                  <input
                    type="checkbox"
                    checked={selectedCategories.has(cat.slug)}
                    onChange={() => toggleCategory(cat.slug)}
                    className="h-4 w-4 rounded border-neutral-300 text-amber-500 focus:ring-amber-500"
                  />
                  <span className="flex-1">{cat.name}</span>
                  <span className="font-mono text-xs text-neutral-400">
                    {products.filter((p) => p.category === cat.slug).length}
                  </span>
                </label>
              ))}
            </div>
            {selectedCategories.size > 0 && (
              <button
                onClick={() => setSelectedCategories(new Set())}
                className="mt-3 text-xs font-medium text-amber-600 hover:text-amber-700"
              >
                {t.clearFilters}
              </button>
            )}
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          {filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-neutral-200 bg-white py-20">
              <Package size={48} className="text-neutral-300" />
              <p className="mt-4 text-sm text-neutral-500">{t.emptyState}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {filteredProducts.map((product) => {
                const price = getUnitPrice(product);
                const qty = getQuantity(product.id);
                const inCart = cart.find((c) => c.productId === product.id);

                return (
                  <div
                    key={product.id}
                    className={cn(
                      "group flex flex-col rounded-lg border bg-white p-4 transition-shadow hover:shadow-md",
                      inCart ? "border-amber-300" : "border-neutral-200"
                    )}
                  >
                    {/* Image placeholder */}
                    <div className="flex h-36 items-center justify-center rounded-md bg-neutral-100 text-neutral-400">
                      <Package size={40} />
                    </div>

                    {/* Info */}
                    <div className="mt-3 flex-1">
                      <p className="text-xs font-medium uppercase tracking-wider text-neutral-400">
                        {product.id}
                      </p>
                      <h3 className="mt-1 font-display text-sm font-semibold text-[#0A1628] leading-snug">
                        {product.name}
                      </h3>
                      <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-neutral-500">
                        {product.volume && (
                          <span>
                            {t.volume}: {product.volume}
                          </span>
                        )}
                        <span>
                          {t.material}: {product.material}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-neutral-400">
                        {t.minOrder}:{" "}
                        <span className="font-mono">
                          {product.minOrder.toLocaleString(locale === "en" ? "en-US" : "tr-TR")}
                        </span>{" "}
                        {t.pcs}
                      </p>
                    </div>

                    {/* Price */}
                    <div className="mt-3 border-t border-neutral-100 pt-3">
                      <div className="flex items-baseline justify-between">
                        <span className="text-xs text-neutral-500">{t.unitPrice}</span>
                        <span className="font-mono text-base font-bold text-[#0A1628]">
                          {formatPrice(price)}
                        </span>
                      </div>

                      {/* Quantity + Add */}
                      <div className="mt-2 flex items-center gap-2">
                        <div className="flex items-center rounded-md border border-neutral-200">
                          <button
                            onClick={() => setQuantity(product.id, qty - 1)}
                            className="px-2 py-1.5 text-neutral-500 hover:bg-neutral-50"
                          >
                            <Minus size={14} />
                          </button>
                          <input
                            type="number"
                            value={qty}
                            onChange={(e) =>
                              setQuantity(product.id, parseInt(e.target.value) || 1)
                            }
                            className="w-14 border-x border-neutral-200 bg-transparent py-1.5 text-center font-mono text-sm text-neutral-900 focus:outline-none"
                            min={1}
                          />
                          <button
                            onClick={() => setQuantity(product.id, qty + 1)}
                            className="px-2 py-1.5 text-neutral-500 hover:bg-neutral-50"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <button
                          onClick={() => addToCart(product)}
                          className={cn(
                            "flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-colors",
                            inCart
                              ? "bg-amber-100 text-amber-800 hover:bg-amber-200"
                              : "bg-amber-500 text-white hover:bg-amber-600"
                          )}
                        >
                          <ShoppingCart size={14} />
                          {t.addToCart}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Floating Cart Bar */}
      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-amber-200 bg-[#0A1628] px-4 py-3 shadow-lg lg:left-64">
          <div className="mx-auto flex max-w-5xl items-center justify-between">
            <div className="flex items-center gap-3">
              <ShoppingCart size={20} className="text-amber-400" />
              <span className="text-sm font-medium text-white">
                <span className="font-mono text-amber-400">{cartCount}</span> {t.cartItems}
              </span>
              <span className="hidden text-neutral-400 sm:inline">|</span>
              <span className="hidden text-sm text-white sm:inline">
                {t.total}:{" "}
                <span className="font-mono font-bold text-amber-400">
                  {formatPrice(cartTotal)}
                </span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={clearCart}
                className="rounded-lg px-3 py-1.5 text-xs font-medium text-neutral-400 transition-colors hover:text-white"
              >
                {t.clearCart}
              </button>
              <button
                onClick={() => setShowCartModal(true)}
                className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-amber-600"
              >
                {t.viewCart}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cart Modal */}
      {showCartModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[80vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-[#0A1628]">{t.cartSummary}</h2>
              <button
                onClick={() => setShowCartModal(false)}
                className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
              >
                <X size={20} />
              </button>
            </div>

            {cart.length === 0 ? (
              <p className="mt-8 text-center text-sm text-neutral-500">{t.cartEmpty}</p>
            ) : (
              <>
                <div className="mt-4 divide-y divide-neutral-100">
                  {cart.map((item) => (
                    <div key={item.productId} className="flex items-center justify-between py-3">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-[#0A1628]">{item.name}</p>
                        <p className="mt-0.5 text-xs text-neutral-500">
                          <span className="font-mono">{item.quantity.toLocaleString()}</span> x{" "}
                          <span className="font-mono">{formatPrice(item.unitPrice)}</span>
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-sm font-semibold text-[#0A1628]">
                          {formatPrice(item.quantity * item.unitPrice)}
                        </span>
                        <button
                          onClick={() => removeFromCart(item.productId)}
                          className="rounded p-1 text-neutral-400 hover:bg-red-50 hover:text-red-500"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-neutral-200 pt-4">
                  <span className="text-sm font-semibold text-neutral-700">{t.subtotal}</span>
                  <span className="font-mono text-lg font-bold text-[#0A1628]">
                    {formatPrice(cartTotal)}
                  </span>
                </div>

                <div className="mt-4 flex gap-3">
                  <button
                    onClick={() => {
                      clearCart();
                      setShowCartModal(false);
                    }}
                    className="flex-1 rounded-lg border border-neutral-200 px-4 py-2.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50"
                  >
                    {t.clearCart}
                  </button>
                  <LocaleLink
                    href="/bayi-panel/tekliflerim"
                    className="flex flex-1 items-center justify-center rounded-lg bg-amber-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-amber-600"
                    onClick={() => setShowCartModal(false)}
                  >
                    {t.goToQuote}
                  </LocaleLink>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
