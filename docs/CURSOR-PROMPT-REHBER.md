# Kısmet Plastik — B2B Cursor Prompt Rehberi

> **Site:** kismetplastik-app.vercel.app
> **Stack:** Next.js 16+ (App Router), Vercel, Tailwind CSS, Supabase
> **Amaç:** Kozmetik ambalaj B2B platformu için kapsamlı özellik geliştirme

---

## Mevcut Durum (2026-02-27)

### Tamamlanan Özellikler
- [x] Next.js 16 + React 19 + Tailwind CSS 4 + TypeScript
- [x] Çoklu dil desteği (TR/EN) - locale routing + JSON çeviri dosyaları
- [x] Ürün kataloğu (8 kategori, 23 ürün, filtreleme, arama)
- [x] 3D ürün görüntüleyici (React Three Fiber)
- [x] AI Chatbot (OpenAI GPT-4o-mini)
- [x] WhatsApp Business widget (3 agent)
- [x] İletişim + Teklif formu (Resend email)
- [x] Blog sistemi (Supabase CRUD)
- [x] Admin paneli (ürün + blog yönetimi)
- [x] SEO (sitemap, robots.txt, JSON-LD, meta tags)
- [x] Dark mode
- [x] PWA (Service Worker, manifest, install prompt)
- [x] API rate limiting
- [x] Security headers
- [x] Vercel production deploy

### Yapılacak Modüller (Öncelik Sırasına Göre)

#### FAZ 1: Veritabanı & Backend Güçlendirme
- [ ] Supabase şema genişletme (profiles, quote_requests, orders, contact_messages)
- [ ] RLS politikaları
- [ ] API route'ları (products CRUD, quotes, orders)

#### FAZ 2: Bayi Portal Sistemi
- [ ] Bayi giriş/kayıt (Supabase Auth)
- [ ] Bayi dashboard
- [ ] Sipariş takip sayfası
- [ ] Cari hesap

#### FAZ 3: Teklif & Sipariş Sistemi
- [ ] Multi-step teklif formu
- [ ] Teklif sepeti
- [ ] Sipariş oluşturma (bayi)
- [ ] PDF fatura/irsaliye

#### FAZ 4: Admin Panel Genişletme
- [ ] Admin dashboard (grafikler, KPI'lar)
- [ ] Gelişmiş ürün yönetimi (rich text, çoklu görsel)
- [ ] Sipariş/teklif yönetimi (Kanban board)
- [ ] Bayi yönetimi (onay/red, CRM notları)

#### FAZ 5: Blog & İçerik
- [ ] Rich text editor (Tiptap)
- [ ] Çift dil blog yönetimi
- [ ] RSS feed
- [ ] Blog SEO (Article schema)

#### FAZ 6: Entegrasyonlar
- [ ] Email template sistemi (React Email)
- [ ] Admin raporlama (Recharts, Excel/PDF export)
- [ ] Google Analytics 4 custom events
- [ ] WhatsApp Business API

#### FAZ 7: Güvenlik & Performans
- [ ] Session yönetimi
- [ ] Failed login limiting
- [ ] KVKK uyumluluk
- [ ] Core Web Vitals optimizasyonu

---

*Son güncelleme: 2026-02-27*
