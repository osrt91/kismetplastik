# Full CMS: Admin Panelinden Tum Icerik Yonetimi

**Tarih:** 2026-03-13
**Durum:** Onaylandi (v2 — review sonrasi duzeltilmis)
**Amac:** Sitedeki tum hardcoded icerigi admin panelinden yonetilebilir hale getirmek.

---

## Ozet

Mevcut yapida icerik %40 admin-managed, %60 hardcoded. Bu tasarim **mevcut Supabase tablolarini kullanarak** tum icerigi admin panelinden yonetilebilir kilar.

- **Yaklasim:** Genel ayarlar tek sayfada + sayfa icerikleri sayfa bazli editorlerde
- **Dil:** TR + EN admin'den yonetilir, diger 9 locale Google Translate API ile otomatik cevirilir
- **Editor:** Basit form (input/textarea)
- **Lokaller:** tr, en, ar, ru, fr, de, es, zh, ja, ko, pt (11 toplam)

---

## 1. Veritabani Mimarisi

### 1.1 Mevcut Tablolar (Degisiklik Yok, Sadece Veri Eklenir)

Bu tablolar zaten Supabase'de tanimli ve TypeScript tipleri `src/types/database.ts`'de mevcut:

| Tablo | TypeScript Tipi | Admin Sayfasi | Durum |
|-------|----------------|--------------|-------|
| `site_settings` | `DbSiteSetting` (key, value: string, group) | `/admin/settings` | Calisiyor, genisletilecek |
| `content_sections` | `DbContentSection` (section_key, title_tr/en, subtitle_tr/en, content_tr/en, cta_text_tr/en, cta_url, image_url, metadata) | `/admin/content` (stub) | Tablo var, sayfa yarim |
| `faq_items` | `DbFaqItem` (question_tr/en, answer_tr/en, category, display_order) | `/admin/content` (FAQ tab) | Tablo var, SSS sayfasina baglanmamis |
| `career_listings` | `DbCareerListing` (title_tr/en, description_tr/en, department, requirements_tr/en) | `/admin/content` (careers tab) | Tablo var, kariyer sayfasina baglanmamis |
| `certificates` | `DbCertificate` (name_tr/en, description_tr/en, icon, pdf_url, issuer, valid_until) | `/admin/certificates` (stub) | Tablo var, sertifikalar sayfasi statik dosyadan okuyor |
| `trade_shows` | `DbTradeShow` (name_tr/en, description_tr/en, location_tr/en, start_date, end_date, booth, website, status) | `/admin/tradeshows` (stub) | Tablo var, fuarlar sayfasi statik dosyadan okuyor |
| `resources` | `DbResource` (title_tr/en, description_tr/en, file_url, page_count, category_tr/en) | `/admin/resources` (stub) | Tablo var, kaynaklar sayfasi statik dosyadan okuyor |
| `references` | `DbReference` (name, logo_url, sector_tr/en, website) | `/admin/references` | Calisiyor |
| `milestones` | `DbMilestone` (year, title_tr/en, description_tr/en, icon) | `/admin/milestones` | Calisiyor |

### 1.2 Yeni Tablo: `translations`

Otomatik ceviri sistemi icin. TR/EN disindaki 9 dil icin ceviri saklama.

```sql
CREATE TABLE translations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  source_table TEXT NOT NULL,
  source_id UUID NOT NULL,
  field_name TEXT NOT NULL,
  locale TEXT NOT NULL,
  translated_text TEXT NOT NULL,
  is_manual BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(source_table, source_id, field_name, locale)
);

CREATE INDEX idx_translations_lookup ON translations(source_table, source_id, locale);

ALTER TABLE translations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON translations FOR SELECT USING (true);
CREATE POLICY "Service role write" ON translations FOR ALL USING (auth.role() = 'service_role');
```

### 1.3 Yeni Tablo: `glossary_terms`

