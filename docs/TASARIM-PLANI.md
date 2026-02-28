# Kismet Plastik — Yeniden Tasarım Planı

Son güncelleme: 28 Şubat 2026

---

## Referans Analizi Özeti

### En İyi Türk Rakipler
| Site | Puan | Güçlü Yönü |
|------|------|-------------|
| Plaş Plastik (plas.com.tr) | 8.5/10 | Tab-bazlı ürün browser, istatistik hero |
| Lale Plastik (laleplastik.com.tr) | 8/10 | Dengeli homepage, WhatsApp, referans carousel |
| Petek Plastik (petekplastik.com) | 7.5/10 | Kapsamlı footer, eco branding |
| Sarten (sarten.com.tr) | 7/10 | Mega-menu, kurumsal his |
| Nurpet (nurpet.com.tr) | 7/10 | Avantaj bölümü, WhatsApp |

### En İyi Uluslararası Referanslar
| Site | Puan | Güçlü Yönü |
|------|------|-------------|
| Arkay (arkay.com) | 9/10 | Premium minimal, serif tipografi |
| TNT Group (tntgm.com) | 8.5/10 | Luxury cinematic, animasyonlu text |
| Jarsking (jarsking.com) | 8/10 | En iyi mega menu + ürün UX |
| Packiro (packiro.com) | 8/10 | Sürdürülebilir ambalaj, friendly modern |
| Kospack (kospack.com) | 7.5/10 | Video hero, global approach |

---

## Önerilen Homepage Akışı

```
1. Utility Bar (telefon, email, TR/EN toggle)
2. Sticky Navigation (logo, mega menu, "Teklif Al" CTA)
3. Hero (video/gradient bg, büyük başlık, 2 CTA, animasyonlu sayılar)
4. Trusted By (müşteri logo marquee - sürekli kayma)
5. Ürünler (6-8 kategori kartı grid veya tab-bazlı browser)
6. Neden Kısmet? (4 değer: Kalite, Özel Üretim, Hız, Sürdürülebilirlik)
7. Süreç Adımları (4 adım: İletişim > Tasarım > Üretim > Teslimat)
8. Sektörler (tab bazlı: Kozmetik, Gıda, İlaç, Temizlik, Endüstriyel)
9. Sertifikalar & Kalite (ISO badge'ları, test lab)
10. Referanslar / Testimonials (logo carousel)
11. Blog / Haberler (3 son yazı kartı)
12. CTA Banner ("Projeniz İçin Teklif Alın" - tam genişlik)
13. Footer (4 kolon + alt bar)
```

---

## Renk Paleti

### Mevcut
- Primary: `#002060` (koyu mavi)
- Accent: `#f2b300` (altın)

### Önerilen (Rakip analizi bazlı)
- Primary: `#0A1628` (deep navy) - güven, profesyonellik
- Secondary: `#2D9CDB` (teal) - sürdürülebilirlik, büyüme
- Accent: `#F2994A` (warm amber) - CTA, vurgu
- Eco: `#00A878` (yeşil) - çevre dostu
- Neutral: `#FFFFFF`, `#F5F7FA`, `#333333`

---

## Tipografi

- Headlines: Plus Jakarta Sans / Inter (geometric sans-serif)
- Body: Inter / DM Sans (16-18px base)
- Monospace: JetBrains Mono (teknik specs için)

---

## Header Tasarımı

```
┌─────────────────────────────────────────────────────┐
│ ☎ 0212 549 87 03 │ ✉ bilgi@kismetplastik.com │ TR/EN │
├─────────────────────────────────────────────────────┤
│ [LOGO]  Ana Sayfa │ Ürünler ▾ │ Kurumsal ▾ │     │
│         Sektörler ▾ │ Medya ▾ │ İletişim    │     │
│                                        [TEKLİF AL] │
└─────────────────────────────────────────────────────┘
```

- Utility bar: 36px, koyu navy
- Main nav: 72px, transparent → scroll'da solid
- Mega menu: ürünlerde thumbnail + açıklama

---

## Footer Tasarımı

```
┌───────────────────────────────────────────────────────┐
│ [LOGO]          │ Ürünler    │ Kurumsal  │ İletişim  │
│ Kısa açıklama   │ PET Şişe   │ Hakkımızda│ Adres     │
│                 │ Kapak      │ Kalite    │ Telefon   │
│ ISO 9001 14001  │ Pompa      │ Üretim    │ Email     │
│ FSSC 22000      │ Sprey      │ AR-GE     │ Harita    │
│                 │ Tüm Ürünler│ Blog      │ WhatsApp  │
├───────────────────────────────────────────────────────┤
│ © 2026 Kısmet Plastik │ FB IG LI │ KVKK │ Gizlilik  │
└───────────────────────────────────────────────────────┘
```

- 4 kolon, koyu navy arka plan
- Sertifika badge'ları
- Sosyal medya ikonları

---

## Fark Yaratacak Özellikler (Hiçbir rakipte yok)

1. **Dark Mode** - Hiçbir rakip sunmuyor
2. **3D Ürün Viewer** - Zaten mevcut, rakiplerden çok üstün
3. **Ürün Konfiguratör** - Şişe + kapak + pompa seçerek ürün oluşturma
4. **PWA + TWA** - Mobil uygulama deneyimi
5. **Çift Dil (TR/EN)** - Çoğu rakip tek dil
6. **AI Chatbot** - B2B müşteri desteği
7. **Bayi Paneli** - Online sipariş takibi

