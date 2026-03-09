"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  FileText,
  Plus,
  Loader2,
  ChevronDown,
  ChevronUp,
  CheckCircle,
} from "lucide-react";
import { toast } from "sonner";
import { useLocale } from "@/contexts/LocaleContext";
import { supabaseBrowser } from "@/lib/supabase/client";
import LocaleLink from "@/components/ui/LocaleLink";
import { cn } from "@/lib/utils";
import type { DbQuoteRequest, DbQuoteItem, QuoteStatus } from "@/types/database";

type QuoteWithItems = DbQuoteRequest & { quote_items: DbQuoteItem[] };

const PAGE_SIZE = 20;

const labels: Record<string, Record<string, string>> = {
  tr: {
    title: "Tekliflerim",
    searchPlaceholder: "Teklif no veya firma adi ara...",
    allStatuses: "Tum Durumlar",
    quoteNo: "Teklif No",
    date: "Tarih",
    productCount: "Urun Sayisi",
    status: "Durum",
    total: "Toplam",
    action: "Islem",
    detail: "Detay",
    newQuote: "Yeni Teklif Iste",
    empty: "Henuz teklif talebiniz bulunmuyor.",
    emptyDesc: "Teklif istediginizde burada goruntulenecektir.",
    loading: "Yukleniyor...",
    prev: "Onceki",
    next: "Sonraki",
    page: "Sayfa",
    of: "/",
    items: "urun",
    pending: "Beklemede",
    reviewing: "Inceleniyor",
    quoted: "Fiyatlandirildi",
    accepted: "Onaylandi",
    rejected: "Reddedildi",
    error: "Teklifler yuklenirken bir hata olustu.",
    validUntil: "Gecerlilik",
    response: "Yanit",
    noResponse: "Henuz yanitlanmadi",
    requestedProducts: "Talep Edilen Urunler",
    product: "Urun",
    qty: "Adet",
    unitPrice: "Birim Fiyat",
    lineTotal: "Tutar",
    awaiting: "Fiyat bekleniyor",
    convertToOrder: "Onayla ve Siparise Donustur",
    converting: "Donusturuluyor...",
    convertSuccess: "Siparis basariyla olusturuldu",
    convertError: "Siparis olusturulurken hata olustu",
  },
  en: {
    title: "My Quotes",
    searchPlaceholder: "Search by quote number or company...",
    allStatuses: "All Statuses",
    quoteNo: "Quote No",
    date: "Date",
    productCount: "Products",
    status: "Status",
    total: "Total",
    action: "Action",
    detail: "Detail",
    newQuote: "Request New Quote",
    empty: "You don't have any quote requests yet.",
    emptyDesc: "Your quote requests will appear here.",
    loading: "Loading...",
    prev: "Previous",
    next: "Next",
    page: "Page",
    of: "/",
    items: "items",
    pending: "Pending",
    reviewing: "Reviewing",
    quoted: "Quoted",
    accepted: "Accepted",
    rejected: "Rejected",
    error: "An error occurred while loading quotes.",
    validUntil: "Valid Until",
    response: "Response",
    noResponse: "Not yet responded",
    requestedProducts: "Requested Products",
    product: "Product",
    qty: "Qty",
    unitPrice: "Unit Price",
    lineTotal: "Total",
    awaiting: "Awaiting pricing",
    convertToOrder: "Approve & Convert to Order",
    converting: "Converting...",
    convertSuccess: "Order created successfully",
    convertError: "Error creating order",
  },
};

const statusOptions: QuoteStatus[] = ["pending", "reviewing", "quoted", "accepted", "rejected"];

const statusBadgeColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-700",
  reviewing: "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-700",
  quoted: "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-700",
  accepted: "bg-green-100 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-400 dark:border-green-700",
  rejected: "bg-red-100 text-red-800 border-red-300 dark:bg-red-900/30 dark:text-red-400 dark:border-red-700",
};

function QuoteStatusBadge({ status, locale = "tr" }: { status: string; locale?: string }) {
  const t = labels[locale] || labels.tr;
  const color = statusBadgeColors[status] || "bg-neutral-100 text-neutral-800 border-neutral-300";
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        color
      )}
    >
      {t[status] || status}
    </span>
  );
}

