"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  Search,
  Save,
  Download,
  Upload,
  Plus,
  Trash2,
  AlertTriangle,
  Check,
  X,
  RefreshCw,
  Globe,
  ChevronRight,
  Filter,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type FlatTranslations = Record<string, string>;
type NestedTranslations = Record<string, unknown>;

// ─── Flatten / Unflatten helpers ──────────────────────────────────────────────

function flattenObject(
  obj: NestedTranslations,
  prefix = "",
  result: FlatTranslations = {}
): FlatTranslations {
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (Array.isArray(value)) {
      result[fullKey] = JSON.stringify(value);
    } else if (typeof value === "object" && value !== null) {
      flattenObject(value as NestedTranslations, fullKey, result);
    } else {
      result[fullKey] = String(value ?? "");
    }
  }
  return result;
}

function unflattenObject(flat: FlatTranslations): NestedTranslations {
  const result: NestedTranslations = {};
  for (const [fullKey, value] of Object.entries(flat)) {
    const parts = fullKey.split(".");
    let current = result;
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      if (typeof current[part] !== "object" || current[part] === null) {
        current[part] = {};
      }
      current = current[part] as NestedTranslations;
    }
    const lastPart = parts[parts.length - 1];
    // Try to restore arrays
    let parsed: unknown = value;
    if (typeof value === "string" && value.startsWith("[")) {
      try {
        parsed = JSON.parse(value);
      } catch {
        parsed = value;
      }
    }
    current[lastPart] = parsed;
  }
  return result;
}

// ─── Locale metadata ──────────────────────────────────────────────────────────

