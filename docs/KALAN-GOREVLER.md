# Kısmet Plastik B2B — Kalan Görevler

Güncel görev listesi. Tamamlananlar üstte, kalanlar altta. Commit edildi; Vercel ve Supabase adımları aşağıda.

---

## Tamamlananlar

### 1. 3D ürün viewer — TAMAMLANDI (2026-02-25)
- React Three Fiber ile programatik 3D modeller (şişe, kapak, sprey, pompa, huni)
- 2D/3D toggle, auto-rotate, orbit controls, zoom, fullscreen
- Lazy loading ile performans optimize

### 2. Kapsamlı iyileştirmeler — TAMAMLANDI (2026-02-25)
- [x] Security headers, ThemeContext SSR fix, Admin timing-safe auth, Email escaping
- [x] Error/loading/not-found sayfaları, React.memo, i18n (50+ string), SEO metadata, sitemap EN
- [x] TypeScript ES2022, lint, .gitignore, reactStrictMode

### 3. Supabase veritabanı kurulumu — TAMAMLANDI (2026-02-25)
- [x] Tablolar: categories, products, blog_posts
- [x] 8 kategori, 23 ürün, 6 blog aktarıldı; `scripts/import-data.mjs`

### 4. Deploy öncesi iyileştirmeler — TAMAMLANDI (2026-02-27)
- [x] Build hatası (teklif-al), galeri/about/testimonials i18n, API rate limiting, robots.txt, .env.example

### 5. PWA & Mobil uyumluluk — TAMAMLANDI (2026-02-27)
- [x] Service Worker, PWA manifest, Install Prompt, offline fallback

### 6. Supabase genişletme (B2B) — HAZIR (2026-02-27)
- [x] Migration dosyası: `kismetplastik-app/docs/supabase-migration-002.sql`
- [x] Tablolar: profiles, quote_requests, quote_items, orders, order_items, contact_messages, catalog_downloads, order_status_history
- [x] RLS, trigger'lar, handle_new_user
- **Yapılacak:** Supabase Dashboard → SQL Editor → migration dosyasını çalıştır

### 7. Bayi paneli & API — TAMAMLANDI (2026-02-27)
- [x] `/api/quotes`, `/api/orders`, `/api/auth/login`, `/api/auth/register`
- [x] Bayi girişi sayfası, bayi panel layout, siparişlerim sayfası

### 8. UI/UX İyileştirmeler — TAMAMLANDI (2026-02-27)
- [x] Header mega menü: Ürünler (ikonlu + açıklamalı), Kurumsal (8 alt menü), Sektörler (6 sektör), Medya (Blog, Fuarlar, Sözlük)
- [x] Footer sadeleştirme: QR kaldırıldı, adres kısaltıldı, newsletter formu eklendi
- [x] Ürün filtreleri: sidebar layout (desktop sol, mobil toggle), collapsible kategori/malzeme panelleri
- [x] Tema/dil: ThemeContext `.dark` class + `data-theme` senkronizasyonu, CSS birleştirildi
- [x] 3D/2D viewer: dark mode uyumlu font renkleri, Chrome positioning düzeltmesi, semantic renk sınıfları

### 9. PWA İkon Optimizasyonu — TAMAMLANDI (2026-02-27)
- [x] icon-192.png: 3,864 KB → 8.3 KB (192x192px)
- [x] icon-512.png: 4,190 KB → 43.8 KB (512x512px)
- [x] Maskable ikonlar: icon-maskable-192.png (5 KB) + icon-maskable-512.png (36.3 KB)
- [x] manifest.json ayrı maskable ikonlarla güncellendi

### 10. Galeri Sistemi (Supabase Storage) — TAMAMLANDI (2026-02-27)
- [x] Migration: `docs/supabase-migration-003.sql` (gallery_images tablosu, storage bucket, RLS)
- [x] API: `/api/gallery` (GET/POST), `/api/gallery/[id]` (DELETE/PATCH)
- [x] Admin galeri sayfası: drag & drop yükleme, kategori filtre, gizle/göster, silme
- [x] Galeri sayfası: Supabase'den veri çekme, lightbox, klavye navigasyon, placeholder fallback
- [x] i18n: TR/EN galeri stringleri
- **Yapılacak:** Supabase Dashboard → SQL Editor → `docs/supabase-migration-003.sql` çalıştır

