"use client";

import { useEffect, useState } from "react";
import { useLocale } from "@/contexts/LocaleContext";
import { toIntlLocale } from "@/lib/locales";

interface PriceDisplayProps {
  price?: number | null;
  currency?: string;
  className?: string;
  showLoginPrompt?: boolean;
}

export default function PriceDisplay({
  price,
  currency = "TRY",
  className = "",
  showLoginPrompt = true,
}: PriceDisplayProps) {
  const { locale } = useLocale();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { supabaseBrowser } = await import("@/lib/supabase/client");
        const supabase = supabaseBrowser();
        const { data: { session } } = await supabase.auth.getSession();
        setIsAuthenticated(!!session);
      } catch {
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  if (loading) {
    return <span className={`inline-block h-5 w-16 animate-pulse rounded bg-neutral-200 ${className}`} />;
  }

  if (!isAuthenticated) {
    if (!showLoginPrompt) return null;
    return (
      <span className={`font-mono text-sm text-neutral-500 ${className}`}>
        Fiyat için giriş yapın
      </span>
    );
  }

  if (price == null) {
    return <span className={`font-mono text-sm text-neutral-400 ${className}`}>&mdash;</span>;
  }

  const formatted = new Intl.NumberFormat(toIntlLocale(locale), {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(price);

  return <span className={`font-mono font-semibold ${className}`}>{formatted}</span>;
}
