# B2B Platform UI Donusumu - Tasarim Dokumani

**Tarih:** 2026-03-05
**Proje:** Kismet Plastik B2B Web Platform
**Yaklasim:** Progressive Disclosure (Public Vitrin + Bayi Portal)

---

## 1. Vizyon

57 yillik bir firma olarak hem yeni musteri kazanimi hem mevcut bayilere guclu self-servis portal sunmak. "AI yapmis gibi" gorunen template hissini kirip, ozgun, premium ve fonksiyonel bir B2B platform olusturmak.

## 2. Kullanici Tipleri

| Tip | Ihtiyac | Deneyim |
|-----|---------|---------|
| Ziyaretci | Firmay tanimak, urunleri gormek | Public site - vitrin |
| Potansiyel Musteri | Teklif almak, bayi olmak | Public site - CTA'lar |
| Mevcut Bayi | Siparis vermek, takip etmek | Portal - is araci |
| Admin | Yonetim, DIA sync | Admin panel |

## 3. Public Site Tasarimi

### 3.1 Tasarim Felsefesi
- Asimetrik layoutlar (simetrik grid'lerden kacin)
- Degisken spacing - siki bolumler + nefes alan bolumler
- Fonksiyonel animasyonlar (dekoratif degil)
- Gercek icerik alanlari (3D viewer placeholder, fabrika foto placeholder)

### 3.2 Homepage Akisi
1. **Hero** - Tam ekran, asimetrik layout, 3D urun viewer placeholder, cesur tipografi
2. **Guven Bari** - "57 Yil | 8 Ulke | 2000+ Urun | 500+ Bayi" count-up
3. **Urun Kategorileri** - Horizontal scroll carousel, 8 kategori
4. **Neden Biz** - Timeline/akis formati (Hammadde > Uretim > Kalite > Teslimat)
5. **Sektorler** - Sektore ozel urun onerileri ile expandable kartlar
6. **CTA Bolumu** - "Bayimiz Olun" navy arka plan, amber accent
7. **Footer** - Mevcut yapi korunur, tutarlilik duzeltmeleri

### 3.3 Tipografi
- **Display:** Fraunces (serif, kisilikli) - basliklar, hero text
- **Body:** Instrument Sans (modern, okunabilir) - paragraflar, UI text
- **Mono:** JetBrains Mono - urun kodlari, fiyat, teknik spec

### 3.4 Renk Kullanimi
- Navy (#0A1628) - sadece onemli bolumlerde (hero, CTA, footer)
- Amber (#F59E0B) - sadece aksiyon noktalarinda
- Cream (#FAFAF7) - baskin arka plan (sicak, beyaz degil)

### 3.5 "AI Template" Hissini Kiran Kurallar
- Simetrik grid yerine asimetrik layout
- Her bolumdeki padding/gap farkli
- Dekoratif particle/orb kaldirilacak
- Kart hover efektleri baglama ozel
- Gercek copy yazimi (somut rakamlar, hikaye)

## 4. Bayi Portal Tasarimi

### 4.1 Tasarim Felsefesi
Is araci - guzel ama gosterissiz, hizli ama guclu. Linear + Shopify B2B arasi.

### 4.2 Layout
- Sol sidebar (collapsible, 240px): Logo + navigasyon + bayi bilgisi
- Ust bar: Arama + bildirimler + sepet + profil
- Ana alan: Genis cream/beyaz content area

### 4.3 Navigasyon
- Dashboard
- Urunler (Katalog)
- Hizli Siparis
- Sepetim
- Siparislerim
- Tekliflerim
- Faturalarim
- Profilim
- Destek

### 4.4 Sayfa Detaylari

#### Dashboard
- Karsilama mesaji + firma adi
- 4 ozet kart: Aktif Siparisler | Bekleyen Teklifler | Odenmemis Faturalar | Son 30 Gun Ciro
- Son siparisler tablosu (5 satir)
- Hizli aksiyonlar: "Yeni Siparis" + "Teklif Iste"

#### Urun Katalogu (Sepet Modu)
- Sol: Kategori filtreleri (8 kategori + alt filtreler)
- Sag: Urun grid'i - gorsel + ad + kod + bayinin ozel fiyati
- Kart uzerinde: miktar input + "Sepete Ekle"
- Urun detay: 3D viewer alani, teknik ozellikler, hacim kademeli fiyat tablosu

#### Hizli Siparis Formu
- Excel benzeri tablo: Urun Kodu | Urun Adi (autocomplete) | Miktar | Birim Fiyat | Toplam
- "Satir Ekle" butonu
- "Excel'den Yapistir" ozelligi
- "Siparise Donustur" veya "Teklif Iste"

#### Teklif Akisi
- Bayi urun secer > "Teklif Iste" > Admin bildirim > Fiyat belirleme > Bayi bildirim > Onay/Red

#### Siparis Takibi
- Tablo: Siparis No | Tarih | Urun Sayisi | Toplam | Durum
- Durum badge'leri: Beklemede | Onaylandi | Uretimde | Kargoda | Teslim Edildi
- Detay: Timeline gorunumu, siparis kalemleri, fatura linki

#### Fatura Takibi
- DIA'dan senkronize
- Tablo: Fatura No | Tarih | Vade | Tutar | Durum
- PDF indirme, gecikmis fatura vurgu

### 4.5 Fiyatlandirma
- Giris yapilmamis: Fiyat gizli
- Bayi girisi: Kendi ozel fiyatini gorur (DIA'dan)
- Hacim kademeli fiyat tablosu urun detayda

### 4.6 Portal Renk Kullanimi
- Sidebar: Navy (#0A1628)
- Icerik alani: Cream (#FAFAF7) uzerine beyaz kartlar
- Primary CTA: Amber butonlar
- Secondary: Navy outline
- Durum renkleri: Yesil/Sari/Kirmizi/Mavi (marka renginden bagimsiz)

## 5. Siparis Akislari

### Akis A: Katalog + Sepet
Bayi > Katalog > Urunu bul > Sepete ekle > Sepeti incele > Siparis ver

### Akis B: Hizli Siparis
Bayi > Hizli Siparis Formu > Urun kodu + miktar > Siparis ver

### Akis C: Teklif Bazli
Bayi > Urun sec > Teklif iste > Admin yanitlar > Bayi onaylar > Siparise donusur

### Akis D: Excel Import
Bayi > Hizli Siparis > Excel yapistir > Kontrol et > Siparis ver

## 6. Teknik Altyapi

### 6.1 Route Yapisi
```
src/app/
  [locale]/              - Public site
  [locale]/bayi-panel/   - Portal (sidebar layout)
    page.tsx             - Dashboard
    urunler/             - Katalog
    hizli-siparis/       - Hizli siparis formu (yeni)
    siparislerim/        - Siparis takibi
    tekliflerim/         - Teklif yonetimi
    faturalarim/         - Fatura takibi
    profilim/            - Profil ayarlari
  admin/                 - Admin panel (mevcut)
```

### 6.2 Component Mimarisi
```
src/components/
  public/     - Public site bilesenler (vitrin)
  portal/     - Bayi portal bilesenler
  shared/     - Ortak bilesenler (3D viewer, ProductCard, PriceDisplay)
  ui/         - shadcn/ui (mevcut, korunur)
```

### 6.3 DIA v3 Entegrasyonu
- dia-client.ts yeniden yazilacak (session-based, /api/v3/sis/json)
- Servis cagrilari: scf_stokkart_listele, scf_carikart_getir, scf_siparis_ekle
- API Key gerekli (firma yetkilisinden alinacak)

### 6.4 3D Viewer
- Mevcut Three.js / React Three Fiber + Drei kullanilacak
- ProductViewer3D component - .glb/.gltf dosya alir
- Placeholder: Urun fotografi gosterir, 3D model yuklenince gecis
- Lazy load

## 7. Oncelik Sirasi

1. Tasarim sistemi (tipografi, renk, spacing tokenlari)
2. Public site homepage refactor
3. Portal layout (sidebar + dashboard)
4. Urun katalogu (public + portal)
5. Siparis sistemi (sepet + hizli form)
6. Teklif sistemi
7. DIA entegrasyonu (API key alindiginda)
8. Fatura sistemi
9. 3D viewer entegrasyonu (taramalar hazir oldiginda)
10. Performance & polish
