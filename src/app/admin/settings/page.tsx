"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  Building2,
  Share2,
  Phone,
  BarChart3,
  Palette,
  Settings,
  ChevronDown,
  ChevronUp,
  Save,
  Loader2,
  Upload,
  Check,
  AlertCircle,
  RefreshCw,
  Image as ImageIcon,
} from "lucide-react";
import type { DbSiteSetting } from "@/types/database";

// ─── Types ────────────────────────────────────────────────────────────────────

interface SettingField {
  key: string;
  label: string;
  placeholder?: string;
  type?: "text" | "email" | "tel" | "url" | "textarea";
}

interface SettingGroup {
  id: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  fields: SettingField[];
  hasFileUpload?: boolean;
  hasToggle?: string; // key of the toggle field
}

// ─── Group definitions ────────────────────────────────────────────────────────

const SETTING_GROUPS: SettingGroup[] = [
  {
    id: "company",
    label: "Firma Bilgileri",
    icon: Building2,
    fields: [
      { key: "company_name", label: "Firma Adı", placeholder: "Kısmet Plastik" },
      { key: "company_address", label: "Adres", placeholder: "Tam adres", type: "textarea" },
      { key: "company_phone", label: "Telefon", placeholder: "+90 212 000 00 00", type: "tel" },
      { key: "company_email", label: "E-posta", placeholder: "bilgi@kismetplastik.com", type: "email" },
      { key: "company_tax_number", label: "Vergi Numarası", placeholder: "0000000000" },
      { key: "company_tax_office", label: "Vergi Dairesi", placeholder: "Beylikdüzü VD" },
    ],
  },
  {
    id: "social",
    label: "Sosyal Medya",
    icon: Share2,
    fields: [
      { key: "social_instagram", label: "Instagram", placeholder: "https://instagram.com/...", type: "url" },
      { key: "social_linkedin", label: "LinkedIn", placeholder: "https://linkedin.com/company/...", type: "url" },
      { key: "social_facebook", label: "Facebook", placeholder: "https://facebook.com/...", type: "url" },
      { key: "social_youtube", label: "YouTube", placeholder: "https://youtube.com/...", type: "url" },
      { key: "social_twitter", label: "X / Twitter", placeholder: "https://x.com/...", type: "url" },
    ],
  },
  {
    id: "contact",
    label: "İletişim",
    icon: Phone,
    fields: [
      { key: "whatsapp_number", label: "WhatsApp Numarası", placeholder: "+90 500 000 00 00", type: "tel" },
      { key: "whatsapp_hours", label: "WhatsApp Çalışma Saatleri", placeholder: "09:00 - 18:00" },
    ],
  },
  {
    id: "analytics",
    label: "Analitik",
    icon: BarChart3,
    fields: [
      { key: "google_analytics_id", label: "Google Analytics ID", placeholder: "G-XXXXXXXXXX" },
    ],
  },
  {
    id: "branding",
    label: "Marka",
    icon: Palette,
    fields: [
      { key: "logo_url", label: "Logo URL", placeholder: "https://...", type: "url" },
    ],
    hasFileUpload: true,
  },
  {
    id: "system",
    label: "Sistem",
    icon: Settings,
    fields: [],
    hasToggle: "maintenance_mode",
  },
];

// ─── Toast helper ─────────────────────────────────────────────────────────────

interface Toast {
  id: number;
  type: "success" | "error";
  message: string;
}

// ─── Utility ──────────────────────────────────────────────────────────────────

// ─── Components ───────────────────────────────────────────────────────────────

