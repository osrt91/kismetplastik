/**
 * DIA ERP Business Services — v3 API
 *
 * High-level service functions for interacting with DIA ERP resources
 * (stock, customers, orders, invoices) and syncing data to Supabase.
 *
 * Uses the DIA Web Service v3 session-based JSON API via DiaClient.
 */

import { getDiaClient, DiaApiError, type DiaListParams, type DiaListResponse } from "@/lib/dia-client";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

// ---------------------------------------------------------------------------
// DIA Entity Interfaces
// ---------------------------------------------------------------------------

export interface DiaStock {
  Kodu: string;
  Adi: string;
  Birim: string;
  KDVOrani: number;
  Barkod: string | null;
  GrupKodu: string | null;
  OzelKod1: string | null;
  OzelKod2: string | null;
  Aciklama: string | null;
  SatisFiyati1: number | null;
  SatisFiyati2: number | null;
  AlisFiyati: number | null;
  Marka: string | null;
  Model: string | null;
  StokMiktari: number | null;
  AsgariStok: number | null;
  Durum: boolean;
}

export interface DiaCari {
  Kodu: string;
  Unvan: string;
  VergiDairesi: string | null;
  VergiNo: string | null;
  TCKimlikNo: string | null;
  Adres: string | null;
  Sehir: string | null;
  Ilce: string | null;
  Telefon: string | null;
  Faks: string | null;
  Email: string | null;
  Web: string | null;
  GrupKodu: string | null;
  OzelKod1: string | null;
  OzelKod2: string | null;
  Bakiye: number | null;
  Durum: boolean;
}

export interface DiaOrderItem {
  StokKodu: string;
  StokAdi: string;
  Miktar: number;
  BirimFiyat: number;
  Tutar: number;
  KDVOrani: number;
  KDVTutar: number;
  IskontoOrani: number | null;
  IskontoTutar: number | null;
}

export interface DiaOrder {
  BelgeNo: string;
  Tarih: string;
  CariKodu: string;
  CariUnvan: string;
  ToplamTutar: number;
  KDVTutar: number;
  GenelToplam: number;
  Aciklama: string | null;
  Durum: string;
  Kalemler: DiaOrderItem[];
}

export interface DiaInvoice {
  BelgeNo: string;
  FaturaTarihi: string;
  VadeTarihi: string | null;
  CariKodu: string;
  CariUnvan: string;
  ToplamTutar: number;
  KDVTutar: number;
  GenelToplam: number;
  Aciklama: string | null;
  Durum: string;
  FaturaTipi: string;
}

export interface DiaQuote {
  BelgeNo: string;
  Tarih: string;
  GecerlilikTarihi: string | null;
  CariKodu: string;
  CariUnvan: string;
  ToplamTutar: number;
  KDVTutar: number;
  GenelToplam: number;
  Aciklama: string | null;
  Durum: string;
  Kalemler: DiaOrderItem[];
}

// ---------------------------------------------------------------------------
// Service params
// ---------------------------------------------------------------------------

export interface ListParams {
  filter?: string;
  sort?: string;
  page?: number;
  limit?: number;
}

