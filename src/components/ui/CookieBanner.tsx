"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "@/components/ui/LocaleLink";
import { Cookie, X, Shield, BarChart3, Megaphone, ChevronDown } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";

const STORAGE_KEY = "kismetplastik-cookie-consent";

interface CookieConsent {
  required: boolean;
  analytics: boolean;
  marketing: boolean;
}

const DEFAULT_CONSENT: CookieConsent = {
  required: true,
  analytics: false,
  marketing: false,
};

const ALL_ACCEPTED: CookieConsent = {
  required: true,
  analytics: true,
  marketing: true,
};

const ALL_DECLINED: CookieConsent = {
  required: true,
  analytics: false,
  marketing: false,
};

/**
 * Update GA4 consent mode based on user preferences.
 * https://developers.google.com/tag-platform/security/guides/consent
 */
function updateGtagConsent(consent: CookieConsent) {
  if (typeof window === "undefined") return;

  const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag;
  if (typeof gtag !== "function") return;

  gtag("consent", "update", {
    analytics_storage: consent.analytics ? "granted" : "denied",
    ad_storage: consent.marketing ? "granted" : "denied",
    ad_user_data: consent.marketing ? "granted" : "denied",
    ad_personalization: consent.marketing ? "granted" : "denied",
  });
}

function saveConsent(consent: CookieConsent) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
  } catch {
    /* localStorage unavailable */
  }
}

function loadConsent(): CookieConsent | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    // Handle legacy string values from old implementation
    if (raw === "accepted") return ALL_ACCEPTED;
    if (raw === "declined") return ALL_DECLINED;

    const parsed = JSON.parse(raw);
    if (
      typeof parsed === "object" &&
      parsed !== null &&
      typeof parsed.required === "boolean"
    ) {
      return parsed as CookieConsent;
    }
    return null;
  } catch {
    return null;
  }
}

/* ------------------------------------------------------------------ */
/*  Toggle Switch Component                                           */
/* ------------------------------------------------------------------ */

