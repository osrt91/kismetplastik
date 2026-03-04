"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, ClipboardList, ChevronLeft, ChevronRight } from "lucide-react";
import type { QuoteStatus } from "@/types/database";

interface QuoteRow {
  id: string;
  company_name: string;
  contact_name: string;
  email: string;
  status: QuoteStatus;
  total_amount: number | null;
  created_at: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
}

const STATUS_LABELS: Record<QuoteStatus, string> = {
  pending: "Beklemede",
  reviewing: "İnceleniyor",
  quoted: "Yanıtlandı",
  accepted: "Kabul Edildi",
  rejected: "Reddedildi",
};

const STATUS_COLORS: Record<QuoteStatus, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  reviewing: "bg-blue-100 text-blue-800",
  quoted: "bg-purple-100 text-purple-800",
  accepted: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
};

const STATUS_FILTERS: { value: string; label: string }[] = [
  { value: "", label: "Tümü" },
  { value: "pending", label: "Beklemede" },
  { value: "reviewing", label: "İnceleniyor" },
  { value: "quoted", label: "Yanıtlandı" },
  { value: "accepted", label: "Kabul Edildi" },
  { value: "rejected", label: "Reddedildi" },
];

const LIMIT = 20;

export default function AdminQuotesPage() {
  const router = useRouter();

  const [quotes, setQuotes] = useState<QuoteRow[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: LIMIT,
    total: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);

  const fetchQuotes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(LIMIT),
      });
      if (statusFilter) params.set("status", statusFilter);
      if (search) params.set("search", search);

      const res = await fetch(`/api/admin/quotes?${params.toString()}`);
      const json = await res.json();

      if (!json.success) {
        setError(json.error ?? "Bir hata oluştu");
        return;
      }

      setQuotes(json.data ?? []);
      setPagination(json.pagination ?? { page, limit: LIMIT, total: 0 });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Bağlantı hatası");
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, search]);

  useEffect(() => {
    fetchQuotes();
  }, [fetchQuotes]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [statusFilter, search]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
  };

  const totalPages = Math.max(1, Math.ceil(pagination.total / LIMIT));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Teklifler</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {pagination.total} teklif talebi
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <form onSubmit={handleSearchSubmit} className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Firma veya kişi adı ile ara..."
            className="w-full rounded-lg border border-border bg-card py-2.5 pl-9 pr-4 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </form>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-border bg-card px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        >
          {STATUS_FILTERS.map((f) => (
            <option key={f.value} value={f.value}>
              {f.label}
            </option>
          ))}
        </select>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted">
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">
                  Firma
                </th>
                <th className="hidden px-4 py-3 text-left font-semibold text-muted-foreground sm:table-cell">
                  Yetkili
                </th>
                <th className="hidden px-4 py-3 text-left font-semibold text-muted-foreground md:table-cell">
                  E-posta
                </th>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">
                  Durum
                </th>
                <th className="hidden px-4 py-3 text-right font-semibold text-muted-foreground lg:table-cell">
                  Tutar
                </th>
                <th className="hidden px-4 py-3 text-left font-semibold text-muted-foreground xl:table-cell">
                  Tarih
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-border">
                    <td colSpan={6} className="px-4 py-3">
                      <div className="h-4 w-full animate-pulse rounded bg-muted" />
                    </td>
                  </tr>
                ))
              ) : quotes.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                      <ClipboardList size={40} className="mb-3 opacity-30" />
                      <p className="text-sm font-medium">Teklif bulunamadı</p>
                      <p className="text-xs">
                        Arama veya filtre kriterlerini değiştirmeyi deneyin
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                quotes.map((quote) => (
                  <tr
                    key={quote.id}
                    onClick={() => router.push(`/admin/quotes/${quote.id}`)}
                    className="cursor-pointer border-b border-border transition-colors last:border-0 hover:bg-muted/50"
                  >
                    <td className="px-4 py-3 font-medium text-foreground">
                      {quote.company_name}
                    </td>
                    <td className="hidden px-4 py-3 text-muted-foreground sm:table-cell">
                      {quote.contact_name}
                    </td>
                    <td className="hidden px-4 py-3 text-muted-foreground md:table-cell">
                      {quote.email}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[quote.status]}`}
                      >
                        {STATUS_LABELS[quote.status]}
                      </span>
                    </td>
                    <td className="hidden px-4 py-3 text-right text-muted-foreground lg:table-cell">
                      {quote.total_amount != null
                        ? `${quote.total_amount.toLocaleString("tr-TR")} ₺`
                        : "—"}
                    </td>
                    <td className="hidden px-4 py-3 text-muted-foreground xl:table-cell">
                      {new Date(quote.created_at).toLocaleDateString("tr-TR")}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            Sayfa {page} / {totalPages} &bull; Toplam {pagination.total} kayıt
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="flex items-center gap-1 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft size={14} />
              Önceki
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="flex items-center gap-1 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
            >
              Sonraki
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
