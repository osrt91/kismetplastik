"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
const COOKIE_CONSENT_KEY = "kismetplastik-cookie-consent";

/**
 * Checks localStorage for cookie consent and determines if analytics is allowed.
 *
 * Handles two consent value formats:
 * - JSON object: {"required":true,"analytics":true,"marketing":false}
 * - Legacy string: "accepted" (treated as full consent) or "declined" (no consent)
 */
function hasAnalyticsConsent(): boolean {
  try {
    const raw = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!raw) return false;

    // Try parsing as JSON object first
    try {
      const consent = JSON.parse(raw);
      if (typeof consent === "object" && consent !== null) {
        return consent.analytics === true;
      }
    } catch {
      // Not JSON — fall through to legacy string check
    }

    // Legacy string format: "accepted" means full consent
    return raw === "accepted";
  } catch {
    // localStorage unavailable (e.g. private browsing, SSR)
    return false;
  }
}

/**
 * Google Analytics 4 component.
 *
 * - Loads gtag.js via next/script only when analytics consent is granted
 * - Sets consent mode defaults to 'denied' before any data collection
 * - Updates consent to 'granted' only when the user has opted in
 * - Renders nothing if NEXT_PUBLIC_GA_MEASUREMENT_ID is not set
 *
 * Place this component in the locale layout (or root layout) so it loads on every page.
 */
export default function GoogleAnalytics() {
  const [consentGranted, setConsentGranted] = useState(false);

  useEffect(() => {
    // Check consent on mount
    // eslint-disable-next-line react-hooks/set-state-in-effect -- SSR: localStorage unavailable at render
    setConsentGranted(hasAnalyticsConsent());

    // Listen for storage changes (e.g. user updates consent in CookieBanner)
    const onStorage = (e: StorageEvent) => {
      if (e.key === COOKIE_CONSENT_KEY) {
        setConsentGranted(hasAnalyticsConsent());
      }
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // No measurement ID configured — render nothing
  if (!GA_MEASUREMENT_ID) return null;

  // No consent — render nothing (no scripts loaded at all)
  if (!consentGranted) return null;

  return (
    <>
      {/* Initialize dataLayer and set consent defaults before gtag.js loads */}
      <Script
        id="ga-consent-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('consent', 'default', {
              analytics_storage: 'denied',
              ad_storage: 'denied'
            });
          `,
        }}
      />

      {/* Load the gtag.js library */}
      <Script
        id="ga-script"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />

      {/* Configure GA4 and update consent to granted */}
      <Script
        id="ga-config"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('consent', 'update', {
              analytics_storage: 'granted'
            });
            gtag('config', '${GA_MEASUREMENT_ID}', {
              page_path: window.location.pathname,
              send_page_view: true
            });
          `,
        }}
      />
    </>
  );
}
