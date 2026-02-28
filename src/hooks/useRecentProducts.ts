import { useState, useCallback } from "react";

const STORAGE_KEY = "kismetplastik-recent-products";
const MAX_ITEMS = 8;

function getStoredIds(): string[] {
  if (typeof window === "undefined" || !window.localStorage) return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveIds(ids: string[]): void {
  if (typeof window === "undefined" || !window.localStorage) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // ignore
  }
}

export function useRecentProducts(): {
  recentIds: string[];
  addRecent: (id: string) => void;
  clearRecent: () => void;
} {
  const [recentIds, setRecentIds] = useState<string[]>(getStoredIds);

  const addRecent = useCallback((id: string) => {
    if (!id) return;
    setRecentIds((prev) => {
      const filtered = prev.filter((item) => item !== id);
      const next = [id, ...filtered].slice(0, MAX_ITEMS);
      saveIds(next);
      return next;
    });
  }, []);

  const clearRecent = useCallback(() => {
    setRecentIds([]);
    saveIds([]);
  }, []);

  return { recentIds, addRecent, clearRecent };
}
