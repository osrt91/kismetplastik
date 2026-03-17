"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Receipt,
  Download,
  Filter,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  X,
  AlertTriangle,
  MessageCircle,
  CreditCard,
} from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import { supabaseBrowser } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

type InvoiceStatus = "draft" | "issued" | "paid" | "cancelled";

interface Invoice {
  id: string;
  invoice_number: string;
  created_at: string;
  due_date: string | null;
  order_id: string | null;
  order_number: string | null;
  total_amount: number;
  status: InvoiceStatus;
  profile_id: string;
}

const labels: Record<string, Record<string, string>> = {
  tr: {
    title: "Faturalarım",
    invoiceNo: "Fatura No",
    date: "Tarih",
    dueDate: "Vade Tarihi",
    orderNo: "Sipariş No",
    amount: "Tutar",
    status: "Durum",
    actions: "İşlemler",
    download: "PDF İndir",
    empty: "Henüz faturanız bulunmuyor.",
    loading: "Yükleniyor...",
    filter: "Filtrele",
    allStatuses: "Tüm Durumlar",
    from: "Başlangıç",
    to: "Bitiş",
    clearFilters: "Filtreleri Temizle",
    draft: "Taslak",
    issued: "Kesildi",
    paid: "Ödendi",
    cancelled: "İptal",
    totalDebt: "Toplam Borç",
    overdueAmount: "Gecikmiş Tutar",
    paidAmount: "Ödenen Tutar",
    totalInvoices: "Toplam Fatura",
    prev: "Önceki",
    next: "Sonraki",
    page: "Sayfa",
    of: "/",
  },
  en: {
    title: "My Invoices",
    invoiceNo: "Invoice No",
    date: "Date",
    dueDate: "Due Date",
    orderNo: "Order No",
    amount: "Amount",
    status: "Status",
    actions: "Actions",
    download: "Download PDF",
    empty: "You have no invoices yet.",
    loading: "Loading...",
    filter: "Filter",
    allStatuses: "All Statuses",
    from: "From",
    to: "To",
    clearFilters: "Clear Filters",
    draft: "Draft",
    issued: "Issued",
    paid: "Paid",
    cancelled: "Cancelled",
    totalDebt: "Total Debt",
    overdueAmount: "Overdue Amount",
    paidAmount: "Paid Amount",
    totalInvoices: "Total Invoices",
    prev: "Previous",
    next: "Next",
    page: "Page",
    of: "/",
  },
};

const statusConfig: Record<
  InvoiceStatus,
  { bg: string; darkBg: string }
> = {
  draft: {
    bg: "bg-neutral-100 text-neutral-700",
    darkBg: "dark:bg-neutral-700 dark:text-neutral-300",
  },
  issued: {
    bg: "bg-amber-100 text-amber-800",
    darkBg: "dark:bg-amber-900/30 dark:text-amber-400",
  },
  paid: {
    bg: "bg-emerald-100 text-emerald-800",
    darkBg: "dark:bg-emerald-900/30 dark:text-emerald-400",
  },
  cancelled: {
    bg: "bg-red-100 text-red-800",
    darkBg: "dark:bg-red-900/30 dark:text-red-400",
  },
};

const PAGE_SIZE = 20;

function isOverdue(invoice: Invoice): boolean {
  if (invoice.status === "paid" || invoice.status === "cancelled") return false;
  if (!invoice.due_date) return false;
  return new Date(invoice.due_date) < new Date();
}

