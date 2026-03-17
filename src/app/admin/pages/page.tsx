"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  FileText,
  Loader2,
  Save,
  Check,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import type { DbContentSection } from "@/types/database";

// ─── Page definitions ────────────────────────────────────────────────────────

const PAGES = [
  { key: "home", label: "Ana Sayfa" },
  { key: "about", label: "Hakkımızda" },
  { key: "quality", label: "Kalite" },
  { key: "production", label: "Üretim" },
  { key: "contact", label: "İletişim" },
  { key: "vision", label: "Vizyon-Misyon" },
  { key: "sustainability", label: "Sürdürülebilirlik" },
  { key: "kvkk", label: "KVKK" },
  { key: "history", label: "Tarihçe" },
  { key: "rnd", label: "Ar-Ge" },
  { key: "sectors", label: "Sektörler" },
  { key: "career", label: "Kariyer" },
  { key: "catalog", label: "Katalog" },
  { key: "references", label: "Referanslar" },
  { key: "factory", label: "Fabrika" },
  { key: "quote", label: "Teklif Al" },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function sectionLabel(sectionKey: string): string {
  // "home_hero" → "Hero", "about_story" → "Story"
  const parts = sectionKey.split("_");
  // Remove the page prefix (first part)
  const rest = parts.slice(1).join(" ");
  if (!rest) return sectionKey;
  return rest.charAt(0).toUpperCase() + rest.slice(1);
}

type LangTab = "tr" | "en";

const EDITABLE_FIELDS: { key: string; label: string; type: "input" | "textarea" }[] = [
  { key: "title", label: "Başlık", type: "input" },
  { key: "subtitle", label: "Alt Başlık", type: "input" },
  { key: "content", label: "İçerik", type: "textarea" },
  { key: "cta_text", label: "CTA Metni", type: "input" },
];

const SHARED_FIELDS: { key: keyof DbContentSection; label: string; type: "input" }[] = [
  { key: "cta_url", label: "CTA URL", type: "input" },
  { key: "image_url", label: "Görsel URL", type: "input" },
];

// Check whether a section has any content for a bilingual field
function hasFieldContent(section: DbContentSection, fieldBase: string): boolean {
  const trKey = `${fieldBase}_tr` as keyof DbContentSection;
  const enKey = `${fieldBase}_en` as keyof DbContentSection;
  return Boolean(section[trKey]) || Boolean(section[enKey]);
}

function hasSharedContent(section: DbContentSection, key: keyof DbContentSection): boolean {
  return Boolean(section[key]);
}

// ─── Toast ───────────────────────────────────────────────────────────────────

interface Toast {
  id: number;
  type: "success" | "error";
  message: string;
}

// ─── Main page ───────────────────────────────────────────────────────────────

export default function AdminPagesPage() {
  const [selectedPage, setSelectedPage] = useState<string | null>(null);
  const [sections, setSections] = useState<DbContentSection[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [langTab, setLangTab] = useState<LangTab>("tr");
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastId = useRef(0);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // ── Toast ──────────────────────────────────────────────────────────────────

  const showToast = useCallback((type: "success" | "error", message: string) => {
    const id = ++toastId.current;
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  // ── Fetch sections for selected page ───────────────────────────────────────

  const fetchSections = useCallback(
    async (pageKey: string) => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/admin/content/sections?page=${pageKey}`);
        const json = await res.json();
        if (!res.ok || !json.success) {
          setError(json.error ?? "İçerikler yüklenemedi");
          return;
        }
        setSections(json.data ?? []);
      } catch {
        setError("Bağlantı hatası");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    if (selectedPage) {
      fetchSections(selectedPage);
    }
  }, [selectedPage, fetchSections]);

  // ── Field change ───────────────────────────────────────────────────────────

  const handleFieldChange = (sectionId: string, fieldKey: string, value: string) => {
    setSections((prev) =>
      prev.map((s) =>
        s.id === sectionId ? { ...s, [fieldKey]: value } : s
      )
    );
  };

  // ── Save ───────────────────────────────────────────────────────────────────

  const handleSave = async () => {
    if (sections.length === 0) return;
    setSaving(true);
    try {
      const payload = sections.map((s) => ({
        id: s.id,
        title_tr: s.title_tr,
        title_en: s.title_en,
        subtitle_tr: s.subtitle_tr,
        subtitle_en: s.subtitle_en,
        content_tr: s.content_tr,
        content_en: s.content_en,
        cta_text_tr: s.cta_text_tr,
        cta_text_en: s.cta_text_en,
        cta_url: s.cta_url,
        image_url: s.image_url,
      }));

      const res = await fetch((process.env.NEXT_PUBLIC_BASE_PATH || "") + "/api/admin/content/sections", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sections: payload }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        showToast("error", json.error ?? "Kaydetme başarısız");
        return;
      }

      showToast("success", "Sayfa içerikleri kaydedildi");
    } catch {
      showToast("error", "Bağlantı hatası");
    } finally {
      setSaving(false);
    }
  };

  // ── Select page ────────────────────────────────────────────────────────────

  const selectPage = (key: string) => {
    setSelectedPage(key);
    setLangTab("tr");
    setMobileSidebarOpen(false);
  };

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Sayfa İçerikleri</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Sayfa başlık, alt başlık ve içerik metinlerini düzenleyin.
          </p>
        </div>
        {/* Mobile sidebar toggle */}
        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="inline-flex h-10 items-center gap-2 rounded-lg border border-border bg-card px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted sm:hidden"
        >
          <FileText size={14} />
          Sayfa Seç
        </button>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Sidebar — page list */}
        <div
          className={`w-full shrink-0 lg:w-56 ${
            mobileSidebarOpen ? "block" : "hidden sm:block"
          }`}
        >
          <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
            <div className="border-b border-border px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Sayfalar
              </p>
            </div>
            <nav className="max-h-[60vh] overflow-y-auto p-1.5">
              {PAGES.map((page) => (
                <button
                  key={page.key}
                  onClick={() => selectPage(page.key)}
                  className={`flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-[13px] font-medium transition-all ${
                    selectedPage === page.key
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <FileText size={14} />
                  {page.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main panel */}
        <div className="min-w-0 flex-1">
          {!selectedPage && (
            <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card py-20 text-muted-foreground shadow-sm">
              <FileText size={40} className="mb-3 opacity-30" />
              <p className="text-sm font-medium">Düzenlemek istediğiniz sayfayı seçin</p>
            </div>
          )}

          {selectedPage && loading && (
            <div className="flex items-center justify-center rounded-xl border border-border bg-card py-20 shadow-sm">
              <Loader2 size={24} className="animate-spin text-muted-foreground" />
            </div>
          )}

          {selectedPage && error && !loading && (
            <div className="flex flex-col items-center gap-4 rounded-xl border border-border bg-card py-20 text-center shadow-sm">
              <AlertCircle size={40} className="text-destructive opacity-60" />
              <p className="text-sm font-medium text-destructive">{error}</p>
              <button
                onClick={() => fetchSections(selectedPage)}
                className="inline-flex h-10 items-center gap-2 rounded-lg border border-border bg-card px-4 text-sm font-medium text-foreground hover:bg-muted"
              >
                <RefreshCw size={14} />
                Tekrar Dene
              </button>
            </div>
          )}

          {selectedPage && !loading && !error && sections.length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card py-20 text-muted-foreground shadow-sm">
              <FileText size={40} className="mb-3 opacity-30" />
              <p className="text-sm font-medium">Bu sayfa için içerik bulunamadı</p>
              <p className="text-xs">Önce içerik bölümlerini oluşturmanız gerekebilir.</p>
            </div>
          )}

          {selectedPage && !loading && !error && sections.length > 0 && (
            <div className="space-y-4">
              {/* Language tab & save */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex rounded-lg border border-border bg-card p-0.5">
                  <button
                    onClick={() => setLangTab("tr")}
                    className={`rounded-md px-4 py-1.5 text-sm font-medium transition-all ${
                      langTab === "tr"
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Türkçe
                  </button>
                  <button
                    onClick={() => setLangTab("en")}
                    className={`rounded-md px-4 py-1.5 text-sm font-medium transition-all ${
                      langTab === "en"
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    English
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => fetchSections(selectedPage)}
                    className="inline-flex h-10 items-center gap-2 rounded-lg border border-border bg-card px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted"
                    title="Yenile"
                  >
                    <RefreshCw size={14} />
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 disabled:opacity-60"
                  >
                    {saving ? (
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

              {/* Section cards */}
              {sections.map((section) => {
                // Determine which fields to show: show all for flexibility but filter empty shared fields
                const visibleBilingualFields = EDITABLE_FIELDS.filter((f) =>
                  hasFieldContent(section, f.key)
                );
                const visibleSharedFields = SHARED_FIELDS.filter((f) =>
                  hasSharedContent(section, f.key)
                );

                // If no fields have content, show all bilingual fields anyway for data entry
                const fieldsToShow =
                  visibleBilingualFields.length > 0 ? visibleBilingualFields : EDITABLE_FIELDS;
                const sharedToShow =
                  visibleSharedFields.length > 0 ? visibleSharedFields : SHARED_FIELDS;

                return (
                  <div
                    key={section.id}
                    className="overflow-hidden rounded-xl border border-border bg-card shadow-sm"
                  >
                    <div className="border-b border-border px-5 py-3">
                      <h3 className="text-sm font-semibold text-foreground">
                        {sectionLabel(section.section_key)}
                      </h3>
                      <p className="text-xs text-muted-foreground">{section.section_key}</p>
                    </div>

                    <div className="space-y-4 px-5 py-4">
                      {/* Bilingual fields */}
                      {fieldsToShow.map((field) => {
                        const fieldKey = `${field.key}_${langTab}` as keyof DbContentSection;
                        const value = (section[fieldKey] as string) ?? "";

                        return (
                          <div key={field.key}>
                            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                              {field.label} ({langTab.toUpperCase()})
                            </label>
                            {field.type === "textarea" ? (
                              <textarea
                                rows={4}
                                value={value}
                                onChange={(e) =>
                                  handleFieldChange(section.id, fieldKey, e.target.value)
                                }
                                className="w-full resize-y rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                              />
                            ) : (
                              <input
                                type="text"
                                value={value}
                                onChange={(e) =>
                                  handleFieldChange(section.id, fieldKey, e.target.value)
                                }
                                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                              />
                            )}
                          </div>
                        );
                      })}

                      {/* Shared fields (not bilingual) */}
                      {sharedToShow.map((field) => {
                        const value = (section[field.key] as string) ?? "";

                        return (
                          <div key={field.key}>
                            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                              {field.label}
                            </label>
                            <input
                              type="text"
                              value={value}
                              onChange={(e) =>
                                handleFieldChange(section.id, field.key, e.target.value)
                              }
                              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              {/* Bottom save */}
              <div className="flex justify-end">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 disabled:opacity-60"
                >
                  {saving ? (
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
      </div>

      {/* Toast notifications */}
      <div className="pointer-events-none fixed bottom-4 left-4 right-4 z-50 flex flex-col gap-2 sm:left-auto sm:right-6 sm:bottom-6 sm:max-w-sm">
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
