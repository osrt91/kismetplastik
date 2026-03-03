# Veritabani Semasi

Kismet Plastik B2B platformunun Supabase (PostgreSQL) veritabani semasi.

## Migration Dosyalari

| # | Dosya | Aciklama |
|---|-------|----------|
| 1 | `docs/supabase-schema.sql` | Baslangic semasi: categories, products, blog_posts |
| 2 | `docs/supabase-migration-002.sql` | B2B portal: profiles, orders, quotes, enum'lar |
| 3 | `docs/supabase-migration-003.sql` | Galeri sistemi: gallery_images + storage bucket |
| - | `supabase/migrations/001_initial_schema.sql` | Konsolide sema (tum tablolar tek dosyada) |

> **Not:** Yeni kurulumda sadece `supabase/migrations/001_initial_schema.sql` calistirilmasi yeterlidir.

---

## Iliski Diyagrami

```mermaid
erDiagram
    auth_users ||--o| profiles : "id = id"
    profiles ||--o{ orders : "id = profile_id"
    profiles ||--o{ quote_requests : "id = profile_id"
    orders ||--|{ order_items : "id = order_id"
    orders ||--o{ order_status_history : "id = order_id"
    quote_requests ||--|{ quote_items : "id = quote_request_id"
    categories ||--o{ products : "slug = category_slug"
    products ||--o{ order_items : "id = product_id"
    products ||--o{ quote_items : "id = product_id"

    categories {
        uuid id PK
        text slug UK
        text name
        text description
        int product_count
        text icon
        timestamptz created_at
    }

    products {
        uuid id PK
        text slug UK
        text name
        text category_slug FK
        text description
        text short_description
        text volume
        text weight
        text neck_diameter
        text height
        text diameter
        text material
        text_array colors
        jsonb color_codes
        text model
        text shape
        text surface_type
        text_array compatible_caps
        int min_order
        boolean in_stock
        boolean featured
        jsonb specs
        timestamptz created_at
        timestamptz updated_at
    }

    profiles {
        uuid id PK_FK
        text email
        text full_name
        text phone
        text company_name
        text tax_number
        text tax_office
        text company_address
        text city
        text district
        text role
        boolean is_approved
        timestamptz created_at
    }

    orders {
        uuid id PK
        uuid profile_id FK
        text order_number UK
        text status
        text shipping_address
        text billing_address
        numeric subtotal
        numeric tax_amount
        numeric shipping_cost
        numeric total_amount
        text payment_method
        text payment_status
        text notes
        timestamptz created_at
    }

    order_items {
        uuid id PK
        uuid order_id FK
        uuid product_id FK
        text product_name
        int quantity
        numeric unit_price
        numeric total_price
        text notes
    }

    order_status_history {
        uuid id PK
        uuid order_id FK
        text new_status
        text note
        timestamptz created_at
    }

    quote_requests {
        uuid id PK
        text company_name
        text contact_name
        text email
        text phone
        text message
        text status
        timestamptz created_at
    }

    quote_items {
        uuid id PK
        uuid quote_request_id FK
        uuid product_id FK
        text product_name
        int quantity
        text notes
    }

    blog_posts {
        uuid id PK
        text slug UK
        text title
        text excerpt
        text_array content
        text category
        date date
        text read_time
        boolean featured
        timestamptz created_at
        timestamptz updated_at
    }

    gallery_images {
        uuid id PK
        text category
        text title_tr
        text title_en
        text description_tr
        text description_en
        text image_url
        text storage_path
        int display_order
        boolean is_active
        timestamptz created_at
    }
```

---

## Tablolar

### 1. categories

Urun kategorileri (8 adet).

| Sutun | Tip | Constraint | Aciklama |
|-------|-----|-----------|----------|
| `id` | UUID | PK, default `uuid_generate_v4()` | Benzersiz kimlik |
| `slug` | TEXT | UNIQUE, NOT NULL | URL dostu isim (`pet-siseler`, `kapaklar`, vb.) |
| `name` | TEXT | NOT NULL | Gosterim adi |
| `description` | TEXT | NOT NULL, default `''` | Kategori aciklamasi |
| `product_count` | INT | NOT NULL, default `0` | Urun sayisi |
| `icon` | TEXT | - | Ikon adi |
| `created_at` | TIMESTAMPTZ | NOT NULL, default `now()` | Olusturma zamani |

**Indexler:** `slug` (unique index)

---

### 2. products

Urun katalogu.

