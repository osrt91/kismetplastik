"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  RefreshCw,
  CheckCircle,
  XCircle,
  Database,
  Users,
  Clock,
  Settings,
  Loader2,
  Save,
  Wifi,
  WifiOff,
  AlertCircle,
  Check,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface DiaSettings {
  api_url: string;
  firma_kodu: string;
  kullanici_adi: string;
  sifre: string;
  firma_id: number;
  donem_id: number;
}

interface TestResult {
  success: boolean;
  message: string;
}

interface SyncResult {
  last_sync: string | null;
  synced_count: number;
  error_count: number;
}

interface SyncLog {
  id: string;
  event_type: string;
  status: "pending" | "processing" | "success" | "failed";
  created_at: string;
  error_message: string | null;
}

interface Toast {
  id: number;
  type: "success" | "error";
  message: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const DEFAULT_SETTINGS: DiaSettings = {
  api_url: "",
  firma_kodu: "",
  kullanici_adi: "",
  sifre: "",
  firma_id: 1,
  donem_id: 1,
};

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-amber-500/10 text-amber-600",
  processing: "bg-blue-500/10 text-blue-600",
  success: "bg-emerald-500/10 text-emerald-600",
  failed: "bg-destructive/10 text-destructive",
};

const STATUS_LABELS: Record<string, string> = {
  pending: "Beklemede",
  processing: "İşleniyor",
  success: "Başarılı",
  failed: "Hatalı",
};

const STATUS_ICONS: Record<string, React.ReactNode> = {
  pending: <Clock size={12} />,
  processing: <Loader2 size={12} className="animate-spin" />,
  success: <CheckCircle size={12} />,
  failed: <XCircle size={12} />,
};

