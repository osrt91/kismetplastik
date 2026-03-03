import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CompareProduct {
  slug: string;
  name: string;
  category: string;
  volume?: string;
  weight?: string;
  neckDiameter?: string;
  material?: string;
  colors?: string[];
  image?: string;
}

interface CompareStore {
  items: CompareProduct[];
  addItem: (product: CompareProduct) => void;
  removeItem: (slug: string) => void;
  clearAll: () => void;
  isInCompare: (slug: string) => boolean;
}

const MAX_COMPARE_ITEMS = 3;

export const useCompareStore = create<CompareStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product: CompareProduct) => {
        const { items } = get();
        if (items.length >= MAX_COMPARE_ITEMS) return;
        if (items.some((item) => item.slug === product.slug)) return;
        set({ items: [...items, product] });
      },

      removeItem: (slug: string) => {
        set({ items: get().items.filter((item) => item.slug !== slug) });
      },

      clearAll: () => {
        set({ items: [] });
      },

      isInCompare: (slug: string) => {
        return get().items.some((item) => item.slug === slug);
      },
    }),
    {
      name: "kismet-compare",
    }
  )
);
