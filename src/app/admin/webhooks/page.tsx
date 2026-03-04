"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Bell,
  Webhook,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Save,
  RotateCcw,
  CheckCircle,
  XCircle,
  Clock,
  Loader2,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import type { WebhookEventStatus } from "@/types/database";

// ===================== TYPES =====================

interface WebhookEventRow {
  id: string;
  event_type: string;
  status: WebhookEventStatus;
  retry_count: number;
  created_at: string;
  processed_at: string | null;
  error_message: string | null;
}

interface WebhookEventFull extends WebhookEventRow {
  payload: Record<string, unknown>;
}

interface NotificationSetting {
  id?: string;
  event_type: string;
  email_enabled: boolean;
  email_recipients: string[];
  webhook_enabled: boolean;
  webhook_url: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// ===================== CONSTANTS =====================

const EVENT_TYPE_LABELS: Record<string, string> = {
  new_order: "Yeni Sipariş",
  new_quote: "Yeni Teklif",
  new_contact: "Yeni İletişim Mesajı",
  new_sample_request: "Yeni Numune Talebi",
  new_dealer: "Yeni Bayi Kaydı",
  order_status_change: "Sipariş Durumu Değişikliği",
};

const ALL_EVENT_TYPES = Object.keys(EVENT_TYPE_LABELS);

const STATUS_LABELS: Record<WebhookEventStatus, string> = {
  pending: "Beklemede",
  processing: "İşleniyor",
  success: "Başarılı",
  failed: "Hatalı",
};

const STATUS_COLORS: Record<WebhookEventStatus, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  success: "bg-green-100 text-green-800",
  failed: "bg-red-100 text-red-800",
};

const STATUS_ICONS: Record<WebhookEventStatus, React.ReactNode> = {
  pending: <Clock size={12} />,
  processing: <Loader2 size={12} className="animate-spin" />,
  success: <CheckCircle size={12} />,
  failed: <XCircle size={12} />,
};

// ===================== HELPERS =====================

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function buildDefaultSettings(): NotificationSetting[] {
  return ALL_EVENT_TYPES.map((et) => ({
    event_type: et,
    email_enabled: false,
    email_recipients: [],
    webhook_enabled: false,
    webhook_url: "",
  }));
}

// ===================== NOTIFICATION SETTINGS TAB =====================