const EVENT_TYPE_LABELS: Record<string, string> = {
  dia_stock_sync: "Stok Senkronizasyonu",
  dia_cari_sync: "Cari Senkronizasyonu",
  dia_connection_test: "Bağlantı Testi",
  dia_stock_sync_error: "Stok Senkron Hatası",
  dia_cari_sync_error: "Cari Senkron Hatası",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function DiaPage() {
  // Settings state
  const [settings, setSettings] = useState<DiaSettings>(DEFAULT_SETTINGS);
  const [settingsLoading, setSettingsLoading] = useState(true);
  const [settingsSaving, setSettingsSaving] = useState(false);

  // Test connection state
  const [testLoading, setTestLoading] = useState(false);
  const [testResult, setTestResult] = useState<TestResult | null>(null);

  // Sync state
  const [stockSyncing, setStockSyncing] = useState(false);
  const [stockResult, setStockResult] = useState<SyncResult | null>(null);
  const [cariSyncing, setCariSyncing] = useState(false);
  const [cariResult, setCariResult] = useState<SyncResult | null>(null);

  // Logs state
  const [logs, setLogs] = useState<SyncLog[]>([]);
  const [logsLoading, setLogsLoading] = useState(true);

  // Toast state
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastId = useRef(0);

  // ── Toast helper ──────────────────────────────────────────────────────────

  const showToast = useCallback((type: "success" | "error", message: string) => {
    const id = ++toastId.current;
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  // ── Fetch settings ────────────────────────────────────────────────────────

  const fetchSettings = useCallback(async () => {
    setSettingsLoading(true);
    try {
      const res = await fetch("/api/admin/dia/settings", {
        credentials: "include",
      });
      const json = await res.json();
      if (res.ok && json.success && json.data) {
        setSettings({
          api_url: json.data.api_url ?? "",
          firma_kodu: json.data.firma_kodu ?? "",
          kullanici_adi: json.data.kullanici_adi ?? "",
          sifre: json.data.sifre ?? "",
          firma_id: json.data.firma_id ?? 1,
          donem_id: json.data.donem_id ?? 1,
        });
      }
    } catch {
      showToast("error", "Ayarlar yüklenirken hata oluştu");
    } finally {
      setSettingsLoading(false);
    }
  }, [showToast]);

  // ── Save settings ─────────────────────────────────────────────────────────

  const saveSettings = async () => {
    setSettingsSaving(true);
    try {
      const res = await fetch("/api/admin/dia/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(settings),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        showToast("error", json.error ?? "Ayarlar kaydedilemedi");
        return;
      }
      showToast("success", "DIA ayarları kaydedildi");
    } catch {
      showToast("error", "Bağlantı hatası");
    } finally {
      setSettingsSaving(false);
    }
  };

  // ── Test connection ───────────────────────────────────────────────────────

  const testConnection = async () => {
    setTestLoading(true);
    setTestResult(null);
    try {
      const res = await fetch("/api/admin/dia/test", {
        method: "POST",
        credentials: "include",
      });
      const json = await res.json();
      setTestResult({
        success: json.success ?? false,
        message: json.message ?? json.error ?? "Bilinmeyen sonuç",
      });
    } catch {
      setTestResult({
        success: false,
        message: "Bağlantı testi sırasında hata oluştu",
      });
    } finally {
      setTestLoading(false);
    }
  };

  // ── Sync stock ────────────────────────────────────────────────────────────

  const syncStock = async () => {
    setStockSyncing(true);
    try {
      const res = await fetch("/api/admin/dia/sync/stock", {
        method: "POST",
        credentials: "include",
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        showToast("error", json.error ?? "Stok senkronizasyonu başarısız");
        return;
      }
      setStockResult({
        last_sync: json.data?.last_sync ?? new Date().toISOString(),
        synced_count: json.data?.synced_count ?? 0,
        error_count: json.data?.error_count ?? 0,
      });
      showToast("success", "Stok senkronizasyonu tamamlandı");
      fetchLogs();
    } catch {
      showToast("error", "Stok senkronizasyonu sırasında hata oluştu");
    } finally {
      setStockSyncing(false);
    }
  };

  // ── Sync cari ─────────────────────────────────────────────────────────────

  const syncCari = async () => {
    setCariSyncing(true);
    try {
      const res = await fetch("/api/admin/dia/sync/cari", {
        method: "POST",
        credentials: "include",
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        showToast("error", json.error ?? "Cari senkronizasyonu başarısız");
        return;
      }
      setCariResult({
        last_sync: json.data?.last_sync ?? new Date().toISOString(),
        synced_count: json.data?.synced_count ?? 0,
        error_count: json.data?.error_count ?? 0,
      });
      showToast("success", "Cari senkronizasyonu tamamlandı");
      fetchLogs();
    } catch {
      showToast("error", "Cari senkronizasyonu sırasında hata oluştu");
    } finally {
      setCariSyncing(false);
    }
  };

  // ── Fetch logs ────────────────────────────────────────────────────────────

  const fetchLogs = useCallback(async () => {
    setLogsLoading(true);
    try {
      const res = await fetch("/api/admin/webhooks?limit=50", {
        credentials: "include",
      });
      const json = await res.json();
      if (res.ok && json.success) {
        const allEvents: SyncLog[] = json.data ?? [];
        const diaEvents = allEvents.filter((e: SyncLog) =>
          e.event_type.startsWith("dia_")
        );
        setLogs(diaEvents);
      }
    } catch {
      // Silently fail for logs
    } finally {
      setLogsLoading(false);
    }
  }, []);

  // ── Initial load ──────────────────────────────────────────────────────────

  useEffect(() => {
    fetchSettings();
    fetchLogs();
  }, [fetchSettings, fetchLogs]);

  // ── Field change ──────────────────────────────────────────────────────────

  const handleChange = (field: keyof DiaSettings, value: string | number) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  // ─── Loading state ────────────────────────────────────────────────────────

  if (settingsLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-64 animate-pulse rounded-lg bg-muted" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-40 animate-pulse rounded-xl bg-muted" />
        ))}
      </div>
    );
  }

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            DIA ERP Entegrasyonu
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            DIA ERP sistemi ile stok ve cari senkronizasyonunu yonetin.
          </p>
        </div>
        {testResult && (
          <div
            className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium ${
              testResult.success
                ? "bg-emerald-500/10 text-emerald-600"
                : "bg-destructive/10 text-destructive"
            }`}
          >
            {testResult.success ? (
              <Wifi size={14} />
            ) : (
              <WifiOff size={14} />
            )}
            {testResult.success ? "Bagli" : "Baglanti Yok"}
          </div>
        )}
      </div>

      {/* ── Connection Settings Card ───────────────────────────────────────── */}
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="flex items-center gap-3 border-b border-border px-5 py-4">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Settings size={16} />
          </div>
          <span className="flex-1 text-sm font-semibold text-foreground">
            Baglanti Ayarlari
          </span>
        </div>

        <div className="space-y-4 px-5 pb-5 pt-4">
          {/* API URL */}
          <div>
            <label
              htmlFor="dia_api_url"
              className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground"
            >
              DIA API URL
            </label>
            <input
              id="dia_api_url"
              type="text"
              value={settings.api_url}
              onChange={(e) => handleChange("api_url", e.target.value)}
              placeholder="https://ws.dia.com.tr"
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {/* Firma Kodu + Kullanici Adi */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="dia_firma_kodu"
                className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground"
              >
                Firma Kodu
              </label>
              <input
                id="dia_firma_kodu"
                type="text"
                value={settings.firma_kodu}
                onChange={(e) => handleChange("firma_kodu", e.target.value)}
                placeholder="Firma kodu"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label
                htmlFor="dia_kullanici_adi"
                className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground"
              >
                Kullanici Adi
              </label>
              <input
                id="dia_kullanici_adi"
                type="text"
                value={settings.kullanici_adi}
                onChange={(e) => handleChange("kullanici_adi", e.target.value)}
                placeholder="Kullanici adi"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          {/* Sifre */}
          <div>
            <label
              htmlFor="dia_sifre"
              className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground"
            >
              Sifre
            </label>
            <input
              id="dia_sifre"
              type="password"
              value={settings.sifre}
              onChange={(e) => handleChange("sifre", e.target.value)}
              placeholder="********"
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {/* Firma ID + Donem ID */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="dia_firma_id"
                className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground"
              >
                Firma ID
              </label>
              <input
                id="dia_firma_id"
                type="number"
                min={1}
                value={settings.firma_id}
                onChange={(e) =>
                  handleChange("firma_id", parseInt(e.target.value, 10) || 1)
                }
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label
                htmlFor="dia_donem_id"
                className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground"
              >
                Donem ID
              </label>
              <input
                id="dia_donem_id"
                type="number"
                min={1}
                value={settings.donem_id}
                onChange={(e) =>
                  handleChange("donem_id", parseInt(e.target.value, 10) || 1)
                }
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          {/* Test result message */}
          {testResult && (
            <div
              className={`flex items-center gap-2 rounded-lg px-4 py-3 text-sm ${
                testResult.success
                  ? "border border-green-300 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-900/30 dark:text-green-300"
                  : "border border-destructive/30 bg-destructive/10 text-destructive"
              }`}
            >
              {testResult.success ? (
                <CheckCircle size={15} className="shrink-0" />
              ) : (
                <XCircle size={15} className="shrink-0" />
              )}
              {testResult.message}
            </div>
          )}

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              type="button"
              onClick={saveSettings}
              disabled={settingsSaving}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 disabled:opacity-60"
            >
              {settingsSaving ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Kaydediliyor...
                </>
              ) : (
                <>
                  <Save size={14} />
                  Kaydet
                </>
              )}
            </button>

            <button
              type="button"
              onClick={testConnection}
              disabled={testLoading}
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted disabled:opacity-60"
            >
              {testLoading ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Test Ediliyor...
                </>
              ) : (
                <>
                  <Wifi size={14} />
                  Baglantiyi Test Et
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ── Synchronization Cards ──────────────────────────────────────────── */}
      <div className="grid gap-4 sm:grid-cols-2">
        {/* Stock Sync Card */}
        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
          <div className="flex items-center gap-3 border-b border-border px-5 py-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600">
              <Database size={16} />
            </div>
            <span className="flex-1 text-sm font-semibold text-foreground">
              Stok Senkronizasyonu
            </span>
          </div>

          <div className="space-y-4 px-5 pb-5 pt-4">
            {stockResult && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Son Senkron:</span>
                  <span className="font-medium text-foreground">
                    {stockResult.last_sync
                      ? formatDate(stockResult.last_sync)
                      : "—"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    Senkronize Edilen:
                  </span>
                  <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-600">
                    {stockResult.synced_count} kayit
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Hata:</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      stockResult.error_count > 0
                        ? "bg-destructive/10 text-destructive"
                        : "bg-emerald-500/10 text-emerald-600"
                    }`}
                  >
                    {stockResult.error_count} hata
                  </span>
                </div>
              </div>
            )}

            {!stockResult && (
              <p className="text-sm text-muted-foreground">
                Henuz stok senkronizasyonu yapilmadi.
              </p>
            )}

            <button
              type="button"
              onClick={syncStock}
              disabled={stockSyncing}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 disabled:opacity-60"
            >
              {stockSyncing ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Senkronize Ediliyor...
                </>
              ) : (
                <>
                  <RefreshCw size={14} />
                  Stoklari Senkronize Et
                </>
              )}
            </button>
          </div>
        </div>

        {/* Cari Sync Card */}
        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
          <div className="flex items-center gap-3 border-b border-border px-5 py-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600">
              <Users size={16} />
            </div>
            <span className="flex-1 text-sm font-semibold text-foreground">
              Cari Senkronizasyonu
            </span>
          </div>

          <div className="space-y-4 px-5 pb-5 pt-4">
            {cariResult && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Son Senkron:</span>
                  <span className="font-medium text-foreground">
                    {cariResult.last_sync
                      ? formatDate(cariResult.last_sync)
                      : "—"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    Senkronize Edilen:
                  </span>
                  <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-600">
                    {cariResult.synced_count} kayit
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Hata:</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      cariResult.error_count > 0
                        ? "bg-destructive/10 text-destructive"
                        : "bg-emerald-500/10 text-emerald-600"
                    }`}
                  >
                    {cariResult.error_count} hata
                  </span>
                </div>
              </div>
            )}

            {!cariResult && (
              <p className="text-sm text-muted-foreground">
                Henuz cari senkronizasyonu yapilmadi.
              </p>
            )}

            <button
              type="button"
              onClick={syncCari}
              disabled={cariSyncing}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 disabled:opacity-60"
            >
              {cariSyncing ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Senkronize Ediliyor...
                </>
              ) : (
                <>
                  <RefreshCw size={14} />
                  Carileri Senkronize Et
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ── Sync Logs Table ────────────────────────────────────────────────── */}
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Clock size={16} />
            </div>
            <span className="text-sm font-semibold text-foreground">
              Senkron Loglari
            </span>
          </div>
          <button
            type="button"
            onClick={fetchLogs}
            disabled={logsLoading}
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted disabled:opacity-50"
          >
            <RefreshCw
              size={13}
              className={logsLoading ? "animate-spin" : ""}
            />
            Yenile
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Tarih
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Tur
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Durum
                </th>
                <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground md:table-cell">
                  Detay
                </th>
              </tr>
            </thead>
            <tbody>
              {logsLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="border-b border-border">
                    {Array.from({ length: 4 }).map((_, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="h-4 animate-pulse rounded bg-muted" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : logs.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-16 text-center text-muted-foreground"
                  >
                    <Database size={36} className="mx-auto mb-3 opacity-30" />
                    <p className="text-sm font-medium">
                      DIA senkron logu bulunamadi
                    </p>
                    <p className="text-xs">
                      Senkronizasyon islemleri burada gorunecek
                    </p>
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr
                    key={log.id}
                    className="border-b border-border transition-colors last:border-0 hover:bg-muted/40"
                  >
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {formatDate(log.created_at)}
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-medium text-foreground">
                        {EVENT_TYPE_LABELS[log.event_type] ?? log.event_type}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          STATUS_COLORS[log.status] ?? ""
                        }`}
                      >
                        {STATUS_ICONS[log.status]}
                        {STATUS_LABELS[log.status] ?? log.status}
                      </span>
                    </td>
                    <td className="hidden px-4 py-3 text-xs text-muted-foreground md:table-cell">
                      {log.error_message ? (
                        <span className="text-destructive">
                          {log.error_message}
                        </span>
                      ) : (
                        <span>—</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Toast notifications ────────────────────────────────────────────── */}
      <div className="pointer-events-none fixed bottom-6 right-6 z-50 flex flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium shadow-lg transition-all ${
              toast.type === "success"
                ? "border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-900/30 dark:text-green-300"
                : "border-destructive/30 bg-destructive/10 text-destructive"
            }`}
          >
            {toast.type === "success" ? (
              <Check size={15} className="shrink-0" />
            ) : (
              <AlertCircle size={15} className="shrink-0" />
            )}
            {toast.message}
          </div>
        ))}
      </div>
    </div>
  );
}