export default function TekliflerimPage() {
  const { locale } = useLocale();
  const t = labels[locale] || labels.tr;

  const [quotes, setQuotes] = useState<QuoteWithItems[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [convertingId, setConvertingId] = useState<string | null>(null);

  const handleConvertToOrder = async (quote: QuoteWithItems) => {
    if (convertingId) return;
    setConvertingId(quote.id);

    try {
      const supabase = supabaseBrowser();

      // Map quote items to order format
      const items = quote.quote_items.map((item) => ({
        stokKodu: item.product_name,
        stokAdi: item.product_name,
        miktar: item.quantity,
        birimFiyat: item.unit_price ?? 0,
      }));

      // Create order via dealer orders API
      const res = await fetch("/api/dealer/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          aciklama: `Teklif #${quote.id.slice(0, 8).toUpperCase()} onaylanarak siparise donusturuldu`,
        }),
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.error || t.convertError);
      }

      // Update quote status to accepted
      const { error: updateError } = await supabase
        .from("quote_requests")
        .update({ status: "accepted" })
        .eq("id", quote.id);

      if (updateError) {
        console.error("[Convert to order] Quote status update failed:", updateError);
      }

      toast.success(t.convertSuccess);
      fetchQuotes();
    } catch (err) {
      const message = err instanceof Error ? err.message : t.convertError;
      toast.error(message);
    } finally {
      setConvertingId(null);
    }
  };

  const fetchQuotes = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const supabase = supabaseBrowser();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setError(t.error);
        setLoading(false);
        return;
      }

      let query = supabase
        .from("quote_requests")
        .select("*, quote_items(*)", { count: "exact" })
        .eq("profile_id", user.id)
        .order("created_at", { ascending: false });

      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter);
      }

      if (search.trim()) {
        query = query.or(
          `company_name.ilike.%${search.trim()}%,contact_name.ilike.%${search.trim()}%`
        );
      }

      const from = (page - 1) * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;
      query = query.range(from, to);

      const { data, error: fetchError, count } = await query;

      if (fetchError) {
        setError(t.error);
        setLoading(false);
        return;
      }

      setQuotes((data || []) as QuoteWithItems[]);
      setTotalCount(count || 0);
    } catch {
      setError(t.error);
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, search, t.error]);

  useEffect(() => {
    fetchQuotes();
  }, [fetchQuotes]);

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString(locale === "en" ? "en-US" : "tr-TR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat(locale === "en" ? "en-US" : "tr-TR", {
      style: "currency",
      currency: "TRY",
      minimumFractionDigits: 2,
    }).format(amount);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="font-display text-2xl font-bold text-[#0A1628] dark:text-white">{t.title}</h1>
        <LocaleLink
          href="/bayi-panel/urunler"
          className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-amber-600"
        >
          <Plus size={16} />
          {t.newQuote}
        </LocaleLink>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full rounded-lg border border-neutral-200 bg-white py-2.5 pl-10 pr-4 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:placeholder:text-neutral-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-neutral-200 bg-white px-4 py-2.5 text-sm text-neutral-700 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
        >
          <option value="all">{t.allStatuses}</option>
          {statusOptions.map((s) => (
            <option key={s} value={s}>
              {t[s]}
            </option>
          ))}
        </select>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={32} className="animate-spin text-amber-500" />
          <span className="ml-3 text-sm text-neutral-500">{t.loading}</span>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center dark:border-red-800 dark:bg-red-900/20">
          <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && quotes.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-neutral-200 bg-white py-20 dark:border-neutral-700 dark:bg-neutral-800">
          <FileText size={48} className="text-neutral-300 dark:text-neutral-600" />
          <p className="mt-4 text-lg font-medium text-neutral-600 dark:text-neutral-300">{t.empty}</p>
          <p className="mt-1 text-sm text-neutral-400 dark:text-neutral-500">{t.emptyDesc}</p>
        </div>
      )}

      {/* Desktop table */}
      {!loading && !error && quotes.length > 0 && (
        <>
          <div className="hidden overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-sm md:block dark:border-neutral-700 dark:bg-neutral-800">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-100 bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900">
                  <th className="w-8 px-4 py-3" />
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">
                    {t.quoteNo}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">
                    {t.date}
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-neutral-500">
                    {t.productCount}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">
                    {t.status}
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-neutral-500">
                    {t.total}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-700">
                {quotes.map((quote) => (
                  <>
                    <tr
                      key={quote.id}
                      onClick={() => toggleExpand(quote.id)}
                      className="cursor-pointer transition-colors hover:bg-neutral-50/50 dark:hover:bg-neutral-700/50"
                    >
                      <td className="px-4 py-3.5 text-neutral-400">
                        {expandedId === quote.id ? (
                          <ChevronUp size={16} />
                        ) : (
                          <ChevronDown size={16} />
                        )}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="font-mono text-sm font-semibold text-[#0A1628] dark:text-white">
                          #{quote.id.slice(0, 8).toUpperCase()}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-sm text-neutral-600 dark:text-neutral-400">
                        {formatDate(quote.created_at)}
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <span className="font-mono text-sm text-neutral-700">
                          {quote.quote_items?.length || 0}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <QuoteStatusBadge status={quote.status} locale={locale} />
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <span className="font-mono text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                          {quote.total_amount
                            ? formatCurrency(quote.total_amount)
                            : "-"}
                        </span>
                      </td>
                    </tr>
                    {/* Expanded detail */}
                    {expandedId === quote.id && (
                      <tr key={`${quote.id}-detail`}>
                        <td colSpan={6} className="bg-neutral-50/50 px-6 py-4 dark:bg-neutral-900/50">
                          <div className="space-y-3">
                            {/* Quote items */}
                            {quote.quote_items && quote.quote_items.length > 0 && (
                              <div>
                                <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                                  {t.requestedProducts}
                                </h4>
                                <div className="mt-2 overflow-hidden rounded-md border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-800">
                                  <table className="w-full text-sm">
                                    <thead>
                                      <tr className="border-b border-neutral-100 bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900">
                                        <th className="px-3 py-2 text-left text-xs font-medium text-neutral-500">
                                          {t.product}
                                        </th>
                                        <th className="px-3 py-2 text-center text-xs font-medium text-neutral-500">
                                          {t.qty}
                                        </th>
                                        <th className="px-3 py-2 text-right text-xs font-medium text-neutral-500">
                                          {t.unitPrice}
                                        </th>
                                        <th className="px-3 py-2 text-right text-xs font-medium text-neutral-500">
                                          {t.lineTotal}
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-neutral-100 dark:divide-neutral-700">
                                      {quote.quote_items.map((item) => (
                                        <tr key={item.id}>
                                          <td className="px-3 py-2 text-neutral-800">
                                            {item.product_name}
                                          </td>
                                          <td className="px-3 py-2 text-center font-mono text-neutral-700">
                                            {item.quantity.toLocaleString()}
                                          </td>
                                          <td className="px-3 py-2 text-right font-mono text-neutral-700">
                                            {item.unit_price
                                              ? formatCurrency(item.unit_price)
                                              : t.awaiting}
                                          </td>
                                          <td className="px-3 py-2 text-right font-mono font-semibold text-neutral-900">
                                            {item.unit_price
                                              ? formatCurrency(
                                                  item.quantity * item.unit_price
                                                )
                                              : "-"}
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            )}

                            {/* Response */}
                            {quote.response_message && (
                              <div className="rounded-md border border-blue-100 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-900/20">
                                <h4 className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                                  {t.response}
                                </h4>
                                <p className="mt-1 text-sm text-blue-800 dark:text-blue-300">
                                  {quote.response_message}
                                </p>
                              </div>
                            )}

                            {/* Valid until */}
                            {quote.valid_until && (
                              <p className="text-xs text-neutral-500">
                                {t.validUntil}: {formatDate(quote.valid_until)}
                              </p>
                            )}

                            {/* Convert to order button */}
                            {quote.status === "quoted" && quote.total_amount && (
                              <div className="flex justify-end pt-2">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleConvertToOrder(quote);
                                  }}
                                  disabled={convertingId === quote.id}
                                  className={cn(
                                    "inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition-colors",
                                    convertingId === quote.id
                                      ? "cursor-not-allowed bg-green-400"
                                      : "bg-green-600 hover:bg-green-700"
                                  )}
                                >
                                  {convertingId === quote.id ? (
                                    <Loader2 size={16} className="animate-spin" />
                                  ) : (
                                    <CheckCircle size={16} />
                                  )}
                                  {convertingId === quote.id
                                    ? t.converting
                                    : t.convertToOrder}
                                </button>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="space-y-3 md:hidden">
            {quotes.map((quote) => (
              <div
                key={quote.id}
                className="rounded-lg border border-neutral-200 bg-white shadow-sm dark:border-neutral-700 dark:bg-neutral-800"
              >
                <button
                  onClick={() => toggleExpand(quote.id)}
                  className="flex w-full items-start justify-between p-4 text-left"
                >
                  <div>
                    <p className="font-mono text-sm font-semibold text-[#0A1628] dark:text-white">
                      #{quote.id.slice(0, 8).toUpperCase()}
                    </p>
                    <p className="mt-0.5 text-xs text-neutral-400">
                      {formatDate(quote.created_at)} -{" "}
                      <span className="font-mono">
                        {quote.quote_items?.length || 0}
                      </span>{" "}
                      {t.items}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <QuoteStatusBadge status={quote.status} locale={locale} />
                    {expandedId === quote.id ? (
                      <ChevronUp size={16} className="text-neutral-400" />
                    ) : (
                      <ChevronDown size={16} className="text-neutral-400" />
                    )}
                  </div>
                </button>

                {expandedId === quote.id && (
                  <div className="border-t border-neutral-100 px-4 pb-4 pt-3 dark:border-neutral-700">
                    {quote.total_amount && (
                      <p className="text-sm text-neutral-700 dark:text-neutral-300">
                        {t.total}:{" "}
                        <span className="font-mono font-semibold">
                          {formatCurrency(quote.total_amount)}
                        </span>
                      </p>
                    )}
                    {quote.quote_items && quote.quote_items.length > 0 && (
                      <div className="mt-2 space-y-1.5">
                        {quote.quote_items.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between text-xs"
                          >
                            <span className="text-neutral-700">{item.product_name}</span>
                            <span className="font-mono text-neutral-500">
                              x{item.quantity.toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                    {quote.response_message && (
                      <div className="mt-3 rounded-md bg-blue-50 p-2 dark:bg-blue-900/20">
                        <p className="text-xs text-blue-800 dark:text-blue-300">{quote.response_message}</p>
                      </div>
                    )}

                    {/* Convert to order button (mobile) */}
                    {quote.status === "quoted" && quote.total_amount && (
                      <div className="mt-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleConvertToOrder(quote);
                          }}
                          disabled={convertingId === quote.id}
                          className={cn(
                            "inline-flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition-colors",
                            convertingId === quote.id
                              ? "cursor-not-allowed bg-green-400"
                              : "bg-green-600 hover:bg-green-700"
                          )}
                        >
                          {convertingId === quote.id ? (
                            <Loader2 size={16} className="animate-spin" />
                          ) : (
                            <CheckCircle size={16} />
                          )}
                          {convertingId === quote.id
                            ? t.converting
                            : t.convertToOrder}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between rounded-lg border border-neutral-200 bg-white px-4 py-3 dark:border-neutral-700 dark:bg-neutral-800">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className={cn(
                  "flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                  page === 1
                    ? "cursor-not-allowed text-neutral-300"
                    : "text-neutral-600 hover:bg-neutral-100"
                )}
              >
                <ChevronLeft size={16} />
                {t.prev}
              </button>
              <span className="text-sm text-neutral-500">
                {t.page} {page} {t.of} {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className={cn(
                  "flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                  page === totalPages
                    ? "cursor-not-allowed text-neutral-300"
                    : "text-neutral-600 hover:bg-neutral-100"
                )}
              >
                {t.next}
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
