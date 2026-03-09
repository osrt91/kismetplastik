# DIA-Entegre B2B Bayi Portal Tasarimi

**Tarih:** 2026-03-09
**Durum:** Onaylandi

## Amac

Kismet Plastik bayi portalini DIA ERP v3 ile cift yonlu entegre ederek bayilerin stok, fiyat, siparis, fatura ve bakiye islemlerini tek platformdan yonetmesini saglamak.

## Mimari

```
Bayi Portal <-> Next.js API <-> DIA ERP v3 (kismetplastik.ws.dia.com.tr)
                    |
               Supabase (cache + yerel veri)
                    |
            Halkbank Sanal POS (ERS odemeleri)
```

**Temel prensip:** DIA tek dogru kaynak (SSOT). Supabase cache/ara katman. Portal DIA'dan okur, DIA'ya yazar.

## Moduller

### A. Cari Hesap & Bakiye Modulu

- Bayi girisi sonrasi DIA cari kartiyla eslestirme (eposta veya cari kodu)
- Dashboard'da 3 bakiye karti:
  - **EGR bakiye** (gayri resmi — fis/irsaliye bazli borc)
  - **ERS bakiye** (resmi — e-fatura bazli borc)
  - **Toplam borc** (EGR + ERS)
- DIA alanlari: `borc_fatura_bilgi`, `alacak_fatura_bilgi`, `bakiye`, `orjbakiye`
- Bakiye verileri her sayfa yuklemesinde DIA'dan cekilir veya 5 dk cache

### B. Urun Katalogu + Cari Bazli Fiyatlandirma

- Urunler DIA stok kartlarindan cekilir (`scf_stokkart_listele`)
- Fiyatlar bayinin DIA fiyat kartindan gelir (pesin/vadeli ayrim)
- Yeni bayiler standart bayi fiyat listesini gorur (fiyat1 veya fiyat2)
- Urun uyumluluk kurallari:
  - Sise -> uyumlu kapak/tipa/sprey iliskisi
  - DIA + Supabase tarafinda yonetilir
  - Urun builder (combo secim) portal icinde aktif

### C. Siparis Sistemi (Cift Yonlu)

**Akis:**
1. Bayi urunleri secer (katalog, hizli siparis, veya urun builder)
2. Sepete ekler
3. "Siparis Ver" tiklar

**Onayli bayiler:** Siparis -> direkt DIA'ya duser (`scf_siparis_ekle`)
**Yeni bayiler:** Siparis -> Supabase'de "beklemede" -> Admin onaylar -> DIA'ya duser

**Ozellikler:**
- Hizli siparis formu (Excel paste destegi mevcut)
- Urun builder (sise + kapak + tipa combo)
- Katalog uzerinden sepet
- Siparis gecmisi DIA'dan cekilir (`scf_siparis_listele`)

### D. Fatura Goruntuleme (EGR/ERS Ayrimi)

- **EGR tab:** Gayri resmi faturalar/fisler
- **ERS tab:** Resmi e-faturalar
- Her birinde: fatura no, tarih, vade, tutar, odeme durumu
- Toplam borc ozet karti ustte
- DIA'dan cekilir (`scf_fatura_listele` + tip filtreleme)

### E. Odeme Sistemi

**ERS faturalari:**
- Halkbank sanal POS ile online kart odemesi
- Bayi fatura secer -> odeme sayfasi -> POS entegrasyonu
- Odeme sonucu DIA'ya islenir

**EGR faturalari:**
- "Odeme Talebi" butonu
- WhatsApp'tan otomatik mesaj gonderilir:
  - EGR hesap bilgisi (IBAN vb.)
  - Guncel EGR borc tutari
- Kart ile odeme alinamaz (yasal kisitlama)

**Odeme gecmisi:** Tum odemeler portal uzerinden takip edilir

### F. Teklif Sistemi

- Bayi teklif ister -> DIA'ya teklif kaydi duser (`scf_teklif_ekle`)
- Admin DIA'dan fiyatlandirir, yanitlar
- Bayi portaldan gorur, onaylarsa -> siparise donusur
- Siparise donus: teklif kalemleri otomatik siparis formuna aktarilir

## Veri Akisi

### DIA -> Portal (Okuma)
- Stok kartlari (urun bilgileri, stok miktarlari)
- Cari bazli fiyatlar (fiyat kartlari)
- Faturalar (EGR/ERS ayrimli)
- Bakiye bilgileri (EGR/ERS ayrimli)
- Siparis gecmisi
- Teklif durumlari

### Portal -> DIA (Yazma)
- Yeni siparis olusturma
- Yeni teklif istegi
- Odeme kaydlari (ERS POS odemesi sonrasi)

## Teknik Detaylar

### DIA API Bilgileri
- **URL:** https://kismetplastik.ws.dia.com.tr/api/v3
- **Modul:** scf (ticari islemler), sis (sistem)
- **Auth:** Session-based (API key + kullanici/sifre)
- **Kontor:** 1720+ mevcut (her API cagrisi kontor harcar)

### Fiyat Yapisi
- DIA stok kartinda `fiyat1`-`fiyat10` alanlari
- Cari bazli fiyat kartlari (pesin/vadeli ayrim)
- Yeni bayiler icin standart fiyat listesi

### Urun Uyumluluk
- DIA'da ve Supabase'de paralel yonetim
- Sise kategorisi -> uyumlu kapak/tipa/sprey/disc-top
- Kurallar admin panelden tanimlanir

### Odeme Entegrasyonu
- Halkbank sanal POS (3D Secure)
- Sadece ERS faturalari icin
- EGR icin WhatsApp uzerinden talep

### Bayi Tipleri
- **Onayli bayi:** Direkt siparis, cari bazli fiyat, tam erisim
- **Yeni bayi:** On siparis, standart fiyat, admin onayi gerekli

## Mevcut Altyapi

### Hazir Olan
- DIA client (session yonetimi, auto-reconnect) ✅
- DIA servis fonksiyonlari (stok, cari, siparis, fatura, teklif) ✅
- Portal sayfalari (dashboard, katalog, hizli siparis, siparisler, teklifler, faturalar) ✅
- Supabase DB semalari (orders, quotes, invoices, profiles) ✅
- Admin DIA ayar/test/sync endpointleri ✅

### Yapilacak
- Cari bazli fiyat cekme servisi
- EGR/ERS fatura ayirimi
- Bakiye sorgulama servisi
- Siparis -> DIA entegrasyonu (gercek POST)
- Halkbank sanal POS entegrasyonu
- WhatsApp otomatik mesaj (EGR odeme talebi)
- Urun uyumluluk kural motoru
- Fiyat karti cekme/esitleme
- Kontor optimizasyonu (cache stratejisi)
