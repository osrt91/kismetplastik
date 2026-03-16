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
import { useLocale } from "@/contexts/LocaleContext";

interface ErsInvoice {
  belgeno: string;
  tarih: string;
  net: string;
  kalantutar_taksit: string;
  __cariunvan: string;
  _key: string;
}

const labels: Record<string, Record<string, string>> = {
  tr: {
    title: "ERS Fatura Ödeme",
    subtitle: "Resmi faturalarınızı kredi kartı ile online ödeyebilirsiniz.",
    paymentSuccess: "Ödeme Başarılı",
    paymentSuccessDesc: "Ödemeniz başarıyla alındı.",
    transactionNo: "İşlem no",
    backToPanel: "Panele Dön",
    paymentFailed: "Ödeme Başarısız",
    paymentFailedDefault: "Ödeme işlenirken bir hata oluştu.",
    retry: "Tekrar Dene",
    configWarningTitle: "Online ödeme sistemi yapılandırma aşamasındadır.",
    configWarningDesc:
      "Halkbank sanal POS entegrasyonu tamamlandıktan sonra bu sayfa aktif olacaktır.",
    invoiceSelection: "Fatura Seçimi",
    noInvoices: "Ödenmemiş ERS faturanız bulunmuyor.",
    invoicesSelected: "fatura seçili",
    cardInfo: "Kart Bilgileri",
    cardHolderName: "Kart Üzerindeki İsim",
    cardHolderPlaceholder: "AD SOYAD",
    cardNumber: "Kart Numarası",
    cardNumberPlaceholder: "0000 0000 0000 0000",
    month: "Ay",
    year: "Yıl",
    cvv: "CVV",
    payAmount: "Öde",
    selectInvoice: "Fatura Seçin",
    securePayment: "3D Secure ile güvenli ödeme. Kart bilgileriniz sunucularımızda saklanmaz.",
    errorSelectInvoice: "Lütfen en az bir fatura seçin.",
    errorInvalidCard: "Geçersiz kart numarası.",
    errorPaymentInit: "Ödeme başlatılamadı.",
    errorConnection: "Sunucuya bağlanılamadı.",
  },
  en: {
    title: "ERS Invoice Payment",
    subtitle: "Pay your official invoices online by credit card.",
    paymentSuccess: "Payment Successful",
    paymentSuccessDesc: "Your payment has been received successfully.",
    transactionNo: "Transaction no",
    backToPanel: "Back to Panel",
    paymentFailed: "Payment Failed",
    paymentFailedDefault: "An error occurred while processing the payment.",
    retry: "Try Again",
    configWarningTitle: "Online payment system is being configured.",
    configWarningDesc:
      "This page will be active after Halkbank virtual POS integration is completed.",
    invoiceSelection: "Invoice Selection",
    noInvoices: "You have no unpaid ERS invoices.",
    invoicesSelected: "invoices selected",
    cardInfo: "Card Information",
    cardHolderName: "Cardholder Name",
    cardHolderPlaceholder: "FULL NAME",
    cardNumber: "Card Number",
    cardNumberPlaceholder: "0000 0000 0000 0000",
    month: "Month",
    year: "Year",
    cvv: "CVV",
    payAmount: "Pay",
    selectInvoice: "Select Invoice",
    securePayment: "Secure payment with 3D Secure. Your card information is not stored on our servers.",
    errorSelectInvoice: "Please select at least one invoice.",
    errorInvalidCard: "Invalid card number.",
    errorPaymentInit: "Could not initiate payment.",
    errorConnection: "Could not connect to server.",
  },
};

export default function PaymentPage() {
  const { locale } = useLocale();
  const t = labels[locale] || labels.en || labels.tr;

  const searchParams = useSearchParams();
  const status = searchParams.get("status");
  const errorParam = searchParams.get("message");
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
        <h1 className="text-xl font-bold text-foreground">{t.paymentSuccess}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {t.paymentSuccessDesc}
          {orderId && ` ${t.transactionNo}: ${orderId}`}
        </p>
        <Link
          href="/bayi-panel"
          className="mt-6 inline-block rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
        >
          {t.backToPanel}
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
        <h1 className="text-xl font-bold text-foreground">{t.paymentFailed}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {errorParam ?? t.paymentFailedDefault}
        </p>
        <Link
          href="/bayi-panel/odeme"
          className="mt-6 inline-block rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
        >
          {t.retry}
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
      setFormError(t.errorSelectInvoice);
      return;
    }

    const cleanCard = cardNumber.replace(/\s/g, "");
    if (cleanCard.length < 15 || cleanCard.length > 16) {
      setFormError(t.errorInvalidCard);
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
        setFormError(json.error ?? t.errorPaymentInit);
      }
    } catch {
      setFormError(t.errorConnection);
    } finally {
      setSubmitting(false);
    }
  };

  const currencyLocale = locale === "en" ? "en-US" : "tr-TR";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{t.title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t.subtitle}</p>
      </div>

      {/* Not configured warning */}
      <div className="flex items-start gap-3 rounded-lg border border-amber-500/30 bg-amber-500/5 p-4">
        <AlertTriangle size={18} className="mt-0.5 shrink-0 text-amber-500" />
        <div className="text-sm">
          <p className="font-medium text-amber-700 dark:text-amber-400">
            {t.configWarningTitle}
          </p>
          <p className="mt-1 text-muted-foreground">{t.configWarningDesc}</p>
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
              {t.invoiceSelection}
            </h2>

            {invoices.length === 0 ? (
              <div className="flex flex-col items-center py-12 text-muted-foreground">
                <FileText size={36} className="mb-3 opacity-20" />
                <p className="text-sm">{t.noInvoices}</p>
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
                        {kalan.toLocaleString(currencyLocale, { minimumFractionDigits: 2 })} TL
                      </span>
                    </label>
                  );
                })}
              </div>
            )}

            {selectedIds.size > 0 && (
              <div className="flex items-center justify-between rounded-xl border border-primary/30 bg-primary/5 p-4">
                <span className="text-sm font-medium text-foreground">
                  {selectedIds.size} {t.invoicesSelected}
                </span>
                <span className="font-mono text-lg font-bold text-primary tabular-nums">
                  {selectedTotal.toLocaleString(currencyLocale, { minimumFractionDigits: 2 })} TL
                </span>
              </div>
            )}
          </div>

          {/* Card form */}
          <div className="lg:col-span-2">
            <div className="sticky top-6 rounded-xl border border-border bg-card p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <CreditCard size={18} className="text-primary" />
                <h2 className="text-sm font-semibold text-foreground">{t.cardInfo}</h2>
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
                    {t.cardHolderName}
                  </label>
                  <input
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                    placeholder={t.cardHolderPlaceholder}
                    required
                    className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm uppercase outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                    {t.cardNumber}
                  </label>
                  <input
                    value={cardNumber}
                    onChange={(e) => setCardNumber(formatCard(e.target.value))}
                    placeholder={t.cardNumberPlaceholder}
                    required
                    maxLength={19}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2.5 font-mono text-sm tracking-wider outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                      {t.month}
                    </label>
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
                    <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                      {t.year}
                    </label>
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
                    <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                      {t.cvv}
                    </label>
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
                    ? `${selectedTotal.toLocaleString(currencyLocale, { minimumFractionDigits: 2 })} TL ${t.payAmount}`
                    : t.selectInvoice}
                </button>

                <p className="text-center text-[11px] text-muted-foreground">
                  {t.securePayment}
                </p>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