| Sutun | Tip | Constraint | Aciklama |
|-------|-----|-----------|----------|
| `id` | UUID | PK | Benzersiz kimlik |
| `slug` | TEXT | UNIQUE, NOT NULL | URL dostu isim |
| `name` | TEXT | NOT NULL | Urun adi |
| `category_slug` | TEXT | NOT NULL, FK → categories(slug) | Kategori referansi |
| `description` | TEXT | NOT NULL, default `''` | Detayli aciklama |
| `short_description` | TEXT | NOT NULL, default `''` | Kisa aciklama |
| `volume` | TEXT | - | Hacim (ornek: "500ml") |
| `weight` | TEXT | - | Agirlik |
| `neck_diameter` | TEXT | - | Boyun capi (ornek: "28mm") |
| `height` | TEXT | - | Yukseklik |
| `diameter` | TEXT | - | Cap |
| `material` | TEXT | NOT NULL, default `'PET'` | Malzeme |
| `colors` | TEXT[] | NOT NULL, default `'{}'` | Mevcut renkler |
| `color_codes` | JSONB | - | Renk kodlari (`{"Seffaf": "#e8f4fd"}`) |
| `model` | TEXT | - | Model adi |
| `shape` | TEXT | - | Sekil |
| `surface_type` | TEXT | - | Yuzey tipi |
| `compatible_caps` | TEXT[] | - | Uyumlu kapak slug'lari |
| `min_order` | INT | NOT NULL, default `10000` | Minimum siparis adedi |
| `in_stock` | BOOLEAN | NOT NULL, default `true` | Stok durumu |
| `featured` | BOOLEAN | NOT NULL, default `false` | One cikarilan urun |
| `specs` | JSONB | NOT NULL, default `'[]'` | Teknik ozellikler (`[{label, value}]`) |
| `created_at` | TIMESTAMPTZ | NOT NULL, default `now()` | Olusturma zamani |
| `updated_at` | TIMESTAMPTZ | NOT NULL, default `now()` | Guncelleme zamani (trigger) |

**Indexler:** `category_slug`, `featured`, `in_stock`
**Trigger:** `set_updated_at()` — update oncesi `updated_at` otomatik guncellenir

---

### 3. blog_posts

Blog yazilari.

| Sutun | Tip | Constraint | Aciklama |
|-------|-----|-----------|----------|
| `id` | UUID | PK | Benzersiz kimlik |
| `slug` | TEXT | UNIQUE, NOT NULL | URL dostu baslik |
| `title` | TEXT | NOT NULL | Yazi basligi |
| `excerpt` | TEXT | NOT NULL, default `''` | Ozet |
| `content` | TEXT[] | NOT NULL, default `'{}'` | Icerik paragraflari |
| `category` | TEXT | NOT NULL, default `'Bilgi'` | Yazi kategorisi |
| `date` | DATE | NOT NULL, default `CURRENT_DATE` | Yayin tarihi |
| `read_time` | TEXT | NOT NULL, default `'5 dk'` | Okuma suresi |
| `featured` | BOOLEAN | NOT NULL, default `false` | One cikan yazi |
| `created_at` | TIMESTAMPTZ | NOT NULL, default `now()` | Olusturma zamani |
| `updated_at` | TIMESTAMPTZ | NOT NULL, default `now()` | Guncelleme zamani (trigger) |

**Indexler:** `featured`, `date DESC`
**Trigger:** `set_updated_at()`

---

### 4. profiles

Kullanici profilleri. `auth.users` tablosuna 1:1 bagli.

| Sutun | Tip | Constraint | Aciklama |
|-------|-----|-----------|----------|
| `id` | UUID | PK, FK → auth.users(id) ON DELETE CASCADE | Supabase Auth kullanici ID |
| `email` | TEXT | - | E-posta adresi |
| `full_name` | TEXT | - | Ad soyad |
| `phone` | TEXT | - | Telefon |
| `company_name` | TEXT | - | Firma adi |
| `tax_number` | TEXT | - | Vergi numarasi |
| `tax_office` | TEXT | - | Vergi dairesi |
| `company_address` | TEXT | - | Firma adresi |
| `city` | TEXT | - | Sehir |
| `district` | TEXT | - | Ilce |
| `role` | TEXT | NOT NULL, CHECK, default `'customer'` | Rol: `customer`, `dealer`, `admin` |
| `is_approved` | BOOLEAN | NOT NULL, default `false` | Onay durumu (admin onaylar) |
| `created_at` | TIMESTAMPTZ | NOT NULL, default `now()` | Kayit zamani |

**Indexler:** `role`
**Trigger:** `handle_new_user()` — yeni `auth.users` kaydinda otomatik profil olusturur

---

### 5. orders

Bayi siparisleri.

