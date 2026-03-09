# DIA-Entegre B2B Bayi Portal — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transform the dealer portal into a fully DIA-integrated B2B platform with real-time stock/price data, bidirectional order flow, EGR/ERS invoice separation, and Halkbank POS payment for ERS invoices.

**Architecture:** Next.js API routes serve as middleware between the portal UI and DIA ERP v3. Supabase caches dealer-DIA mappings and stores local state (cart, pending orders). DIA is the single source of truth for stock, prices, invoices, and balances. Two document types are tracked separately: EGR (gayri resmi) and ERS (resmi fatura).

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS 4, Supabase, DIA ERP v3 API, Halkbank Sanal POS, WhatsApp API (wa.me links)

---

## DIA API Reference (Verified Fields)

### Key DIA Service Endpoints (scf module)
- `scf_stokkart_listele` / `scf_stokkart_getir` — Stock cards
- `scf_carikart_listele` / `scf_carikart_getir` — Customer accounts
- `scf_siparis_listele` / `scf_siparis_ekle` — Orders
- `scf_fatura_listele` — Invoices
- `scf_irsaliye_listele` — Delivery notes
- `scf_teklif_listele` / `scf_teklif_ekle` — Quotes
- `scf_fiyatkart_listele` / `scf_fiyatgrup_listele` — Price cards/groups
- `sis_kontor_sorgula` — Credit balance

### EGR/ERS Distinction
- **Field:** `ustislemturuack` — value "EGR" (gayri resmi) or "ERS" (resmi)
- **Invoices:** `efaturatipkodu` = "SATIS" with KDV > 0 = ERS; empty = EGR
- **Document numbers:** Prefixed `EGR2026...` or `EAR2026...` / `ERS2026...`

### Cari Bakiye Fields
- `bakiye` — net balance
- `orjbakiye` — original balance (negative = borçlu)
- `borc_fatura_bilgi` / `alacak_fatura_bilgi` — invoice debit/credit breakdown
- `borc_irsaliye_bilgi` / `alacak_irsaliye_bilgi` — delivery note debit/credit

### Stok Kart Fields
- `stokkartkodu`, `aciklama`, `kodveaciklama` — identification
- `fiyat1`-`fiyat10` — price tiers
- `gercek_stok`, `fiili_stok` — stock quantities
- `kdvsatis`, `kdvalis` — VAT rates
- `durum` — "A" = active
- `birimadi` — unit name (ADET etc.)

### Siparis Fields
- `__carikodu`, `__cariunvan` — customer
- `toplam`, `toplamkdv`, `net` — financial
- `onay` — "KABUL" / etc.
- `siparisdurum` — status text
- `turu` — type (2 = Alinan Siparis)
- `ustislemturuack` — "EGR" or "ERS"
- `fisno`, `belgeno` — document numbers

### Connection Info
- **URL:** `https://kismetplastik.ws.dia.com.tr/api/v3`
- **Auth:** Session-based, 30min timeout, auto-reconnect
- **Params:** `firma_kodu: 1` (integer), `donem_kodu: 7` (integer)
- **Credit:** ~1720 kontors available (each API call costs kontors)

---

## Phase 1: DIA Service Layer Enhancement

### Task 1: Add EGR/ERS Invoice Service Functions

**Files:**
- Modify: `src/lib/dia-services.ts`

**Step 1: Update DiaInvoice interface to match real DIA fields**

Replace the existing `DiaInvoice` interface:

```typescript
/** DIA v3 fatura — gercek API alan isimleri */
export interface DiaInvoice {
  belgeno: string;
  belgeno2: string;
  belgeturu: string;
  belgeturuack: string;
  tarih: string;
  vadegun: string;
  toplam: string;
  toplamkdv: string;
  toplamara: string;
  toplamaradvz: string;
  net: string;
  kalantutar_taksit: string;
  kapanmadurumu: string;
  __carikartkodu: string;
  __cariunvan: string;
  __cariverginumarasi: string;
  __carieposta: string;
  efaturatipkodu: string;
  efatura_durum: string;
  earsiv_durum: string;
  ebelge: string;
  ustislemturuack: string;
  fisno: string;
  _key: string;
}
```

**Step 2: Add EGR/ERS filtered invoice functions**

```typescript
/** Fetch invoices filtered by cari code */
export async function getInvoiceListByCari(
  cariKodu: string,
  params?: ListParams
): Promise<DiaListResponse<DiaInvoice>> {
  const client = getDiaClient();
  return client.listService<DiaInvoice>("scf", "scf_fatura_listele", toDiaListParams(params), {
    filters: `__carikartkodu='${cariKodu}'`,
  });
}

/** Separate EGR and ERS invoices from a list */
export function separateInvoicesByType(invoices: DiaInvoice[]): {
  egr: DiaInvoice[];
  ers: DiaInvoice[];
} {
  const egr: DiaInvoice[] = [];
  const ers: DiaInvoice[] = [];
  for (const inv of invoices) {
    if (inv.efaturatipkodu === "SATIS" || parseFloat(inv.toplamkdv) > 0) {
      ers.push(inv);
    } else {
      egr.push(inv);
    }
  }
  return { egr, ers };
}
```

