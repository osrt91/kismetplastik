"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Save,
  Send,
  Building2,
  User,
  Mail,
  Phone,
  ClipboardList,
  Loader2,
} from "lucide-react";
import type { QuoteStatus, DbQuoteItem } from "@/types/database";

interface QuoteDetail {
  id: string;
  company_name: string;
  contact_name: string;
  email: string;
  phone: string;
  message: string | null;
  status: QuoteStatus;
  admin_notes: string | null;
  response_message: string | null;
  total_amount: number | null;
  valid_until: string | null;
  created_at: string;
  updated_at: string;
  quote_items: DbQuoteItem[];
}

const STATUS_LABELS: Record<QuoteStatus, string> = {
  pending: "Beklemede",
  reviewing: "İnceleniyor",
  quoted: "Yanıtlandı",
  accepted: "Kabul Edildi",
  rejected: "Reddedildi",
};

const STATUS_COLORS: Record<QuoteStatus, string> = {
  pending: "bg-amber-500/10 text-amber-600",
  reviewing: "bg-blue-500/10 text-blue-600",
  quoted: "bg-indigo-500/10 text-indigo-600",
  accepted: "bg-emerald-500/10 text-emerald-600",
  rejected: "bg-destructive/10 text-destructive",
};

const ALL_STATUSES: QuoteStatus[] = [
  "pending",
  "reviewing",
  "quoted",
  "accepted",
  "rejected",
];