export interface SyncResult {
  synced: number;
  errors: string[];
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function toDiaListParams(params?: ListParams): DiaListParams | undefined {
  if (!params) return undefined;

  const limit = params.limit ?? 50;
  const offset = params.page && params.page > 1 ? (params.page - 1) * limit : 0;

  return {
    filters: params.filter ?? "",
    sorts: params.sort ?? "",
    limit,
    offset,
  };
}

// ---------------------------------------------------------------------------
// Stock (Stok) Services — scf module
// ---------------------------------------------------------------------------

export async function getStockList(params?: ListParams): Promise<DiaListResponse<DiaStock>> {
  const client = getDiaClient();
  return client.listService<DiaStock>("scf", "scf_stokkart_listele", toDiaListParams(params));
}

export async function getStockDetail(stockCode: string): Promise<DiaStock> {
  const client = getDiaClient();
  return client.callService<DiaStock>("scf", "scf_stokkart_getir", {
    stok_kodu: stockCode,
  });
}

/**
 * Fetches all stock cards from DIA and upserts matching products in Supabase
 * using the dia_stock_mappings table (maps DIA stock codes to product slugs).
 */
export async function syncStockToSupabase(): Promise<SyncResult> {
  const client = getDiaClient();
  const supabase = getSupabaseAdmin();
  const result: SyncResult = { synced: 0, errors: [] };

  try {
    // Fetch mappings: dia_stock_code -> product_slug
    const { data: mappings, error: mappingError } = await supabase
      .from("dia_stock_mappings")
      .select("dia_stock_code, product_slug");

    if (mappingError) {
      result.errors.push(`Mapping tablosu okunamadi: ${mappingError.message}`);
      return result;
    }

    if (!mappings || mappings.length === 0) {
      result.errors.push("dia_stock_mappings tablosunda kayit bulunamadi.");
      return result;
    }

    const mappingMap = new Map<string, string>();
    for (const m of mappings) {
      mappingMap.set(m.dia_stock_code, m.product_slug);
    }

    // Fetch all stocks from DIA (paginated)
    let offset = 0;
    const batchSize = 100;
    let hasMore = true;

    while (hasMore) {
      const response = await client.listService<DiaStock>("scf", "scf_stokkart_listele", {
        limit: batchSize,
        offset,
      });

      for (const stock of response.records) {
        const productSlug = mappingMap.get(stock.Kodu);
        if (!productSlug) continue;

        try {
          const { error: upsertError } = await supabase
            .from("products")
            .update({
              in_stock: stock.Durum && (stock.StokMiktari ?? 0) > 0,
              min_order: stock.AsgariStok ?? 0,
              updated_at: new Date().toISOString(),
            })
            .eq("slug", productSlug);

          if (upsertError) {
            result.errors.push(`Stok guncelleme hatasi [${stock.Kodu}]: ${upsertError.message}`);
          } else {
            result.synced++;
          }
        } catch (err) {
          const message = err instanceof Error ? err.message : String(err);
          result.errors.push(`Stok guncelleme hatasi [${stock.Kodu}]: ${message}`);
        }
      }

      offset += batchSize;
      hasMore = response.records.length === batchSize;
    }
  } catch (err) {
    const message = err instanceof DiaApiError ? err.message : err instanceof Error ? err.message : String(err);
    result.errors.push(`DIA stok cekme hatasi: ${message}`);
  }

  return result;
}

// ---------------------------------------------------------------------------
// Cari (Customer Account) Services — scf module
// ---------------------------------------------------------------------------

export async function getCariList(params?: ListParams): Promise<DiaListResponse<DiaCari>> {
  const client = getDiaClient();
  return client.listService<DiaCari>("scf", "scf_carikart_listele", toDiaListParams(params));
}

export async function getCariDetail(cariCode: string): Promise<DiaCari> {
  const client = getDiaClient();
  return client.callService<DiaCari>("scf", "scf_carikart_getir", {
    cari_kodu: cariCode,
  });
}

/**
 * Fetches all cari (customer) records from DIA and upserts matching profiles
 * in Supabase. Matches by email address.
 */
export async function syncCariToSupabase(): Promise<SyncResult> {
  const client = getDiaClient();
  const supabase = getSupabaseAdmin();
  const result: SyncResult = { synced: 0, errors: [] };

  try {
    let offset = 0;
    const batchSize = 100;
    let hasMore = true;

    while (hasMore) {
      const response = await client.listService<DiaCari>("scf", "scf_carikart_listele", {
        limit: batchSize,
        offset,
      });

      for (const cari of response.records) {
        if (!cari.Email) continue;

        try {
          const { error: upsertError } = await supabase
            .from("profiles")
            .update({
              company_name: cari.Unvan,
              tax_number: cari.VergiNo,
              tax_office: cari.VergiDairesi,
              company_address: cari.Adres,
              city: cari.Sehir,
              district: cari.Ilce,
              phone: cari.Telefon,
              updated_at: new Date().toISOString(),
            })
            .eq("email", cari.Email);

          if (upsertError) {
            result.errors.push(`Cari guncelleme hatasi [${cari.Kodu}]: ${upsertError.message}`);
          } else {
            result.synced++;
          }
        } catch (err) {
          const message = err instanceof Error ? err.message : String(err);
          result.errors.push(`Cari guncelleme hatasi [${cari.Kodu}]: ${message}`);
        }
      }

      offset += batchSize;
      hasMore = response.records.length === batchSize;
    }
  } catch (err) {
    const message = err instanceof DiaApiError ? err.message : err instanceof Error ? err.message : String(err);
    result.errors.push(`DIA cari cekme hatasi: ${message}`);
  }

  return result;
}

// ---------------------------------------------------------------------------
// Order (Siparis) Services — scf module
// ---------------------------------------------------------------------------

export interface CreateDiaOrderData {
  cariKodu: string;
  aciklama?: string;
  kalemler: Array<{
    stokKodu: string;
    stokAdi: string;
    miktar: number;
    birimFiyat: number;
    kdvOrani: number;
    iskontoOrani?: number;
  }>;
}

export async function getOrderList(params?: ListParams): Promise<DiaListResponse<DiaOrder>> {
  const client = getDiaClient();
  return client.listService<DiaOrder>("scf", "scf_siparis_listele", toDiaListParams(params));
}

/**
 * Creates a new order in DIA ERP from site order data.
 */
export async function createDiaOrder(orderData: CreateDiaOrderData): Promise<unknown> {
  const client = getDiaClient();

  const kalemler = orderData.kalemler.map((k) => {
    const tutar = k.miktar * k.birimFiyat;
    const iskontoTutar = k.iskontoOrani ? tutar * (k.iskontoOrani / 100) : 0;
    const netTutar = tutar - iskontoTutar;
    const kdvTutar = netTutar * (k.kdvOrani / 100);

    return {
      StokKodu: k.stokKodu,
      StokAdi: k.stokAdi,
      Miktar: k.miktar,
      BirimFiyat: k.birimFiyat,
      Tutar: netTutar,
      KDVOrani: k.kdvOrani,
      KDVTutar: kdvTutar,
      IskontoOrani: k.iskontoOrani ?? 0,
      IskontoTutar: iskontoTutar,
    };
  });

  const toplamTutar = kalemler.reduce((sum, k) => sum + k.Tutar, 0);
  const kdvTutar = kalemler.reduce((sum, k) => sum + k.KDVTutar, 0);

  return client.callService("scf", "scf_siparis_ekle", {
    tarih: new Date().toISOString(),
    cari_kodu: orderData.cariKodu,
    toplam_tutar: toplamTutar,
    kdv_tutar: kdvTutar,
    genel_toplam: toplamTutar + kdvTutar,
    aciklama: orderData.aciklama ?? "",
    kalemler,
  });
}

// ---------------------------------------------------------------------------
// Invoice (Fatura) Services — scf module
// ---------------------------------------------------------------------------

export async function getInvoiceList(params?: ListParams): Promise<DiaListResponse<DiaInvoice>> {
  const client = getDiaClient();
  return client.listService<DiaInvoice>("scf", "scf_fatura_listele", toDiaListParams(params));
}

// ---------------------------------------------------------------------------
// Quote (Teklif) Services — scf module
// ---------------------------------------------------------------------------

export interface CreateDiaQuoteData {
  cariKodu: string;
  gecerlilikTarihi?: string;
  aciklama?: string;
  kalemler: Array<{
    stokKodu: string;
    stokAdi: string;
    miktar: number;
    birimFiyat: number;
    kdvOrani: number;
    iskontoOrani?: number;
  }>;
}

export async function getQuoteList(params?: ListParams): Promise<DiaListResponse<DiaQuote>> {
  const client = getDiaClient();
  return client.listService<DiaQuote>("scf", "scf_teklif_listele", toDiaListParams(params));
}

/**
 * Creates a new quote (teklif) in DIA ERP.
 */
export async function createDiaQuote(quoteData: CreateDiaQuoteData): Promise<unknown> {
  const client = getDiaClient();

  const kalemler = quoteData.kalemler.map((k) => {
    const tutar = k.miktar * k.birimFiyat;
    const iskontoTutar = k.iskontoOrani ? tutar * (k.iskontoOrani / 100) : 0;
    const netTutar = tutar - iskontoTutar;
    const kdvTutar = netTutar * (k.kdvOrani / 100);

    return {
      StokKodu: k.stokKodu,
      StokAdi: k.stokAdi,
      Miktar: k.miktar,
      BirimFiyat: k.birimFiyat,
      Tutar: netTutar,
      KDVOrani: k.kdvOrani,
      KDVTutar: kdvTutar,
      IskontoOrani: k.iskontoOrani ?? 0,
      IskontoTutar: iskontoTutar,
    };
  });

  const toplamTutar = kalemler.reduce((sum, k) => sum + k.Tutar, 0);
  const kdvTutar = kalemler.reduce((sum, k) => sum + k.KDVTutar, 0);

  return client.callService("scf", "scf_teklif_ekle", {
    tarih: new Date().toISOString(),
    gecerlilik_tarihi: quoteData.gecerlilikTarihi ?? "",
    cari_kodu: quoteData.cariKodu,
    toplam_tutar: toplamTutar,
    kdv_tutar: kdvTutar,
    genel_toplam: toplamTutar + kdvTutar,
    aciklama: quoteData.aciklama ?? "",
    kalemler,
  });
}