**Step 3: Verify build**

Run: `npm run build`

**Step 4: Commit**

```bash
git add src/lib/dia-services.ts
git commit -m "feat: add EGR/ERS invoice separation and cari-filtered invoice service"
```

---

### Task 2: Add Cari Balance Service

**Files:**
- Modify: `src/lib/dia-services.ts`

**Step 1: Add balance calculation function**

```typescript
export interface CariBalance {
  cariKodu: string;
  unvan: string;
  toplamBakiye: number;
  egrBakiye: number;
  ersBakiye: number;
  borcFatura: number;
  alacakFatura: number;
  borcIrsaliye: number;
  alacakIrsaliye: number;
}

/** Get cari balance with EGR/ERS breakdown */
export async function getCariBalance(cariKodu: string): Promise<CariBalance> {
  const cari = await getCariDetail(cariKodu);

  // Parse DIA balance fields (format: "amount,count,date")
  const parseBilgi = (bilgi: string): number => {
    if (!bilgi) return 0;
    const parts = bilgi.split(",");
    return parseFloat(parts[0]) || 0;
  };

  const borcFatura = parseBilgi(cari.borc_fatura_bilgi ?? "");
  const alacakFatura = parseBilgi(cari.alacak_fatura_bilgi ?? "");
  const borcIrsaliye = parseBilgi(cari.borc_irsaliye_bilgi ?? "");
  const alacakIrsaliye = parseBilgi(cari.alacak_irsaliye_bilgi ?? "");
  const toplamBakiye = parseFloat(cari.bakiye) || 0;

  // ERS = fatura bazli borc, EGR = irsaliye bazli borc
  const ersBakiye = alacakFatura - borcFatura;
  const egrBakiye = toplamBakiye - ersBakiye;

  return {
    cariKodu: cari.carikartkodu,
    unvan: cari.unvan,
    toplamBakiye,
    egrBakiye,
    ersBakiye,
    borcFatura,
    alacakFatura,
    borcIrsaliye,
    alacakIrsaliye,
  };
}
```

**Step 2: Add borc_fatura_bilgi etc. fields to DiaCari interface**

Add these fields to the existing `DiaCari` interface:

```typescript
  borc_fatura_bilgi?: string;
  alacak_fatura_bilgi?: string;
  borc_irsaliye_bilgi?: string;
  alacak_irsaliye_bilgi?: string;
  borctoplam?: string;
  alacaktoplam?: string;
```

**Step 3: Verify build**

Run: `npm run build`

**Step 4: Commit**

```bash
git add src/lib/dia-services.ts
git commit -m "feat: add cari balance service with EGR/ERS breakdown"
```

---

### Task 3: Add Cari Price Lookup Service

**Files:**
- Modify: `src/lib/dia-services.ts`

**Step 1: Add price lookup function**

DIA stores prices in `fiyat1`-`fiyat10` on stok kartı. Cari-specific prices come from fiyat kartı (when set up) or fallback to standard price fields.

```typescript
export interface ProductPrice {
  stokKodu: string;
  aciklama: string;
  fiyat: number;
  doviz: string;
  kdvOrani: number;
  birim: string;
  stokMiktari: number;
}

/** Get product price for a specific dealer */
export async function getProductPriceForCari(
  stokKodu: string,
  _cariKodu: string,
): Promise<ProductPrice> {
  const stock = await getStockDetail(stokKodu);

  // Priority: fiyat1 (pesin bayi), then fiyat2 (vadeli bayi)
  // When fiyat kartı is set up in DIA, these will be cari-specific
  const fiyat = parseFloat(stock.fiyat1) || parseFloat(stock.fiyat2) || 0;

  return {
    stokKodu: stock.stokkartkodu,
    aciklama: stock.aciklama,
    fiyat,
    doviz: "TRY",
    kdvOrani: parseFloat(stock.kdvsatis) || 20,
    birim: stock.birimadi,
    stokMiktari: parseFloat(stock.gercek_stok) || 0,
  };
}

/** Get all product prices for catalog display */
export async function getProductPricesForCatalog(
  params?: ListParams,
): Promise<DiaListResponse<ProductPrice>> {
  const stockList = await getStockList(params);

  const prices: ProductPrice[] = stockList.records.map(stock => ({
    stokKodu: stock.stokkartkodu,
    aciklama: stock.aciklama,
    fiyat: parseFloat(stock.fiyat1) || parseFloat(stock.fiyat2) || 0,
    doviz: "TRY",
    kdvOrani: parseFloat(stock.kdvsatis) || 20,
    birim: stock.birimadi,
    stokMiktari: parseFloat(stock.gercek_stok) || 0,
  }));

  return { records: prices, total_count: stockList.total_count };
}
```

