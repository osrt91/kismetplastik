"use client";

import { useState, useEffect } from "react";
import { Cookie } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";

const STORAGE_KEY = "kismetplastik-cookie-consent";

export default function CookieBanner() {
  const { dict } = useLocale();
  const comp = dict.components;
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem(STORAGE_KEY);
      if (!consent) {
        const timer = setTimeout(() => setVisible(true), 1500);
        return () => clearTimeout(timer);
      }
    } catch (e) {
      if (process.env.NODE_ENV === "development") console.warn("localStorage unavailable", e);
    }
  }, []);

  const accept = () => {
    try {
      localStorage.setItem(STORAGE_KEY, "accepted");
    } catch { /* localStorage unavailable */ }
    setVisible(false);
  };

  const decline = () => {
    try {
      localStorage.setItem(STORAGE_KEY, "declined");
    } catch { /* localStorage unavailable */ }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-[fade-in-up_500ms_ease-out_forwards]">
      <div className="mx-auto max-w-4xl rounded-2xl border border-neutral-200 bg-white p-5 shadow-2xl dark:border-neutral-700 dark:bg-neutral-800 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <Cookie size={24} className="mt-0.5 shrink-0 text-accent-500" />
            <div>
              <p className="text-sm font-semibold text-primary-900 dark:text-white">
                {comp.cookieTitle}
              </p>
              <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                {comp.cookieDescription}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:shrink-0">
            <button
              onClick={decline}
              className="rounded-lg border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-50 dark:border-neutral-600 dark:text-neutral-300 dark:hover:bg-neutral-700"
            >
              {comp.cookieDecline}
            </button>
            <button
              onClick={accept}
              className="rounded-lg bg-primary-900 px-4 py-2 text-sm font-bold text-white transition-all hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600"
            >
              {comp.cookieAccept}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
