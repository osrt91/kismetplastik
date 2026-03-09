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

/** DIA v3 stok kartı — gerçek API alan isimleri */
export interface DiaStock {
  stokkartkodu: string;
  aciklama: string;
  birimadi: string;
  kdvsatis: string;
  kdvalis: string;
  barkodu: string;
  ozelkod1: string;
  ozelkod2: string;
  marka: string;
  fiyat1: string;
  fiyat2: string;
  fiyat3: string;
  gercek_stok: string;
  fiili_stok: string;
  asgarimiktar: string;
  durum: string;
  durum_txt: string;
  stokkartturu: string;
  kodveaciklama: string;
  firmaadi: string;
  _key: string;
}

/** DIA v3 cari kartı — gerçek API alan isimleri */
export interface DiaCari {
  carikartkodu: string;
  unvan: string;
  vergidairesi: string;
  verginumarasi: string;
  tckimlikno: string;
  adres1: string;
  adres2: string;
  sehir: string;
  ilce: string;
  il: string;
  telefon1: string;
  telefon2: string;
  ceptel: string;
  fax: string;
  eposta: string;
  weburl: string;
  ozelkod1: string;
  ozelkod2: string;
  bakiye: string;
  orjbakiye: string;
  borc_fatura_bilgi?: string;
  alacak_fatura_bilgi?: string;
  borc_irsaliye_bilgi?: string;
  alacak_irsaliye_bilgi?: string;
  borctoplam?: string;
  alacaktoplam?: string;
  durum: string;
  durum_txt: string;
  kodveunvan: string;
  firmaadi: string;
  _key: string;
}

/** DIA v3 sipariş — gerçek API alan isimleri */
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

/** DIA v3 fatura — gerçek API alan isimleri */
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

/** DIA v3 teklif — gerçek API alan isimleri */
export interface DiaQuote {
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
  aciklama: string;
  ustislemturuack: string;
  _key: string;
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
    stokkartkodu: stockCode,
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
        const productSlug = mappingMap.get(stock.stokkartkodu);
        if (!productSlug) continue;

        try {
          const gercekStok = parseFloat(stock.gercek_stok) || 0;
          const { error: upsertError } = await supabase
            .from("products")
            .update({
              in_stock: stock.durum === "A" && gercekStok > 0,
              min_order: parseFloat(stock.asgarimiktar) || 0,
              updated_at: new Date().toISOString(),
            })
            .eq("slug", productSlug);

          if (upsertError) {
            result.errors.push(`Stok guncelleme hatasi [${stock.stokkartkodu}]: ${upsertError.message}`);
          } else {
            result.synced++;
          }
        } catch (err) {
          const message = err instanceof Error ? err.message : String(err);
          result.errors.push(`Stok guncelleme hatasi [${stock.stokkartkodu}]: ${message}`);
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
// Product Price Services
// ---------------------------------------------------------------------------

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
  // TODO: Use cariKodu for cari-specific pricing when DIA fiyat kartı is configured
  _cariKodu: string,
): Promise<ProductPrice> {
  const stock = await getStockDetail(stokKodu);

  // Priority: fiyat1 (peşin bayi), then fiyat2 (vadeli bayi)
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

  const prices: ProductPrice[] = stockList.records.map((stock) => ({
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
    carikartkodu: cariCode,
  });
}

// ---------------------------------------------------------------------------
// Cari Balance Service
// ---------------------------------------------------------------------------

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

  // ERS = fatura bazlı borç, EGR = irsaliye bazlı borç
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
        if (!cari.eposta) continue;

        try {
          const { error: upsertError } = await supabase
            .from("profiles")
            .update({
              company_name: cari.unvan,
              tax_number: cari.verginumarasi,
              tax_office: cari.vergidairesi,
              company_address: [cari.adres1, cari.adres2].filter(Boolean).join(" "),
              city: cari.il || cari.sehir,
              district: cari.ilce,
              phone: cari.telefon1 || cari.ceptel,
              updated_at: new Date().toISOString(),
            })
            .eq("email", cari.eposta);

          if (upsertError) {
            result.errors.push(`Cari guncelleme hatasi [${cari.carikartkodu}]: ${upsertError.message}`);
          } else {
            result.synced++;
          }
        } catch (err) {
          const message = err instanceof Error ? err.message : String(err);
          result.errors.push(`Cari guncelleme hatasi [${cari.carikartkodu}]: ${message}`);
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
// Irsaliye (Delivery Note) Services — scf module
// ---------------------------------------------------------------------------

/** DIA v3 irsaliye — gerçek API alan isimleri */
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

export async function getIrsaliyeList(params?: ListParams): Promise<DiaListResponse<DiaIrsaliye>> {
  const client = getDiaClient();
  return client.listService<DiaIrsaliye>("scf", "scf_irsaliye_listele", toDiaListParams(params));
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

// ---------------------------------------------------------------------------
// Invoice (Fatura) Services — scf module
// ---------------------------------------------------------------------------

export async function getInvoiceList(params?: ListParams): Promise<DiaListResponse<DiaInvoice>> {
  const client = getDiaClient();
  return client.listService<DiaInvoice>("scf", "scf_fatura_listele", toDiaListParams(params));
}

/** Fetch invoices filtered by cari code */
export async function getInvoiceListByCari(
  cariKodu: string,
  params?: ListParams,
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