**Step 2: Verify build**

Run: `npm run build`

**Step 3: Commit**

```bash
git add src/lib/dia-services.ts
git commit -m "feat: add product price lookup and catalog pricing service"
```

---

### Task 4: Add DIA Order Retrieval by Cari

**Files:**
- Modify: `src/lib/dia-services.ts`

**Step 1: Update DiaOrder interface to match real fields**

```typescript
/** DIA v3 siparis — gercek API alan isimleri */
export interface DiaOrder {
  fisno: string;
  belgeno: string;
  tarih: string;
  saat: string;
  __carikodu: string;
  __cariunvan: string;
  toplam: string;
  toplamkdv: string;
  net: string;
  onay: string;
  onay_txt: string;
  siparisdurum: string;
  turu: string;
  turuack: string;
  turu_ack: string;
  ustislemturuack: string;
  aciklama: string;
  odemeplani: string;
  odemeplaniack: string;
  faturanumaralari: string;
  irsaliyenumaralari: string;
  toplammiktar: string;
  teslimatkalanmiktar: string;
  _key: string;
}

/** Fetch orders filtered by cari code */
export async function getOrderListByCari(
  cariKodu: string,
  params?: ListParams,
): Promise<DiaListResponse<DiaOrder>> {
  const client = getDiaClient();
  return client.listService<DiaOrder>("scf", "scf_siparis_listele", toDiaListParams(params), {
    filters: `__carikodu='${cariKodu}'`,
  });
}
```

**Step 2: Remove old DiaOrder/DiaOrderItem interfaces**

Delete the old interfaces that don't match real DIA fields.

**Step 3: Verify build**

Run: `npm run build`

**Step 4: Commit**

```bash
git add src/lib/dia-services.ts
git commit -m "feat: update DiaOrder to real API fields, add cari-filtered order listing"
```

---

### Task 5: Add Irsaliye (Delivery Note) Service

**Files:**
- Modify: `src/lib/dia-services.ts`

**Step 1: Add irsaliye interface and service**

```typescript
/** DIA v3 irsaliye — gercek API alan isimleri */
export interface DiaIrsaliye {
  fisno: string;
  belgeno: string;
  belgeno2: string;
  tarih: string;
  saat: string;
  __carikartkodu: string;
  __cariunvan: string;
  toplam: string;
  toplamkdv: string;
  toplamara: string;
  net: string;
  ustislemturuack: string;
  turuack: string;
  toplammiktar: string;
  kalemsayisi: string;
  kargofirma: string;
  sevkadresi: string;
  __faturabelgeno2: string;
  _key: string;
}

/** Fetch irsaliyes filtered by cari code */
export async function getIrsaliyeListByCari(
  cariKodu: string,
  params?: ListParams,
): Promise<DiaListResponse<DiaIrsaliye>> {
  const client = getDiaClient();
  return client.listService<DiaIrsaliye>("scf", "scf_irsaliye_listele", toDiaListParams(params), {
    filters: `__carikartkodu='${cariKodu}'`,
  });
}
```

**Step 2: Verify build**

Run: `npm run build`

**Step 3: Commit**

```bash
git add src/lib/dia-services.ts
git commit -m "feat: add irsaliye (delivery note) service with cari filter"
```

---

## Phase 2: Dealer-DIA Mapping & API Routes

### Task 6: Database — Dealer-Cari Mapping Table

**Files:**
- Create: `docs/supabase-migrations/012_dealer_cari_mapping.sql`
- Modify: `src/types/database.ts`

**Step 1: Write migration SQL**

```sql
-- Dealer-DIA Cari Mapping
-- Links Supabase dealer profiles to DIA cari accounts

CREATE TABLE IF NOT EXISTS dealer_cari_mappings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  dia_cari_kodu VARCHAR(50) NOT NULL,
  dia_cari_unvan VARCHAR(255),
  is_approved BOOLEAN DEFAULT false,
  price_type VARCHAR(20) DEFAULT 'standard',  -- 'standard', 'pesin', 'vadeli', 'ozel'
  can_direct_order BOOLEAN DEFAULT false,      -- true = skip admin approval
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(profile_id),
  UNIQUE(dia_cari_kodu)
);

-- RLS
ALTER TABLE dealer_cari_mappings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Dealers can read their own mapping"
  ON dealer_cari_mappings FOR SELECT
  USING (profile_id = auth.uid());

CREATE POLICY "Admins can manage all mappings"
  ON dealer_cari_mappings FOR ALL
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Index
CREATE INDEX idx_dealer_cari_profile ON dealer_cari_mappings(profile_id);
CREATE INDEX idx_dealer_cari_kodu ON dealer_cari_mappings(dia_cari_kodu);
```

**Step 2: Add types to database.ts**

