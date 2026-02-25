"use client";

import { useState, useEffect } from "react";
import { MessageCircle, X } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";

const WHATSAPP_NUMBER = "905307417599";

export default function WhatsAppButton() {
  const { locale } = useLocale();
  const [visible, setVisible] = useState(false);
  const [tooltipOpen, setTooltipOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(() => setTooltipOpen(true), 4000);
    const hideTimer = setTimeout(() => setTooltipOpen(false), 12000);
    return () => {
      clearTimeout(timer);
      clearTimeout(hideTimer);
    };
  }, [visible]);

  const message =
    locale === "tr"
      ? "Merhaba, Kısmet Plastik ürünleri hakkında bilgi almak istiyorum."
      : "Hello, I would like to get information about Kısmet Plastik products.";

  const tooltipText =
    locale === "tr"
      ? "Bize WhatsApp'tan ulaşın!"
      : "Reach us on WhatsApp!";

  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-end gap-3">
      {tooltipOpen && (
        <div className="relative rounded-xl bg-white px-4 py-3 shadow-xl border border-neutral-200 animate-[fade-in-up_300ms_ease-out_forwards]">
          <button
            onClick={() => setTooltipOpen(false)}
            className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-neutral-200 text-neutral-500 hover:bg-neutral-300"
          >
            <X size={10} />
          </button>
          <p className="text-sm font-semibold text-neutral-800 whitespace-nowrap">
            {tooltipText}
          </p>
        </div>
      )}
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-[#25D366]/30 transition-all duration-300 hover:scale-110 hover:shadow-xl hover:shadow-[#25D366]/40 active:scale-95 animate-[fade-in-up_500ms_ease-out_forwards]"
        aria-label="WhatsApp"
      >
        <MessageCircle size={26} className="fill-current" />
      </a>
    </div>
  );
}
