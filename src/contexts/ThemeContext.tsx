"use client";
import { createContext, useContext, useState, useEffect, useCallback, useSyncExternalStore } from "react";

type Theme = "light" | "dark";

const ThemeContext = createContext<{
  theme: Theme;
  toggleTheme: () => void;
} | null>(null);

const STORAGE_KEY = "kismetplastik-theme";

function applyTheme(t: Theme) {
  const html = document.documentElement;
  html.setAttribute("data-theme", t);
  if (t === "dark") {
    html.classList.add("dark");
  } else {
    html.classList.remove("dark");
  }
}

function getStoredTheme(): Theme {
  try {
    const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
    const preferred = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    return stored || preferred;
  } catch {
    return "light";
  }
}

const subscribe = () => () => {};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const initialTheme = useSyncExternalStore(subscribe, getStoredTheme, () => "light" as Theme);
  const [theme, setTheme] = useState<Theme>(initialTheme);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme(prev => {
      const next = prev === "light" ? "dark" : "light";
      applyTheme(next);
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch {
        // localStorage unavailable
      }
      return next;
    });
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