```typescript
export interface DealerCariMapping {
  id: string;
  profile_id: string;
  dia_cari_kodu: string;
  dia_cari_unvan: string | null;
  is_approved: boolean;
  price_type: 'standard' | 'pesin' | 'vadeli' | 'ozel';
  can_direct_order: boolean;
  created_at: string;
  updated_at: string;
}
```

**Step 3: Verify build**

Run: `npm run build`

**Step 4: Commit**

```bash
git add docs/supabase-migrations/012_dealer_cari_mapping.sql src/types/database.ts
git commit -m "feat: add dealer-cari mapping table with RLS policies"
```

---

### Task 7: API — Dealer Balance Endpoint

**Files:**
- Create: `src/app/api/dealer/balance/route.ts`

**Step 1: Create balance endpoint**

```typescript
import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase-server";
import { getCariBalance } from "@/lib/dia-services";

export async function GET() {
  try {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ success: false, error: "Yetkisiz" }, { status: 401 });
    }

    // Get dealer's DIA cari code
    const { data: mapping } = await supabase
      .from("dealer_cari_mappings")
      .select("dia_cari_kodu")
      .eq("profile_id", user.id)
      .single();

    if (!mapping) {
      return NextResponse.json({
        success: false,
        error: "DIA cari hesabiniz tanimli degil. Lutfen yoneticiyle iletisime gecin.",
      }, { status: 404 });
    }

    const balance = await getCariBalance(mapping.dia_cari_kodu);

    return NextResponse.json({ success: true, data: balance });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Bilinmeyen hata";
    console.error("[Dealer Balance GET]", err);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
```

**Step 2: Verify build**

Run: `npm run build`

**Step 3: Commit**

```bash
git add src/app/api/dealer/balance/route.ts
git commit -m "feat: add dealer balance API with EGR/ERS breakdown"
```

---

### Task 8: API — Dealer Invoices Endpoint (EGR/ERS)

**Files:**
- Create: `src/app/api/dealer/invoices/route.ts`

**Step 1: Create invoices endpoint with EGR/ERS separation**

```typescript
import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase-server";
import { getInvoiceListByCari, separateInvoicesByType } from "@/lib/dia-services";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ success: false, error: "Yetkisiz" }, { status: 401 });
    }

    const { data: mapping } = await supabase
      .from("dealer_cari_mappings")
      .select("dia_cari_kodu")
      .eq("profile_id", user.id)
      .single();

    if (!mapping) {
      return NextResponse.json({ success: false, error: "DIA cari tanimli degil" }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") ?? "1", 10);
    const limit = Math.min(parseInt(searchParams.get("limit") ?? "50", 10), 100);

    const invoices = await getInvoiceListByCari(mapping.dia_cari_kodu, { page, limit });
    const { egr, ers } = separateInvoicesByType(invoices.records);

    // Calculate totals
    const egrTotal = egr.reduce((sum, inv) => sum + (parseFloat(inv.kalantutar_taksit) || 0), 0);
    const ersTotal = ers.reduce((sum, inv) => sum + (parseFloat(inv.kalantutar_taksit) || 0), 0);

    return NextResponse.json({
      success: true,
      data: {
        egr: { records: egr, total: egrTotal },
        ers: { records: ers, total: ersTotal },
        grandTotal: egrTotal + ersTotal,
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Bilinmeyen hata";
    console.error("[Dealer Invoices GET]", err);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
```

**Step 2: Verify build**

Run: `npm run build`

**Step 3: Commit**

```bash
git add src/app/api/dealer/invoices/route.ts
git commit -m "feat: add dealer invoices API with EGR/ERS separation"
```

---

### Task 9: API — Dealer Orders Endpoint (DIA-backed)

**Files:**
- Create: `src/app/api/dealer/orders/route.ts`

**Step 1: Create GET for DIA orders and POST for new orders**

GET: Fetches dealer's orders from DIA.
POST: Creates order in DIA (direct for approved dealers) or Supabase (pending for new dealers).