| Sutun | Tip | Constraint | Aciklama |
|-------|-----|-----------|----------|
| `id` | UUID | PK | Benzersiz kimlik |
| `profile_id` | UUID | NOT NULL, FK → profiles(id) | Siparis veren kullanici |
| `order_number` | TEXT | UNIQUE, NOT NULL | Otomatik uretilir (`KP-2026-00001`) |
| `status` | TEXT | NOT NULL, CHECK, default `'pending'` | Siparis durumu |
| `shipping_address` | TEXT | - | Teslimat adresi |
| `billing_address` | TEXT | - | Fatura adresi |
| `subtotal` | NUMERIC(12,2) | NOT NULL, default `0` | Ara toplam |
| `tax_amount` | NUMERIC(12,2) | NOT NULL, default `0` | KDV tutari |
| `shipping_cost` | NUMERIC(12,2) | NOT NULL, default `0` | Kargo ucreti |
| `total_amount` | NUMERIC(12,2) | NOT NULL, default `0` | Toplam tutar |
| `payment_method` | TEXT | NOT NULL, default `'havale'` | Odeme yontemi |
| `payment_status` | TEXT | NOT NULL, CHECK, default `'pending'` | Odeme durumu |
| `notes` | TEXT | - | Musteri notu |
| `created_at` | TIMESTAMPTZ | NOT NULL, default `now()` | Olusturma zamani |

**Indexler:** `profile_id`, `status`
**Trigger:** `generate_order_number()` — insert oncesi siparis numarasi uretir

**Durum degerleri (status):** `pending`, `confirmed`, `preparing`, `shipped`, `delivered`, `cancelled`
**Odeme durumlari (payment_status):** `pending`, `paid`, `refunded`

---

### 6. order_items

Siparis kalemleri.

| Sutun | Tip | Constraint | Aciklama |
|-------|-----|-----------|----------|
| `id` | UUID | PK | Benzersiz kimlik |
| `order_id` | UUID | NOT NULL, FK → orders(id) ON DELETE CASCADE | Ait oldugu siparis |
| `product_id` | UUID | FK → products(id) ON DELETE SET NULL | Urun referansi |
| `product_name` | TEXT | NOT NULL | Urun adi (denormalize) |
| `quantity` | INT | NOT NULL, default `1` | Miktar |
| `unit_price` | NUMERIC(12,2) | NOT NULL, default `0` | Birim fiyat |
| `total_price` | NUMERIC(12,2) | NOT NULL, default `0` | Toplam fiyat |
| `notes` | TEXT | - | Kalem notu |

**Indexler:** `order_id`

---

### 7. order_status_history

Siparis durum gecmisi — her durum degisikligi kaydedilir.

| Sutun | Tip | Constraint | Aciklama |
|-------|-----|-----------|----------|
| `id` | UUID | PK | Benzersiz kimlik |
| `order_id` | UUID | NOT NULL, FK → orders(id) ON DELETE CASCADE | Ilgili siparis |
| `new_status` | TEXT | NOT NULL | Yeni durum |
| `note` | TEXT | - | Degisiklik notu |
| `created_at` | TIMESTAMPTZ | NOT NULL, default `now()` | Degisiklik zamani |

**Indexler:** `order_id`

---

### 8. quote_requests

Teklif talepleri. Anonim veya giris yapmis kullanicilar tarafindan olusturulabilir.

| Sutun | Tip | Constraint | Aciklama |
|-------|-----|-----------|----------|
| `id` | UUID | PK | Benzersiz kimlik |
| `company_name` | TEXT | NOT NULL | Firma adi |
| `contact_name` | TEXT | NOT NULL | Yetkili adi |
| `email` | TEXT | NOT NULL | E-posta |
| `phone` | TEXT | NOT NULL | Telefon |
| `message` | TEXT | - | Ek mesaj |
| `status` | TEXT | NOT NULL, CHECK, default `'pending'` | Teklif durumu |
| `created_at` | TIMESTAMPTZ | NOT NULL, default `now()` | Olusturma zamani |

**Durum degerleri:** `pending`, `reviewed`, `replied`, `closed`
**Indexler:** `status`

---

### 9. quote_items

Teklif kalemleri.

| Sutun | Tip | Constraint | Aciklama |
|-------|-----|-----------|----------|
| `id` | UUID | PK | Benzersiz kimlik |
| `quote_request_id` | UUID | NOT NULL, FK → quote_requests(id) ON DELETE CASCADE | Ait oldugu teklif |
| `product_id` | UUID | FK → products(id) ON DELETE SET NULL | Urun referansi |
| `product_name` | TEXT | NOT NULL | Urun adi (denormalize) |
| `quantity` | INT | NOT NULL, default `1` | Miktar |
| `notes` | TEXT | - | Kalem notu |

