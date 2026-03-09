# Deep Project Interview - Sipariş Takip & Fatura

## Kullanıcı Cevapları

1. **Fatura PDF yaklaşımı:** Server-side PDF (API route'ta oluştur, Supabase Storage'a kaydet)
2. **Sipariş takip detayı:** Basit durum — 5 aşamalı timeline (Beklemede → Onaylandı → Üretimde → Kargoda → Teslim)
3. **Portal durumu:** Mevcut portal var, üzerine ekleyeceğiz

## Mevcut Altyapı Analizi

- `bayi-panel/siparislerim/page.tsx` → Stub (sadece `<div>Sayfa</div>`)
- `api/orders/route.ts` → GET (listeleme) ve POST (oluşturma) mevcut, çalışıyor
- `api/orders/[id]/route.ts` → GET (detay) ve PATCH (güncelleme) mevcut
- `types/database.ts` → DbOrder, DbOrderItem, DbOrderStatusHistory tipleri tanımlı
- OrderStatus enum: pending, confirmed, production, shipping, delivered, cancelled
- PaymentStatus enum: pending, paid, partial, refunded
- Fatura tablosu (invoices) henüz YOK — oluşturulacak
- Bayi dashboard zaten sipariş sayısını gösteriyor

## Kararlar

- PDF kütüphanesi: jsPDF (lightweight, no puppeteer dependency)
- Fatura numarası formatı: KP-2026-00001
- KDV oranı: %20 (mevcut sistemle uyumlu)
- Fatura Storage bucket: "invoices"