```typescript
import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase-server";
import { getOrderListByCari, createDiaOrder } from "@/lib/dia-services";
import { rateLimit } from "@/lib/rate-limit";

const limiter = rateLimit({ interval: 60_000, uniqueTokenPerInterval: 100 });

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ success: false, error: "Yetkisiz" }, { status: 401 });
    }

    const { data: mapping } = await supabase
      .from("dealer_cari_mappings")
      .select("dia_cari_kodu, can_direct_order")
      .eq("profile_id", user.id)
      .single();

    if (!mapping) {
      // Return Supabase-only orders for unmapped dealers
      const { data: orders } = await supabase
        .from("orders")
        .select("*, order_items(*)")
        .eq("profile_id", user.id)
        .order("created_at", { ascending: false });

      return NextResponse.json({ success: true, data: { orders: orders ?? [], source: "local" } });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") ?? "1", 10);
    const limit = Math.min(parseInt(searchParams.get("limit") ?? "20", 10), 50);

    const diaOrders = await getOrderListByCari(mapping.dia_cari_kodu, { page, limit });

    return NextResponse.json({
      success: true,
      data: { orders: diaOrders.records, source: "dia", total: diaOrders.total_count },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Bilinmeyen hata";
    console.error("[Dealer Orders GET]", err);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Rate limit
    const ip = request.headers.get("x-forwarded-for") ?? "unknown";
    try { await limiter.check(5, ip); } catch {
      return NextResponse.json({ success: false, error: "Cok fazla istek" }, { status: 429 });
    }

    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ success: false, error: "Yetkisiz" }, { status: 401 });
    }

    const body = await request.json();
    const { items, aciklama } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ success: false, error: "Urun listesi bos" }, { status: 400 });
    }

    const { data: mapping } = await supabase
      .from("dealer_cari_mappings")
      .select("dia_cari_kodu, can_direct_order, is_approved")
      .eq("profile_id", user.id)
      .single();

    if (mapping?.can_direct_order && mapping.is_approved) {
      // Direct DIA order for approved dealers
      const result = await createDiaOrder({
        cariKodu: mapping.dia_cari_kodu,
        aciklama: aciklama ?? "",
        kalemler: items,
      });

      return NextResponse.json({ success: true, data: result, target: "dia" });
    }

    // Pending order in Supabase for new/unapproved dealers
    const { data: profile } = await supabase
      .from("profiles")
      .select("company_name")
      .eq("id", user.id)
      .single();

    const orderNumber = `KP-${Date.now().toString(36).toUpperCase()}`;
    const subtotal = items.reduce((s: number, i: { miktar: number; birimFiyat: number }) =>
      s + i.miktar * i.birimFiyat, 0);
    const taxAmount = subtotal * 0.20;

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        profile_id: user.id,
        order_number: orderNumber,
        status: "pending",
        subtotal,
        tax_amount: taxAmount,
        total_amount: subtotal + taxAmount,
        notes: aciklama ?? "",
        shipping_address: profile?.company_name ?? "",
      })
      .select()
      .single();

    if (orderError) {
      return NextResponse.json({ success: false, error: orderError.message }, { status: 500 });
    }

    // Insert order items
    const orderItems = items.map((item: { stokKodu: string; stokAdi: string; miktar: number; birimFiyat: number }) => ({
      order_id: order.id,
      product_name: item.stokAdi,
      quantity: item.miktar,
      unit_price: item.birimFiyat,
      total_price: item.miktar * item.birimFiyat,
    }));

    await supabase.from("order_items").insert(orderItems);

    return NextResponse.json({
      success: true,
      data: { orderId: order.id, orderNumber },
      target: "pending_approval",
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Bilinmeyen hata";
    console.error("[Dealer Orders POST]", err);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
```

**Step 2: Verify build**

Run: `npm run build`

**Step 3: Commit**

```bash
git add src/app/api/dealer/orders/route.ts
git commit -m "feat: add dealer orders API — DIA direct for approved, Supabase pending for new"
```

---

### Task 10: API — Dealer Stock/Catalog Endpoint

**Files:**
- Create: `src/app/api/dealer/catalog/route.ts`

**Step 1: Create catalog endpoint with prices**

```typescript
import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase-server";
import { getProductPricesForCatalog } from "@/lib/dia-services";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ success: false, error: "Yetkisiz" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") ?? "1", 10);
    const limit = Math.min(parseInt(searchParams.get("limit") ?? "50", 10), 100);
    const search = searchParams.get("search") ?? "";

    const catalog = await getProductPricesForCatalog({
      page,
      limit,
      filter: search ? `stokkartkodu like '%${search}%' or aciklama like '%${search}%'` : undefined,
    });

    return NextResponse.json({ success: true, data: catalog });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Bilinmeyen hata";
    console.error("[Dealer Catalog GET]", err);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
```

**Step 2: Verify build**

Run: `npm run build`

**Step 3: Commit**

```bash
git add src/app/api/dealer/catalog/route.ts
git commit -m "feat: add dealer catalog API with DIA stock prices"
```

---

## Phase 3: Portal UI — Dashboard & Balance

### Task 11: Refactor Dashboard with DIA Balance Cards

**Files:**
- Modify: `src/app/[locale]/bayi-panel/page.tsx`
- Modify: `src/components/portal/DashboardCards.tsx`

**Step 1: Update DashboardCards to fetch from DIA balance API**

Replace placeholder stats with real `/api/dealer/balance` call:
- Card 1: **EGR Bakiye** (amber icon, JetBrains Mono amount)
- Card 2: **ERS Bakiye** (blue icon, JetBrains Mono amount)
- Card 3: **Toplam Borc** (red icon if > 0, green if 0)
- Card 4: **Kontor Durumu** (info card, optional)

Each card shows loading skeleton while fetching.

**Step 2: Update dashboard page to use DIA-backed recent orders**