export default function FaturalarimPage() {
  const { locale } = useLocale();
  const t = labels[locale] || labels.en || labels.tr;

  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    async function loadInvoices() {
      try {
        const supabase = supabaseBrowser();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) return;

        const { data, error } = await supabase
          .from("invoices")
          .select("*")
          .eq("profile_id", user.id)
          .order("created_at", { ascending: false });

        if (!error && data) {
          setInvoices(data as Invoice[]);
        }
      } catch (err) {
        console.error("Failed to load invoices:", err);
      } finally {
        setLoading(false);
      }
    }

    loadInvoices();
  }, []);

  const filteredInvoices = useMemo(() => {
    let result = invoices;

    if (statusFilter) {
      result = result.filter((inv) => inv.status === statusFilter);
    }

    if (dateFrom) {
      const from = new Date(dateFrom);
      result = result.filter((inv) => new Date(inv.created_at) >= from);
    }

    if (dateTo) {
      const to = new Date(dateTo);
      to.setHours(23, 59, 59, 999);
      result = result.filter((inv) => new Date(inv.created_at) <= to);
    }

    return result;
  }, [invoices, statusFilter, dateFrom, dateTo]);

  // Reset page when filters change
  const filterKey = `${statusFilter}-${dateFrom}-${dateTo}`;
  useEffect(() => {
    setPage(1);
  }, [filterKey]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredInvoices.length / PAGE_SIZE));
  const paginatedInvoices = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredInvoices.slice(start, start + PAGE_SIZE);
  }, [filteredInvoices, page]);

  // Summary calculations
  const summary = useMemo(() => {
    const unpaid = invoices.filter(
      (inv) => inv.status === "draft" || inv.status === "issued"
    );
    const totalDebt = unpaid.reduce((sum, inv) => sum + inv.total_amount, 0);

    const overdue = invoices.filter((inv) => isOverdue(inv));
    const overdueAmount = overdue.reduce(
      (sum, inv) => sum + inv.total_amount,
      0
    );

    const paidTotal = invoices
      .filter((inv) => inv.status === "paid")
      .reduce((sum, inv) => sum + inv.total_amount, 0);

    return { totalDebt, overdueAmount, paidTotal, total: invoices.length };
  }, [invoices]);

  const hasActiveFilters = statusFilter || dateFrom || dateTo;

  const clearFilters = () => {
    setStatusFilter("");
    setDateFrom("");
    setDateTo("");
  };

  const handleDownloadPdf = (invoiceId: string) => {
    window.open(`/api/invoices/${invoiceId}/pdf`, "_blank");
  };

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString(locale === "tr" ? "tr-TR" : "en-US");

  const formatAmount = (amount: number) =>
    `${amount.toLocaleString(locale === "tr" ? "tr-TR" : "en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} TL`;

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 animate-pulse rounded-lg bg-neutral-200 dark:bg-neutral-700" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-24 animate-pulse rounded-xl bg-neutral-100 dark:bg-neutral-800"
            />
          ))}
        </div>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-16 animate-pulse rounded-xl bg-neutral-100 dark:bg-neutral-800"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-900/10 text-primary-900 dark:bg-white/10 dark:text-white">
            <Receipt size={22} />
          </div>
          <h2 className="font-display text-2xl font-bold text-[#0A1628] dark:text-white">
            {t.title}
          </h2>
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
            hasActiveFilters
              ? "border-accent-500 bg-accent-50 text-accent-700 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-600"
              : "border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
          }`}
        >
          <Filter size={16} />
          {t.filter}
          <ChevronDown
            size={14}
            className={`transition-transform ${showFilters ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Debt */}
        <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-700 dark:bg-neutral-800">
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            {t.totalDebt}
          </p>
          <p className="mt-1 font-mono text-2xl font-bold text-[#0A1628] dark:text-white">
            {formatAmount(summary.totalDebt)}
          </p>
        </div>

        {/* Overdue Amount */}
        <div
          className={`rounded-xl border p-5 shadow-sm ${
            summary.overdueAmount > 0
              ? "border-red-300 bg-red-50 dark:border-red-800 dark:bg-red-900/20"
              : "border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-800"
          }`}
        >
          <div className="flex items-center gap-2">
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              {t.overdueAmount}
            </p>
            {summary.overdueAmount > 0 && (
              <AlertTriangle size={14} className="text-red-500" />
            )}
          </div>
          <p
            className={`mt-1 font-mono text-2xl font-bold ${
              summary.overdueAmount > 0
                ? "text-red-600 dark:text-red-400"
                : "text-[#0A1628] dark:text-white"
            }`}
          >
            {formatAmount(summary.overdueAmount)}
          </p>
        </div>

        {/* Paid Amount */}
        <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-700 dark:bg-neutral-800">
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            {t.paidAmount}
          </p>
          <p className="mt-1 font-mono text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            {formatAmount(summary.paidTotal)}
          </p>
        </div>

        {/* Total Invoices */}
        <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-700 dark:bg-neutral-800">
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            {t.totalInvoices}
          </p>
          <p className="mt-1 font-mono text-2xl font-bold text-[#0A1628] dark:text-white">
            {summary.total}
          </p>
        </div>
      </div>

      {/* Payment Actions */}
      {summary.totalDebt > 0 && (
        <div className="flex flex-col gap-3 sm:flex-row">
          {/* ERS Online Payment */}
          <a
            href={`/${locale}/bayi-panel/odeme`}
            className="inline-flex items-center gap-2 rounded-xl border border-primary-200 bg-primary-50 px-5 py-3 text-sm font-semibold text-primary-900 transition-colors hover:bg-primary-100 dark:border-primary-800 dark:bg-primary-900/20 dark:text-primary-300 dark:hover:bg-primary-900/30"
          >
            <CreditCard size={18} />
            {locale === "tr" ? "Online Ödeme Yap (ERS)" : "Pay Online (ERS)"}
          </a>

          {/* EGR WhatsApp Payment Request */}
          <a
            href={`https://wa.me/905322117475?text=${encodeURIComponent(
              `EGR Ödeme Talebi\nBorç Tutarı: ${formatAmount(summary.totalDebt)}\n\nÖdeme yapmak istiyorum.`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-3 text-sm font-semibold text-emerald-800 transition-colors hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300 dark:hover:bg-emerald-900/30"
          >
            <MessageCircle size={18} />
            {locale === "tr" ? "EGR Ödeme Talebi (WhatsApp)" : "EGR Payment Request (WhatsApp)"}
          </a>
        </div>
      )}

      {/* Filters */}
      {showFilters && (
        <div className="rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-800">
          <div className="flex flex-wrap items-end gap-4">
            {/* Status filter */}
            <div className="min-w-[160px]">
              <label className="mb-1.5 block text-xs font-medium text-neutral-500 dark:text-neutral-400">
                {t.status}
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-800 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 dark:border-neutral-600 dark:bg-neutral-700 dark:text-neutral-200"
              >
                <option value="">{t.allStatuses}</option>
                <option value="draft">{t.draft}</option>
                <option value="issued">{t.issued}</option>
                <option value="paid">{t.paid}</option>
                <option value="cancelled">{t.cancelled}</option>
              </select>
            </div>

            {/* Date from */}
            <div className="min-w-[160px]">
              <label className="mb-1.5 block text-xs font-medium text-neutral-500 dark:text-neutral-400">
                {t.from}
              </label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-800 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 dark:border-neutral-600 dark:bg-neutral-700 dark:text-neutral-200"
              />
            </div>

            {/* Date to */}
            <div className="min-w-[160px]">
              <label className="mb-1.5 block text-xs font-medium text-neutral-500 dark:text-neutral-400">
                {t.to}
              </label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-800 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 dark:border-neutral-600 dark:bg-neutral-700 dark:text-neutral-200"
              />
            </div>

            {/* Clear filters */}
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
              >
                <X size={14} />
                {t.clearFilters}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Content */}
      {filteredInvoices.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-neutral-300 bg-white py-16 dark:border-neutral-700 dark:bg-neutral-800">
          <Receipt size={48} className="mb-4 text-neutral-300 dark:text-neutral-600" />
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            {t.empty}
          </p>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden overflow-hidden rounded-xl border border-neutral-200 bg-white md:block dark:border-neutral-700 dark:bg-neutral-800">
            <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-100 bg-neutral-50 text-left text-xs font-medium uppercase tracking-wider text-neutral-400 dark:border-neutral-700 dark:bg-neutral-800/80 dark:text-neutral-500">
                  <th className="px-5 py-3">{t.invoiceNo}</th>
                  <th className="px-5 py-3">{t.date}</th>
                  <th className="px-5 py-3">{t.dueDate}</th>
                  <th className="px-5 py-3">{t.amount}</th>
                  <th className="px-5 py-3">{t.status}</th>
                  <th className="px-5 py-3 text-right">{t.actions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-50 dark:divide-neutral-700">
                {paginatedInvoices.map((invoice) => {
                  const overdue = isOverdue(invoice);
                  return (
                    <tr
                      key={invoice.id}
                      className={`transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-700/50 ${
                        overdue
                          ? "border-l-2 border-l-red-500 bg-red-50/50 dark:bg-red-900/10"
                          : ""
                      }`}
                    >
                      <td className="px-5 py-4 font-mono font-medium text-[#0A1628] dark:text-white">
                        {invoice.invoice_number}
                      </td>
                      <td className="px-5 py-4 text-neutral-500 dark:text-neutral-400">
                        {formatDate(invoice.created_at)}
                      </td>
                      <td
                        className={`px-5 py-4 ${
                          overdue
                            ? "font-medium text-red-600 dark:text-red-400"
                            : "text-neutral-500 dark:text-neutral-400"
                        }`}
                      >
                        {invoice.due_date ? formatDate(invoice.due_date) : "-"}
                      </td>
                      <td className="px-5 py-4 font-mono font-medium text-[#0A1628] dark:text-white">
                        {formatAmount(invoice.total_amount)}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${statusConfig[invoice.status]?.bg || "bg-neutral-100 text-neutral-800"} ${statusConfig[invoice.status]?.darkBg || ""}`}
                        >
                          {t[invoice.status] || invoice.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button
                          onClick={() => handleDownloadPdf(invoice.id)}
                          className="inline-flex h-10 items-center gap-1.5 rounded-lg px-3 text-xs font-medium text-[#0A1628] transition-colors hover:bg-primary-50 dark:text-neutral-300 dark:hover:bg-neutral-700"
                          title={t.download}
                        >
                          <Download size={14} />
                          PDF
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            </div>
          </div>

          {/* Mobile Cards */}
          <div className="space-y-3 md:hidden">
            {paginatedInvoices.map((invoice) => {
              const overdue = isOverdue(invoice);
              return (
                <div
                  key={invoice.id}
                  className={`rounded-xl border bg-white p-4 dark:bg-neutral-800 ${
                    overdue
                      ? "border-red-300 dark:border-red-800"
                      : "border-neutral-200 dark:border-neutral-700"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-mono font-medium text-[#0A1628] dark:text-white">
                        {invoice.invoice_number}
                      </p>
                      <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
                        {formatDate(invoice.created_at)}
                      </p>
                    </div>
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${statusConfig[invoice.status]?.bg || "bg-neutral-100 text-neutral-800"} ${statusConfig[invoice.status]?.darkBg || ""}`}
                    >
                      {t[invoice.status] || invoice.status}
                    </span>
                  </div>

                  {/* Due date row */}
                  {invoice.due_date && (
                    <div className="mt-2">
                      <span className="text-xs text-neutral-500 dark:text-neutral-400">
                        {t.dueDate}:{" "}
                      </span>
                      <span
                        className={`text-xs font-medium ${
                          overdue
                            ? "text-red-600 dark:text-red-400"
                            : "text-neutral-700 dark:text-neutral-300"
                        }`}
                      >
                        {formatDate(invoice.due_date)}
                      </span>
                      {overdue && (
                        <AlertTriangle
                          size={12}
                          className="ml-1 inline text-red-500"
                        />
                      )}
                    </div>
                  )}

                  <div className="mt-3 flex items-center justify-between border-t border-neutral-100 pt-3 dark:border-neutral-700">
                    <div className="space-y-1">
                      {invoice.order_number && (
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">
                          {t.orderNo}: {invoice.order_number}
                        </p>
                      )}
                      <p
                        className={`font-mono text-sm font-semibold ${
                          overdue
                            ? "text-red-600 dark:text-red-400"
                            : "text-[#0A1628] dark:text-white"
                        }`}
                      >
                        {formatAmount(invoice.total_amount)}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDownloadPdf(invoice.id)}
                      className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-neutral-200 px-3 text-xs font-medium text-[#0A1628] transition-colors hover:bg-neutral-50 dark:border-neutral-600 dark:text-neutral-300 dark:hover:bg-neutral-700"
                    >
                      <Download size={14} />
                      {t.download}
                    </button>
                  </div>
                </div>
              );
            })}
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
