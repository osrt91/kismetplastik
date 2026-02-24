"use client";

import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      onClick={scrollToTop}
      aria-label="Yukarı çık"
      className={`fixed bottom-6 left-6 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-700 shadow-lg transition-all duration-300 hover:bg-primary-900 hover:text-white hover:border-primary-900 hover:scale-110 active:scale-95 ${
        visible
          ? "translate-y-0 opacity-100"
          : "translate-y-4 opacity-0 pointer-events-none"
      }`}
    >
      <ArrowUp size={20} />
    </button>
  );
}