function NotificationSettingsTab() {
  const [settings, setSettings] = useState<NotificationSetting[]>(
    buildDefaultSettings()
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [recipientInputs, setRecipientInputs] = useState<
    Record<string, string>
  >({});

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/notifications");
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Veri alınamadı");

      const fetched: NotificationSetting[] = json.data ?? [];

      // Merge fetched data with defaults (ensure all event types present)
      const merged = buildDefaultSettings().map((def) => {
        const found = fetched.find((f) => f.event_type === def.event_type);
        return found
          ? {
              ...def,
              ...found,
              webhook_url: found.webhook_url ?? "",
              email_recipients: found.email_recipients ?? [],
            }
          : def;
      });

      setSettings(merged);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const updateSetting = (
    eventType: string,
    field: keyof NotificationSetting,
    value: unknown
  ) => {
    setSettings((prev) =>
      prev.map((s) =>
        s.event_type === eventType ? { ...s, [field]: value } : s
      )
    );
  };

  const addRecipient = (eventType: string) => {
    const input = recipientInputs[eventType]?.trim();
    if (!input) return;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(input)) {
      alert("Geçerli bir e-posta adresi girin.");
      return;
    }

    setSettings((prev) =>
      prev.map((s) =>
        s.event_type === eventType
          ? {
              ...s,
              email_recipients: s.email_recipients.includes(input)
                ? s.email_recipients
                : [...s.email_recipients, input],
            }
          : s
      )
    );
    setRecipientInputs((prev) => ({ ...prev, [eventType]: "" }));
  };

  const removeRecipient = (eventType: string, email: string) => {
    setSettings((prev) =>
      prev.map((s) =>
        s.event_type === eventType
          ? {
              ...s,
              email_recipients: s.email_recipients.filter((r) => r !== email),
            }
          : s
      )
    );
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccessMsg(null);
    try {
      const res = await fetch("/api/admin/notifications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Kayıt başarısız");
      setSuccessMsg("Bildirim ayarları başarıyla kaydedildi.");
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-28 animate-pulse rounded-xl border border-border bg-muted"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {successMsg && (
        <div className="rounded-lg border border-green-300 bg-green-50 px-4 py-3 text-sm text-green-700">
          {successMsg}
        </div>
      )}

      {settings.map((setting) => (
        <div
          key={setting.event_type}
          className="rounded-xl border border-border bg-card p-4 shadow-sm"
        >
          <h3 className="mb-4 font-semibold text-foreground">
            {EVENT_TYPE_LABELS[setting.event_type] ?? setting.event_type}
          </h3>

          <div className="grid gap-6 md:grid-cols-2">
            {/* E-posta Bildirimi */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  E-posta Bildirimi
                </span>
                <button
                  onClick={() =>
                    updateSetting(
                      setting.event_type,
                      "email_enabled",
                      !setting.email_enabled
                    )
                  }
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${
                    setting.email_enabled ? "bg-primary" : "bg-muted-foreground/30"
                  }`}
                  aria-label="E-posta bildirimini aç/kapat"
                >
                  <span
                    className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${
                      setting.email_enabled ? "translate-x-4" : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>

              {setting.email_enabled && (
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Alıcılar
                  </label>

                  <div className="flex flex-wrap gap-1.5">
                    {setting.email_recipients.map((email) => (
                      <span
                        key={email}
                        className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary"
                      >
                        {email}
                        <button
                          onClick={() =>
                            removeRecipient(setting.event_type, email)
                          }
                          className="ml-0.5 rounded-full hover:text-destructive"
                          aria-label="Alıcıyı kaldır"
                        >
                          <X size={10} />
                        </button>
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="email"
                      value={recipientInputs[setting.event_type] ?? ""}
                      onChange={(e) =>
                        setRecipientInputs((prev) => ({
                          ...prev,
                          [setting.event_type]: e.target.value,
                        }))
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addRecipient(setting.event_type);
                        }
                      }}
                      placeholder="e-posta@ornek.com"
                      className="flex-1 rounded-lg border border-border bg-muted px-3 py-1.5 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                    <button
                      onClick={() => addRecipient(setting.event_type)}
                      className="flex items-center gap-1 rounded-lg border border-border bg-card px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted"
                    >
                      <Plus size={13} />
                      Ekle
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Webhook */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  Webhook
                </span>
                <button
                  onClick={() =>
                    updateSetting(
                      setting.event_type,
                      "webhook_enabled",
                      !setting.webhook_enabled
                    )
                  }
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${
                    setting.webhook_enabled
                      ? "bg-primary"
                      : "bg-muted-foreground/30"
                  }`}
                  aria-label="Webhook'u aç/kapat"
                >
                  <span
                    className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${
                      setting.webhook_enabled
                        ? "translate-x-4"
                        : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>

              {setting.webhook_enabled && (
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Webhook URL
                  </label>
                  <input
                    type="url"
                    value={setting.webhook_url}
                    onChange={(e) =>
                      updateSetting(
                        setting.event_type,
                        "webhook_url",
                        e.target.value
                      )
                    }
                    placeholder="https://example.com/webhook"
                    className="w-full rounded-lg border border-border bg-muted px-3 py-1.5 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      ))}

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
        >
          {saving ? (
            <Loader2 size={15} className="animate-spin" />
          ) : (
            <Save size={15} />
          )}
          Kaydet
        </button>
      </div>
    </div>
  );
}

// ===================== PAYLOAD MODAL =====================

function PayloadModal({
  event,
  onClose,
  onRetry,
}: {
  event: WebhookEventFull;
  onClose: () => void;
  onRetry: (id: string) => Promise<void>;
}) {
  const [retrying, setRetrying] = useState(false);

  const handleRetry = async () => {
    setRetrying(true);
    await onRetry(event.id);
    setRetrying(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="flex max-h-[80vh] w-full max-w-2xl flex-col rounded-2xl border border-border bg-card shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div>
            <h2 className="font-semibold text-foreground">
              Webhook Olayı Detayı
            </h2>
            <p className="mt-0.5 text-xs text-muted-foreground font-mono">
              {event.id}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted"
          >
            <X size={16} />
          </button>
        </div>

        {/* Meta */}
        <div className="grid grid-cols-2 gap-3 border-b border-border px-5 py-3 text-sm sm:grid-cols-4">
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Olay Türü
            </p>
            <p className="mt-0.5 font-medium text-foreground">
              {EVENT_TYPE_LABELS[event.event_type] ?? event.event_type}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Durum
            </p>
            <span
              className={`mt-0.5 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[event.status]}`}
            >
              {STATUS_ICONS[event.status]}
              {STATUS_LABELS[event.status]}
            </span>
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Deneme Sayısı
            </p>
            <p className="mt-0.5 font-medium text-foreground">
              {event.retry_count}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Oluşturulma
            </p>
            <p className="mt-0.5 text-xs text-foreground">
              {formatDate(event.created_at)}
            </p>
          </div>
        </div>

        {/* Error message */}
        {event.error_message && (
          <div className="border-b border-border px-5 py-3">
            <p className="mb-1 text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Hata Mesajı
            </p>
            <p className="rounded-lg bg-destructive/10 px-3 py-2 text-xs text-destructive font-mono">
              {event.error_message}
            </p>
          </div>
        )}

        {/* Payload */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          <p className="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Payload (JSON)
          </p>
          <pre className="overflow-x-auto rounded-lg bg-muted px-4 py-3 text-xs text-foreground leading-relaxed">
            {JSON.stringify(event.payload, null, 2)}
          </pre>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-border px-5 py-3">
          <button
            onClick={onClose}
            className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted"
          >
            Kapat
          </button>
          {event.status === "failed" && (
            <button
              onClick={handleRetry}
              disabled={retrying}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
            >
              {retrying ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <RotateCcw size={14} />
              )}
              Yeniden Dene
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ===================== WEBHOOK LOGS TAB =====================

function WebhookLogsTab() {
  const [events, setEvents] = useState<WebhookEventRow[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<WebhookEventStatus | "">("");
  const [currentPage, setCurrentPage] = useState(1);

  const [selectedEvent, setSelectedEvent] = useState<WebhookEventFull | null>(
    null
  );
  const [loadingDetail, setLoadingDetail] = useState(false);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ page: String(currentPage) });
      if (statusFilter) params.set("status", statusFilter);

      const res = await fetch(`/api/admin/webhooks?${params.toString()}`);
      const json = await res.json();

      if (!json.success) throw new Error(json.error || "Veri alınamadı");

      setEvents(json.data ?? []);
      setPagination(
        json.pagination ?? { page: 1, limit: 20, total: 0, totalPages: 0 }
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  }, [currentPage, statusFilter]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleStatusFilterChange = (val: WebhookEventStatus | "") => {
    setStatusFilter(val);
    setCurrentPage(1);
  };

  const openDetail = async (id: string) => {
    setLoadingDetail(true);
    try {
      const res = await fetch(`/api/admin/webhooks/${id}`);
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Detay alınamadı");
      setSelectedEvent(json.data);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Detay yüklenemedi");
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleRetry = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/webhooks/${id}/retry`, {
        method: "POST",
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Yeniden dene başarısız");
      await fetchEvents();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Hata oluştu");
    }
  };

  const ALL_STATUS_FILTERS: Array<{
    value: WebhookEventStatus | "";
    label: string;
  }> = [
    { value: "", label: "Tümü" },
    { value: "pending", label: "Beklemede" },
    { value: "processing", label: "İşleniyor" },
    { value: "success", label: "Başarılı" },
    { value: "failed", label: "Hatalı" },
  ];

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-muted-foreground">
            Durum:
          </label>
          <div className="flex gap-1">
            {ALL_STATUS_FILTERS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleStatusFilterChange(opt.value)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  statusFilter === opt.value
                    ? "bg-primary text-primary-foreground"
                    : "border border-border bg-card text-muted-foreground hover:bg-muted"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={fetchEvents}
          disabled={loading}
          className="ml-auto inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted disabled:opacity-50"
        >
          <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
          Yenile
        </button>
      </div>

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
              <tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Olay Türü
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Durum
                </th>
                <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground sm:table-cell">
                  Deneme
                </th>
                <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground md:table-cell">
                  Oluşturulma
                </th>
                <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground lg:table-cell">
                  İşlenme
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  İşlem
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-border">
                    {Array.from({ length: 6 }).map((_, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="h-4 animate-pulse rounded bg-muted" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : events.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-16 text-center text-muted-foreground"
                  >
                    <Webhook size={36} className="mx-auto mb-3 opacity-30" />
                    <p className="text-sm font-medium">
                      Webhook olayı bulunamadı
                    </p>
                    <p className="text-xs">
                      {statusFilter
                        ? "Farklı bir durum filtresi deneyin"
                        : "Henüz webhook olayı yok"}
                    </p>
                  </td>
                </tr>
              ) : (
                events.map((event) => (
                  <tr
                    key={event.id}
                    onClick={() => openDetail(event.id)}
                    className="cursor-pointer border-b border-border transition-colors last:border-0 hover:bg-muted/40"
                  >
                    <td className="px-4 py-3">
                      <span className="font-medium text-foreground">
                        {EVENT_TYPE_LABELS[event.event_type] ??
                          event.event_type}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[event.status]}`}
                      >
                        {STATUS_ICONS[event.status]}
                        {STATUS_LABELS[event.status]}
                      </span>
                    </td>
                    <td className="hidden px-4 py-3 text-muted-foreground sm:table-cell">
                      {event.retry_count > 0 ? (
                        <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-700">
                          {event.retry_count}x
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="hidden px-4 py-3 text-xs text-muted-foreground md:table-cell">
                      {formatDate(event.created_at)}
                    </td>
                    <td className="hidden px-4 py-3 text-xs text-muted-foreground lg:table-cell">
                      {event.processed_at ? (
                        formatDate(event.processed_at)
                      ) : (
                        <span>—</span>
                      )}
                    </td>
                    <td
                      className="px-4 py-3 text-right"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {event.status === "failed" && (
                        <button
                          onClick={() => handleRetry(event.id)}
                          className="inline-flex items-center gap-1 rounded-lg border border-border bg-card px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted"
                        >
                          <RotateCcw size={12} />
                          Yeniden Dene
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-border px-4 py-3">
            <p className="text-xs text-muted-foreground">
              Sayfa {currentPage} / {pagination.totalPages} — toplam{" "}
              {pagination.total} olay
            </p>
            <div className="flex items-center gap-2">
              <button
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:bg-muted disabled:opacity-40"
              >
                <ChevronLeft size={14} />
              </button>
              <button
                disabled={currentPage >= pagination.totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:bg-muted disabled:opacity-40"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {loadingDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <Loader2 size={32} className="animate-spin text-white" />
        </div>
      )}

      {selectedEvent && !loadingDetail && (
        <PayloadModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onRetry={handleRetry}
        />
      )}
    </div>
  );
}

// ===================== PAGE =====================

type Tab = "settings" | "logs";

export default function AdminWebhooksPage() {
  const [activeTab, setActiveTab] = useState<Tab>("settings");

  const tabs: Array<{ id: Tab; label: string; icon: React.ReactNode }> = [
    {
      id: "settings",
      label: "Bildirim Ayarları",
      icon: <Bell size={15} />,
    },
    {
      id: "logs",
      label: "Webhook Logları",
      icon: <Webhook size={15} />,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Bildirimler &amp; Webhook
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Olay bildirimlerini ve webhook entegrasyonlarını yönetin.
        </p>
      </div>

      {/* Tab navigation */}
      <div className="flex gap-1 rounded-xl border border-border bg-muted p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
              activeTab === tab.id
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === "settings" && <NotificationSettingsTab />}
      {activeTab === "logs" && <WebhookLogsTab />}
    </div>
  );
}