function Toggle({
  checked,
  disabled,
  onChange,
  label,
}: {
  checked: boolean;
  disabled?: boolean;
  onChange?: (value: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange?.(!checked)}
      className={`
        relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full
        transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2
        focus-visible:ring-[#F59E0B] focus-visible:ring-offset-2
        ${disabled ? "cursor-not-allowed opacity-60" : ""}
        ${checked ? "bg-[#0A1628]" : "bg-neutral-300"}
      `}
    >
      <span
        className={`
          pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow-sm
          ring-0 transition-transform duration-200
          ${checked ? "translate-x-6" : "translate-x-1"}
        `}
      />
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Cookie Category Row                                               */
/* ------------------------------------------------------------------ */

function CategoryRow({
  icon,
  title,
  description,
  checked,
  disabled,
  onChange,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  onChange?: (value: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-xl border border-neutral-200/60 bg-white/50 p-4 transition-colors hover:bg-white/80">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 shrink-0 text-[#F59E0B]">{icon}</div>
        <div>
          <p className="text-sm font-semibold text-[#0A1628]">{title}</p>
          <p className="mt-0.5 text-xs leading-relaxed text-neutral-500">
            {description}
          </p>
        </div>
      </div>
      <div className="mt-0.5 shrink-0">
        <Toggle
          checked={checked}
          disabled={disabled}
          onChange={onChange}
          label={title}
        />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Translations                                                      */
/* ------------------------------------------------------------------ */

const texts = {
  tr: {
    ariaLabel: "\u00C7erez tercihleri",
    close: "Kapat",
    title: "\u00C7erez Tercihleri",
    description:
      "Bu web sitesi, deneyiminizi geli\u015Ftirmek i\u00E7in \u00E7erezler kullanmaktad\u0131r. 6698 say\u0131l\u0131 KVKK kapsam\u0131nda ki\u015Fisel verileriniz i\u015Flenmektedir.",
    kvkkLink: "KVKK Ayd\u0131nlatma Metni",
    decline: "Reddet",
    manage: "Ayarlar\u0131 Y\u00F6net",
    acceptAll: "Kabul Et",
    categoryHeading: "\u00C7erez Kategorileri",
    required: "Zorunlu \u00C7erezler",
    requiredDesc:
      "Web sitesinin d\u00FCzg\u00FCn \u00E7al\u0131\u015Fmas\u0131 i\u00E7in gerekli \u00E7erezlerdir. Bu \u00E7erezler devre d\u0131\u015F\u0131 b\u0131rak\u0131lamaz.",
    analytics: "Analitik \u00C7erezler",
    analyticsDesc:
      "Ziyaret\u00E7i davran\u0131\u015Flar\u0131n\u0131 anlamak ve web sitemizi iyile\u015Ftirmek i\u00E7in kullan\u0131l\u0131r.",
    marketing: "Pazarlama \u00C7erezleri",
    marketingDesc:
      "Ki\u015Fiselle\u015Ftirilmi\u015F reklamlar g\u00F6stermek ve pazarlama kampanyalar\u0131n\u0131n etkinli\u011Fini \u00F6l\u00E7mek i\u00E7in kullan\u0131l\u0131r.",
    save: "Tercihleri Kaydet",
  },
  en: {
    ariaLabel: "Cookie preferences",
    close: "Close",
    title: "Cookie Preferences",
    description:
      "This website uses cookies to improve your experience. Your personal data is processed in accordance with data protection regulations.",
    kvkkLink: "Privacy Policy (KVKK)",
    decline: "Decline All",
    manage: "Manage Settings",
    acceptAll: "Accept All",
    categoryHeading: "Cookie Categories",
    required: "Required Cookies",
    requiredDesc:
      "These cookies are necessary for the website to function properly. They cannot be disabled.",
    analytics: "Analytics Cookies",
    analyticsDesc:
      "Used to understand visitor behavior and improve our website experience.",
    marketing: "Marketing Cookies",
    marketingDesc:
      "Used to show personalized advertisements and measure the effectiveness of marketing campaigns.",
    save: "Save Preferences",
  },
};

/* ------------------------------------------------------------------ */
/*  Main Cookie Banner Component                                      */
/* ------------------------------------------------------------------ */

export default function CookieBanner() {
  const { locale } = useLocale();
  const [visible, setVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState<CookieConsent>(DEFAULT_CONSENT);

  const t = locale === "tr" ? texts.tr : texts.en;

  useEffect(() => {
    const existing = loadConsent();
    if (!existing) {
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
    // Apply saved consent to GA4 on load
    updateGtagConsent(existing);
  }, []);

  const handleAcceptAll = useCallback(() => {
    saveConsent(ALL_ACCEPTED);
    updateGtagConsent(ALL_ACCEPTED);
    setVisible(false);
  }, []);

  const handleDeclineAll = useCallback(() => {
    saveConsent(ALL_DECLINED);
    updateGtagConsent(ALL_DECLINED);
    setVisible(false);
  }, []);

  const handleSavePreferences = useCallback(() => {
    const consent: CookieConsent = { ...preferences, required: true };
    saveConsent(consent);
    updateGtagConsent(consent);
    setVisible(false);
  }, [preferences]);

  const handleClose = useCallback(() => {
    // Closing without explicit choice = decline all
    saveConsent(ALL_DECLINED);
    updateGtagConsent(ALL_DECLINED);
    setVisible(false);
  }, []);

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-[slide-up_500ms_ease-out_forwards]"
      role="dialog"
      aria-label={t.ariaLabel}
    >
      <div
        className="mx-auto max-w-2xl overflow-hidden rounded-2xl border border-neutral-200/50 shadow-2xl"
        style={{
          background: "rgba(255, 255, 255, 0.85)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
        }}
      >
        {/* ---- Main Banner ---- */}
        <div className="relative p-5 sm:p-6">
          {/* Close button */}
          <button
            onClick={handleClose}
            aria-label={t.close}
            className="absolute right-3 top-3 rounded-lg p-1.5 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600"
          >
            <X size={18} />
          </button>

          {/* Icon + Text */}
          <div className="flex items-start gap-3 pr-8">
            <div className="mt-0.5 shrink-0 rounded-full bg-[#F59E0B]/10 p-2">
              <Cookie size={20} className="text-[#F59E0B]" />
            </div>
            <div>
              <p className="text-sm font-bold text-[#0A1628]">
                {t.title}
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-neutral-600">
                {t.description}
              </p>
              <Link
                href="/kvkk"
                className="mt-1 inline-block text-xs font-medium text-[#F59E0B] underline decoration-[#F59E0B]/30 underline-offset-2 transition-colors hover:text-[#d4a017] hover:decoration-[#d4a017]/50"
              >
                {t.kvkkLink}
              </Link>
            </div>
          </div>

          {/* ---- Buttons ---- */}
          <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
            <button
              onClick={handleDeclineAll}
              className="order-3 rounded-xl border border-neutral-200 px-5 py-2.5 text-sm font-medium text-neutral-600 transition-all hover:bg-neutral-50 hover:border-neutral-300 sm:order-1"
            >
              {t.decline}
            </button>
            <button
              onClick={() => setShowSettings((prev) => !prev)}
              className="order-2 flex items-center justify-center gap-1.5 rounded-xl border border-[#F59E0B]/30 bg-[#F59E0B]/5 px-5 py-2.5 text-sm font-medium text-[#0A1628] transition-all hover:bg-[#F59E0B]/10 hover:border-[#F59E0B]/50"
            >
              {t.manage}
              <ChevronDown
                size={16}
                className={`transition-transform duration-300 ${showSettings ? "rotate-180" : ""}`}
              />
            </button>
            <button
              onClick={handleAcceptAll}
              className="order-1 rounded-xl bg-[#0A1628] px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-[#0A1628]/20 transition-all hover:bg-[#0A1628]/90 hover:shadow-xl hover:shadow-[#0A1628]/25 sm:order-3"
            >
              {t.acceptAll}
            </button>
          </div>
        </div>

        {/* ---- Settings Panel (inline expand) ---- */}
        <div
          className={`
            grid transition-[grid-template-rows] duration-300 ease-in-out
            ${showSettings ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}
          `}
        >
          <div className="overflow-hidden">
            <div className="border-t border-neutral-200/60 bg-neutral-50/50 p-5 sm:p-6">
              <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-neutral-400">
                {t.categoryHeading}
              </p>

              <div className="flex flex-col gap-3">
                {/* Required Cookies - always on */}
                <CategoryRow
                  icon={<Shield size={18} />}
                  title={t.required}
                  description={t.requiredDesc}
                  checked={true}
                  disabled={true}
                />

                {/* Analytics Cookies */}
                <CategoryRow
                  icon={<BarChart3 size={18} />}
                  title={t.analytics}
                  description={t.analyticsDesc}
                  checked={preferences.analytics}
                  onChange={(val) =>
                    setPreferences((prev) => ({ ...prev, analytics: val }))
                  }
                />

                {/* Marketing Cookies */}
                <CategoryRow
                  icon={<Megaphone size={18} />}
                  title={t.marketing}
                  description={t.marketingDesc}
                  checked={preferences.marketing}
                  onChange={(val) =>
                    setPreferences((prev) => ({ ...prev, marketing: val }))
                  }
                />
              </div>

              {/* Save preferences button */}
              <div className="mt-5 flex justify-end">
                <button
                  onClick={handleSavePreferences}
                  className="rounded-xl bg-[#0A1628] px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-[#0A1628]/20 transition-all hover:bg-[#0A1628]/90 hover:shadow-xl hover:shadow-[#0A1628]/25"
                >
                  {t.save}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