**Indexler:** `quote_request_id`

---

### 10. newsletter_subscribers

E-bulten aboneleri.

| Sutun | Tip | Constraint | Aciklama |
|-------|-----|-----------|----------|
| `id` | UUID | PK | Benzersiz kimlik |
| `email` | TEXT | UNIQUE, NOT NULL | E-posta adresi |
| `subscribed_at` | TIMESTAMPTZ | NOT NULL, default `now()` | Abone olma zamani |

---

### 11. gallery_images

Galeri gorselleri.

| Sutun | Tip | Constraint | Aciklama |
|-------|-----|-----------|----------|
| `id` | UUID | PK | Benzersiz kimlik |
| `category` | TEXT | NOT NULL, CHECK | Kategori: `uretim`, `urunler`, `etkinlikler` |
| `title_tr` | TEXT | NOT NULL | Turkce baslik |
| `title_en` | TEXT | NOT NULL, default `''` | Ingilizce baslik |
| `description_tr` | TEXT | - | Turkce aciklama |
| `description_en` | TEXT | - | Ingilizce aciklama |
| `image_url` | TEXT | NOT NULL | Public gorsel URL'i |
| `storage_path` | TEXT | NOT NULL | Supabase Storage dosya yolu |
| `display_order` | INT | NOT NULL, default `0` | Siralama |
| `is_active` | BOOLEAN | NOT NULL, default `true` | Aktif/pasif |
| `created_at` | TIMESTAMPTZ | NOT NULL, default `now()` | Olusturma zamani |

**Indexler:** `category`, `is_active` (partial: `WHERE is_active = true`)

---

### 12. site_content

CMS icerikleri (sayfa bazinda JSON verileri).

| Sutun | Tip | Constraint | Aciklama |
|-------|-----|-----------|----------|
| `id` | UUID | PK | Benzersiz kimlik |
| `page_key` | TEXT | UNIQUE, NOT NULL | Sayfa anahtari (ornek: `homepage`, `about`) |
| `content` | JSONB | NOT NULL, default `'{}'` | Sayfa icerigi |
| `updated_at` | TIMESTAMPTZ | NOT NULL, default `now()` | Guncelleme zamani |

---

## Fonksiyonlar ve Trigger'lar

### `handle_new_user()`
`auth.users` tablosuna yeni kayit eklendiginde `profiles` tablosunda otomatik profil olusturur.

```sql
-- Trigger: AFTER INSERT ON auth.users
-- email ve full_name (raw_user_meta_data'dan) kopyalanir
-- SECURITY DEFINER: service_role yetkileriyle calisir
```

### `generate_order_number()`
Yeni siparis kaydedilirken otomatik siparis numarasi uretir.

```
Format: KP-YYYY-NNNNN
Ornek: KP-2026-00001, KP-2026-00002, ...
```

### `set_updated_at()` / `update_updated_at()`
`updated_at` sutununu otomatik `now()` olarak gunceller. `products` ve `blog_posts` tablolarinda kullanilir.

---

## RLS (Row Level Security) Ozeti

Tum tablolarda RLS aktiftir. Admin islemleri `service_role` key ile yapilir (RLS bypass).

| Tablo | Anonim | Authenticated (kendi verisi) | Service Role |
|-------|--------|------|--------------|
| categories | SELECT | SELECT | FULL |
| products | SELECT | SELECT | FULL |
| blog_posts | SELECT | SELECT | FULL |
| profiles | - | SELECT, UPDATE (own) | FULL |
| orders | - | SELECT, INSERT (own) | FULL |
| order_items | - | SELECT, INSERT (own order) | FULL |
| order_status_history | - | SELECT, INSERT (own order) | FULL |
| quote_requests | INSERT | INSERT | FULL |
| quote_items | INSERT | INSERT | FULL |
| newsletter_subscribers | INSERT, SELECT | INSERT, SELECT | FULL |
| gallery_images | SELECT (is_active=true) | SELECT (is_active=true) | FULL |
| site_content | SELECT | SELECT | FULL |

---

## Storage Bucket

### `gallery`

| Ozellik | Deger |
|---------|-------|
| Bucket adi | `gallery` |
| Public | Evet |
| Dosya boyutu limiti | 10 MB |
| Izin verilen MIME tipleri | `image/jpeg`, `image/png`, `image/webp` |

**Storage Policy'leri:**
- **SELECT:** Herkes (anon + authenticated) okuyabilir
- **INSERT:** Sadece authenticated kullanicilar yukleyebilir
- **DELETE:** Sadece authenticated kullanicilar silebilir