Replace Supabase order fetch with `/api/dealer/orders?limit=5`.

**Step 3: Verify build**

Run: `npm run build`

**Step 4: Commit**

```bash
git add src/app/[locale]/bayi-panel/page.tsx src/components/portal/DashboardCards.tsx
git commit -m "feat: dashboard with real DIA balance (EGR/ERS) and orders"
```

---

### Task 12: Refactor Invoices Page with EGR/ERS Tabs

**Files:**
- Modify: `src/app/[locale]/bayi-panel/faturalarim/page.tsx`

**Step 1: Refactor to tabbed layout**

- Two tabs: **EGR Faturalar** | **ERS Faturalar**
- Summary cards at top: EGR toplam | ERS toplam | Genel toplam
- Each tab shows table: Belge No | Tarih | Tutar | KDV | Toplam | Kalan | Durum
- ERS tab: "Ode" button (links to payment page)
- EGR tab: "Odeme Talebi" button (WhatsApp link)
- Fetch from `/api/dealer/invoices`
- JetBrains Mono for all financial figures
- Overdue invoices highlighted (red border)

**Step 2: Add WhatsApp payment request for EGR**

"Odeme Talebi" button generates WhatsApp link:
```
https://wa.me/905XXXXXXXXX?text=EGR%20Odeme%20Talebi%0ABayi:%20{unvan}%0ABorc:%20{egrTotal}%20TL
```

**Step 3: Verify build**

Run: `npm run build`

**Step 4: Commit**

```bash
git add src/app/[locale]/bayi-panel/faturalarim/page.tsx
git commit -m "feat: invoices page with EGR/ERS tabs and WhatsApp payment request"
```

---

## Phase 4: Portal UI — Catalog & Orders

### Task 13: Refactor Product Catalog to Use DIA Data

**Files:**
- Modify: `src/app/[locale]/bayi-panel/urunler/page.tsx`

**Step 1: Replace static product data with DIA catalog API**

- Fetch from `/api/dealer/catalog`
- Show real stock quantities
- Show real prices from DIA (cari-specific when available)
- Keep existing cart functionality (localStorage)
- Add stock status indicator (yeşil: stokta, kırmızı: stokta yok)
- Search by stok kodu or açıklama

**Step 2: Verify build**

Run: `npm run build`

**Step 3: Commit**

```bash
git add src/app/[locale]/bayi-panel/urunler/page.tsx
git commit -m "feat: portal catalog with real DIA stock and prices"
```

---

### Task 14: Connect Quick Order Form to DIA

**Files:**
- Modify: `src/components/portal/QuickOrderForm.tsx`

**Step 1: Wire up order creation**

- "Siparis Ver" button: POST to `/api/dealer/orders`
- "Teklif Iste" button: POST to `/api/quotes` (existing)
- Product code autocomplete: fetch from `/api/dealer/catalog?search=`
- Show real prices when product is selected
- Success: show order number and status (direct/pending)
- Error: show toast with error message

**Step 2: Verify build**

Run: `npm run build`

**Step 3: Commit**

```bash
git add src/components/portal/QuickOrderForm.tsx
git commit -m "feat: connect quick order form to DIA order API"
```

---

### Task 15: Refactor Orders Page to Show DIA Orders

**Files:**
- Modify: `src/app/[locale]/bayi-panel/siparislerim/page.tsx`

**Step 1: Fetch orders from DIA**

- Fetch from `/api/dealer/orders`
- Show: Fiş No | Tarih | Tutar | KDV | Net | Onay Durumu | Sipariş Durumu
- Status badges: Kabul edildi (green), Beklemede (yellow), Red (red)
- EGR/ERS badge on each order
- "Tekrar Sipariş Ver" button copies items to cart

**Step 2: Handle mixed source (DIA + local pending)**

When dealer has both DIA orders and local pending orders, show both with source indicator.

**Step 3: Verify build**

Run: `npm run build`

**Step 4: Commit**

```bash
git add src/app/[locale]/bayi-panel/siparislerim/page.tsx
git commit -m "feat: orders page with real DIA data and pending local orders"
```

---

## Phase 5: Product Compatibility Rules

### Task 16: Database — Product Compatibility Table

**Files:**
- Create: `docs/supabase-migrations/013_product_compatibility.sql`
- Modify: `src/types/database.ts`

**Step 1: Write migration**

