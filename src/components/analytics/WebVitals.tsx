"use client";

import { useEffect } from "react";
import { onCLS, onINP, onLCP, onFCP, onTTFB } from "web-vitals";

export default function WebVitals() {
  useEffect(() => {
    const sendToAnalytics = (metric: { name: string; value: number; id: string; delta: number }) => {
      // Send to Google Analytics if available
      if (typeof window !== "undefined" && "gtag" in window) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).gtag?.("event", metric.name, {
          value: Math.round(metric.name === "CLS" ? metric.delta * 1000 : metric.delta),
          event_label: metric.id,
          non_interaction: true,
        });
      }

      // Console log in development
      if (process.env.NODE_ENV === "development") {
        console.warn(`[Web Vitals] ${metric.name}: ${metric.value}`);
      }
    };

    onCLS(sendToAnalytics);
    onINP(sendToAnalytics);
    onLCP(sendToAnalytics);
    onFCP(sendToAnalytics);
    onTTFB(sendToAnalytics);
  }, []);

  return null;
}
