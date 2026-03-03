# MASTER ORCHESTRATOR — 18 PARALEL AGENT CALISTIR

Projeyi incele. tsc --noEmit calistir, hata varsa once npm install yap.
CLAUDE.md ve .claude/B2B-MASTER-PROMPT.md oku.

## ONEMLI: Bu prompt 18 PARALEL agent baslatir.
## Task tool ile her birini AYNI ANDA calistir.
## Hepsinin bitmesini bekle, sonra AGENT-16 ve AGENT-20 sirayla calistir.

## DALGA 1 — 18 PARALEL TASK (ayni anda baslat)

Asagidaki her bir gorevi AYRI bir Task olarak PARALEL baslat.
Her Task kendi dosyalarina dokunur, hicbir cakisma olmaz.

### TASK 1: 404 Sayfasi
src/app/not-found.tsx olustur. Navy arka plan, buyuk 404 (amber), Sayfa Bulunamadi mesaji, Ana Sayfaya Don butonu, populer sayfa linkleri. LocaleLink kullan. Responsive.

### TASK 2: Sertifika Sayfasi
src/data/certificates.ts (6 sertifika verisi) + src/app/[locale]/sertifikalar/page.tsx + layout.tsx + src/components/pages/CertificatesClient.tsx olustur. Kart grid, ikon (lucide-react), PDF indir butonu, JSON-LD Organization.hasCredential, generateMetadata.

### TASK 3: Tarihce Timeline
src/data/milestones.ts (8 milestone, 1969-2026) + src/components/ui/Timeline.tsx + src/app/[locale]/tarihce/page.tsx + layout.tsx olustur. Desktop zigzag, mobil tek sutun. Navy cizgi, amber yil dairesi, cream kart. IntersectionObserver fade-in animasyonu.

### TASK 4: Fabrika Galerisi
src/app/[locale]/fabrika/page.tsx + layout.tsx + src/components/pages/FactoryClient.tsx + src/components/ui/ImageLightbox.tsx olustur. Hero gorsel, YouTube placeholder, 8 fotograf grid, lightbox, 360 tur placeholder, fabrika ozellikleri (4 kolon sayi grid).

### TASK 5: Numune Talep Formu
src/app/[locale]/numune-talep/ sayfasini DOLDUR. src/components/pages/SampleRequestClient.tsx + src/app/api/sample-request/route.ts + docs/supabase-migrations/004_sample_requests.sql olustur. 3 adimli form (firma, numune, teslimat). Multi-select urun secimi. Zod validation. Rate limit.

### TASK 6: YouTube Embed Component
src/components/ui/YouTubeEmbed.tsx + src/components/ui/VideoJsonLd.tsx olustur. Facade pattern: once thumbnail + play butonu, tiklaninca iframe. IntersectionObserver lazy load. Responsive 16:9. VideoObject JSON-LD.

### TASK 7: Sektor Rehberi
src/data/resources.ts (4 rehber) + src/app/[locale]/kaynaklar/page.tsx + layout.tsx + src/components/pages/ResourcesClient.tsx + src/app/api/resources/download/route.ts + docs/supabase-migrations/005_lead_downloads.sql olustur. Kart grid, modal form (ad, email, firma), lead toplama.

### TASK 8: Fuar Takvimi
src/data/trade-shows.ts (3 fuar) + src/app/[locale]/fuarlar/ sayfasini DOLDUR + src/components/pages/TradeShowsClient.tsx + src/lib/ical.ts olustur. Yaklasan/gecmis fuarlar, iCal export, Fuarda Goruselim CTA.

### TASK 9: Urun Karsilastirma
src/store/useCompareStore.ts (Zustand, max 3, persist) + src/components/ui/CompareBar.tsx + src/app/[locale]/karsilastir/page.tsx + layout.tsx + src/components/pages/CompareClient.tsx olustur. Yan yana tablo, fark highlight (amber), Teklife Ekle entegrasyon. ProductCard.tsx a DOKUNMA.

### TASK 10: Stok Durumu + On Siparis
src/components/ui/StockBadge.tsx + src/app/[locale]/on-siparis/page.tsx + layout.tsx + src/components/pages/PreOrderClient.tsx + src/app/api/orders/pre-order/route.ts + docs/supabase-migrations/006_stock_preorder.sql olustur. 4 badge tipi, on siparis formu, Zod validation. ProductCard.tsx a DOKUNMA.

