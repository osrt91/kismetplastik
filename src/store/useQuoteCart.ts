"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface QuoteCartItem {
  productId: string;
  productName: string;
  category: string;
  quantity: number;
  notes: string;
}

interface QuoteCartState {
  items: QuoteCartItem[];
  addItem: (productId: string, productName: string, category: string) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  updateNotes: (productId: string, notes: string) => void;
  clearCart: () => void;
  isInCart: (productId: string) => boolean;
  itemCount: () => number;
}

export const useQuoteCart = create<QuoteCartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (productId, productName, category) => {
        const existing = get().items.find((i) => i.productId === productId);
        if (existing) return;
        set((state) => ({
          items: [
            ...state.items,
            { productId, productName, category, quantity: 1, notes: "" },
          ],
        }));
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
        }));
      },

      updateQuantity: (productId, quantity) => {
        set((state) => ({
          items: state.items.map((i) =>
            i.productId === productId ? { ...i, quantity: Math.max(1, quantity) } : i
          ),
        }));
      },

      updateNotes: (productId, notes) => {
        set((state) => ({
          items: state.items.map((i) =>
            i.productId === productId ? { ...i, notes } : i
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      isInCart: (productId) => get().items.some((i) => i.productId === productId),

      itemCount: () => get().items.length,
    }),
    {
      name: "kismetplastik-quote-cart",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