```sql
-- Product Compatibility Rules
-- Defines which products are compatible (e.g., bottle -> matching caps/stoppers)

CREATE TABLE IF NOT EXISTS product_compatibility (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  source_stock_kodu VARCHAR(50) NOT NULL,       -- e.g., bottle code
  source_category VARCHAR(50) NOT NULL,          -- e.g., 'pet-siseler'
  compatible_stock_kodu VARCHAR(50) NOT NULL,    -- e.g., cap code
  compatible_category VARCHAR(50) NOT NULL,      -- e.g., 'kapaklar'
  compatibility_type VARCHAR(30) DEFAULT 'fits', -- 'fits', 'recommended', 'alternative'
  notes TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE product_compatibility ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read compatibility"
  ON product_compatibility FOR SELECT USING (true);

CREATE POLICY "Admins can manage compatibility"
  ON product_compatibility FOR ALL
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE INDEX idx_compat_source ON product_compatibility(source_stock_kodu);
CREATE INDEX idx_compat_target ON product_compatibility(compatible_stock_kodu);
CREATE INDEX idx_compat_category ON product_compatibility(source_category, compatible_category);
```

**Step 2: Add types**

**Step 3: Verify build**

Run: `npm run build`

**Step 4: Commit**

```bash
git add docs/supabase-migrations/013_product_compatibility.sql src/types/database.ts
git commit -m "feat: add product compatibility rules table"
```

---

### Task 17: API — Compatibility Lookup

**Files:**
- Create: `src/app/api/products/compatible/route.ts`

**Step 1: Create compatibility endpoint**

GET `/api/products/compatible?stock_kodu=KP001`
Returns list of compatible products with their DIA stock info.

**Step 2: Verify build**

Run: `npm run build`

**Step 3: Commit**

```bash
git add src/app/api/products/compatible/route.ts
git commit -m "feat: add product compatibility API endpoint"
```

---

### Task 18: Admin — Compatibility Management Page

**Files:**
- Create: `src/app/admin/compatibility/page.tsx`

**Step 1: Create admin page for managing product compatibility rules**

- Table: Source Product | Category | Compatible Product | Category | Type | Active
- Add/edit/delete rules
- Search by stock code
- Bulk import support

**Step 2: Verify build**

Run: `npm run build`

**Step 3: Commit**

```bash
git add src/app/admin/compatibility/page.tsx
git commit -m "feat: admin page for product compatibility management"
```

---

## Phase 6: Payment System

### Task 19: ERS Payment Page with Halkbank POS

**Files:**
- Create: `src/app/[locale]/bayi-panel/odeme/page.tsx`
- Create: `src/app/api/payment/initiate/route.ts`
- Create: `src/app/api/payment/callback/route.ts`
- Create: `src/lib/halkbank-pos.ts`

**Step 1: Create Halkbank sanal POS client**

```typescript
// src/lib/halkbank-pos.ts
// Halkbank 3D Secure payment integration
// Requires: HALKBANK_MERCHANT_ID, HALKBANK_TERMINAL_ID, HALKBANK_STORE_KEY env vars
```

**Step 2: Create payment initiation API**

POST `/api/payment/initiate`:
- Accept: invoice IDs (ERS only), amount, card info
- Validate: only ERS invoices can be paid online
- Initiate 3D Secure flow with Halkbank
- Return: redirect URL for 3D Secure page

**Step 3: Create payment callback API**

POST `/api/payment/callback`:
- Receive 3D Secure result from Halkbank
- Verify signature
- On success: record payment, update invoice status
- Redirect to success/failure page

**Step 4: Create payment page**

- Select ERS invoices to pay (checkboxes)
- Show total amount
- Credit card form (card number, expiry, CVV, cardholder)
- 3D Secure redirect flow
- Success/error result page

**Step 5: Add "Odeme" link to Sidebar**

**Step 6: Verify build**

Run: `npm run build`

**Step 7: Commit**

```bash
git add src/app/[locale]/bayi-panel/odeme/ src/app/api/payment/ src/lib/halkbank-pos.ts src/components/portal/Sidebar.tsx
git commit -m "feat: ERS invoice payment with Halkbank sanal POS (3D Secure)"
```

---

### Task 20: EGR WhatsApp Payment Request

**Files:**
- Modify: `src/app/[locale]/bayi-panel/faturalarim/page.tsx`

**Step 1: Add WhatsApp payment request button**

On EGR tab, "Odeme Talebi Gonder" button:
- Generates WhatsApp wa.me link with pre-filled message
- Message includes: bayi adı, EGR borç tutarı, IBAN/hesap bilgisi
- Opens in new tab

**Step 2: Verify build**

Run: `npm run build`

**Step 3: Commit**

```bash
git add src/app/[locale]/bayi-panel/faturalarim/page.tsx
git commit -m "feat: EGR WhatsApp payment request with auto-filled message"
```

---

## Phase 7: Admin DIA Management

### Task 21: Admin — Dealer-Cari Mapping Management

**Files:**
- Create: `src/app/admin/dealer-mappings/page.tsx`
- Create: `src/app/api/admin/dealer-mappings/route.ts`

**Step 1: Create API for managing dealer-cari mappings**

GET: List all mappings with profile + DIA cari info
POST: Create new mapping (link dealer to DIA cari)
PUT: Update mapping (approve, change price type, toggle direct order)

**Step 2: Create admin page**

