"use client";

import { useState, useEffect } from "react";
import {
  FileText,
  Search,
  Clock,
  Eye,
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronUp,
  Calendar,
  DollarSign,
  Loader2,
} from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import { getSupabaseBrowser } from "@/lib/supabase-browser";

interface QuoteItem {
  id: string;
  product_name: string;
  quantity: number;
  notes: string | null;
}

interface QuoteRequest {
  id: string;
  status: string;
  company_name: string;
  contact_name: string | null;
  total_amount: number | null;
  valid_until: string | null;
  created_at: string;
  quote_items: QuoteItem[];
}

const statusConfig: Record<string, { icon: typeof Clock; color: string; bg: string }> = {
  pending: { icon: Clock, color: "text-amber-600", bg: "bg-amber-50 border-amber-200" },
  reviewing: { icon: Eye, color: "text-blue-600", bg: "bg-blue-50 border-blue-200" },
  quoted: { icon: DollarSign, color: "text-indigo-600", bg: "bg-indigo-50 border-indigo-200" },
  accepted: { icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-200" },
  rejected: { icon: XCircle, color: "text-red-600", bg: "bg-red-50 border-red-200" },
};

const statusKeys = ["pending", "reviewing", "quoted", "accepted", "rejected"];

const labels: Record<string, Record<string, string>> = {
  tr: {
    title: "Tekliflerim",
    search: "Firma adı veya kişi adı ile ara...",
    all: "Tümü",
    pending: "Bekliyor",
    reviewing: "İnceleniyor",
    quoted: "Fiyatlandırıldı",
    accepted: "Kabul Edildi",
    rejected: "Reddedildi",
    date: "Tarih",
    company: "Firma",
    items: "Ürünler",
    total: "Toplam",
    status: "Durum",
    validUntil: "Geçerlilik",
    noQuotes: "Henüz teklif talebiniz bulunmuyor.",
    loading: "Yükleniyor...",
    quantity: "adet",
    product: "Ürün",
    notes: "Not",
    amount: "Tutar",
  },
  en: {
    title: "My Quotes",
    search: "Search by company or contact name...",
    all: "All",
    pending: "Pending",
    reviewing: "Reviewing",
    quoted: "Quoted",
    accepted: "Accepted",
    rejected: "Rejected",
    date: "Date",
    company: "Company",
    items: "Products",
    total: "Total",
    status: "Status",
    validUntil: "Valid Until",
    noQuotes: "You don't have any quote requests yet.",
    loading: "Loading...",
    quantity: "pcs",
    product: "Product",
    notes: "Note",
    amount: "Amount",
  },
};

export default function TekliflerimPage() {
  const { locale } = useLocale();
  const t = labels[locale] || labels.tr;

  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    async function loadQuotes() {
      try {
        const supabase = getSupabaseBrowser();
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) return;

        let query = supabase
          .from("quote_requests")
          .select("*, quote_items(*)")
          .eq("profile_id", user.id)
          .order("created_at", { ascending: false });

        if (filter !== "all") {
          query = query.eq("status", filter);
        }

        const { data } = await query;
        setQuotes((data as QuoteRequest[]) || []);
      } catch (err) {
        console.error("Quotes load error:", err);
      } finally {
        setLoading(false);
      }
    }

    setLoading(true);
    loadQuotes();
  }, [filter]);

  const filtered = search
    ? quotes.filter(
        (q) =>
          q.company_name?.toLowerCase().includes(search.toLowerCase()) ||
          q.contact_name?.toLowerCase().includes(search.toLowerCase())
      )
    : quotes;

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex items-center gap-3 text-neutral-500">
          <Loader2 size={24} className="animate-spin text-primary-500" />
          {t.loading}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-primary-900">{t.title}</h2>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t.search}
            className="w-full rounded-lg border border-neutral-200 py-2.5 pl-10 pr-4 text-sm outline-none transition-colors focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {["all", ...statusKeys].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                filter === s
                  ? "bg-primary-900 text-white"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
              }`}
            >
              {t[s]}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-neutral-200 bg-white py-16 text-center">
          <FileText size={48} className="mx-auto mb-4 text-neutral-300" />
          <p className="text-neutral-500">{t.noQuotes}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((quote) => {
            const config = statusConfig[quote.status] || statusConfig.pending;
            const StatusIcon = config.icon;
            const isExpanded = expandedId === quote.id;

            return (
              <div
                key={quote.id}
                className="overflow-hidden rounded-xl border border-neutral-200 bg-white transition-shadow hover:shadow-md"
              >
                <button
                  onClick={() => setExpandedId(isExpanded ? null : quote.id)}
                  className="flex w-full items-center gap-4 p-4 text-left"
                >
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border ${config.bg}`}
                  >
                    <StatusIcon size={20} className={config.color} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-primary-900">
                        {quote.company_name}
                      </span>
                      <span
                        className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${config.bg} ${config.color}`}
                      >
                        {t[quote.status]}
                      </span>
                    </div>
                    <div className="mt-0.5 flex items-center gap-3 text-xs text-neutral-400">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        {new Date(quote.created_at).toLocaleDateString(
                          locale === "tr" ? "tr-TR" : "en-US"
                        )}
                      </span>
                      <span>
                        {quote.quote_items?.length || 0} {t.items}
                      </span>
                      {quote.valid_until && (
                        <span className="flex items-center gap-1 text-indigo-500">
                          <Clock size={12} />
                          {new Date(quote.valid_until).toLocaleDateString(
                            locale === "tr" ? "tr-TR" : "en-US"
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    {quote.total_amount != null ? (
                      <p className="text-sm font-bold text-primary-900">
                        {quote.total_amount.toLocaleString("tr-TR", {
                          style: "currency",
                          currency: "TRY",
                        })}
                      </p>
                    ) : (
                      <p className="text-xs italic text-neutral-400">—</p>
                    )}
                  </div>
                  {isExpanded ? (
                    <ChevronUp size={18} className="text-neutral-400" />
                  ) : (
                    <ChevronDown size={18} className="text-neutral-400" />
                  )}
                </button>

                {isExpanded && (
                  <div className="border-t border-neutral-100 bg-neutral-50 p-4">
                    {quote.valid_until && (
                      <div className="mb-4 flex items-center gap-2 rounded-lg bg-indigo-50 p-3 text-sm">
                        <Calendar size={16} className="text-indigo-600" />
                        <span className="font-medium text-indigo-800">
                          {t.validUntil}:{" "}
                          {new Date(quote.valid_until).toLocaleDateString(
                            locale === "tr" ? "tr-TR" : "en-US"
                          )}
                        </span>
                      </div>
                    )}

                    <div className="space-y-2">
                      {quote.quote_items?.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between rounded-lg bg-white p-3"
                        >
                          <div>
                            <p className="text-sm font-medium text-primary-900">
                              {item.product_name}
                            </p>
                            <p className="text-xs text-neutral-400">
                              {item.quantity} {t.quantity}
                            </p>
                            {item.notes && (
                              <p className="mt-0.5 text-xs italic text-neutral-400">
                                {item.notes}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
