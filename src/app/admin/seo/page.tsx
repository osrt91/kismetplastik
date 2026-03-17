"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Search,
  Plus,
  Save,
  Trash2,
  X,
  Loader2,
  Globe,
  ChevronRight,
  ExternalLink,
  AlertCircle,
  CheckCircle2,
  EyeOff,
  Image as ImageIcon,
} from "lucide-react";
import type { DbSeoSetting } from "@/types/database";

const KNOWN_PAGES = [
  "/",
  "/urunler",
  "/hakkimizda",
  "/kalite",
  "/uretim",
  "/iletisim",
  "/teklif-al",
  "/katalog",
  "/blog",
  "/sss",
  "/kariyer",
  "/galeri",
  "/sektorler",
  "/fuarlar",
  "/surdurulebilirlik",
  "/ambalaj-sozlugu",
  "/kvkk",
  "/vizyon-misyon",
  "/referanslar",
  "/arge",
  "/numune-talep",
];

interface EditForm {
  meta_title_tr: string;
  meta_title_en: string;
  meta_description_tr: string;
  meta_description_en: string;
  og_image: string;
  canonical_url: string;
  no_index: boolean;
  json_ld: string;
}

const EMPTY_FORM: EditForm = {
  meta_title_tr: "",
  meta_title_en: "",
  meta_description_tr: "",
  meta_description_en: "",
  og_image: "",
  canonical_url: "",
  no_index: false,
  json_ld: "",
};

function charCountClass(current: number, max: number): string {
  if (current === 0) return "text-muted-foreground";
  if (current > max) return "text-destructive font-semibold";
  if (current > max * 0.9) return "text-amber-500";
  return "text-green-600 dark:text-green-400";
}

