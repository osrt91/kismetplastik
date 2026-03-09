# Split 03: Portal Entegrasyon

## Amaç
Fatura sayfasını bayi portalına eklemek, dashboard'ı güncellemek ve tüm parçaları birleştirmek.

## Bağımlılıklar
- 01-siparis-takip
- 02-fatura-sistemi

## Dosya Değişiklikleri

### Yeni Dosyalar

1. **`src/app/[locale]/bayi-panel/faturalarim/page.tsx`**
   - Fatura listesi tablosu (fatura no, tarih, tutar, durum, PDF indir)
   - Filtreler: tarih aralığı, durum
   - PDF indirme butonu (her satırda)
   - Boş durum gösterimi
   - Loading skeleton

### Değiştirilecek Dosyalar

2. **`src/app/[locale]/bayi-panel/layout.tsx`**
   - Navigasyona "Faturalarım" menü öğesi ekle
   - Icon: Receipt veya FileText (lucide-react)
   - Href: `/bayi-panel/faturalarim`
   - "Siparişlerim" ile "Profilim" arasına yerleştir

3. **`src/app/[locale]/bayi-panel/page.tsx`** (Dashboard)
   - Yeni istatistik kartı: "Toplam Fatura" sayısı
   - Yeni istatistik kartı: "Ödenmemiş Fatura" sayısı (opsiyonel)
   - Son siparişler widget'ına durum badge ekle
   - Hızlı aksiyon: "Faturalarımı Gör" butonu

4. **`src/app/[locale]/bayi-panel/siparislerim/[id]/page.tsx`**
   - Fatura varsa "Faturayı İndir" butonu ekle
   - Fatura yoksa "Fatura henüz oluşturulmadı" bilgisi

## UI Detayları

### Fatura Listesi Tablosu
| Fatura No | Tarih | Sipariş No | Tutar | Durum | İşlem |
|-----------|-------|------------|-------|-------|-------|
| KP-2026-00001 | 05.03.2026 | SIP-00042 | ₺4,440 | Ödendi | [PDF İndir] |

### Durum Badge Renkleri
```
draft     → bg-gray-100 text-gray-800     "Taslak"
issued    → bg-blue-100 text-blue-800     "Kesildi"
paid      → bg-green-100 text-green-800   "Ödendi"
cancelled → bg-red-100 text-red-800       "İptal"
```

### Dashboard Yeni Kartlar
- Receipt icon + "Toplam Fatura" + count
- AlertCircle icon + "Ödenmemiş" + count (status != 'paid')

## Kabul Kriterleri
- [ ] Navigasyonda "Faturalarım" linki görünmeli
- [ ] Dashboard'da fatura istatistikleri doğru
- [ ] Sipariş detayından fatura indirilebilmeli
- [ ] Fatura listesi filtrelenebilmeli
- [ ] Tüm sayfalar mobil responsive
- [ ] TR/EN dil desteği
