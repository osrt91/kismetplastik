"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "@/components/ui/LocaleLink";
import {
  CreditCard,
  CheckCircle2,
  XCircle,
  Loader2,
  FileText,
  Lock,
  AlertTriangle,
} from "lucide-react";

interface ErsInvoice {
  belgeno: string;
  tarih: string;
  net: string;
  kalantutar_taksit: string;
  __cariunvan: string;
  _key: string;
}

export default function PaymentPage() {
  const searchParams = useSearchParams();
  const status = searchParams.get("status");
  const errorMsg = searchParams.get("message");
  const orderId = searchParams.get("order");

  const [invoices, setInvoices] = useState<ErsInvoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Card form
  const [cardHolder, setCardHolder] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expMonth, setExpMonth] = useState("");
  const [expYear, setExpYear] = useState("");
  const [cvv, setCvv] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchInvoices() {
      try {
        const res = await fetch("/api/dealer/invoices");
        const json = await res.json();
        if (json.success) {
          setInvoices(json.data.ers?.records ?? []);
        }
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    }
    if (!status) fetchInvoices();
    else setLoading(false);
  }, [status]);

  // Result screens
  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10">
          <CheckCircle2 size={32} className="text-emerald-500" />
        </div>
        <h1 className="text-xl font-bold text-foreground">Odeme Basarili</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Odemeniz basariyla alindi.{orderId && ` Islem no: ${orderId}`}
        </p>
        <Link
          href="/bayi-panel"
          className="mt-6 inline-block rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
        >
          Panele Don
        </Link>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
          <XCircle size={32} className="text-destructive" />
        </div>
        <h1 className="text-xl font-bold text-foreground">Odeme Basarisiz</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {errorMsg ?? "Odeme islenirken bir hata olustu."}
        </p>
        <Link
          href="/bayi-panel/odeme"
          className="mt-6 inline-block rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
        >
          Tekrar Dene
        </Link>
      </div>
    );
  }

  const toggleInvoice = (key: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const selectedTotal = invoices
    .filter((inv) => selectedIds.has(inv._key))
    .reduce((sum, inv) => sum + (parseFloat(inv.kalantutar_taksit) || 0), 0);

  const formatCard = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(.{4})/g, "$1 ").trim();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (selectedIds.size === 0) {
      setFormError("Lutfen en az bir fatura secin.");
      return;
    }

    const cleanCard = cardNumber.replace(/\s/g, "");
    if (cleanCard.length < 15 || cleanCard.length > 16) {
      setFormError("Gecersiz kart numarasi.");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/payment/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invoiceIds: Array.from(selectedIds),
          amount: selectedTotal,
          cardHolderName: cardHolder,
          cardNumber: cleanCard,
          expireMonth: expMonth,
          expireYear: expYear,
          cvv,
        }),
      });

      const contentType = res.headers.get("content-type") ?? "";

      if (contentType.includes("text/html")) {
        // 3D Secure redirect — replace page with bank form
        const html = await res.text();
        document.open();
        document.write(html);
        document.close();
      } else {
        const json = await res.json();
        setFormError(json.error ?? "Odeme baslatilamadi.");
      }
    } catch {
      setFormError("Sunucuya baglanılamadı.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">ERS Fatura Odeme</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Resmi faturalarinizi kredi karti ile online odeyebilirsiniz.
        </p>
      </div>

      {/* Not configured warning */}
      <div className="flex items-start gap-3 rounded-lg border border-amber-500/30 bg-amber-500/5 p-4">
        <AlertTriangle size={18} className="mt-0.5 shrink-0 text-amber-500" />
        <div className="text-sm">
          <p className="font-medium text-amber-700 dark:text-amber-400">
            Online odeme sistemi yapilandirma asamasindadir.
          </p>
          <p className="mt-1 text-muted-foreground">
            Halkbank sanal POS entegrasyonu tamamlandiktan sonra bu sayfa aktif olacaktir.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={28} className="animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-5">
          {/* Invoice selection */}
          <div className="lg:col-span-3 space-y-4">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Fatura Secimi
            </h2>

            {invoices.length === 0 ? (
              <div className="flex flex-col items-center py-12 text-muted-foreground">
                <FileText size={36} className="mb-3 opacity-20" />
                <p className="text-sm">Odenmemis ERS faturaniz bulunmuyor.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {invoices.map((inv) => {
                  const kalan = parseFloat(inv.kalantutar_taksit) || 0;
                  if (kalan <= 0) return null;
                  const isSelected = selectedIds.has(inv._key);

                  return (
                    <label
                      key={inv._key}
                      className={`flex cursor-pointer items-center gap-4 rounded-xl border p-4 transition-all ${
                        isSelected
                          ? "border-primary bg-primary/5 shadow-sm"
                          : "border-border hover:border-primary/30"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleInvoice(inv._key)}
                        className="h-4 w-4 rounded border-border text-primary focus:ring-primary/20"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-medium">{inv.belgeno}</span>
                          <span className="text-xs text-muted-foreground">{inv.tarih}</span>
                        </div>
                      </div>
                      <span className="font-mono text-sm font-bold tabular-nums">
                        {kalan.toLocaleString("tr-TR", { minimumFractionDigits: 2 })} TL
                      </span>
                    </label>
                  );
                })}
              </div>
            )}

            {selectedIds.size > 0 && (
              <div className="flex items-center justify-between rounded-xl border border-primary/30 bg-primary/5 p-4">
                <span className="text-sm font-medium text-foreground">
                  {selectedIds.size} fatura secili
                </span>
                <span className="font-mono text-lg font-bold text-primary tabular-nums">
                  {selectedTotal.toLocaleString("tr-TR", { minimumFractionDigits: 2 })} TL
                </span>
              </div>
            )}
          </div>

          {/* Card form */}
          <div className="lg:col-span-2">
            <div className="sticky top-6 rounded-xl border border-border bg-card p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <CreditCard size={18} className="text-primary" />
                <h2 className="text-sm font-semibold text-foreground">Kart Bilgileri</h2>
                <Lock size={12} className="ml-auto text-muted-foreground" />
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {formError && (
                  <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
                    {formError}
                  </div>
                )}

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                    Kart Uzerindeki Isim
                  </label>
                  <input
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                    placeholder="AD SOYAD"
                    required
                    className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm uppercase outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                    Kart Numarasi
                  </label>
                  <input
                    value={cardNumber}
                    onChange={(e) => setCardNumber(formatCard(e.target.value))}
                    placeholder="0000 0000 0000 0000"
                    required
                    maxLength={19}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2.5 font-mono text-sm tracking-wider outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Ay</label>
                    <select
                      value={expMonth}
                      onChange={(e) => setExpMonth(e.target.value)}
                      required
                      className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    >
                      <option value="">--</option>
                      {Array.from({ length: 12 }, (_, i) => {
                        const m = String(i + 1).padStart(2, "0");
                        return (
                          <option key={m} value={m}>
                            {m}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Yil</label>
                    <select
                      value={expYear}
                      onChange={(e) => setExpYear(e.target.value)}
                      required
                      className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    >
                      <option value="">--</option>
                      {Array.from({ length: 10 }, (_, i) => {
                        const y = String(26 + i);
                        return (
                          <option key={y} value={y}>
                            20{y}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-muted-foreground">CVV</label>
                    <input
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                      placeholder="***"
                      required
                      maxLength={4}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2.5 font-mono text-sm text-center outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting || selectedIds.size === 0}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-50"
                >
                  {submitting ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Lock size={14} />
                  )}
                  {selectedIds.size > 0
                    ? `${selectedTotal.toLocaleString("tr-TR", { minimumFractionDigits: 2 })} TL Ode`
                    : "Fatura Secin"}
                </button>

                <p className="text-center text-[11px] text-muted-foreground">
                  3D Secure ile guvenli odeme. Kart bilgileriniz sunucularimizda saklanmaz.
                </p>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