export default function AdminQuoteDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const [quote, setQuote] = useState<QuoteDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Editable fields
  const [status, setStatus] = useState<QuoteStatus>("pending");
  const [adminNotes, setAdminNotes] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [validUntil, setValidUntil] = useState("");

  // UI state
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const [responding, setResponding] = useState(false);
  const [respondSuccess, setRespondSuccess] = useState(false);
  const [respondError, setRespondError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuote = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/admin/quotes/${id}`);
        const json = await res.json();
        if (!json.success) {
          setError(json.error ?? "Teklif yüklenemedi");
          return;
        }
        const q: QuoteDetail = json.data;
        setQuote(q);
        setStatus(q.status);
        setAdminNotes(q.admin_notes ?? "");
        setResponseMessage(q.response_message ?? "");
        setTotalAmount(q.total_amount != null ? String(q.total_amount) : "");
        setValidUntil(
          q.valid_until ? q.valid_until.slice(0, 10) : ""
        );
      } catch (e) {
        setError(e instanceof Error ? e.message : "Bağlantı hatası");
      } finally {
        setLoading(false);
      }
    };
    fetchQuote();
  }, [id]);

  const handleSave = async () => {
    setSaving(true);
    setSaveSuccess(false);
    setSaveError(null);
    try {
      const body: Record<string, unknown> = {
        status,
        admin_notes: adminNotes || null,
        response_message: responseMessage || null,
        total_amount: totalAmount !== "" ? parseFloat(totalAmount) : null,
        valid_until: validUntil || null,
      };
      const res = await fetch(`/api/admin/quotes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (!json.success) {
        setSaveError(json.error ?? "Kayıt başarısız");
        return;
      }
      setSaveSuccess(true);
      setQuote((prev) =>
        prev ? { ...prev, ...json.data } : prev
      );
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : "Bağlantı hatası");
    } finally {
      setSaving(false);
    }
  };

  const handleRespond = async () => {
    if (!responseMessage.trim()) {
      setRespondError("Yanıt mesajı boş olamaz");
      return;
    }
    setResponding(true);
    setRespondSuccess(false);
    setRespondError(null);
    try {
      const res = await fetch(`/api/admin/quotes/${id}/respond`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: responseMessage }),
      });
      const json = await res.json();
      if (!json.success) {
        setRespondError(json.error ?? "Yanıt gönderilemedi");
        return;
      }
      setRespondSuccess(true);
      setStatus("quoted");
      setQuote((prev) =>
        prev ? { ...prev, ...json.data } : prev
      );
      setTimeout(() => setRespondSuccess(false), 4000);
    } catch (e) {
      setRespondError(e instanceof Error ? e.message : "Bağlantı hatası");
    } finally {
      setResponding(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 size={32} className="animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !quote) {
    return (
      <div className="space-y-4">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft size={16} />
          Geri
        </button>
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error ?? "Teklif bulunamadı"}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/admin/quotes")}
            className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {quote.company_name}
            </h1>
            <div className="mt-1 flex items-center gap-2">
              <span
                className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[quote.status]}`}
              >
                {STATUS_LABELS[quote.status]}
              </span>
              <span className="text-xs text-muted-foreground">
                {new Date(quote.created_at).toLocaleDateString("tr-TR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Save size={16} />
          )}
          Kaydet
        </button>
      </div>

      {/* Save feedback */}
      {saveSuccess && (
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-2.5 text-sm text-green-700">
          Değişiklikler kaydedildi.
        </div>
      )}
      {saveError && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-2.5 text-sm text-destructive">
          {saveError}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left column */}
        <div className="space-y-6 lg:col-span-2">
          {/* Contact Info */}
          <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-base font-semibold text-foreground">
              <Building2 size={16} />
              İletişim Bilgileri
            </h2>
            <dl className="grid gap-3 sm:grid-cols-2">
              <div>
                <dt className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                  <Building2 size={12} />
                  Firma
                </dt>
                <dd className="mt-0.5 text-sm font-medium text-foreground">
                  {quote.company_name}
                </dd>
              </div>
              <div>
                <dt className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                  <User size={12} />
                  Yetkili
                </dt>
                <dd className="mt-0.5 text-sm text-foreground">
                  {quote.contact_name}
                </dd>
              </div>
              <div>
                <dt className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                  <Mail size={12} />
                  E-posta
                </dt>
                <dd className="mt-0.5 text-sm text-foreground">
                  <a
                    href={`mailto:${quote.email}`}
                    className="text-primary hover:underline"
                  >
                    {quote.email}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                  <Phone size={12} />
                  Telefon
                </dt>
                <dd className="mt-0.5 text-sm text-foreground">
                  {quote.phone || "—"}
                </dd>
              </div>
            </dl>

            {quote.message && (
              <div className="mt-4 border-t border-border pt-4">
                <dt className="text-xs font-medium text-muted-foreground">
                  Müşteri Notu
                </dt>
                <dd className="mt-1 text-sm text-foreground whitespace-pre-wrap">
                  {quote.message}
                </dd>
              </div>
            )}
          </section>

          {/* Quote Items */}
          {quote.quote_items && quote.quote_items.length > 0 && (
            <section className="rounded-xl border border-border bg-card shadow-sm">
              <div className="flex items-center gap-2 border-b border-border px-5 py-4">
                <ClipboardList size={16} />
                <h2 className="text-base font-semibold text-foreground">
                  Teklif Kalemleri
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted">
                      <th className="px-4 py-3 text-left font-semibold text-muted-foreground">
                        Ürün
                      </th>
                      <th className="px-4 py-3 text-right font-semibold text-muted-foreground">
                        Miktar
                      </th>
                      <th className="hidden px-4 py-3 text-right font-semibold text-muted-foreground sm:table-cell">
                        Birim Fiyat
                      </th>
                      <th className="hidden px-4 py-3 text-left font-semibold text-muted-foreground md:table-cell">
                        Not
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {quote.quote_items.map((item) => (
                      <tr
                        key={item.id}
                        className="border-b border-border last:border-0"
                      >
                        <td className="px-4 py-3 font-medium text-foreground">
                          {item.product_name}
                        </td>
                        <td className="px-4 py-3 text-right text-muted-foreground">
                          {item.quantity.toLocaleString("tr-TR")}
                        </td>
                        <td className="hidden px-4 py-3 text-right text-muted-foreground sm:table-cell">
                          {item.unit_price != null
                            ? `${item.unit_price.toLocaleString("tr-TR")} ₺`
                            : "—"}
                        </td>
                        <td className="hidden px-4 py-3 text-muted-foreground md:table-cell">
                          {item.notes || "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* Response Message */}
          <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <h2 className="mb-3 text-base font-semibold text-foreground">
              Müşteriye Yanıt
            </h2>
            <textarea
              value={responseMessage}
              onChange={(e) => setResponseMessage(e.target.value)}
              rows={6}
              placeholder="Müşteriye gönderilecek yanıt mesajını buraya yazın..."
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 resize-y"
            />
            <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              {respondSuccess && (
                <p className="text-xs text-green-600">
                  E-posta gonderildi ve durum &quot;Yanıtlandı&quot; olarak guncellendi.
                </p>
              )}
              {respondError && (
                <p className="text-xs text-destructive">{respondError}</p>
              )}
              {!respondSuccess && !respondError && (
                <span />
              )}
              <button
                onClick={handleRespond}
                disabled={responding || !responseMessage.trim()}
                className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground shadow-sm transition-all hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {responding ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Send size={14} />
                )}
                Yanıt Gönder
              </button>
            </div>
          </section>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Status */}
          <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <h2 className="mb-3 text-base font-semibold text-foreground">
              Durum
            </h2>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as QuoteStatus)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              {ALL_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {STATUS_LABELS[s]}
                </option>
              ))}
            </select>
          </section>

          {/* Pricing */}
          <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <h2 className="mb-3 text-base font-semibold text-foreground">
              Fiyatlandırma
            </h2>
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">
                  Toplam Tutar (₺)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={totalAmount}
                  onChange={(e) => setTotalAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">
                  Geçerlilik Tarihi
                </label>
                <input
                  type="date"
                  value={validUntil}
                  onChange={(e) => setValidUntil(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
          </section>

          {/* Admin Notes */}
          <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <h2 className="mb-3 text-base font-semibold text-foreground">
              Admin Notları
            </h2>
            <textarea
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              rows={5}
              placeholder="Dahili notlar (müşteriye görünmez)..."
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 resize-y"
            />
          </section>

          {/* Meta */}
          <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <h2 className="mb-3 text-base font-semibold text-foreground">
              Bilgiler
            </h2>
            <dl className="space-y-2 text-xs">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">ID</dt>
                <dd className="font-mono text-foreground">{quote.id.slice(0, 8)}&hellip;</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Oluşturulma</dt>
                <dd className="text-foreground">
                  {new Date(quote.created_at).toLocaleDateString("tr-TR")}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Güncelleme</dt>
                <dd className="text-foreground">
                  {new Date(quote.updated_at).toLocaleDateString("tr-TR")}
                </dd>
              </div>
            </dl>
          </section>
        </div>
      </div>
    </div>
  );
}
