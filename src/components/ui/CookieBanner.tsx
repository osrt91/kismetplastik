"use client";

import { useState, useEffect } from "react";
import { Cookie } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";

const STORAGE_KEY = "kismetplastik-cookie-consent";

export default function CookieBanner() {
  const { locale } = useLocale();
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

  const isTr = locale === "tr";

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-[fade-in-up_500ms_ease-out_forwards]">
      <div className="mx-auto max-w-4xl rounded-2xl border border-neutral-200 bg-white p-5 shadow-2xl sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <Cookie size={24} className="mt-0.5 shrink-0 text-accent-500" />
            <div>
              <p className="text-sm font-semibold text-primary-900">
                {isTr ? "Çerez Kullanımı" : "Cookie Usage"}
              </p>
              <p className="mt-1 text-sm text-neutral-500">
                {isTr
                  ? "Bu web sitesi, deneyiminizi geliştirmek için çerezler kullanmaktadır. 6698 sayılı KVKK kapsamında kişisel verileriniz işlenmektedir."
                  : "This website uses cookies to improve your experience. Your personal data is processed in accordance with data protection regulations."}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:shrink-0">
            <button
              onClick={decline}
              className="rounded-lg border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-50"
            >
              {isTr ? "Reddet" : "Decline"}
            </button>
            <button
              onClick={accept}
              className="rounded-lg bg-primary-900 px-4 py-2 text-sm font-bold text-white transition-all hover:bg-primary-700"
            >
              {isTr ? "Kabul Et" : "Accept"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