### 11. Performans & SEO — TAMAMLANDI (2026-02-27)
- [x] Renk paleti: accent turuncu (#f97316) → marka altını (#f2b300), amber dekoratif sınıflar
- [x] WOFF2 fontlar (MyriadPro: ~%47 boyut azalması), preload güncellendi
- [x] OG Image (1200x630) + Twitter Card; sitemap genişletme (sektorler, fuarlar, arge, vb.)
- [x] Supabase preconnect; galeri görselleri `next/image` ile optimize

### 12. Next.js 16 Proxy — TAMAMLANDI (2026-02-27)
- [x] `middleware.ts` → `proxy.ts` migrasyonu (deprecation uyarısı kaldırıldı)
- [x] Layout import güncellendi

### 13. Vercel & Domain — TAMAMLANDI (2026-02-27)
- [x] Proje adı: kismetplastik (domain: kismetplastik.vercel.app)
- [x] `vercel domains add kismetplastik.vercel.app` ile domain eklendi
- **Not:** Yeni deploy için `vercel login` gerekebilir (token süresi)

### 14. UI: Özel Kategori İkonları — TAMAMLANDI (2026-02-27)
- [x] `CategoryIcons.tsx`: 8 özel SVG ikon (PET şişe, plastik şişe, kapak, tıpa, parmak sprey, pompa, tetikli püskürtücü, huni)
- [x] Header mega menü ve Categories bölümünde kullanıldı

### 15. UI: Footer Yeniden Tasarım — TAMAMLANDI (2026-02-27)
- [x] B2B odaklı footer: koyu arka plan (#0a1628), net bölüm başlıkları (accent), sadeleştirilmiş grid
- [x] İletişim ikonları kutu içinde; sosyal medya butonları; KVKK alt link

### Son build: 73 sayfa, 0 hata, production-ready

---

## Vercel & Supabase — Commit ve Deploy

### Commit (yapıldı)
- Ana repo: `docs/KALAN-GOREVLER.md` güncellendi ve commit edildi.
- Submodule: `kismetplastik-app` kendi repo'sunda güncel; ana repo submodule referansı commit'e dahil.

### Vercel
- [ ] Vercel'da proje: root olarak `kismetplastik-app` seç (veya submodule path)
- [ ] Ortam değişkenleri: `RESEND_API_KEY`, `EMAIL_FROM`, `EMAIL_TO`, `ADMIN_SECRET`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `OPENAI_API_KEY` (opsiyonel), `NEXT_PUBLIC_GA_ID` (opsiyonel)
- [ ] Custom domain: kismetplastik.com + DNS (A veya CNAME)

### Supabase
- [ ] Supabase Dashboard → SQL Editor → `kismetplastik-app/docs/supabase-migration-002.sql` içeriğini yapıştırıp çalıştır
- [ ] Supabase Dashboard → SQL Editor → `kismetplastik-app/docs/supabase-migration-003.sql` (galeri sistemi) çalıştır
- [ ] Auth etkin; RLS politikaları aktif

---

## Kalan Görevler

### 1. Play Store (TWA) — HAZIR (2026-02-27)
- [x] Bubblewrap CLI kuruldu (`@bubblewrap/cli`)
- [x] TWA manifest yapılandırması (`twa/twa-manifest.json`)
- [x] Digital Asset Links (`public/.well-known/assetlinks.json`)
- [x] Vercel headers güncellendi (assetlinks.json için)
- [x] Kapsamlı rehber oluşturuldu (`twa/PLAY-STORE-REHBER.md`)
- **Yapılacak:** Rehberdeki adımları takip ederek APK/AAB oluştur ve Play Console'a yükle

### 2. İçerik güncelleme (opsiyonel)
- [x] ~~Fontlar: MyriadPro → `public/fonts/`~~ (zaten yapılmış)
- [x] ~~Galeri: gerçek fotoğraflar~~ (Supabase Storage ile dinamik galeri sistemi kuruldu)
- [x] ~~Footer: sosyal medya linkleri~~ (Facebook, Instagram, LinkedIn zaten ekliydi)
- [x] ~~PWA ikonları: 192x192 + 512x512 PNG, maskable~~ (optimize edildi)
- [ ] QR kod (gerekirse PDF)

---

## Özet: Kalan Yapılacaklar

| Öncelik | Görev | Durum |
|--------|--------|--------|
| 1 | Supabase migration-002.sql çalıştır | Bekliyor |
| 2 | Supabase migration-003.sql (galeri) çalıştır | Bekliyor |
| 3 | Vercel ortam değişkenleri + custom domain (kismetplastik.com) | Opsiyonel |
| 4 | Play Store: TWA APK/AAB + rehber adımları | Hazır, rehber: `twa/PLAY-STORE-REHBER.md` |
| 5 | QR kod (PDF, gerekirse) | Opsiyonel |

---

*Son güncelleme: 2026-02-27 — Performans/SEO, proxy migrasyonu, özel ikonlar, footer redesign eklendi.*
