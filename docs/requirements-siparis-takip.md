# Bayi Portalı: Sipariş Takip & Fatura Görüntüleme

## Proje Bağlamı

Kısmet Plastik B2B kozmetik ambalaj şirketi. Next.js 16 App Router, Supabase PostgreSQL, TypeScript. Bayi portalı `/bayi-panel` altında, Supabase Auth ile korunan bir alan.

Mevcut altyapı:
- `src/app/[locale]/bayi-panel/` — Bayi dashboard
- `src/app/api/orders/` — Sipariş API'leri
- `src/types/database.ts` — DB tipleri (orders, order_items, order_status_history)
- `src/lib/supabase-admin.ts` — Supabase admin client
- Supabase Auth ile bayi girişi mevcut

## Hedef

Bayilerin kendi siparişlerini takip edebilmesi ve faturalarını görüntüleyebilmesi.

## Gereksinimler

### 1. Sipariş Takip Sistemi

- Bayi kendi siparişlerini listeleyebilmeli (tarih, durum, tutar)
- Sipariş detay sayfası: ürünler, miktarlar, birim fiyatlar
- Sipariş durumu timeline gösterimi (beklemede → onaylandı → üretimde → kargoda → teslim edildi)
- Durum değişikliklerinde bildirim (opsiyonel)
- Filtreleme: tarih aralığı, durum, sipariş no
- Arama: sipariş numarası veya ürün adıyla

### 2. Fatura Görüntüleme

- Sipariş onaylandığında otomatik fatura oluşturma
- Fatura PDF olarak indirilebilmeli
- Fatura listesi: tarih, tutar, ödeme durumu
- Fatura detay görünümü: şirket bilgileri, ürün kalemleri, KDV, toplam
- E-fatura entegrasyonu (gelecekte, şimdilik PDF)

### 3. UI/UX

- Türkçe arayüz (i18n desteğiyle)
- Responsive tasarım (mobil uyumlu)
- Tailwind CSS + shadcn/ui bileşenleri
- Loading state'leri ve hata yönetimi
- Boş durum (henüz sipariş yok) gösterimi

### 4. Teknik Gereksinimler

- Supabase RLS ile bayi sadece kendi verilerini görmeli
- Server Components tercih edilmeli
- API route'ları rate-limit korumalı
- TypeScript strict mode
- Mevcut `orders`, `order_items`, `order_status_history` tabloları kullanılmalı
- Yeni tablo: `invoices` (fatura bilgileri)

## Kısıtlamalar

- Ödeme sistemi entegrasyonu YOK (sadece fatura görüntüleme)
- E-fatura entegrasyonu şimdilik YOK
- Mevcut admin panel siparişler modülüyle uyumlu olmalı