- Table: Bayi | Email | DIA Cari Kodu | Cari Unvan | Fiyat Tipi | Direkt Siparis | Onayli | Actions
- "Yeni Eslestirme" dialog: select dealer profile + enter DIA cari kodu
- Auto-lookup DIA cari when code entered
- Approve/reject buttons
- Toggle direct order capability

**Step 3: Verify build**

Run: `npm run build`

**Step 4: Commit**

```bash
git add src/app/admin/dealer-mappings/ src/app/api/admin/dealer-mappings/
git commit -m "feat: admin dealer-cari mapping management page"
```

---

### Task 22: Admin — Pending Order Approval

**Files:**
- Modify: `src/app/admin/orders/page.tsx`
- Create: `src/app/api/admin/orders/[id]/approve/route.ts`

**Step 1: Add "Onayla ve DIA'ya Gonder" button to admin orders**

For orders with status "pending":
- Admin reviews order
- Clicks "Onayla" → order is sent to DIA via `createDiaOrder()`
- Status updates to "confirmed"
- Dealer sees updated status

**Step 2: Verify build**

Run: `npm run build`

**Step 3: Commit**

```bash
git add src/app/admin/orders/ src/app/api/admin/orders/
git commit -m "feat: admin order approval with DIA push"
```

---

## Phase 8: Homepage Payment Button & Polish

### Task 23: Homepage — Bayi Odeme Button

**Files:**
- Modify: `src/components/layout/Header.tsx`
- Or: `src/app/[locale]/page.tsx`

**Step 1: Add "Bayi Odeme" button to header/homepage**

- Visible on homepage, links to `/bayi-panel/odeme`
- If not logged in, redirects to `/bayi-girisi` first
- Styled: amber button, prominent placement

**Step 2: Verify build**

Run: `npm run build`

**Step 3: Commit**

```bash
git add src/components/layout/Header.tsx
git commit -m "feat: add 'Bayi Odeme' button to homepage header"
```

---

### Task 24: DIA Cache Strategy (Kontor Optimization)

**Files:**
- Create: `src/lib/dia-cache.ts`

**Step 1: Create caching layer for DIA API calls**

Each DIA call costs kontors. Cache frequently accessed data:
- Stock list: 5 minute cache
- Cari balance: 2 minute cache
- Invoice list: 5 minute cache
- Order list: 3 minute cache

Use in-memory cache (Map with TTL) for server-side API routes.

**Step 2: Wrap DIA service calls with cache**

**Step 3: Verify build**

Run: `npm run build`

**Step 4: Commit**

```bash
git add src/lib/dia-cache.ts
git commit -m "feat: add DIA API cache layer for kontor optimization"
```

---

### Task 25: Final Build & Quality Check

**Files:** All modified files

**Step 1: Run full quality check**

```bash
npm run lint
npx tsc --noEmit
npm run build
```

**Step 2: Fix any remaining issues**

**Step 3: Commit**

```bash
git commit -am "chore: final quality pass for DIA B2B portal integration"
```

---

## Dependency Map

```
Phase 1 (Tasks 1-5): DIA service layer — no deps
Phase 2 (Tasks 6-10): API routes — depends on Phase 1
Phase 3 (Tasks 11-12): Dashboard/Invoices UI — depends on Phase 2
Phase 4 (Tasks 13-15): Catalog/Orders UI — depends on Phase 2
Phase 5 (Tasks 16-18): Compatibility — independent
Phase 6 (Tasks 19-20): Payments — depends on Phase 3 (EGR/ERS)
Phase 7 (Tasks 21-22): Admin — depends on Phase 2
Phase 8 (Tasks 23-25): Polish — depends on all above
```

## Parallelization Opportunities

```
Group A: Tasks 1-5 (DIA Services) — sequential
Group B: Tasks 6-10 (API Routes) — after A, partially parallel
Group C: Tasks 11-12 (Dashboard UI) + Tasks 13-15 (Catalog UI) — after B, parallel
Group D: Tasks 16-18 (Compatibility) — independent, any time
Group E: Tasks 19-20 (Payments) — after C
Group F: Tasks 21-22 (Admin) — after B
Group G: Tasks 23-25 (Polish) — after all
```

## Environment Variables Needed

```
# Existing (already configured)
DIA_API_URL=https://kismetplastik.ws.dia.com.tr/api/v3
DIA_API_KEY=a8395b08-d405-4e22-b546-43e346869ec3
DIA_USERNAME=web
DIA_PASSWORD=123
DIA_FIRMA_KODU=1
DIA_DONEM_KODU=7

# New (required for payment)
HALKBANK_MERCHANT_ID=
HALKBANK_TERMINAL_ID=
HALKBANK_STORE_KEY=
HALKBANK_3D_URL=

# New (for WhatsApp EGR payment)
WHATSAPP_PHONE=905XXXXXXXXX
EGR_IBAN=TRXX XXXX XXXX XXXX XXXX XXXX XX
```
