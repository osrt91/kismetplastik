# Split 02: Fatura Sistemi

## Amaç
Sipariş onaylandığında fatura oluşturma, PDF olarak indirme ve fatura listeleme altyapısı kurmak.

## Bağımlılıklar
- 01-siparis-takip (sipariş detay sayfasından faturaya link verilecek)

## Dosya Değişiklikleri

### Yeni Dosyalar

1. **`docs/supabase-migrations/011_invoices.sql`**
   ```sql
   CREATE TABLE IF NOT EXISTS invoices (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
     profile_id UUID NOT NULL,
     invoice_number TEXT UNIQUE NOT NULL,  -- KP-2026-00001
     company_name TEXT NOT NULL,
     company_address TEXT,
     tax_number TEXT,
     tax_office TEXT,
     subtotal NUMERIC(12,2) NOT NULL,
     tax_rate NUMERIC(5,2) DEFAULT 20.00,
     tax_amount NUMERIC(12,2) NOT NULL,
     total_amount NUMERIC(12,2) NOT NULL,
     pdf_url TEXT,
     storage_path TEXT,
     status TEXT DEFAULT 'issued' CHECK (status IN ('draft','issued','paid','cancelled')),
     issued_at TIMESTAMPTZ DEFAULT now(),
     created_at TIMESTAMPTZ DEFAULT now(),
     updated_at TIMESTAMPTZ DEFAULT now()
   );
   ```

2. **`src/app/api/invoices/route.ts`** (GET)
   - Bayinin kendi faturalarını listeleme
   - Filtreleme: tarih aralığı, durum
   - Pagination
   - Auth: supabaseServer().auth.getUser() ile profile_id kontrolü

3. **`src/app/api/invoices/[id]/route.ts`** (GET)
   - Fatura detay bilgileri
   - İlişkili order ve order_items dahil
   - Auth kontrolü (sadece kendi faturası)

4. **`src/app/api/invoices/[id]/pdf/route.ts`** (GET)
   - jsPDF ile PDF oluşturma
   - Şirket logosu + bilgileri
   - Ürün kalemleri tablosu
   - KDV hesaplama, toplam
   - PDF'i Supabase Storage'a yükleme (ilk istek)
   - Sonraki isteklerde cache'den döndürme
   - Response: application/pdf stream

5. **`src/lib/invoice-pdf.ts`**
   - jsPDF ile fatura PDF oluşturma utility
   - Şirket bilgileri header
   - Müşteri bilgileri
   - Ürün tablosu
   - Ara toplam, KDV, genel toplam
   - Fatura numarası, tarih
   - Türkçe karakter desteği

### Değiştirilecek Dosyalar

6. **`src/types/database.ts`**
   - DbInvoice interface ekle
   - InvoiceStatus type ekle

7. **`src/app/api/orders/[id]/route.ts`** (PATCH)
   - Status "confirmed" olduğunda otomatik fatura oluşturma
   - invoice_number generator: `KP-{YIL}-{5_HANE}`

## PDF İçeriği
```
┌──────────────────────────────────────────┐
│  [LOGO]  KISMET PLASTİK                 │
│  Adres, Telefon, E-posta                │
│  Vergi No: ...                          │
├──────────────────────────────────────────┤
│  FATURA NO: KP-2026-00001              │
│  TARİH: 05.03.2026                     │
├──────────────────────────────────────────┤
│  MÜŞTERİ:                              │
│  Firma Adı, Adres, Vergi No            │
├──────────────────────────────────────────┤
│  # │ Ürün          │ Miktar │ Fiyat │ T │
│  1 │ PET Şişe 50ml │ 1000   │ ₺2.50 │ … │
│  2 │ Sprey Kapak   │ 1000   │ ₺1.20 │ … │
├──────────────────────────────────────────┤
│                      Ara Toplam: ₺3,700 │
│                      KDV (%20):   ₺740  │
│                      TOPLAM:    ₺4,440  │
└──────────────────────────────────────────┘
```

## Kabul Kriterleri
- [ ] Sipariş onaylandığında otomatik fatura oluşturulmalı
- [ ] PDF indirilebilmeli ve Türkçe karakterler doğru görünmeli
- [ ] Fatura numarası unique ve sıralı olmalı
- [ ] Bayi sadece kendi faturalarını görebilmeli (RLS)
- [ ] PDF Supabase Storage'da cache'lenmeli