const LOCALES = [
  { code: "tr", label: "Türkçe", flag: "🇹🇷" },
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "ar", label: "العربية", flag: "🇸🇦" },
  { code: "ru", label: "Русский", flag: "🇷🇺" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "de", label: "Deutsch", flag: "🇩🇪" },
  { code: "es", label: "Español", flag: "🇪🇸" },
  { code: "zh", label: "中文", flag: "🇨🇳" },
  { code: "ja", label: "日本語", flag: "🇯🇵" },
  { code: "ko", label: "한국어", flag: "🇰🇷" },
  { code: "pt", label: "Português", flag: "🇵🇹" },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function TranslationsPage() {
  const [selectedLocale, setSelectedLocale] = useState("tr");
  const [translations, setTranslations] = useState<FlatTranslations>({});
  const [baseTranslations, setBaseTranslations] = useState<FlatTranslations>({});
  const [, setOriginalTranslations] = useState<FlatTranslations>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");
  const [saveMessage, setSaveMessage] = useState("");
  const [search, setSearch] = useState("");
  const [showMissingOnly, setShowMissingOnly] = useState(false);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState("");
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");
  const [showAddRow, setShowAddRow] = useState(false);
  const [dirtyKeys, setDirtyKeys] = useState<Set<string>>(new Set());

  const importInputRef = useRef<HTMLInputElement>(null);

  // ── Load base (tr) translations ──────────────────────────────────────────────
  const loadBaseTranslations = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/translations?locale=tr");
      const json = await res.json();
      if (json.success) {
        setBaseTranslations(flattenObject(json.data as NestedTranslations));
      }
    } catch {
      // silently fail — base is used for diff only
    }
  }, []);

  // ── Load locale translations ──────────────────────────────────────────────────
  const loadTranslations = useCallback(async (locale: string) => {
    setLoading(true);
    setSaveStatus("idle");
    setDirtyKeys(new Set());
    setEditingKey(null);
    setShowAddRow(false);
    try {
      const res = await fetch(`/api/admin/translations?locale=${locale}`);
      const json = await res.json();
      if (json.success) {
        const flat = flattenObject(json.data as NestedTranslations);
        setTranslations(flat);
        setOriginalTranslations(flat);
      } else {
        console.error(json.error);
      }
    } catch (err) {
      console.error("[TranslationsPage] load error", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadBaseTranslations();
  }, [loadBaseTranslations]);

  useEffect(() => {
    void loadTranslations(selectedLocale);
  }, [selectedLocale, loadTranslations]);

  // ── Derived data ───────────────────────────────────────────────────────────────

  const allKeys = selectedLocale === "tr"
    ? Object.keys(translations)
    : Array.from(new Set([...Object.keys(baseTranslations), ...Object.keys(translations)])).sort();

  const missingKeys = selectedLocale === "tr"
    ? []
    : allKeys.filter((k) => !translations[k]);

  const filteredKeys = allKeys.filter((k) => {
    if (showMissingOnly && translations[k]) return false;
    if (search) {
      const q = search.toLowerCase();
      return k.toLowerCase().includes(q) || (translations[k] ?? "").toLowerCase().includes(q);
    }
    return true;
  });

  // ── Editing helpers ────────────────────────────────────────────────────────────

  const startEdit = (key: string) => {
    setEditingKey(key);
    setEditingValue(translations[key] ?? "");
  };

  const cancelEdit = () => {
    setEditingKey(null);
    setEditingValue("");
  };

  const commitEdit = (key: string) => {
    if (editingValue === (translations[key] ?? "")) {
      cancelEdit();
      return;
    }
    setTranslations((prev) => ({ ...prev, [key]: editingValue }));
    setDirtyKeys((prev) => new Set(prev).add(key));
    cancelEdit();
  };

  const deleteKey = (key: string) => {
    if (!confirm(`"${key}" anahtarını silmek istediğinizden emin misiniz?`)) return;
    setTranslations((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
    setDirtyKeys((prev) => new Set(prev).add(`__deleted__${key}`));
  };

  const addNewKey = () => {
    if (!newKey.trim()) return;
    if (translations[newKey.trim()] !== undefined) {
      alert("Bu anahtar zaten mevcut.");
      return;
    }
    const k = newKey.trim();
    const v = newValue.trim();
    setTranslations((prev) => ({ ...prev, [k]: v }));
    setDirtyKeys((prev) => new Set(prev).add(k));
    setNewKey("");
    setNewValue("");
    setShowAddRow(false);
  };

  // ── Save ────────────────────────────────────────────────────────────────────────

  const saveTranslations = async () => {
    setSaving(true);
    setSaveStatus("idle");
    try {
      const nested = unflattenObject(translations);
      const res = await fetch("/api/admin/translations", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locale: selectedLocale, translations: nested }),
      });
      const json = await res.json();
      if (json.success) {
        setSaveStatus("success");
        setSaveMessage(json.message ?? "Çeviriler kaydedildi");
        setOriginalTranslations({ ...translations });
        setDirtyKeys(new Set());
      } else {
        setSaveStatus("error");
        setSaveMessage(json.error ?? "Kaydetme başarısız");
      }
    } catch {
      setSaveStatus("error");
      setSaveMessage("Bağlantı hatası");
    } finally {
      setSaving(false);
      setTimeout(() => setSaveStatus("idle"), 4000);
    }
  };

  // ── Export ──────────────────────────────────────────────────────────────────────

  const handleExport = () => {
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
    window.location.href = `${basePath}/api/admin/translations/export?locale=${selectedLocale}`;
  };

  // ── Import ──────────────────────────────────────────────────────────────────────

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("locale", selectedLocale);
    formData.append("file", file);
    try {
      const res = await fetch("/api/admin/translations/import", {
        method: "POST",
        body: formData,
      });
      const json = await res.json();
      if (json.success) {
        await loadTranslations(selectedLocale);
        setSaveStatus("success");
        setSaveMessage(json.message ?? "Dosya içe aktarıldı");
        setTimeout(() => setSaveStatus("idle"), 4000);
      } else {
        alert(json.error ?? "İçe aktarma başarısız");
      }
    } catch {
      alert("İçe aktarma sırasında hata oluştu");
    }
    // Reset the input so the same file can be re-imported
    e.target.value = "";
  };

  // ─── Render ───────────────────────────────────────────────────────────────────

  const hasDirty = dirtyKeys.size > 0;

  return (
    <div className="flex h-full flex-col gap-0">
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Çeviri Yönetimi</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Dil dosyalarını düzenle, eksik çevirileri bul ve JSON olarak dışa/içe aktar.
        </p>
      </div>

      <div className="flex flex-1 gap-4 overflow-hidden">
        {/* ── Sidebar: locale list ───────────────────────────────────────────── */}
        <aside className="w-48 shrink-0">
          <div className="overflow-hidden rounded-xl border border-border bg-card">
            <div className="border-b border-border px-3 py-2.5">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Diller
              </p>
            </div>
            <nav className="p-1.5">
              {LOCALES.map((loc) => {
                const isSelected = selectedLocale === loc.code;
                return (
                  <button
                    key={loc.code}
                    onClick={() => setSelectedLocale(loc.code)}
                    className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm transition-all ${
                      isSelected
                        ? "bg-primary/10 font-semibold text-primary"
                        : "text-foreground hover:bg-muted"
                    }`}
                  >
                    <span className="text-base leading-none">{loc.flag}</span>
                    <span className="flex-1 text-[13px]">{loc.label}</span>
                    {loc.code !== "tr" && isSelected && missingKeys.length > 0 && (
                      <span className="rounded-full bg-destructive/10 px-1.5 py-0.5 text-[10px] font-bold text-destructive">
                        {missingKeys.length}
                      </span>
                    )}
                    {isSelected && <ChevronRight size={12} className="opacity-50" />}
                  </button>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* ── Main editor area ───────────────────────────────────────────────── */}
        <div className="flex flex-1 flex-col overflow-hidden rounded-xl border border-border bg-card">
          {/* Toolbar */}
          <div className="flex flex-wrap items-center gap-2 border-b border-border px-4 py-3">
            {/* Search */}
            <div className="relative flex-1 min-w-48">
              <Search
                size={14}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Anahtar veya değer ara..."
                className="h-9 w-full rounded-lg border border-border bg-muted pl-8 pr-3 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/30"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X size={13} />
                </button>
              )}
            </div>

            {/* Missing filter */}
            {selectedLocale !== "tr" && (
              <button
                onClick={() => setShowMissingOnly((v) => !v)}
                className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[13px] font-medium transition-all ${
                  showMissingOnly
                    ? "border-destructive/40 bg-destructive/10 text-destructive"
                    : "border-border text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Filter size={13} />
                Eksik Çeviriler
                {missingKeys.length > 0 && (
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                      showMissingOnly
                        ? "bg-destructive/20 text-destructive"
                        : "bg-muted-foreground/20 text-muted-foreground"
                    }`}
                  >
                    {missingKeys.length}
                  </span>
                )}
              </button>
            )}

            <div className="ml-auto flex items-center gap-2">
              {/* Reload */}
              <button
                onClick={() => loadTranslations(selectedLocale)}
                disabled={loading}
                title="Yenile"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-all hover:bg-muted hover:text-foreground disabled:opacity-50"
              >
                <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
              </button>

              {/* Add new key */}
              <button
                onClick={() => setShowAddRow((v) => !v)}
                className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-[13px] font-medium text-muted-foreground transition-all hover:bg-muted hover:text-foreground"
              >
                <Plus size={14} />
                Yeni Anahtar
              </button>

              {/* Import */}
              <button
                onClick={() => importInputRef.current?.click()}
                className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-[13px] font-medium text-muted-foreground transition-all hover:bg-muted hover:text-foreground"
              >
                <Upload size={14} />
                İçe Aktar
              </button>
              <input
                ref={importInputRef}
                type="file"
                accept=".json,application/json"
                className="hidden"
                onChange={handleImportFile}
              />

              {/* Export */}
              <button
                onClick={handleExport}
                className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-[13px] font-medium text-muted-foreground transition-all hover:bg-muted hover:text-foreground"
              >
                <Download size={14} />
                Dışa Aktar
              </button>

              {/* Save */}
              <button
                onClick={saveTranslations}
                disabled={saving || !hasDirty}
                className={`flex items-center gap-1.5 rounded-lg px-4 py-1.5 text-[13px] font-semibold transition-all disabled:opacity-50 ${
                  hasDirty
                    ? "bg-primary text-white hover:bg-primary/90"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {saving ? (
                  <RefreshCw size={14} className="animate-spin" />
                ) : (
                  <Save size={14} />
                )}
                Kaydet
                {hasDirty && (
                  <span className="rounded-full bg-white/20 px-1.5 text-[10px] font-bold">
                    {dirtyKeys.size}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Status bar */}
          {saveStatus !== "idle" && (
            <div
              className={`flex items-center gap-2 px-4 py-2 text-sm ${
                saveStatus === "success"
                  ? "bg-success/10 text-success"
                  : "bg-destructive/10 text-destructive"
              }`}
            >
              {saveStatus === "success" ? <Check size={14} /> : <AlertTriangle size={14} />}
              {saveMessage}
            </div>
          )}

          {/* Add new key row */}
          {showAddRow && (
            <div className="flex items-center gap-2 border-b border-border bg-accent/5 px-4 py-2.5">
              <Globe size={14} className="shrink-0 text-muted-foreground" />
              <input
                type="text"
                value={newKey}
                onChange={(e) => setNewKey(e.target.value)}
                placeholder="yeni.anahtar.yolu"
                className="h-8 flex-1 rounded-lg border border-border bg-background px-3 text-sm font-mono outline-none focus:border-primary focus:ring-1 focus:ring-primary/30"
                onKeyDown={(e) => {
                  if (e.key === "Enter") addNewKey();
                  if (e.key === "Escape") {
                    setShowAddRow(false);
                    setNewKey("");
                    setNewValue("");
                  }
                }}
              />
              <span className="text-muted-foreground">=</span>
              <input
                type="text"
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                placeholder="Değer..."
                className="h-8 flex-1 rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/30"
                onKeyDown={(e) => {
                  if (e.key === "Enter") addNewKey();
                  if (e.key === "Escape") {
                    setShowAddRow(false);
                    setNewKey("");
                    setNewValue("");
                  }
                }}
              />
              <button
                onClick={addNewKey}
                className="flex h-8 items-center gap-1 rounded-lg bg-primary px-3 text-[12px] font-semibold text-white hover:bg-primary/90"
              >
                <Plus size={12} /> Ekle
              </button>
              <button
                onClick={() => {
                  setShowAddRow(false);
                  setNewKey("");
                  setNewValue("");
                }}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-muted"
              >
                <X size={13} />
              </button>
            </div>
          )}

          {/* Table */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-20 text-muted-foreground">
                <RefreshCw size={18} className="animate-spin" />
                <span className="ml-2 text-sm">Yükleniyor...</span>
              </div>
            ) : filteredKeys.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-2 py-20 text-muted-foreground">
                <Search size={28} className="opacity-30" />
                <p className="text-sm">
                  {showMissingOnly ? "Eksik çeviri yok." : "Sonuç bulunamadı."}
                </p>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead className="sticky top-0 z-10">
                  <tr className="border-b border-border bg-muted/80 backdrop-blur-sm">
                    <th className="w-5/12 px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Anahtar
                    </th>
                    <th className="w-6/12 px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Değer
                    </th>
                    <th className="w-1/12 px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      İşlem
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredKeys.map((key) => {
                    const value = translations[key];
                    const isMissing = selectedLocale !== "tr" && !value;
                    const isDirty = dirtyKeys.has(key);
                    const isEditing = editingKey === key;

                    return (
                      <tr
                        key={key}
                        className={`group border-b border-border last:border-0 transition-colors ${
                          isMissing
                            ? "bg-destructive/5 hover:bg-destructive/10"
                            : isDirty
                            ? "bg-amber-50/60 hover:bg-amber-50 dark:bg-amber-900/10 dark:hover:bg-amber-900/20"
                            : "hover:bg-muted/50"
                        }`}
                      >
                        {/* Key cell */}
                        <td className="px-4 py-2.5">
                          <div className="flex items-center gap-2">
                            {isMissing && (
                              <AlertTriangle
                                size={12}
                                className="shrink-0 text-destructive"
                                aria-label="Bu anahtar eksik"
                              />
                            )}
                            {isDirty && !isMissing && (
                              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                            )}
                            <span className="font-mono text-[12px] text-foreground/80">
                              {key}
                            </span>
                          </div>
                          {/* Show tr reference if not Turkish */}
                          {selectedLocale !== "tr" && baseTranslations[key] && (
                            <p className="mt-0.5 pl-5 text-[11px] text-muted-foreground/60 italic">
                              TR: {baseTranslations[key]}
                            </p>
                          )}
                        </td>

                        {/* Value cell */}
                        <td
                          className="px-4 py-2.5"
                          onClick={() => !isEditing && startEdit(key)}
                        >
                          {isEditing ? (
                            <div className="flex items-center gap-2">
                              <textarea
                                autoFocus
                                value={editingValue}
                                onChange={(e) => setEditingValue(e.target.value)}
                                rows={Math.min(
                                  4,
                                  Math.max(1, editingValue.split("\n").length)
                                )}
                                className="w-full resize-y rounded-lg border border-primary bg-background px-3 py-1.5 text-sm outline-none ring-1 ring-primary/30"
                                onKeyDown={(e) => {
                                  if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    commitEdit(key);
                                  }
                                  if (e.key === "Escape") cancelEdit();
                                }}
                              />
                              <div className="flex flex-col gap-1">
                                <button
                                  onClick={() => commitEdit(key)}
                                  className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary hover:bg-primary/20"
                                  title="Onayla (Enter)"
                                >
                                  <Check size={13} />
                                </button>
                                <button
                                  onClick={cancelEdit}
                                  className="flex h-7 w-7 items-center justify-center rounded-lg bg-muted text-muted-foreground hover:bg-muted/80"
                                  title="İptal (Esc)"
                                >
                                  <X size={13} />
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div
                              className={`cursor-text rounded-md px-2 py-1 text-sm transition-colors group-hover:bg-primary/5 ${
                                isMissing
                                  ? "italic text-destructive/60"
                                  : "text-foreground"
                              }`}
                              title="Düzenlemek için tıkla"
                            >
                              {value ? (
                                value.length > 120 ? `${value.slice(0, 120)}…` : value
                              ) : (
                                <span className="text-[12px] text-muted-foreground/50">
                                  — Eksik çeviri —
                                </span>
                              )}
                            </div>
                          )}
                        </td>

                        {/* Actions cell */}
                        <td className="px-4 py-2.5 text-right">
                          <button
                            onClick={() => deleteKey(key)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity rounded-lg p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                            title="Anahtarı sil"
                          >
                            <Trash2 size={13} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          {/* Footer stats */}
          <div className="flex items-center justify-between border-t border-border bg-muted/40 px-4 py-2 text-[12px] text-muted-foreground">
            <span>
              {filteredKeys.length} / {allKeys.length} anahtar gösteriliyor
            </span>
            <div className="flex items-center gap-4">
              {selectedLocale !== "tr" && (
                <span
                  className={missingKeys.length > 0 ? "text-destructive" : "text-success"}
                >
                  {missingKeys.length > 0
                    ? `${missingKeys.length} eksik çeviri`
                    : "Tüm çeviriler mevcut"}
                </span>
              )}
              {hasDirty && (
                <span className="text-amber-600 dark:text-amber-400">
                  {dirtyKeys.size} değişiklik kaydedilmedi
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