function ToggleSwitch({
  checked,
  onChange,
  disabled,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
        checked ? "bg-primary" : "bg-muted-foreground/30"
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function AdminSettingsPage() {
  const [, setSettings] = useState<DbSiteSetting[]>([]);
  const [localValues, setLocalValues] = useState<Record<string, string>>({});
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const [saving, setSaving] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastId = useRef(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Fetch settings ──────────────────────────────────────────────────────────

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const res = await fetch("/api/admin/settings");
      const json = await res.json();
      if (!res.ok || !json.success) {
        setLoadError(json.error ?? "Ayarlar yüklenemedi");
        return;
      }
      const fetched: DbSiteSetting[] = json.data?.settings ?? [];
      setSettings(fetched);
      const map: Record<string, string> = {};
      fetched.forEach((s) => {
        map[s.key] = s.value;
      });
      setLocalValues(map);
    } catch {
      setLoadError("Bağlantı hatası");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  // ── Toast ───────────────────────────────────────────────────────────────────

  const showToast = useCallback((type: "success" | "error", message: string) => {
    const id = ++toastId.current;
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  // ── Field change ────────────────────────────────────────────────────────────

  const handleChange = (key: string, value: string) => {
    setLocalValues((prev) => ({ ...prev, [key]: value }));
  };

  // ── Toggle collapse ─────────────────────────────────────────────────────────

  const toggleCollapse = (id: string) => {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // ── Save group ──────────────────────────────────────────────────────────────

  const saveGroup = async (group: SettingGroup) => {
    setSaving(group.id);
    try {
      const keys = group.fields.map((f) => f.key);
      if (group.hasToggle) keys.push(group.hasToggle);

      const settingsPayload = keys.map((key) => ({
        key,
        value: localValues[key] ?? "",
        group: group.id,
      }));

      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings: settingsPayload }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        showToast("error", json.error ?? "Kaydetme başarısız");
        return;
      }

      // Merge updated records back
      const updatedRows: DbSiteSetting[] = json.data?.updated ?? [];
      setSettings((prev) => {
        const map = new Map(prev.map((s) => [s.key, s]));
        updatedRows.forEach((r) => map.set(r.key, r));
        return Array.from(map.values());
      });

      showToast("success", `"${group.label}" kaydedildi`);
    } catch {
      showToast("error", "Bağlantı hatası");
    } finally {
      setSaving(null);
    }
  };

  // ── Logo upload ─────────────────────────────────────────────────────────────

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/settings/upload", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        showToast("error", json.error ?? "Yükleme başarısız");
        return;
      }

      const url: string = json.data?.url ?? "";
      handleChange("logo_url", url);
      showToast("success", "Logo yüklendi. Kaydetmek için grubu kaydedin.");
    } catch {
      showToast("error", "Yükleme sırasında hata oluştu");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // ─── Render ─────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 animate-pulse rounded-lg bg-muted" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-40 animate-pulse rounded-xl bg-muted" />
        ))}
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="flex flex-col items-center gap-4 py-20 text-center">
        <AlertCircle size={40} className="text-destructive opacity-60" />
        <p className="text-sm font-medium text-destructive">{loadError}</p>
        <button
          onClick={fetchSettings}
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
        >
          <RefreshCw size={14} />
          Tekrar Dene
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Site Ayarları</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Firma bilgileri, sosyal medya, analitik ve sistem ayarlarını yönetin.
          </p>
        </div>
        <button
          onClick={fetchSettings}
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted"
          title="Yenile"
        >
          <RefreshCw size={14} />
          Yenile
        </button>
      </div>

      {/* Setting group cards */}
      <div className="space-y-4">
        {SETTING_GROUPS.map((group) => {
          const isCollapsed = collapsed.has(group.id);
          const isSaving = saving === group.id;

          return (
            <div
              key={group.id}
              className="overflow-hidden rounded-xl border border-border bg-card shadow-sm"
            >
              {/* Card header / collapse toggle */}
              <button
                type="button"
                onClick={() => toggleCollapse(group.id)}
                className="flex w-full items-center gap-3 px-5 py-4 text-left transition-colors hover:bg-muted/50"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <group.icon size={16} />
                </div>
                <span className="flex-1 text-sm font-semibold text-foreground">
                  {group.label}
                </span>
                {isCollapsed ? (
                  <ChevronDown size={16} className="text-muted-foreground" />
                ) : (
                  <ChevronUp size={16} className="text-muted-foreground" />
                )}
              </button>

              {/* Card body */}
              {!isCollapsed && (
                <div className="border-t border-border px-5 pb-5 pt-4">
                  <div className="space-y-4">
                    {/* Standard text fields */}
                    {group.fields.map((field) => (
                      <div key={field.key}>
                        <label
                          htmlFor={field.key}
                          className="mb-1.5 block text-xs font-semibold text-muted-foreground uppercase tracking-wide"
                        >
                          {field.label}
                        </label>
                        {field.type === "textarea" ? (
                          <textarea
                            id={field.key}
                            rows={3}
                            value={localValues[field.key] ?? ""}
                            onChange={(e) => handleChange(field.key, e.target.value)}
                            placeholder={field.placeholder}
                            className="w-full resize-y rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                          />
                        ) : (
                          <input
                            id={field.key}
                            type={field.type ?? "text"}
                            value={localValues[field.key] ?? ""}
                            onChange={(e) => handleChange(field.key, e.target.value)}
                            placeholder={field.placeholder}
                            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                          />
                        )}

                        {/* Logo URL with file upload (branding group only) */}
                        {field.key === "logo_url" && group.hasFileUpload && (
                          <div className="mt-2 flex items-center gap-3">
                            {/* Preview */}
                            {localValues["logo_url"] ? (
                              /* eslint-disable-next-line @next/next/no-img-element */
                              <img
                                src={localValues["logo_url"]}
                                alt="Logo önizleme"
                                className="h-10 max-w-[120px] rounded border border-border object-contain p-1"
                                onError={(e) => {
                                  (e.currentTarget as HTMLImageElement).style.display = "none";
                                }}
                              />
                            ) : (
                              <div className="flex h-10 w-24 items-center justify-center rounded border border-dashed border-border bg-muted text-muted-foreground">
                                <ImageIcon size={16} />
                              </div>
                            )}

                            {/* Upload button */}
                            <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted/80 hover:text-foreground">
                              {uploading ? (
                                <Loader2 size={13} className="animate-spin" />
                              ) : (
                                <Upload size={13} />
                              )}
                              {uploading ? "Yükleniyor..." : "Dosya Yükle"}
                              <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/jpeg,image/png,image/webp,image/svg+xml"
                                className="hidden"
                                onChange={handleLogoUpload}
                                disabled={uploading}
                              />
                            </label>
                            <span className="text-[11px] text-muted-foreground">
                              Maks. 5 MB — JPEG, PNG, WebP, SVG
                            </span>
                          </div>
                        )}
                      </div>
                    ))}

                    {/* Toggle field (system group: maintenance_mode) */}
                    {group.hasToggle && (
                      <div className="flex items-center justify-between rounded-lg border border-border bg-background px-4 py-3">
                        <div>
                          <p className="text-sm font-medium text-foreground">Bakım Modu</p>
                          <p className="text-xs text-muted-foreground">
                            Aktif olduğunda ziyaretçilere bakım sayfası gösterilir.
                          </p>
                        </div>
                        <ToggleSwitch
                          checked={localValues[group.hasToggle] === "true"}
                          onChange={(v) => handleChange(group.hasToggle!, v ? "true" : "false")}
                          disabled={isSaving}
                        />
                      </div>
                    )}
                  </div>

                  {/* Save button */}
                  <div className="mt-5 flex justify-end">
                    <button
                      type="button"
                      onClick={() => saveGroup(group)}
                      disabled={isSaving}
                      className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 disabled:opacity-60"
                    >
                      {isSaving ? (
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
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Toast notifications */}
      <div className="pointer-events-none fixed bottom-6 right-6 z-50 flex flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center gap-3 rounded-xl border px-4 py-3 shadow-lg text-sm font-medium transition-all ${
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