Ambalaj sozlugu icin (mevcut DB'de tablo yok, sayfa stub durumunda).

```sql
CREATE TABLE glossary_terms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  term_tr TEXT NOT NULL,
  term_en TEXT NOT NULL DEFAULT '',
  definition_tr TEXT NOT NULL,
  definition_en TEXT NOT NULL DEFAULT '',
  letter TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_glossary_letter ON glossary_terms(letter);

ALTER TABLE glossary_terms ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read active" ON glossary_terms FOR SELECT USING (is_active = true);
CREATE POLICY "Service role write" ON glossary_terms FOR ALL USING (auth.role() = 'service_role');
```

### 1.4 `site_settings` Genisletme

Mevcut sema korunur: `(id, key, value: string, group: string, created_at, updated_at)`

**Yeni key'ler eklenecek (mevcut gruplara + yeni gruplar):**

Mevcut gruplar (admin/settings zaten destekliyor):
- `company`: company_name, company_address, company_phone, company_email, company_tax_number, company_tax_office
- `social`: social_instagram, social_linkedin, social_facebook, social_youtube, social_twitter
- `contact`: whatsapp_number, whatsapp_hours
- `analytics`: google_analytics_id
- `branding`: logo_url
- `system`: maintenance_mode

**Yeni key'ler (yeni grup: `stats`):**

| key | group | value (ornek) | Aciklama |
|-----|-------|---------------|----------|
| `stats_experience_years` | stats | `57` | Tecrube yili |
| `stats_products` | stats | `500` | Urun sayisi |
| `stats_capacity` | stats | `50M` | Uretim kapasitesi |
| `stats_customers` | stats | `1000` | Musteri sayisi |
| `experience_badge` | stats | `57+` | Badge metni |
| `working_hours` | contact | `Pzt-Cum 09:00 - 18:00` | Calisma saatleri |
| `working_hours_en` | contact | `Mon-Fri 09:00 - 18:00` | Calisma saatleri EN |
| `company_address_en` | company | `Ikitelli OSB District...` | Adres EN |
| `google_maps_url` | contact | `https://maps...` | Harita embed URL |

### 1.5 `content_sections` Kullanim Plani

Mevcut sema: `(id, section_key, title_tr, title_en, subtitle_tr, subtitle_en, content_tr, content_en, cta_text_tr, cta_text_en, cta_url, image_url, display_order, is_active, metadata)`

Bu tablo hem sayfa baslik/metinleri hem de tekrarlanan icerik bloklari icin kullanilacak.

**section_key Adlandirma Kurali:** `{sayfa}_{bolum}` veya `{sayfa}_{bolum}_{sira}`

**Ana Sayfa icerikleri:**
- `home_hero` — title: baslik, subtitle: alt baslik, content: badge metni, cta_text: CTA buton
- `home_categories` — title: bolum basligi, subtitle: alt baslik
- `home_cta` — title: baslik, subtitle: alt baslik, content: not metni
- `home_about` — content: about lead paragraf 1, metadata: `{ lead2: "..." }`
- `home_feature_1` ... `home_feature_6` — title: ozellik basligi, content: aciklama, metadata: `{ icon: "..." }`
- `home_strength_1` ... `home_strength_6` — title: guclu yan basligi, content: aciklama
- `home_sector_1` ... `home_sector_6` — title: sektor adi, content: aciklama, image_url: gorsel, metadata: `{ icon: "..." }`

**Hakkimizda sayfasi:**
- `about_hero` — title/subtitle
- `about_story` — title, content (paragraf 1), metadata: `{ p2: "..." }`
- `about_mission` — title, content
- `about_vision` — title, content
- `about_value_1` ... `about_value_4` — title, content, metadata: `{ icon }`

**Kalite sayfasi:**
- `quality_hero` — title/subtitle/content
- `quality_process` — title (bolum basligi)
- `quality_lab` — title, content

**Uretim sayfasi:**
- `production_hero` — title/subtitle/content
- `production_process` — title (bolum basligi)

**Iletisim sayfasi:**
- `contact_hero` — title/subtitle/content (form aciklamasi)

**Vizyon-Misyon:**
- `vision_hero` — title
- `vision_vision` — title, content
- `vision_mission` — title, content

**Surdurulebilirlik:**
- `sustainability_hero` — title/subtitle/content
- `sustainability_goal_1` ... — title, content, metadata: `{ icon }`

**KVKK:**
- `kvkk_content` — content (tam metin)

**Tarihce:**
- `history_hero` — title/subtitle/content

**Ar-Ge:**
- `rnd_hero` — title/subtitle/content
- `rnd_tech_1` ... — title, content, metadata: `{ icon }`

**Sektorler:**
- `sectors_hero` — title/subtitle
- `sectors_sector_1` ... `sectors_sector_6` — title, content, image_url, metadata: `{ icon }`

**Kariyer:**
- `career_hero` — title/subtitle/content
- `career_perk_1` ... `career_perk_4` — title, content, metadata: `{ icon }`

**Katalog:**
- `catalog_hero` — title/subtitle/content

**Referanslar:**
- `references_hero` — title/subtitle
- `references_stats` — metadata: `{ customers, countries, sectors }`

**Fabrika:**
- `factory_hero` — title/subtitle/content

**Teklif Al:**
- `quote_hero` — title/subtitle/content
- `quote_benefit_1` ... — title, content, metadata: `{ icon }`

**Numune Talep:**
- `sample_hero` — title/subtitle/content

**On-Siparis:**
- `preorder_hero` — title/subtitle/content

### 1.6 Surec Adimlari (process_steps)

Kalite ve uretim surec adimlari `content_sections` tablosunda:

- `quality_step_1` ... `quality_step_4` — title, content, metadata: `{ icon, step_number }`
- `production_step_1` ... `production_step_4` — title, content, metadata: `{ icon, step_number }`

---

## 2. Admin Panel Sayfalari

### 2.1 `/admin/settings` — Genisletme

Mevcut calisma sekli korunur. **Yeni grup eklenir:**

```typescript
{
  id: "stats",
  label: "Istatistikler",
  icon: TrendingUp,
  fields: [
    { key: "stats_experience_years", label: "Tecrube Yili", type: "text" },
    { key: "stats_products", label: "Urun Sayisi", type: "text" },
    { key: "stats_capacity", label: "Uretim Kapasitesi", type: "text" },
    { key: "stats_customers", label: "Musteri Sayisi", type: "text" },
    { key: "experience_badge", label: "Badge Metni (ornegin 57+)", type: "text" },
  ],
}
```

Mevcut `contact` grubuna ekle:
- `working_hours`, `working_hours_en`, `google_maps_url`

Mevcut `company` grubuna ekle:
- `company_address_en`

### 2.2 `/admin/pages` — Yeni Sayfa

**Sol sidebar:** Sayfa listesi (16 sayfa)
**Sag panel:** Secili sayfanin `content_sections` satirlari form alanlari olarak

Her section icin:
- Label (section_key'den turetilir, ornegin "Hero Baslik", "Hikaye Paragraf 1")
- TR input/textarea
- EN input/textarea
- metadata alanlari (ikon secici, gorsel URL)

**Sayfa listesi:**
Ana Sayfa, Hakkimizda, Kalite, Uretim, Iletisim, Vizyon-Misyon, Surdurulebilirlik, KVKK, Tarihce, Ar-Ge, Sektorler, Kariyer, Katalog, Referanslar, Fabrika, Teklif Al

**Isleyis:**
- Sayfa secilince `content_sections` tablosundan `section_key LIKE '{page}_%'` ile cekilir
- Her alan duzenlenip "Kaydet" denilince upsert yapilir
- Kaydet → otomatik ceviri tetiklenir (diger 9 dil)

### 2.3 Mevcut Admin Sayfalari — Tamamlanacaklar

Bu sayfalarin stub/yarim kisimlari tam calisir hale getirilecek:

| Sayfa | Mevcut Durum | Yapilacak |
|-------|-------------|-----------|
| `/admin/certificates` | Tam CRUD calisiyor | Frontend sayfayi DB'den okumaya cevir |
| `/admin/tradeshows` | Tam CRUD calisiyor | Frontend sayfayi DB'den okumaya cevir |
| `/admin/resources` | Tam CRUD calisiyor | Frontend sayfayi DB'den okumaya cevir |
| `/admin/content` FAQ tab | Admin'de var, SSS sayfasina baglanmamis | SSS sayfasini `faq_items` tablosundan okumaya cevir |
| `/admin/content` careers tab | Admin'de var, kariyer sayfasina baglanmamis | Kariyer sayfasini `career_listings` tablosundan okumaya cevir |

### 2.4 Yeni: `/admin/glossary` — Ambalaj Sozlugu Yonetimi

Tablo: `glossary_terms`
- Terim TR/EN, tanim TR/EN, harf, siralama, aktif/pasif
- Tablo listesi + ekle/duzenle/sil
- Harf bazli filtreleme

### 2.5 Admin Navigasyon Guncelleme

Admin sidebar'a eklenir:
- "Sayfa Icerikleri" → `/admin/pages` (yeni)
- "Sozluk" → `/admin/glossary` (yeni)

---

## 3. Frontend Entegrasyonu

### 3.1 Yeni Utility Fonksiyonlari: `src/lib/content.ts`

```typescript
// site_settings tablosundan tum ayarlari ceker (ISR 60sn cache)
export async function getSettings(): Promise<Record<string, string>>

// content_sections tablosundan bir sayfanin tum bolumlerini ceker
// ornek: getPageContent("home") → { home_hero: {...}, home_feature_1: {...}, ... }
export async function getPageContent(pagePrefix: string): Promise<Record<string, DbContentSection>>

// Belirli tablodan veri ceker (sertifikalar, fuarlar, vb.)
export async function getCertificates(): Promise<DbCertificate[]>
export async function getTradeShows(): Promise<DbTradeShow[]>
export async function getResources(): Promise<DbResource[]>
export async function getFaqItems(): Promise<DbFaqItem[]>
export async function getCareerListings(): Promise<DbCareerListing[]>
export async function getGlossaryTerms(): Promise<GlossaryTerm[]>

// Locale'e gore dogru dili doner
// TR: content_tr, EN: content_en
// Diger 9 dil: translations tablosundan bakar, yoksa EN'e fallback
export function getLocalizedField(item: { [key: string]: any }, field: string, locale: string): string
```

### 3.2 Guncellenecek Componentler

**A. Settings'den Okuyanlar (iletisim bilgileri, istatistikler):**

| Component | Mevcut Kaynak | Yeni Kaynak |
|-----------|--------------|-------------|
| `layout/Footer.tsx` | Hardcoded telefon/adres/email | `getSettings()` |
| `sections/Stats.tsx` | Hardcoded rakamlar (55, 500, 1000, 50M) | `getSettings()` → stats_* |
| `sections/Hero.tsx` | Hardcoded "60+" badge | `getSettings()` → experience_badge |
| `sections/About.tsx` | Hardcoded "60+" badge | `getSettings()` → experience_badge |
| `[locale]/iletisim/page.tsx` | Hardcoded telefon/adres | `getSettings()` |
| `components/public/TrustBar.tsx` | Hardcoded 57/8/2000/500 | `getSettings()` → stats_* |

**B. content_sections'dan Okuyanlar (sayfa metinleri):**

| Sayfa/Component | Mevcut Kaynak | Yeni section_key prefix |
|----------------|--------------|----------------------|
| `sections/Hero.tsx` | `dict.home.*` | `home_hero` |
| `sections/About.tsx` | `dict.about.*` | `home_about` |
| `sections/WhyUs.tsx` | `dict.homeFeatures.*` | `home_feature_*` |
| `sections/Sectors.tsx` | `dict.homeSectors.*` | `home_sector_*` |
| `sections/Categories.tsx` | `dict.homeCategories.*` | `home_categories` |
| `sections/CTA.tsx` | `dict.home.cta*` | `home_cta` |
| `[locale]/hakkimizda/page.tsx` | `dict.about.*` | `about_*` |
| `[locale]/kalite/page.tsx` | `dict.quality.*` + hardcoded | `quality_*` |
| `[locale]/uretim/page.tsx` | `dict.production.*` + hardcoded | `production_*` |
| `[locale]/iletisim/page.tsx` | `dict.contact.*` | `contact_hero` |
| `[locale]/vizyon-misyon/page.tsx` | `dict.about.*` | `vision_*` |
| `[locale]/surdurulebilirlik/page.tsx` | Hardcoded | `sustainability_*` |
| `[locale]/kvkk/page.tsx` | Hardcoded | `kvkk_content` |
| `[locale]/tarihce/page.tsx` | `dict` + hardcoded | `history_hero` |
| `[locale]/arge/page.tsx` | Hardcoded | `rnd_*` |
| `[locale]/sektorler/page.tsx` | `dict.homeSectors.*` | `sectors_*` |
| `[locale]/kariyer/page.tsx` | Hardcoded positions/perks | `career_*` + `career_listings` tablo |
| `[locale]/katalog/page.tsx` | Hardcoded catalogs[] | `catalog_hero` + `resources` tablo |
| `[locale]/referanslar/page.tsx` | Hardcoded stats + DB refs | `references_*` + `references` tablo |
| `[locale]/fabrika/page.tsx` | Hardcoded | `factory_hero` |
| `[locale]/teklif-al/page.tsx` | `dict.quote.*` + hardcoded | `quote_*` |
| `[locale]/numune-talep/page.tsx` | Hardcoded | `sample_hero` |
| `[locale]/on-siparis/page.tsx` | Hardcoded | `preorder_hero` |

**C. Mevcut Tablolardan Okuyanlar (statik dosya yerine DB):**

| Sayfa | Mevcut Kaynak | Yeni Kaynak (DB tablosu) |
|-------|--------------|-------------------------|
| `[locale]/sss/page.tsx` | Hardcoded faqData[] | `faq_items` tablosu |
| `[locale]/sertifikalar/page.tsx` | `src/data/certificates.ts` | `certificates` tablosu |
| `[locale]/fuarlar/page.tsx` | `src/data/trade-shows.ts` | `trade_shows` tablosu |
| `[locale]/kaynaklar/page.tsx` | `src/data/resources.ts` | `resources` tablosu |
| `[locale]/ambalaj-sozlugu/page.tsx` | Stub sayfa | `glossary_terms` tablosu (yeni) |
| `[locale]/kariyer/page.tsx` | Hardcoded positions[] | `career_listings` tablosu |
| `[locale]/kalite/page.tsx` (surec adimlari) | Hardcoded steps[] | `content_sections` (quality_step_*) |
| `[locale]/uretim/page.tsx` (surec adimlari) | Hardcoded steps[] | `content_sections` (production_step_*) |
| `components/ui/ReferenceLogos.tsx` | `src/data/references.ts` | `references` tablosu |
| `components/sections/Testimonials.tsx` | Hardcoded referenceCompanies[] | `references` tablosu |

### 3.3 Icerik Kaynagi Siniri

**DB'ye tasinacaklar (bu spec kapsaminda):**
- Tum sayfa metinleri (basliklar, paragraflar, aciklamalar)
- Iletisim bilgileri (telefon, adres, email, calisma saatleri)
- Istatistikler (tecrube yili, urun sayisi, kapasite, musteri sayisi)
- FAQ sorulari/cevaplari
- Sertifika, fuar, kaynak, referans, milestone listeleri
- Surec adimlari (kalite, uretim)
- Ambalaj sozlugu terimleri
- Kariyer ilanlari

**JSON ceviri dosyalarinda kalacaklar (`tr.json`/`en.json`):**
- Navigasyon menu etiketleri (nav.*)
- Form etiketleri ve placeholder'lar (contact.form.*, quote.form.*)
- Buton metinleri (common.submit, common.cancel, common.loading)
- Hata mesajlari (errors.*)
- Tablo baslik/etiketleri (dealer portal: orders.*, quotes.*)
- Filter/sort etiketleri (products.filters.*)
- Footer statik etiketler (footer.copyright, footer.quickLinks)
- Birim/format etiketleri (productData.ml, productData.mm)

**Silme:** JSON dosyalarindaki sayfa icerik key'leri (home.heroHeading, about.storyP1 vb.) DB'ye aktarildiktan sonra silinecek.

### 3.4 Silinecek Statik Dosyalar (migration sonrasi)

- `src/data/certificates.ts` → `certificates` tablosuna aktarilacak
- `src/data/trade-shows.ts` → `trade_shows` tablosuna aktarilacak
- `src/data/resources.ts` → `resources` tablosuna aktarilacak
- `src/data/references.ts` → `references` tablosuna aktarilacak (zaten DB'de de var)
- `src/data/milestones.ts` → `milestones` tablosuna aktarilacak (zaten DB'de de var)

**Kalacaklar:**
- `src/data/products.ts` — import script referansi
- `src/data/blog.ts` — import script referansi

---

## 4. Otomatik Ceviri Sistemi

### 4.1 API Route: `POST /api/admin/translate`

```
Request: {
  source_table: string,  // "content_sections", "faq_items", vb.
  source_id: string,     // kayit UUID
  fields: { field_name: string, text_tr: string, text_en: string }[]
}
Response: { success: true, translated_count: number }
```

### 4.2 Akis

1. Admin icerik kaydeder (TR + EN)
2. Kaydet handler'i → `/api/admin/translate` cagirir
3. Google Translate API: TR → ar, ru, fr, de, es, zh, ja, ko, pt (9 dil)
4. Ceviriler `translations` tablosuna upsert edilir
5. Frontend: locale TR/EN ise direkt tablo kolonu, diger dillerde `translations` tablosundan

### 4.3 Google Translate API Entegrasyonu

- Yeni env degiskeni: `GOOGLE_TRANSLATE_API_KEY`
- Google Cloud Translation API v2 (Basic)
- Batch ceviri: tek istekte birden fazla metin
- Maliyet: ~$20/milyon karakter
- Ceviri sadece "Kaydet" butonunda tetiklenir
- Admin `/admin/translations`'dan manual ceviri duzeltebilir (is_manual = true, uzerine yazilmaz)
- NOT: Mevcut `/admin/translations` sayfasi JSON dosya editoru olarak kalir (UI label'lari icin). Yeni `translations` DB tablosu sadece CMS icerik otomatik cevirisi icindir — iki farkli sistem.

### 4.5 On-Kosul: Locale Duzeltme

Mevcut `/admin/translations/page.tsx` ve `/api/admin/translations/route.ts` dosyalarindaki SUPPORTED_LOCALES dizisinde `it` (Italyanca) var ama `ko` (Korece) ve `pt` (Portekizce) eksik. Bu, `locales.ts` ile uyumsuz. Migration Adim 3'te duzeltilecek.

### 4.4 Locale Listesi (locales.ts ile senkron)

Kaynak: tr, en (admin girer)
Otomatik ceviri hedef: ar, ru, fr, de, es, zh, ja, ko, pt (9 dil)

---

## 5. Cache Stratejisi

### 5.1 ISR Cache (Next.js fetch cache)

| Veri | Cache Tag | Revalidate |
|------|-----------|-----------|
| `getSettings()` | `site-settings` | 60sn |
| `getPageContent(prefix)` | `page-content-{prefix}` | 60sn |
| Sertifikalar | `certificates` | 60sn |
| Fuarlar | `trade-shows` | 60sn |
| Kaynaklar | `resources` | 60sn |
| FAQ | `faq-items` | 60sn |
| Kariyer | `career-listings` | 60sn |
| Sozluk | `glossary-terms` | 60sn |
| Ceviriler | `translations-{table}-{id}` | 60sn |

### 5.2 Cache Invalidation

Admin kaydet API'lerinde `revalidateTag()` cagirilir:

```typescript
// /api/admin/settings PUT handler sonrasi
revalidateTag("site-settings");

// /api/admin/pages/{page} PUT handler sonrasi
revalidateTag(`page-content-${pageKey}`);

// /api/admin/certificates PUT/POST/DELETE sonrasi
revalidateTag("certificates");
```

---

## 6. Migration Plani (Implementation Adimlari)

### Adim 1: DB Migration
- `glossary_terms` tablosu olustur
- `translations` tablosu olustur
- RLS politikalari ekle
- `site_settings`'e yeni key'leri seed et
- `content_sections`'a tum sayfa iceriklerini seed et (mevcut hardcoded degerlerden)
- `faq_items`'a mevcut hardcoded FAQ verilerini seed et
- `certificates`, `trade_shows`, `resources` tablolarina statik dosya verilerini seed et
- `glossary_terms`'e terim verilerini seed et
- database.ts tiplerini guncelle (GlossaryTerm ekle)

### Adim 2: Utility Fonksiyonlari
- `src/lib/content.ts` olustur (getSettings, getPageContent, get*List fonksiyonlari, getLocalizedField)

### Adim 3: Admin Panel Guncellemeleri
- `/admin/settings` — stats grubu ekle, contact grubuna working_hours/google_maps ekle
- `/admin/pages` — yeni sayfa (content_sections CRUD)
- `/admin/certificates` — stub'dan tam CRUD'a
- `/admin/tradeshows` — stub'dan tam CRUD'a
- `/admin/resources` — stub'dan tam CRUD'a
- `/admin/glossary` — yeni sayfa
- `/admin/content` FAQ tab → `faq_items` CRUD tamam mi kontrol et
- Admin sidebar navigasyon guncelle

### Adim 4: Frontend Component Guncellemeleri
- Settings kullanan componentler (Footer, Stats, Hero, About, TrustBar, Iletisim)
- content_sections kullanan sayfalar (23+ sayfa)
- DB tablosu kullanan sayfalar (SSS, Sertifikalar, Fuarlar, Kaynaklar, Sozluk, Kariyer)
- ReferenceLogos + Testimonials → references tablosundan

### Adim 5: Otomatik Ceviri
- Google Translate API entegrasyonu (`src/lib/translate.ts`)
- `/api/admin/translate` route
- Admin kaydet islemlerine ceviri tetikleme entegrasyonu
- `getLocalizedField()` fonksiyonunda translations tablosu lookup

### Adim 6: Temizlik
- Statik veri dosyalarini sil (certificates.ts, trade-shows.ts, resources.ts, references.ts, milestones.ts)
- JSON ceviri dosyalarindan sayfa icerik key'lerini temizle
- Eski/kullanilmayan admin stub kodlarini temizle

---

## 7. Kapsam Disi

- Blog yonetimi (zaten tam calisiyor)
- Urun yonetimi (zaten tam calisiyor)
- Galeri/referans/milestone yonetimi (zaten calisiyor — sadece frontend baglantisi yapilacak)
- Navigasyon menu yapisini admin'den degistirme
- Tema/renk degisikligi admin'den
- Bayi portal icerik yonetimi (portal icerikleri JSON'da kalir)

---

## 8. TypeScript Tip Guncellemeleri

`src/types/database.ts`'ye eklenecek:

```typescript
export interface GlossaryTerm {
  id: string;
  term_tr: string;
  term_en: string;
  definition_tr: string;
  definition_en: string;
  letter: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Translation {
  id: string;
  source_table: string;
  source_id: string;
  field_name: string;
  locale: string;
  translated_text: string;
  is_manual: boolean;
  created_at: string;
  updated_at: string;
}
```

Database interface'e ekle:
```typescript
glossary_terms: { Row: GlossaryTerm; ... }
translations: { Row: Translation; ... }
```
