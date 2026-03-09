# Split 01: Sipariş Takip Sistemi

## Amaç
Bayi portalındaki stub "Siparişlerim" sayfasını tam işlevsel sipariş listeleme ve detay sayfasına dönüştürmek.

## Bağımlılıklar
- Yok (mevcut API route'ları yeterli)

## Dosya Değişiklikleri

### Yeni Dosyalar
1. **`src/app/[locale]/bayi-panel/siparislerim/[id]/page.tsx`**
   - Sipariş detay sayfası
   - Ürün listesi tablosu (ürün adı, miktar, birim fiyat, toplam)
   - 5 aşamalı durum timeline'ı (order_status_history'den)
   - Bilgilendirme kartları: sipariş no, tarih, toplam, ödeme durumu
   - Kargo takip numarası gösterimi (varsa)

2. **`src/components/ui/OrderTimeline.tsx`**
   - Reusable timeline bileşeni
   - 5 aşama: Beklemede → Onaylandı → Üretimde → Kargoda → Teslim Edildi
   - Her aşamada tarih ve not gösterimi
   - Aktif/tamamlanmış/bekleyen durumlar için farklı stiller
   - İptal durumu için özel gösterim

### Değiştirilecek Dosyalar
3. **`src/app/[locale]/bayi-panel/siparislerim/page.tsx`** (mevcut stub → tam sayfa)
   - Sipariş listesi tablosu (sipariş no, tarih, durum badge, toplam, aksiyon)
   - Filtreler: durum (Select), tarih aralığı (DatePicker veya Input[date])
   - Arama: sipariş numarası veya ürün adı
   - Pagination
   - Boş durum gösterimi ("Henüz siparişiniz bulunmuyor")
   - Loading skeleton

## API Kullanımı
- `GET /api/orders?profile_id={userId}&status={filter}&page={n}` — Listeleme
- `GET /api/orders/{id}` — Detay (order_items + order_status_history dahil)
- Mevcut API'ler yeterli, değişiklik gerekmez

## UI Bileşenleri (shadcn/ui)
- Table, TableHeader, TableBody, TableRow, TableCell
- Badge (durum renkleri: pending=sarı, confirmed=mavi, production=mor, shipping=turuncu, delivered=yeşil, cancelled=kırmızı)
- Button, Input, Select
- Card, CardHeader, CardContent
- Skeleton (loading)

## Durum Badge Renkleri
```
pending    → bg-yellow-100 text-yellow-800  "Beklemede"
confirmed  → bg-blue-100 text-blue-800      "Onaylandı"
production → bg-purple-100 text-purple-800  "Üretimde"
shipping   → bg-orange-100 text-orange-800  "Kargoda"
delivered  → bg-green-100 text-green-800    "Teslim Edildi"
cancelled  → bg-red-100 text-red-800        "İptal Edildi"
```

## Kabul Kriterleri
- [ ] Bayi sadece kendi siparişlerini görebilmeli
- [ ] Filtreleme ve arama çalışmalı
- [ ] Sipariş detayında timeline doğru gösterilmeli
- [ ] Boş durum ve loading state'leri düzgün
- [ ] Mobil responsive
- [ ] TR/EN dil desteği
