# Project Manifest: Sipariş Takip & Fatura Görüntüleme

## Proje Özeti

Bayi portalına sipariş takip (timeline + filtreleme) ve fatura görüntüleme (server-side PDF) eklemek. Mevcut stub sayfaları tam işlevsel hale getirmek.

## Split Yapısı

```SPLIT_MANIFEST
01-siparis-takip
02-fatura-sistemi
03-portal-entegrasyon
```

## Splits

### 01-siparis-takip
**Açıklama:** Sipariş listeleme, detay sayfası ve durum timeline'ı
**Bağımlılık:** Yok (mevcut API'ler yeterli)
**Tahmini dosya sayısı:** 4-5 dosya
**Kapsamı:**
- `bayi-panel/siparislerim/page.tsx` — Sipariş listeleme (filtre, arama, pagination)
- `bayi-panel/siparislerim/[id]/page.tsx` — Sipariş detay + timeline
- Sipariş durumu timeline bileşeni
- Mevcut `api/orders` route'ları yeterli (değişiklik gerekmez)

### 02-fatura-sistemi
**Açıklama:** Fatura tablosu, PDF oluşturma API'si, fatura listeleme
**Bağımlılık:** 01-siparis-takip (sipariş detay sayfasından faturaya link)
**Tahmini dosya sayısı:** 5-6 dosya
**Kapsamı:**
- SQL migration: `invoices` tablosu
- `types/database.ts` → DbInvoice tipi
- `api/invoices/route.ts` — Fatura listeleme (GET)
- `api/invoices/[id]/route.ts` — Fatura detay (GET)
- `api/invoices/[id]/pdf/route.ts` — PDF oluştur ve indir
- Fatura oluşturma logic'i (sipariş onaylandığında)

### 03-portal-entegrasyon
**Açıklama:** Dashboard güncelleme, fatura sayfası, navigasyon
**Bağımlılık:** 01-siparis-takip, 02-fatura-sistemi
**Tahmini dosya sayısı:** 3-4 dosya
**Kapsamı:**
- `bayi-panel/faturalarim/page.tsx` — Fatura listeleme sayfası
- Dashboard'a fatura istatistiği ekleme
- Layout'a "Faturalarım" navigasyon linki ekleme
- Sipariş detay sayfasından fatura indirme butonu

## Yürütme Sırası

```
01-siparis-takip ──→ 02-fatura-sistemi ──→ 03-portal-entegrasyon
   (bağımsız)          (01'e bağımlı)       (01+02'ye bağımlı)
```

## Teknik Notlar

- Tüm sayfalar `"use client"` — Supabase Auth client-side
- `supabaseBrowser()` ile auth, API fetch ile veri çekme
- shadcn/ui bileşenleri: Table, Badge, Button, Input, Select, Card
- i18n: useLocale() hook ile TR/EN
- PDF: jsPDF kütüphanesi (server-side)
