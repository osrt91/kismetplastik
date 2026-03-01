const CACHE_NAME = "kismet-v3";
const STATIC_ASSETS = [
  "/",
  "/tr",
  "/en",
  "/manifest.json",
  "/images/logo.jpg",
  "/images/logo2.svg",
  "/fonts/MyriadPro-Regular.woff2",
  "/fonts/MyriadPro-Semibold.woff2",
  "/fonts/MyriadPro-Black.woff2",
];

const CACHE_STRATEGIES = {
  static: /\.(js|css|woff2?|otf|ttf|png|jpg|jpeg|svg|ico|webp|avif)$/,
  pages: /^\/(tr|en)\//,
  api: /^\/api\//,
};

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      cache.addAll(STATIC_ASSETS).catch(() => {})
    )
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== "GET") return;
  if (CACHE_STRATEGIES.api.test(url.pathname)) return;

  if (CACHE_STRATEGIES.static.test(url.pathname)) {
    event.respondWith(cacheFirst(request));
    return;
  }

  if (url.origin === self.location.origin) {
    event.respondWith(networkFirst(request));
    return;
  }
});

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    return new Response("Offline", { status: 503 });
  }
}

async function networkFirst(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;

    return caches.match("/offline") || new Response(
      '<!DOCTYPE html><html lang="tr"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Çevrimdışı - Kısmet Plastik</title><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:system-ui,sans-serif;background:#f8f8f8;color:#333;display:flex;align-items:center;justify-content:center;min-height:100dvh;padding:24px;text-align:center}.card{background:#fff;border-radius:16px;padding:48px 32px;max-width:420px;box-shadow:0 4px 24px rgba(0,0,0,.08)}h1{font-size:24px;color:#0A1628;margin-bottom:8px}p{color:#666;font-size:14px;line-height:1.6;margin-bottom:24px}button{background:#0A1628;color:#fff;border:none;padding:12px 32px;border-radius:8px;font-size:14px;font-weight:600;cursor:pointer}button:hover{background:#132844}.icon{font-size:48px;margin-bottom:16px}</style></head><body><div class="card"><div class="icon">📡</div><h1>Bağlantı Yok</h1><p>İnternet bağlantınız kesilmiş görünüyor. Lütfen bağlantınızı kontrol edip tekrar deneyin.</p><button onclick="location.reload()">Tekrar Dene</button></div></body></html>',
      { status: 200, headers: { "Content-Type": "text/html; charset=utf-8" } }
    );
  }
}
