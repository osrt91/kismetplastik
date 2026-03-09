/**
 * DIA API Cache Layer
 *
 * Each DIA API call costs kontors. This in-memory cache reduces
 * redundant calls for frequently accessed data.
 *
 * TTLs:
 *   - Stock list: 5 minutes
 *   - Cari balance: 2 minutes
 *   - Invoice list: 5 minutes
 *   - Order list: 3 minutes
 */

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

const cache = new Map<string, CacheEntry<unknown>>();

const CLEANUP_INTERVAL = 60_000; // 1 minute
let lastCleanup = Date.now();

function cleanup() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;
  lastCleanup = now;
  for (const [key, entry] of cache) {
    if (entry.expiresAt < now) cache.delete(key);
  }
}

/**
 * Get cached value or execute fetcher and cache result
 */
export async function cached<T>(
  key: string,
  ttlMs: number,
  fetcher: () => Promise<T>
): Promise<T> {
  cleanup();

  const now = Date.now();
  const existing = cache.get(key) as CacheEntry<T> | undefined;

  if (existing && existing.expiresAt > now) {
    return existing.data;
  }

  const data = await fetcher();
  cache.set(key, { data, expiresAt: now + ttlMs });
  return data;
}

/**
 * Invalidate a specific cache key or pattern
 */
export function invalidateCache(keyOrPrefix: string) {
  if (keyOrPrefix.endsWith("*")) {
    const prefix = keyOrPrefix.slice(0, -1);
    for (const key of cache.keys()) {
      if (key.startsWith(prefix)) cache.delete(key);
    }
  } else {
    cache.delete(keyOrPrefix);
  }
}

/**
 * Clear all cached entries
 */
export function clearCache() {
  cache.clear();
}

/**
 * Get cache stats for monitoring
 */
export function getCacheStats() {
  const now = Date.now();
  let activeCount = 0;
  let expiredCount = 0;

  for (const entry of cache.values()) {
    if (entry.expiresAt > now) activeCount++;
    else expiredCount++;
  }

  return { total: cache.size, active: activeCount, expired: expiredCount };
}

// ─── Pre-defined TTL constants ──────────────────────────────────────────────

export const TTL = {
  STOCK_LIST: 5 * 60 * 1000,      // 5 minutes
  STOCK_DETAIL: 5 * 60 * 1000,    // 5 minutes
  CARI_BALANCE: 2 * 60 * 1000,    // 2 minutes
  INVOICE_LIST: 5 * 60 * 1000,    // 5 minutes
  ORDER_LIST: 3 * 60 * 1000,      // 3 minutes
  IRSALIYE_LIST: 5 * 60 * 1000,   // 5 minutes
  PRICE_CATALOG: 5 * 60 * 1000,   // 5 minutes
} as const;

// ─── Cache key builders ─────────────────────────────────────────────────────

export const cacheKey = {
  stockList: (page: number, limit: number) => `stock:list:${page}:${limit}`,
  stockDetail: (code: string) => `stock:detail:${code}`,
  cariBalance: (code: string) => `cari:balance:${code}`,
  invoiceList: (cariCode: string, page: number) => `invoice:list:${cariCode}:${page}`,
  orderList: (cariCode: string, page: number) => `order:list:${cariCode}:${page}`,
  irsaliyeList: (cariCode: string, page: number) => `irsaliye:list:${cariCode}:${page}`,
  priceCatalog: (page: number, limit: number) => `price:catalog:${page}:${limit}`,
} as const;
