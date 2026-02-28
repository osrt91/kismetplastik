"use client";

import { useState, useEffect, useCallback } from "react";
import { Download, X, Smartphone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocale } from "@/contexts/LocaleContext";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const t = {
  tr: {
    title: "Uygulamayı Yükle",
    description: "Kısmet Plastik'i ana ekranınıza ekleyin, hızlı erişim ve offline destek kazanın.",
    install: "Yükle",
    dismiss: "Şimdi Değil",
  },
  en: {
    title: "Install App",
    description: "Add Kısmet Plastik to your home screen for quick access and offline support.",
    install: "Install",
    dismiss: "Not Now",
  },
};

export default function InstallPrompt() {
  const { locale } = useLocale();
  const strings = t[locale] || t.tr;
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const dismissed = sessionStorage.getItem("pwa-dismissed");
    if (dismissed) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setTimeout(() => setShow(true), 5000);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = useCallback(async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setShow(false);
      setDeferredPrompt(null);
    }
  }, [deferredPrompt]);

  const handleDismiss = useCallback(() => {
    setShow(false);
    sessionStorage.setItem("pwa-dismissed", "1");
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 60 }}
          transition={{ type: "spring", stiffness: 350, damping: 30 }}
          className="fixed bottom-24 left-4 right-4 z-50 mx-auto max-w-md overflow-hidden rounded-2xl border border-primary-100 bg-white shadow-2xl sm:left-auto sm:right-6 sm:w-[380px]"
        >
          <div className="flex items-start gap-3 p-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-700">
              <Smartphone size={24} />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-primary-900">{strings.title}</h3>
              <p className="mt-0.5 text-xs leading-relaxed text-neutral-500">{strings.description}</p>
              <div className="mt-3 flex gap-2">
                <button
                  onClick={handleInstall}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-primary-900 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-primary-700"
                >
                  <Download size={14} />
                  {strings.install}
                </button>
                <button
                  onClick={handleDismiss}
                  className="rounded-lg px-3 py-2 text-xs font-medium text-neutral-500 transition-colors hover:bg-neutral-100"
                >
                  {strings.dismiss}
                </button>
              </div>
            </div>
            <button
              onClick={handleDismiss}
              className="shrink-0 rounded-full p-1 text-neutral-300 transition-colors hover:bg-neutral-100 hover:text-neutral-500"
            >
              <X size={16} />
            </button>
          </div>
          <div className="h-1 bg-gradient-to-r from-primary-500 via-accent-500 to-primary-500" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