---

## Uygulama Fazları

### Faz A: Temel Tasarım (Öncelik: Yüksek)
- [ ] Header yeniden tasarım (mega menu iyileştirme)
- [ ] Hero section yeniden tasarım
- [ ] Footer kompakt yeniden tasarım
- [ ] Dark mode tam uyumluluk
- [ ] Renk paleti güncelleme

### Faz B: İçerik Bölümleri (Öncelik: Orta)
- [ ] Süreç adımları bölümü ekle
- [ ] Referans logo carousel ekle
- [ ] Sertifika/kalite bölümü güçlendir
- [ ] Sektör bölümü tab-bazlı yap

### Faz C: Gelişmiş Özellikler (Öncelik: Düşük)
- [ ] Video hero background
- [ ] Ürün konfiguratör
- [ ] Gelişmiş mega menu (thumbnail'li)
- [ ] Ambalaj sözlüğü genişletme

---

---

## Uluslararası PET Şişe Üretici Referansları

### Premium Siteler
| Site | Ülke | Öne Çıkan Özellik |
|------|------|-------------------|
| **Plascene** (plascene.com) | ABD | Temiz layout, "Request Sample" CTA, sektör bazlı kategorizasyon |
| **Esterform** (esterform.com) | İngiltere | 4 adımlı teknik servis süreci, gerçek müşteri case study'leri |
| **EPROPLAST** (eproplast.com) | Almanya | **"Bottle Finder"** - 3 tıkla şişe konfigüratörü (EN İYİ ÖRNEK) |
| **Krones** (krones.com) | Almanya | Enterprise düzey, komple PET çözümleri |

### EPROPLAST "Bottle Finder" — En İnovatif Özellik
3 adımda müşterinin ihtiyacına uygun şişeyi bulan interaktif araç:
1. Sektör seç (Kozmetik, Gıda, vs.)
2. Hacim seç (50ml - 2000ml)
3. Şekil seç (Silindir, Oval, Kare)
→ Uygun ürünler filtreleniyor

**Kismet Plastik için uyarlanabilir!**

---

## 2026 B2B Üretim Sitesi Trendleri

### Ödüllü Örnekler
| Site | Ödül | Öne Çıkan |
|------|------|-----------|
| **Philadelphia Gear** | W3 Award 2024 | Sektör bazlı sayfalar, Knowledge Center, SEO skoru 58→93 |
| **Sellick Equipment** | Top Manufacturing | Video homepage, dealer locator haritası |
| **AK Industries** | Modern B2B | Aranabilir ürün veritabanı, %15 trafik artışı |

### Kritik 2026 Tasarım Prensipleri
1. **Immersive Dijital Showroom**: 3D ürün görselleri, sanal fabrika turları
2. **Teknik Dokümantasyon Öncelikli**: ISO sertifikaları, malzeme güvenlik belgeleri anında erişilebilir
3. **RFQ-Optimize Dönüşüm**: Teklif formu her sayfada erişilebilir
4. **Çok Paydaşlı Mimari**: Mühendisler (CAD), satın alma (fiyat), yöneticiler (case study)
5. **Mobil-Öncelikli & Hızlı**: Yavaş site = güvensiz firma algısı
6. **AI/AEO Uyumlu**: JSON-LD schema ile teknik yetenekler makineler tarafından okunabilir

### İstatistik
- B2B alıcıların %40'ı web sitesine bakarak satın alma kararı veriyor
- B2B alıcıların %90'ı online araştırma ile başlıyor
- B2B satın alma sürecinin 2/3'ü satış temsilcisiyle iletişime geçmeden önce dijitalde gerçekleşiyor

---

## YouTube & UI Tasarım Kaynakları

### Takip Edilecek Kanallar
- **DBS Interactive**: Manufacturing Website Design Trends 2026
- **Nopio**: B2B Website Design for Manufacturers guide
- **Awwwards**: awwwards.com — En iyi web tasarım ödülleri
- **Dribbble**: dribbble.com/search/B2B-manufacturing — Tasarım ilhamı

### Karşılaştırma Tablosu: Kismet Plastik vs Rakipler

| Özellik | Kismet | Plaş | Lale | EPROPLAST | Plascene |
|---------|--------|------|------|-----------|---------|
| 3D Ürün Viewer | ✅ | ❌ | ❌ | ❌ | ❌ |
| Dark Mode | ✅ | ❌ | ❌ | ❌ | ❌ |
| PWA + TWA | ✅ | ❌ | ❌ | ❌ | ❌ |
| Çift Dil | ✅ | ❌ | ✅ | ✅ | ✅ |
| AI Chatbot | ✅ | ❌ | ❌ | ❌ | ❌ |
| Bayi Paneli | ✅ | ❌ | ❌ | ❌ | ❌ |
| Bottle Finder | ❌ | ❌ | ❌ | ✅ | ❌ |
| Video Hero | ❌ | ❌ | ❌ | ❌ | ❌ |
| Logo Carousel | ❌ | ❌ | ✅ | ❌ | ❌ |

**Kismet Plastik zaten birçok özellikte rakiplerden üstün!**
Sadece görsel tasarım kalitesinin artırılması gerekiyor.

---

*Bu plan kalıcı referans dosyasıdır. Her oturumda güncellenecektir.*