### TASK 11: AI Canli Chat
src/components/ui/AIChatbot.tsx GUNCELLE + src/app/api/chat/route.ts GUNCELLE + src/lib/chat-system-prompt.ts + docs/supabase-migrations/007_chat_sessions.sql olustur. OpenAI GPT-4o-mini streaming, Kismet Plastik bilgi bankasi, mesai kontrolu, canli desteğe aktar butonu. OPENAI_API_KEY yoksa graceful fallback.

### TASK 12: Cookie Banner
src/components/ui/CookieBanner.tsx GUNCELLE. 3 buton (Kabul/Ayarlar/Reddet), cookie kategorileri (zorunlu/analitik/pazarlama), KVKK metni, localStorage, GA4 consent mode.

### TASK 13: GA4 Analytics
src/components/analytics/GoogleAnalytics.tsx + src/hooks/useAnalytics.ts + src/types/gtag.d.ts olustur. next/script, NEXT_PUBLIC_GA_MEASUREMENT_ID, consent kontrolu, trackEvent hook (view_product, add_to_quote, submit_quote, download_resource, start_chat, compare_products, pre_order, sample_request).

### TASK 14: Webhook + n8n
src/app/api/webhooks/n8n/route.ts + src/lib/webhook.ts + docs/supabase-migrations/008_webhook_triggers.sql + docs/n8n/ (7 workflow JSON + README + setup guide) olustur. HMAC verification, event routing, Supabase triggers.

### TASK 15: Referans Logolari
src/components/ui/ReferenceLogos.tsx (compact + full variant) + src/data/references.ts (8 placeholder) + src/app/[locale]/referanslar/page.tsx + layout.tsx + public/references/ (placeholder SVG) olustur. Grayscale hover color. Ana sayfaya DOKUNMA.

### TASK 17: Dil Altyapisi
src/lib/i18n.ts GUNCELLE (11 dil: tr,en,ar,ru,fr,de,es,zh,ja,ko,pt) + src/proxy.ts GUNCELLE (8 yeni route) + src/contexts/LocaleContext.tsx GUNCELLE. localeNames, localeDirections, getDictionary 11 dil. Header.tsx ve layout.tsx a DOKUNMA.

### TASK 18: Dil Grup 1 (RU + FR + DE + ES)
src/locales/ru.json + fr.json + de.json + es.json olustur. tr.json daki TUM key leri cevir (450+ key). Dogal, profesyonel ceviriler. Sektor terimleri dogru.

### TASK 19: Dil Grup 2 (ZH + JA + KO + PT)
src/locales/zh.json + ja.json + ko.json + pt.json olustur. tr.json daki TUM key leri cevir (450+ key). CJK karakterler dogru encoding.

---

## DALGA 1 TAMAMLANINCA:

Tum 18 task bitmesini bekle. Sonra SIRASYLA:

## DALGA 2 — ENTEGRASYON (tek task)

### TASK 16: Entegrasyon
- src/app/[locale]/page.tsx: ReferenceLogos compact ekle
- src/app/[locale]/layout.tsx: GoogleAnalytics ekle, CJK fontlari (zh/ja/ko icin), hreflang 11 dil
- src/components/ui/ProductCard.tsx: StockBadge + Karsilastir butonu ekle
- src/components/pages/CategoryClient.tsx: stok filtresi + CompareBar ekle
- src/components/pages/ProductDetailClient.tsx: StockBadge + On Siparis butonu
- src/components/layout/Header.tsx: 11 dil dropdown secici
- src/app/sitemap.ts: tum yeni sayfalar + 11 dil
- src/locales/tr.json + en.json + ar.json: yeni key ler ekle
- src/lib/constants.ts: FOUNDING_YEAR = 1969, dinamik yil hesapla
- JsonLd.tsx: LocalBusiness schema guncelle
- Header.tsx: sticky telefon numarasi
- globals.css: overflow-wrap: break-word
- Ana sayfa testimonial duzelt

## DALGA 3 — FINAL (tek task)

### TASK 20: Final Audit
tsc --noEmit, eslint, npm run build kontrol.
i18n key parity (11 dil), sitemap, hreflang, JSON-LD, guvenlik kontrol.
.env.example, CODEBASE_MAP.md, FINAL_AUDIT.md, README guncelle.
Sorun bulursan DUZELT.

## KURALLAR
- Dalga 1 deki 18 task i PARALEL baslat (Task tool ile)
- Her task bitmesini BEKLE
- Dalga 2 yi tek baslat, bitmesini bekle
- Dalga 3 u tek baslat
- Brand renkleri: Navy (#0A1628) + Amber (#F59E0B) + Cream (#FAFAF7)
- tsc --noEmit ve eslint her dalga sonunda temiz olmali