export default function AdminSeoPage() {
  const [settings, setSettings] = useState<DbSeoSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Selected page for editing
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<EditForm>(EMPTY_FORM);
  const [jsonLdError, setJsonLdError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Custom page path input
  const [showAddPath, setShowAddPath] = useState(false);
  const [customPath, setCustomPath] = useState("");

  // Search/filter
  const [search, setSearch] = useState("");

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch((process.env.NEXT_PUBLIC_BASE_PATH || "") + "/api/admin/seo");
      const json = await res.json();
      if (!res.ok || !json.success) {
        setError(json.error ?? "SEO ayarları yüklenemedi.");
        return;
      }
      setSettings(json.data ?? []);
    } catch {
      setError("Bağlantı hatası.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  // Build a merged list: known pages + any saved pages not in KNOWN_PAGES + custom
  const savedPaths = settings.map((s) => s.page_path);
  const extraPaths = savedPaths.filter((p) => !KNOWN_PAGES.includes(p));
  const allPaths = [...KNOWN_PAGES, ...extraPaths];

  const filteredPaths = search
    ? allPaths.filter((p) => p.toLowerCase().includes(search.toLowerCase()))
    : allPaths;

  function getSettingForPath(path: string): DbSeoSetting | undefined {
    return settings.find((s) => s.page_path === path);
  }

  function openEditor(path: string) {
    const existing = getSettingForPath(path);
    setSelectedPath(path);
    setEditingId(existing?.id ?? null);
    setJsonLdError(null);
    setSaveSuccess(false);
    if (existing) {
      setForm({
        meta_title_tr: existing.meta_title_tr ?? "",
        meta_title_en: existing.meta_title_en ?? "",
        meta_description_tr: existing.meta_description_tr ?? "",
        meta_description_en: existing.meta_description_en ?? "",
        og_image: existing.og_image ?? "",
        canonical_url: existing.canonical_url ?? "",
        no_index: existing.no_index ?? false,
        json_ld: existing.json_ld ? JSON.stringify(existing.json_ld, null, 2) : "",
      });
    } else {
      setForm(EMPTY_FORM);
    }
  }

  function closeEditor() {
    setSelectedPath(null);
    setEditingId(null);
    setForm(EMPTY_FORM);
    setJsonLdError(null);
    setSaveSuccess(false);
  }

  function handleFormChange(
    field: keyof EditForm,
    value: string | boolean
  ) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (field === "json_ld") setJsonLdError(null);
    setSaveSuccess(false);
  }

  async function handleSave() {
    if (!selectedPath) return;

    // Validate JSON-LD before saving
    let parsedJsonLd: Record<string, unknown> | null = null;
    if (form.json_ld.trim()) {
      try {
        parsedJsonLd = JSON.parse(form.json_ld.trim());
        setJsonLdError(null);
      } catch {
        setJsonLdError("Geçersiz JSON formatı. Lütfen kontrol edin.");
        return;
      }
    }

    setSaving(true);
    setSaveSuccess(false);
    try {
      const payload = {
        page_path: selectedPath,
        meta_title_tr: form.meta_title_tr.trim() || null,
        meta_title_en: form.meta_title_en.trim() || null,
        meta_description_tr: form.meta_description_tr.trim() || null,
        meta_description_en: form.meta_description_en.trim() || null,
        og_image: form.og_image.trim() || null,
        canonical_url: form.canonical_url.trim() || null,
        no_index: form.no_index,
        json_ld: parsedJsonLd,
      };

      const res = await fetch((process.env.NEXT_PUBLIC_BASE_PATH || "") + "/api/admin/seo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();

      if (!res.ok || !json.success) {
        setError(json.error ?? "Kaydetme başarısız.");
        return;
      }

      // Update local state
      const saved: DbSeoSetting = json.data;
      setSettings((prev) => {
        const idx = prev.findIndex((s) => s.page_path === selectedPath);
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = saved;
          return next;
        }
        return [...prev, saved];
      });
      setEditingId(saved.id);
      setSaveSuccess(true);
    } catch {
      setError("Bağlantı hatası.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!editingId || !selectedPath) return;
    if (!confirm(`"${selectedPath}" sayfasının SEO ayarlarını silmek istediğinizden emin misiniz?`))
      return;

    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/seo/${editingId}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok || !json.success) {
        alert(json.error ?? "Silme başarısız.");
        return;
      }
      setSettings((prev) => prev.filter((s) => s.id !== editingId));
      closeEditor();
    } catch {
      alert("Bağlantı hatası.");
    } finally {
      setDeleting(false);
    }
  }

  function handleAddCustomPath() {
    const trimmed = customPath.trim();
    if (!trimmed) return;
    const path = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
    setShowAddPath(false);
    setCustomPath("");
    openEditor(path);
  }

  return (
    <div className="flex h-[calc(100vh-3.5rem)] overflow-hidden">
      {/* Left panel: page list */}
      <div className="flex w-72 shrink-0 flex-col border-r border-border bg-card">
        {/* Header */}
        <div className="border-b border-border px-4 py-3">
          <h1 className="text-base font-bold text-foreground">SEO Yönetimi</h1>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {settings.length} sayfa yapılandırılmış
          </p>
        </div>

        {/* Search */}
        <div className="border-b border-border p-3">
          <div className="relative">
            <Search
              size={14}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Sayfa ara..."
              className="w-full rounded-lg border border-border bg-muted py-2 pl-8 pr-3 text-xs text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        {/* Page list */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 size={20} className="animate-spin text-muted-foreground" />
            </div>
          ) : (
            <ul className="py-1">
              {filteredPaths.map((path) => {
                const setting = getSettingForPath(path);
                const isActive = selectedPath === path;
                const isConfigured = Boolean(setting);
                return (
                  <li key={path}>
                    <button
                      onClick={() => openEditor(path)}
                      className={`flex w-full items-center gap-2 px-4 py-2.5 text-left text-xs transition-colors ${
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      <Globe size={12} className="shrink-0" />
                      <span className="flex-1 truncate font-mono">{path}</span>
                      {setting?.no_index && (
                        <EyeOff size={11} className="shrink-0 text-amber-500" aria-label="no_index aktif" />
                      )}
                      {isConfigured && (
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-green-500" title="Yapılandırılmış" />
                      )}
                      {isActive && <ChevronRight size={12} className="shrink-0 opacity-60" />}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Add custom path */}
        <div className="border-t border-border p-3">
          {showAddPath ? (
            <div className="flex gap-2">
              <input
                type="text"
                value={customPath}
                onChange={(e) => setCustomPath(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAddCustomPath();
                  if (e.key === "Escape") {
                    setShowAddPath(false);
                    setCustomPath("");
                  }
                }}
                placeholder="/sayfa-adi"
                autoFocus
                className="flex-1 rounded-lg border border-border bg-muted px-2.5 py-1.5 text-xs text-foreground outline-none focus:border-primary"
              />
              <button
                onClick={handleAddCustomPath}
                className="rounded-lg bg-primary px-2.5 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
              >
                Ekle
              </button>
              <button
                onClick={() => {
                  setShowAddPath(false);
                  setCustomPath("");
                }}
                className="rounded-lg border border-border px-2 py-1.5 text-xs text-muted-foreground hover:bg-muted"
              >
                <X size={12} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowAddPath(true)}
              className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-border py-2 text-xs font-medium text-muted-foreground transition-colors hover:border-primary hover:text-primary"
            >
              <Plus size={13} />
              Özel sayfa ekle
            </button>
          )}
        </div>
      </div>

      {/* Right panel: editor */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {selectedPath === null ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 text-muted-foreground">
            <Globe size={48} className="opacity-20" />
            <p className="text-sm font-medium">Düzenlemek için bir sayfa seçin</p>
            <p className="text-xs">Sol listeden bir sayfa seçerek SEO ayarlarını düzenleyebilirsiniz.</p>
          </div>
        ) : (
          <div className="flex flex-1 flex-col overflow-hidden">
            {/* Editor header */}
            <div className="flex items-center justify-between border-b border-border px-6 py-3">
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-semibold text-foreground">
                  {selectedPath}
                </span>
                <a
                  href={`https://www.kismetplastik.com/tr${selectedPath === "/" ? "" : selectedPath}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary"
                  title="Siteyi görüntüle"
                >
                  <ExternalLink size={13} />
                </a>
                {editingId && (
                  <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
                    Kayıtlı
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {editingId && (
                  <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-destructive/70 transition-colors hover:border-destructive/50 hover:bg-destructive/10 hover:text-destructive disabled:opacity-40"
                  >
                    {deleting ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
                    Sil
                  </button>
                )}
                <button
                  onClick={closeEditor}
                  className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Error banner */}
            {error && (
              <div className="mx-6 mt-4 flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                <AlertCircle size={14} />
                {error}
                <button onClick={() => setError(null)} className="ml-auto">
                  <X size={14} />
                </button>
              </div>
            )}

            {/* Success banner */}
            {saveSuccess && (
              <div className="mx-6 mt-4 flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-800 dark:bg-green-900/20 dark:text-green-400">
                <CheckCircle2 size={14} />
                SEO ayarları başarıyla kaydedildi.
              </div>
            )}

            {/* Form */}
            <div className="flex-1 overflow-y-auto px-6 py-5">
              <div className="mx-auto max-w-3xl space-y-6">

                {/* Meta Titles */}
                <section>
                  <h2 className="mb-3 text-sm font-semibold text-foreground">Meta Başlık</h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {/* TR */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-medium text-foreground">
                          Türkçe <span className="text-muted-foreground">(meta_title_tr)</span>
                        </label>
                        <span
                          className={`text-[10px] ${charCountClass(
                            form.meta_title_tr.length,
                            60
                          )}`}
                        >
                          {form.meta_title_tr.length}/60
                        </span>
                      </div>
                      <input
                        type="text"
                        value={form.meta_title_tr}
                        onChange={(e) => handleFormChange("meta_title_tr", e.target.value)}
                        placeholder="Sayfa başlığı (TR)"
                        maxLength={80}
                        className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                      />
                      {form.meta_title_tr.length > 60 && (
                        <p className="text-[10px] text-destructive">
                          60 karakter sınırı aşıldı. Arama motorları uzun başlıkları keser.
                        </p>
                      )}
                    </div>

                    {/* EN */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-medium text-foreground">
                          İngilizce <span className="text-muted-foreground">(meta_title_en)</span>
                        </label>
                        <span
                          className={`text-[10px] ${charCountClass(
                            form.meta_title_en.length,
                            60
                          )}`}
                        >
                          {form.meta_title_en.length}/60
                        </span>
                      </div>
                      <input
                        type="text"
                        value={form.meta_title_en}
                        onChange={(e) => handleFormChange("meta_title_en", e.target.value)}
                        placeholder="Page title (EN)"
                        maxLength={80}
                        className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                      />
                      {form.meta_title_en.length > 60 && (
                        <p className="text-[10px] text-destructive">
                          60 karakter sınırı aşıldı.
                        </p>
                      )}
                    </div>
                  </div>
                </section>

                {/* Meta Descriptions */}
                <section>
                  <h2 className="mb-3 text-sm font-semibold text-foreground">Meta Açıklama</h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {/* TR */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-medium text-foreground">
                          Türkçe <span className="text-muted-foreground">(meta_description_tr)</span>
                        </label>
                        <span
                          className={`text-[10px] ${charCountClass(
                            form.meta_description_tr.length,
                            160
                          )}`}
                        >
                          {form.meta_description_tr.length}/160
                        </span>
                      </div>
                      <textarea
                        value={form.meta_description_tr}
                        onChange={(e) => handleFormChange("meta_description_tr", e.target.value)}
                        placeholder="Sayfa açıklaması (TR)"
                        rows={3}
                        maxLength={200}
                        className="w-full resize-none rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                      />
                      {form.meta_description_tr.length > 160 && (
                        <p className="text-[10px] text-destructive">
                          160 karakter sınırı aşıldı. Arama motorları açıklamayı keser.
                        </p>
                      )}
                    </div>

                    {/* EN */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-medium text-foreground">
                          İngilizce <span className="text-muted-foreground">(meta_description_en)</span>
                        </label>
                        <span
                          className={`text-[10px] ${charCountClass(
                            form.meta_description_en.length,
                            160
                          )}`}
                        >
                          {form.meta_description_en.length}/160
                        </span>
                      </div>
                      <textarea
                        value={form.meta_description_en}
                        onChange={(e) => handleFormChange("meta_description_en", e.target.value)}
                        placeholder="Page description (EN)"
                        rows={3}
                        maxLength={200}
                        className="w-full resize-none rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                      />
                      {form.meta_description_en.length > 160 && (
                        <p className="text-[10px] text-destructive">
                          160 karakter sınırı aşıldı.
                        </p>
                      )}
                    </div>
                  </div>
                </section>

                {/* OG Image */}
                <section>
                  <h2 className="mb-3 text-sm font-semibold text-foreground">OG Görseli</h2>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-foreground">
                      Görsel URL <span className="text-muted-foreground">(og_image)</span>
                    </label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <ImageIcon
                          size={14}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                        />
                        <input
                          type="url"
                          value={form.og_image}
                          onChange={(e) => handleFormChange("og_image", e.target.value)}
                          placeholder="https://example.com/og-image.jpg"
                          className="w-full rounded-lg border border-border bg-card py-2 pl-9 pr-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                        />
                      </div>
                    </div>
                    {form.og_image && (
                      <div className="mt-2 overflow-hidden rounded-lg border border-border">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={form.og_image}
                          alt="OG preview"
                          className="h-32 w-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = "none";
                          }}
                        />
                      </div>
                    )}
                  </div>
                </section>

                {/* Canonical URL */}
                <section>
                  <h2 className="mb-3 text-sm font-semibold text-foreground">Canonical URL</h2>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-foreground">
                      Canonical URL{" "}
                      <span className="text-muted-foreground">
                        (boş bırakılırsa otomatik belirlenir)
                      </span>
                    </label>
                    <input
                      type="url"
                      value={form.canonical_url}
                      onChange={(e) => handleFormChange("canonical_url", e.target.value)}
                      placeholder="https://www.kismetplastik.com/tr/sayfa"
                      className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </section>

                {/* No Index toggle */}
                <section>
                  <h2 className="mb-3 text-sm font-semibold text-foreground">Indeksleme</h2>
                  <label className="flex cursor-pointer items-center gap-3">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={form.no_index}
                        onChange={(e) => handleFormChange("no_index", e.target.checked)}
                        className="sr-only"
                      />
                      <div
                        className={`h-5 w-9 rounded-full transition-colors ${
                          form.no_index ? "bg-destructive" : "bg-muted-foreground/30"
                        }`}
                      >
                        <div
                          className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${
                            form.no_index ? "translate-x-4" : "translate-x-0.5"
                          }`}
                        />
                      </div>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-foreground">
                        no_index {form.no_index ? "Aktif" : "Pasif"}
                      </span>
                      <p className="text-xs text-muted-foreground">
                        {form.no_index
                          ? "Bu sayfa arama motorları tarafından indekslenmeyecek."
                          : "Bu sayfa arama motorları tarafından indekslenebilir."}
                      </p>
                    </div>
                    {form.no_index && (
                      <EyeOff size={16} className="ml-auto text-amber-500" />
                    )}
                  </label>
                </section>

                {/* JSON-LD */}
                <section>
                  <div className="mb-3 flex items-center justify-between">
                    <h2 className="text-sm font-semibold text-foreground">
                      JSON-LD Yapısal Veri
                    </h2>
                    <span className="text-[10px] text-muted-foreground">
                      Schema.org formatında
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    <textarea
                      value={form.json_ld}
                      onChange={(e) => handleFormChange("json_ld", e.target.value)}
                      placeholder={`{\n  "@context": "https://schema.org",\n  "@type": "WebPage"\n}`}
                      rows={8}
                      spellCheck={false}
                      className={`w-full resize-y rounded-lg border bg-card px-3 py-2 font-mono text-xs text-foreground outline-none focus:ring-2 focus:ring-primary/20 ${
                        jsonLdError
                          ? "border-destructive focus:border-destructive"
                          : "border-border focus:border-primary"
                      }`}
                    />
                    {jsonLdError && (
                      <p className="flex items-center gap-1.5 text-xs text-destructive">
                        <AlertCircle size={12} />
                        {jsonLdError}
                      </p>
                    )}
                    <p className="text-[10px] text-muted-foreground">
                      Boş bırakılabilir. Geçerli JSON formatında girilmelidir.
                    </p>
                  </div>
                </section>

                {/* SERP Preview */}
                {(form.meta_title_tr || form.meta_description_tr) && (
                  <section>
                    <h2 className="mb-3 text-sm font-semibold text-foreground">
                      Arama Sonucu Önizlemesi (TR)
                    </h2>
                    <div className="rounded-lg border border-border bg-card p-4">
                      <p className="mb-0.5 text-[10px] text-green-700 dark:text-green-500">
                        kismetplastik.com/tr{selectedPath === "/" ? "" : selectedPath}
                      </p>
                      <p className="text-base font-medium text-blue-700 dark:text-blue-400 line-clamp-1">
                        {form.meta_title_tr || "(başlık girilmedi)"}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                        {form.meta_description_tr || "(açıklama girilmedi)"}
                      </p>
                    </div>
                  </section>
                )}

                {/* Save button */}
                <div className="flex items-center justify-end gap-3 border-t border-border pb-4 pt-4">
                  {saveSuccess && (
                    <span className="flex items-center gap-1.5 text-xs text-green-600 dark:text-green-400">
                      <CheckCircle2 size={14} />
                      Kaydedildi
                    </span>
                  )}
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 disabled:opacity-60"
                  >
                    {saving ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Save size={14} />
                    )}
                    {saving ? "Kaydediliyor..." : "Kaydet"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
