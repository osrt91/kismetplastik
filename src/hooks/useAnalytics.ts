"use client";

/** Pre-defined B2B analytics event names */
export const AnalyticsEvents = {
  VIEW_PRODUCT: 'view_product',
  ADD_TO_QUOTE: 'add_to_quote',
  SUBMIT_QUOTE: 'submit_quote',
  DOWNLOAD_RESOURCE: 'download_resource',
  START_CHAT: 'start_chat',
  COMPARE_PRODUCTS: 'compare_products',
  PRE_ORDER: 'pre_order',
  SAMPLE_REQUEST: 'sample_request',
} as const;

export type AnalyticsEventName = (typeof AnalyticsEvents)[keyof typeof AnalyticsEvents];

/**
 * Custom hook for tracking GA4 analytics events.
 *
 * Usage:
 * ```tsx
 * const { trackEvent } = useAnalytics();
 * trackEvent(AnalyticsEvents.VIEW_PRODUCT, { product_id: '123', category: 'pet-siseler' });
 * ```
 */
export function useAnalytics() {
  const trackEvent = (eventName: string, params?: Record<string, string | number>) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', eventName, params);
    }
  };

  return { trackEvent };
}
