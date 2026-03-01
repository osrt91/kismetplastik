"use client";

import { useState, useEffect, useCallback } from "react";

export interface QuoteCartItem {
  productId: string;
  slug: string;
  name: string;
  category: string;
  material: string;
  volume?: string;
  quantity: number;
  note?: string;
  addedAt: number;
}

const STORAGE_KEY = "kismetplastik-quote-cart";

function loadCart(): QuoteCartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveCart(items: QuoteCartItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch { /* localStorage unavailable */ }
}

export function useQuoteCart() {
  const [items, setItems] = useState<QuoteCartItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setItems(loadCart());
    setMounted(true);
  }, []);

  const persist = useCallback((next: QuoteCartItem[]) => {
    setItems(next);
    saveCart(next);
  }, []);

  const addItem = useCallback((item: Omit<QuoteCartItem, "quantity" | "addedAt">) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === item.productId);
      let next: QuoteCartItem[];
      if (existing) {
        next = prev.map((i) =>
          i.productId === item.productId ? { ...i, quantity: i.quantity + 1 } : i
        );
      } else {
        next = [...prev, { ...item, quantity: 1, addedAt: Date.now() }];
      }
      saveCart(next);
      return next;
    });
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => {
      const next = prev.filter((i) => i.productId !== productId);
      saveCart(next);
      return next;
    });
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity < 1) return;
    setItems((prev) => {
      const next = prev.map((i) =>
        i.productId === productId ? { ...i, quantity } : i
      );
      saveCart(next);
      return next;
    });
  }, []);

  const updateNote = useCallback((productId: string, note: string) => {
    setItems((prev) => {
      const next = prev.map((i) =>
        i.productId === productId ? { ...i, note } : i
      );
      saveCart(next);
      return next;
    });
  }, []);

  const clearCart = useCallback(() => {
    persist([]);
  }, [persist]);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);

  return {
    items,
    totalItems,
    mounted,
    addItem,
    removeItem,
    updateQuantity,
    updateNote,
    clearCart,
  };
}
