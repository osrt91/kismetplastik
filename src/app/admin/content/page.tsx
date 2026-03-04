"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Plus,
  Edit3,
  Trash2,
  LayoutTemplate,
  HelpCircle,
  Briefcase,
  Loader2,
  ChevronUp,
  ChevronDown,
  Eye,
  EyeOff,
  X,
  Save,
  AlertCircle,
} from "lucide-react";
import type { DbContentSection, DbFaqItem, DbCareerListing } from "@/types/database";

// ─────────────────────────────────────────────
// Tab type
// ─────────────────────────────────────────────
type Tab = "sections" | "faq" | "careers";

// ─────────────────────────────────────────────
// Shared helpers
// ─────────────────────────────────────────────
function StatusBadge({ active }: { active: boolean }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
        active
          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
          : "bg-muted text-muted-foreground"
      }`}
    >
      {active ? "Aktif" : "Pasif"}
    </span>
  );
}

function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
      <AlertCircle size={14} className="shrink-0" />
      {message}
    </div>
  );
}

// ─────────────────────────────────────────────
// FormField helpers
// ─────────────────────────────────────────────
function FormRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-muted-foreground">{label}</label>
      {children}
    </div>
  );
}

function Input({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
    />
  );
}

function Textarea({
  value,
  onChange,
  placeholder,
  rows = 3,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 resize-y"
    />
  );
}

// ─────────────────────────────────────────────
// SECTIONS TAB
// ─────────────────────────────────────────────

type SectionFormData = {
  section_key: string;
  title_tr: string;
  title_en: string;
  subtitle_tr: string;
  subtitle_en: string;
  content_tr: string;
  content_en: string;
  cta_text_tr: string;
  cta_text_en: string;
  cta_url: string;
  image_url: string;
  display_order: string;
  is_active: boolean;
  metadata: string;
};

const emptySectionForm = (): SectionFormData => ({
  section_key: "",
  title_tr: "",
  title_en: "",
  subtitle_tr: "",
  subtitle_en: "",
  content_tr: "",
  content_en: "",
  cta_text_tr: "",
  cta_text_en: "",
  cta_url: "",
  image_url: "",
  display_order: "0",
  is_active: true,
  metadata: "",
});

function sectionToForm(s: DbContentSection): SectionFormData {
  return {
    section_key: s.section_key,
    title_tr: s.title_tr ?? "",
    title_en: s.title_en ?? "",
    subtitle_tr: s.subtitle_tr ?? "",
    subtitle_en: s.subtitle_en ?? "",
    content_tr: s.content_tr ?? "",
    content_en: s.content_en ?? "",
    cta_text_tr: s.cta_text_tr ?? "",
    cta_text_en: s.cta_text_en ?? "",
    cta_url: s.cta_url ?? "",
    image_url: s.image_url ?? "",
    display_order: String(s.display_order),
    is_active: s.is_active,
    metadata: s.metadata ? JSON.stringify(s.metadata, null, 2) : "",
  };
}

function SectionsTab() {
  const [sections, setSections] = useState<DbContentSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState<SectionFormData>(emptySectionForm());
  const [saving, setSaving] = useState(false);
  const [savingError, setSavingError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [reordering, setReordering] = useState(false);

  const fetchSections = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/content/sections");
      const json = await res.json();
      if (!res.ok || !json.success) {
        setError(json.error ?? "Bölümler yüklenemedi");
        return;
      }
      setSections(json.data ?? []);
    } catch {
      setError("Bağlantı hatası");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSections();
  }, [fetchSections]);

  function startEdit(section: DbContentSection) {
    setEditingId(section.id);
    setForm(sectionToForm(section));
    setShowNew(false);
    setSavingError(null);
  }

  function cancelEdit() {
    setEditingId(null);
    setSavingError(null);
  }

  function startNew() {
    setShowNew(true);
    setEditingId(null);
    setForm(emptySectionForm());
    setSavingError(null);
  }

  function cancelNew() {
    setShowNew(false);
    setSavingError(null);
  }

  function buildPayload(f: SectionFormData) {
    let metadata: Record<string, unknown> | null = null;
    if (f.metadata.trim()) {
      try {
        metadata = JSON.parse(f.metadata);
      } catch {
        throw new Error("Metadata geçerli JSON değil");
      }
    }
    return {
      section_key: f.section_key,
      title_tr: f.title_tr || null,
      title_en: f.title_en || null,
      subtitle_tr: f.subtitle_tr || null,
      subtitle_en: f.subtitle_en || null,
      content_tr: f.content_tr || null,
      content_en: f.content_en || null,
      cta_text_tr: f.cta_text_tr || null,
      cta_text_en: f.cta_text_en || null,
      cta_url: f.cta_url || null,
      image_url: f.image_url || null,
      display_order: parseInt(f.display_order, 10) || 0,
      is_active: f.is_active,
      metadata,
    };
  }

  async function handleSaveNew() {
    setSaving(true);
    setSavingError(null);
    try {
      const payload = buildPayload(form);
      const res = await fetch("/api/admin/content/sections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        setSavingError(json.error ?? "Kayıt başarısız");
        return;
      }
      setShowNew(false);
      await fetchSections();
    } catch (err: unknown) {
      setSavingError(err instanceof Error ? err.message : "Hata oluştu");
    } finally {
      setSaving(false);
    }
  }

  async function handleSaveEdit() {
    if (!editingId) return;
    setSaving(true);
    setSavingError(null);
    try {
      const payload = buildPayload(form);
      const res = await fetch(`/api/admin/content/sections/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        setSavingError(json.error ?? "Güncelleme başarısız");
        return;
      }
      setEditingId(null);
      await fetchSections();
    } catch (err: unknown) {
      setSavingError(err instanceof Error ? err.message : "Hata oluştu");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string, key: string) {
    if (!confirm(`"${key}" bölümünü silmek istediğinizden emin misiniz?`)) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/content/sections/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (res.ok && json.success) {
        await fetchSections();
      } else {
        alert(json.error ?? "Silme başarısız");
      }
    } catch {
      alert("Bağlantı hatası");
    } finally {
      setDeletingId(null);
    }
  }

  async function handleToggleActive(section: DbContentSection) {
    setReordering(true);
    try {
      const res = await fetch(`/api/admin/content/sections/${section.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !section.is_active }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setSections((prev) =>
          prev.map((s) => (s.id === section.id ? { ...s, is_active: !s.is_active } : s))
        );
      } else {
        alert(json.error ?? "Güncelleme başarısız");
      }
    } catch {
      alert("Bağlantı hatası");
    } finally {
      setReordering(false);
    }
  }

  async function handleReorder(index: number, direction: "up" | "down") {
    const newSections = [...sections];
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= newSections.length) return;

    const a = newSections[index];
    const b = newSections[swapIndex];
    newSections[index] = { ...b, display_order: a.display_order };
    newSections[swapIndex] = { ...a, display_order: b.display_order };

    setSections(newSections);
    setReordering(true);

    try {
      await Promise.all([
        fetch(`/api/admin/content/sections/${newSections[index].id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ display_order: newSections[index].display_order }),
        }),
        fetch(`/api/admin/content/sections/${newSections[swapIndex].id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ display_order: newSections[swapIndex].display_order }),
        }),
      ]);
    } catch {
      await fetchSections();
    } finally {
      setReordering(false);
    }
  }

  const isEditing = editingId !== null || showNew;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">
            {loading ? "Yükleniyor..." : `${sections.length} bölüm`}
          </p>
        </div>
        {!isEditing && (
          <button
            onClick={startNew}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90"
          >
            <Plus size={15} />
            Yeni Bölüm
          </button>
        )}
      </div>

      {error && <ErrorBanner message={error} />}

      {/* New Form */}
      {showNew && (
        <SectionForm
          form={form}
          setForm={setForm}
          onSave={handleSaveNew}
          onCancel={cancelNew}
          saving={saving}
          savingError={savingError}
          title="Yeni Bölüm"
        />
      )}

      {/* List */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-16 animate-pulse rounded-xl border border-border bg-muted" />
          ))}
        </div>
      ) : sections.length === 0 && !showNew ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <LayoutTemplate size={44} className="mb-4 opacity-25" />
          <p className="text-sm font-medium">Henüz bölüm eklenmemiş</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sections.map((section, index) => (
            <div key={section.id}>
              {editingId === section.id ? (
                <SectionForm
                  form={form}
                  setForm={setForm}
                  onSave={handleSaveEdit}
                  onCancel={cancelEdit}
                  saving={saving}
                  savingError={savingError}
                  title={`Düzenle: ${section.section_key}`}
                />
              ) : (
                <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 shadow-sm">
                  {/* Reorder */}
                  <div className="flex flex-col gap-0.5">
                    <button
                      onClick={() => handleReorder(index, "up")}
                      disabled={index === 0 || reordering}
                      className="rounded p-0.5 text-muted-foreground transition-colors hover:bg-muted disabled:opacity-30"
                    >
                      <ChevronUp size={14} />
                    </button>
                    <button
                      onClick={() => handleReorder(index, "down")}
                      disabled={index === sections.length - 1 || reordering}
                      className="rounded p-0.5 text-muted-foreground transition-colors hover:bg-muted disabled:opacity-30"
                    >
                      <ChevronDown size={14} />
                    </button>
                  </div>

                  {/* Order badge */}
                  <span className="w-8 text-center text-xs font-mono text-muted-foreground">
                    {section.display_order}
                  </span>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">
                      {section.section_key}
                    </p>
                    {section.title_tr && (
                      <p className="text-xs text-muted-foreground truncate">{section.title_tr}</p>
                    )}
                  </div>

                  {/* Status toggle */}
                  <button
                    onClick={() => handleToggleActive(section)}
                    disabled={reordering}
                    title={section.is_active ? "Pasife al" : "Aktife al"}
                    className="rounded p-1 transition-colors hover:bg-muted"
                  >
                    {section.is_active ? (
                      <Eye size={15} className="text-green-600 dark:text-green-400" />
                    ) : (
                      <EyeOff size={15} className="text-muted-foreground" />
                    )}
                  </button>

                  <StatusBadge active={section.is_active} />

                  {/* Actions */}
                  <button
                    onClick={() => startEdit(section)}
                    disabled={isEditing}
                    className="rounded-lg border border-border p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-40"
                    title="Düzenle"
                  >
                    <Edit3 size={13} />
                  </button>
                  <button
                    onClick={() => handleDelete(section.id, section.section_key)}
                    disabled={deletingId === section.id}
                    className="rounded-lg border border-border p-2 text-muted-foreground transition-colors hover:border-destructive/50 hover:bg-destructive/10 hover:text-destructive disabled:opacity-40"
                    title="Sil"
                  >
                    {deletingId === section.id ? (
                      <Loader2 size={13} className="animate-spin" />
                    ) : (
                      <Trash2 size={13} />
                    )}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function SectionForm({
  form,
  setForm,
  onSave,
  onCancel,
  saving,
  savingError,
  title,
}: {
  form: SectionFormData;
  setForm: React.Dispatch<React.SetStateAction<SectionFormData>>;
  onSave: () => void;
  onCancel: () => void;
  saving: boolean;
  savingError: string | null;
  title: string;
}) {
  function set(key: keyof SectionFormData) {
    return (v: string | boolean) =>
      setForm((prev) => ({ ...prev, [key]: v }));
  }

  return (
    <div className="rounded-xl border border-primary/30 bg-card p-6 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        <button
          onClick={onCancel}
          className="rounded p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <X size={15} />
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormRow label="Bölüm Anahtarı (section_key) *">
          <Input value={form.section_key} onChange={set("section_key") as (v: string) => void} placeholder="hero, stats, about..." />
        </FormRow>
        <FormRow label="Sıra">
          <Input value={form.display_order} onChange={set("display_order") as (v: string) => void} placeholder="0" />
        </FormRow>
        <FormRow label="Başlık (TR)">
          <Input value={form.title_tr} onChange={set("title_tr") as (v: string) => void} placeholder="Türkçe başlık" />
        </FormRow>
        <FormRow label="Başlık (EN)">
          <Input value={form.title_en} onChange={set("title_en") as (v: string) => void} placeholder="English title" />
        </FormRow>
        <FormRow label="Alt Başlık (TR)">
          <Input value={form.subtitle_tr} onChange={set("subtitle_tr") as (v: string) => void} placeholder="Alt başlık (TR)" />
        </FormRow>
        <FormRow label="Alt Başlık (EN)">
          <Input value={form.subtitle_en} onChange={set("subtitle_en") as (v: string) => void} placeholder="Subtitle (EN)" />
        </FormRow>
        <FormRow label="İçerik (TR)">
          <Textarea value={form.content_tr} onChange={set("content_tr") as (v: string) => void} placeholder="Türkçe içerik" rows={4} />
        </FormRow>
        <FormRow label="İçerik (EN)">
          <Textarea value={form.content_en} onChange={set("content_en") as (v: string) => void} placeholder="English content" rows={4} />
        </FormRow>
        <FormRow label="CTA Metni (TR)">
          <Input value={form.cta_text_tr} onChange={set("cta_text_tr") as (v: string) => void} placeholder="Butona yaz (TR)" />
        </FormRow>
        <FormRow label="CTA Metni (EN)">
          <Input value={form.cta_text_en} onChange={set("cta_text_en") as (v: string) => void} placeholder="Button text (EN)" />
        </FormRow>
        <FormRow label="CTA URL">
          <Input value={form.cta_url} onChange={set("cta_url") as (v: string) => void} placeholder="/tr/iletisim" />
        </FormRow>
        <FormRow label="Görsel URL">
          <Input value={form.image_url} onChange={set("image_url") as (v: string) => void} placeholder="https://..." />
        </FormRow>
        <div className="sm:col-span-2">
          <FormRow label="Metadata (JSON — isteğe bağlı)">
            <Textarea value={form.metadata} onChange={set("metadata") as (v: string) => void} placeholder='{ "key": "value" }' rows={3} />
          </FormRow>
        </div>
        <div className="flex items-center gap-3 sm:col-span-2">
          <label className="text-xs font-medium text-muted-foreground">Aktif</label>
          <button
            type="button"
            onClick={() => setForm((prev) => ({ ...prev, is_active: !prev.is_active }))}
            className={`relative h-5 w-9 rounded-full transition-colors ${
              form.is_active ? "bg-primary" : "bg-muted"
            }`}
          >
            <span
              className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${
                form.is_active ? "translate-x-4" : "translate-x-0.5"
              }`}
            />
          </button>
        </div>
      </div>

      {savingError && (
        <div className="mt-4">
          <ErrorBanner message={savingError} />
        </div>
      )}

      <div className="mt-5 flex justify-end gap-3">
        <button
          onClick={onCancel}
          className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted"
        >
          İptal
        </button>
        <button
          onClick={onSave}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-60"
        >
          {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
          Kaydet
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// FAQ TAB
// ─────────────────────────────────────────────

type FaqFormData = {
  question_tr: string;
  question_en: string;
  answer_tr: string;
  answer_en: string;
  category: string;
  display_order: string;
  is_active: boolean;
};

const emptyFaqForm = (): FaqFormData => ({
  question_tr: "",
  question_en: "",
  answer_tr: "",
  answer_en: "",
  category: "",
  display_order: "0",
  is_active: true,
});

function faqToForm(f: DbFaqItem): FaqFormData {
  return {
    question_tr: f.question_tr,
    question_en: f.question_en,
    answer_tr: f.answer_tr,
    answer_en: f.answer_en,
    category: f.category ?? "",
    display_order: String(f.display_order),
    is_active: f.is_active,
  };
}

function FaqTab() {
  const [items, setItems] = useState<DbFaqItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState<FaqFormData>(emptyFaqForm());
  const [saving, setSaving] = useState(false);
  const [savingError, setSavingError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [reordering, setReordering] = useState(false);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/content/faq");
      const json = await res.json();
      if (!res.ok || !json.success) {
        setError(json.error ?? "SSS öğeleri yüklenemedi");
        return;
      }
      setItems(json.data ?? []);
    } catch {
      setError("Bağlantı hatası");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  function startEdit(item: DbFaqItem) {
    setEditingId(item.id);
    setForm(faqToForm(item));
    setShowNew(false);
    setSavingError(null);
  }

  function cancelEdit() {
    setEditingId(null);
    setSavingError(null);
  }

  function startNew() {
    setShowNew(true);
    setEditingId(null);
    setForm(emptyFaqForm());
    setSavingError(null);
  }

  function cancelNew() {
    setShowNew(false);
    setSavingError(null);
  }

  function buildPayload(f: FaqFormData) {
    return {
      question_tr: f.question_tr,
      question_en: f.question_en,
      answer_tr: f.answer_tr,
      answer_en: f.answer_en,
      category: f.category || null,
      display_order: parseInt(f.display_order, 10) || 0,
      is_active: f.is_active,
    };
  }

  async function handleSaveNew() {
    setSaving(true);
    setSavingError(null);
    try {
      const res = await fetch("/api/admin/content/faq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildPayload(form)),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        setSavingError(json.error ?? "Kayıt başarısız");
        return;
      }
      setShowNew(false);
      await fetchItems();
    } catch {
      setSavingError("Hata oluştu");
    } finally {
      setSaving(false);
    }
  }

  async function handleSaveEdit() {
    if (!editingId) return;
    setSaving(true);
    setSavingError(null);
    try {
      const res = await fetch(`/api/admin/content/faq/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildPayload(form)),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        setSavingError(json.error ?? "Güncelleme başarısız");
        return;
      }
      setEditingId(null);
      await fetchItems();
    } catch {
      setSavingError("Hata oluştu");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string, question: string) {
    if (!confirm(`"${question}" sorusunu silmek istediğinizden emin misiniz?`)) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/content/faq/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (res.ok && json.success) {
        await fetchItems();
      } else {
        alert(json.error ?? "Silme başarısız");
      }
    } catch {
      alert("Bağlantı hatası");
    } finally {
      setDeletingId(null);
    }
  }

  async function handleToggleActive(item: DbFaqItem) {
    try {
      const res = await fetch(`/api/admin/content/faq/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !item.is_active }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setItems((prev) =>
          prev.map((i) => (i.id === item.id ? { ...i, is_active: !i.is_active } : i))
        );
      } else {
        alert(json.error ?? "Güncelleme başarısız");
      }
    } catch {
      alert("Bağlantı hatası");
    }
  }

  async function handleReorder(index: number, direction: "up" | "down") {
    const newItems = [...items];
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= newItems.length) return;

    const a = newItems[index];
    const b = newItems[swapIndex];
    newItems[index] = { ...b, display_order: a.display_order };
    newItems[swapIndex] = { ...a, display_order: b.display_order };

    setItems(newItems);
    setReordering(true);

    try {
      await Promise.all([
        fetch(`/api/admin/content/faq/${newItems[index].id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ display_order: newItems[index].display_order }),
        }),
        fetch(`/api/admin/content/faq/${newItems[swapIndex].id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ display_order: newItems[swapIndex].display_order }),
        }),
      ]);
    } catch {
      await fetchItems();
    } finally {
      setReordering(false);
    }
  }

  const isEditing = editingId !== null || showNew;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {loading ? "Yükleniyor..." : `${items.length} soru`}
        </p>
        {!isEditing && (
          <button
            onClick={startNew}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90"
          >
            <Plus size={15} />
            Yeni Soru
          </button>
        )}
      </div>

      {error && <ErrorBanner message={error} />}

      {showNew && (
        <FaqForm
          form={form}
          setForm={setForm}
          onSave={handleSaveNew}
          onCancel={cancelNew}
          saving={saving}
          savingError={savingError}
          title="Yeni SSS Sorusu"
        />
      )}

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-16 animate-pulse rounded-xl border border-border bg-muted" />
          ))}
        </div>
      ) : items.length === 0 && !showNew ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <HelpCircle size={44} className="mb-4 opacity-25" />
          <p className="text-sm font-medium">Henüz SSS öğesi eklenmemiş</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item, index) => (
            <div key={item.id}>
              {editingId === item.id ? (
                <FaqForm
                  form={form}
                  setForm={setForm}
                  onSave={handleSaveEdit}
                  onCancel={cancelEdit}
                  saving={saving}
                  savingError={savingError}
                  title="SSS Düzenle"
                />
              ) : (
                <div className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 shadow-sm">
                  {/* Reorder */}
                  <div className="flex flex-col gap-0.5 mt-0.5">
                    <button
                      onClick={() => handleReorder(index, "up")}
                      disabled={index === 0 || reordering}
                      className="rounded p-0.5 text-muted-foreground transition-colors hover:bg-muted disabled:opacity-30"
                    >
                      <ChevronUp size={14} />
                    </button>
                    <button
                      onClick={() => handleReorder(index, "down")}
                      disabled={index === items.length - 1 || reordering}
                      className="rounded p-0.5 text-muted-foreground transition-colors hover:bg-muted disabled:opacity-30"
                    >
                      <ChevronDown size={14} />
                    </button>
                  </div>

                  <span className="mt-1 w-8 text-center text-xs font-mono text-muted-foreground shrink-0">
                    {item.display_order}
                  </span>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground line-clamp-1">
                      {item.question_tr}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">
                      {item.answer_tr}
                    </p>
                    {item.category && (
                      <span className="mt-1 inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                        {item.category}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => handleToggleActive(item)}
                    title={item.is_active ? "Pasife al" : "Aktife al"}
                    className="mt-0.5 rounded p-1 transition-colors hover:bg-muted"
                  >
                    {item.is_active ? (
                      <Eye size={15} className="text-green-600 dark:text-green-400" />
                    ) : (
                      <EyeOff size={15} className="text-muted-foreground" />
                    )}
                  </button>

                  <StatusBadge active={item.is_active} />

                  <button
                    onClick={() => startEdit(item)}
                    disabled={isEditing}
                    className="rounded-lg border border-border p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-40"
                    title="Düzenle"
                  >
                    <Edit3 size={13} />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id, item.question_tr)}
                    disabled={deletingId === item.id}
                    className="rounded-lg border border-border p-2 text-muted-foreground transition-colors hover:border-destructive/50 hover:bg-destructive/10 hover:text-destructive disabled:opacity-40"
                    title="Sil"
                  >
                    {deletingId === item.id ? (
                      <Loader2 size={13} className="animate-spin" />
                    ) : (
                      <Trash2 size={13} />
                    )}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function FaqForm({
  form,
  setForm,
  onSave,
  onCancel,
  saving,
  savingError,
  title,
}: {
  form: FaqFormData;
  setForm: React.Dispatch<React.SetStateAction<FaqFormData>>;
  onSave: () => void;
  onCancel: () => void;
  saving: boolean;
  savingError: string | null;
  title: string;
}) {
  function set(key: keyof FaqFormData) {
    return (v: string | boolean) =>
      setForm((prev) => ({ ...prev, [key]: v }));
  }

  return (
    <div className="rounded-xl border border-primary/30 bg-card p-6 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        <button
          onClick={onCancel}
          className="rounded p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <X size={15} />
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormRow label="Soru (TR) *">
          <Textarea value={form.question_tr} onChange={set("question_tr") as (v: string) => void} placeholder="Türkçe soru..." rows={2} />
        </FormRow>
        <FormRow label="Soru (EN)">
          <Textarea value={form.question_en} onChange={set("question_en") as (v: string) => void} placeholder="English question..." rows={2} />
        </FormRow>
        <FormRow label="Cevap (TR) *">
          <Textarea value={form.answer_tr} onChange={set("answer_tr") as (v: string) => void} placeholder="Türkçe cevap..." rows={4} />
        </FormRow>
        <FormRow label="Cevap (EN)">
          <Textarea value={form.answer_en} onChange={set("answer_en") as (v: string) => void} placeholder="English answer..." rows={4} />
        </FormRow>
        <FormRow label="Kategori">
          <Input value={form.category} onChange={set("category") as (v: string) => void} placeholder="Genel, Sipariş, Ürün..." />
        </FormRow>
        <FormRow label="Sıra">
          <Input value={form.display_order} onChange={set("display_order") as (v: string) => void} placeholder="0" />
        </FormRow>
        <div className="flex items-center gap-3 sm:col-span-2">
          <label className="text-xs font-medium text-muted-foreground">Aktif</label>
          <button
            type="button"
            onClick={() => setForm((prev) => ({ ...prev, is_active: !prev.is_active }))}
            className={`relative h-5 w-9 rounded-full transition-colors ${
              form.is_active ? "bg-primary" : "bg-muted"
            }`}
          >
            <span
              className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${
                form.is_active ? "translate-x-4" : "translate-x-0.5"
              }`}
            />
          </button>
        </div>
      </div>

      {savingError && (
        <div className="mt-4">
          <ErrorBanner message={savingError} />
        </div>
      )}

      <div className="mt-5 flex justify-end gap-3">
        <button
          onClick={onCancel}
          className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted"
        >
          İptal
        </button>
        <button
          onClick={onSave}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-60"
        >
          {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
          Kaydet
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// CAREERS TAB
// ─────────────────────────────────────────────

type CareerFormData = {
  title_tr: string;
  title_en: string;
  description_tr: string;
  description_en: string;
  department: string;
  location: string;
  type: string;
  requirements_tr: string;
  requirements_en: string;
  is_active: boolean;
};

const emptyCareerForm = (): CareerFormData => ({
  title_tr: "",
  title_en: "",
  description_tr: "",
  description_en: "",
  department: "",
  location: "",
  type: "",
  requirements_tr: "",
  requirements_en: "",
  is_active: true,
});

function careerToForm(c: DbCareerListing): CareerFormData {
  return {
    title_tr: c.title_tr,
    title_en: c.title_en,
    description_tr: c.description_tr,
    description_en: c.description_en,
    department: c.department,
    location: c.location,
    type: c.type,
    requirements_tr: c.requirements_tr.join("\n"),
    requirements_en: c.requirements_en.join("\n"),
    is_active: c.is_active,
  };
}

const JOB_TYPES = ["Tam Zamanlı", "Yarı Zamanlı", "Staj", "Sözleşmeli", "Uzaktan"];
const DEPARTMENTS = ["Üretim", "Satış", "Pazarlama", "İnsan Kaynakları", "Muhasebe", "Lojistik", "Ar-Ge", "Yazılım", "Yönetim"];

function CareersTab() {
  const [careers, setCareers] = useState<DbCareerListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState<CareerFormData>(emptyCareerForm());
  const [saving, setSaving] = useState(false);
  const [savingError, setSavingError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchCareers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/content/careers");
      const json = await res.json();
      if (!res.ok || !json.success) {
        setError(json.error ?? "İlanlar yüklenemedi");
        return;
      }
      setCareers(json.data ?? []);
    } catch {
      setError("Bağlantı hatası");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCareers();
  }, [fetchCareers]);

  function startEdit(career: DbCareerListing) {
    setEditingId(career.id);
    setForm(careerToForm(career));
    setShowNew(false);
    setSavingError(null);
  }

  function cancelEdit() {
    setEditingId(null);
    setSavingError(null);
  }

  function startNew() {
    setShowNew(true);
    setEditingId(null);
    setForm(emptyCareerForm());
    setSavingError(null);
  }

  function cancelNew() {
    setShowNew(false);
    setSavingError(null);
  }

  function buildPayload(f: CareerFormData) {
    return {
      title_tr: f.title_tr,
      title_en: f.title_en,
      description_tr: f.description_tr,
      description_en: f.description_en,
      department: f.department,
      location: f.location,
      type: f.type,
      requirements_tr: f.requirements_tr
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      requirements_en: f.requirements_en
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      is_active: f.is_active,
    };
  }

  async function handleSaveNew() {
    setSaving(true);
    setSavingError(null);
    try {
      const res = await fetch("/api/admin/content/careers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildPayload(form)),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        setSavingError(json.error ?? "Kayıt başarısız");
        return;
      }
      setShowNew(false);
      await fetchCareers();
    } catch {
      setSavingError("Hata oluştu");
    } finally {
      setSaving(false);
    }
  }

  async function handleSaveEdit() {
    if (!editingId) return;
    setSaving(true);
    setSavingError(null);
    try {
      const res = await fetch(`/api/admin/content/careers/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildPayload(form)),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        setSavingError(json.error ?? "Güncelleme başarısız");
        return;
      }
      setEditingId(null);
      await fetchCareers();
    } catch {
      setSavingError("Hata oluştu");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string, title: string) {
    if (!confirm(`"${title}" ilanını silmek istediğinizden emin misiniz?`)) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/content/careers/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (res.ok && json.success) {
        await fetchCareers();
      } else {
        alert(json.error ?? "Silme başarısız");
      }
    } catch {
      alert("Bağlantı hatası");
    } finally {
      setDeletingId(null);
    }
  }

  async function handleToggleActive(career: DbCareerListing) {
    try {
      const res = await fetch(`/api/admin/content/careers/${career.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !career.is_active }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setCareers((prev) =>
          prev.map((c) => (c.id === career.id ? { ...c, is_active: !c.is_active } : c))
        );
      } else {
        alert(json.error ?? "Güncelleme başarısız");
      }
    } catch {
      alert("Bağlantı hatası");
    }
  }

  const isEditing = editingId !== null || showNew;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {loading ? "Yükleniyor..." : `${careers.length} ilan`}
        </p>
        {!isEditing && (
          <button
            onClick={startNew}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90"
          >
            <Plus size={15} />
            Yeni İlan
          </button>
        )}
      </div>

      {error && <ErrorBanner message={error} />}

      {showNew && (
        <CareerForm
          form={form}
          setForm={setForm}
          onSave={handleSaveNew}
          onCancel={cancelNew}
          saving={saving}
          savingError={savingError}
          title="Yeni İş İlanı"
        />
      )}

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-xl border border-border bg-muted" />
          ))}
        </div>
      ) : careers.length === 0 && !showNew ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <Briefcase size={44} className="mb-4 opacity-25" />
          <p className="text-sm font-medium">Henüz iş ilanı eklenmemiş</p>
        </div>
      ) : (
        <div className="space-y-3">
          {careers.map((career) => (
            <div key={career.id}>
              {editingId === career.id ? (
                <CareerForm
                  form={form}
                  setForm={setForm}
                  onSave={handleSaveEdit}
                  onCancel={cancelEdit}
                  saving={saving}
                  savingError={savingError}
                  title="İlanı Düzenle"
                />
              ) : (
                <div className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 shadow-sm">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <p className="text-sm font-semibold text-foreground">{career.title_tr}</p>
                      <StatusBadge active={career.is_active} />
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                      {career.department && (
                        <span className="flex items-center gap-1">
                          <Briefcase size={11} />
                          {career.department}
                        </span>
                      )}
                      {career.location && <span>{career.location}</span>}
                      {career.type && (
                        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-primary font-medium">
                          {career.type}
                        </span>
                      )}
                    </div>
                    {career.description_tr && (
                      <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                        {career.description_tr}
                      </p>
                    )}
                    {career.requirements_tr.length > 0 && (
                      <p className="mt-1 text-xs text-muted-foreground">
                        {career.requirements_tr.length} gereksinim
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => handleToggleActive(career)}
                    title={career.is_active ? "Pasife al" : "Aktife al"}
                    className="mt-0.5 rounded p-1 transition-colors hover:bg-muted"
                  >
                    {career.is_active ? (
                      <Eye size={15} className="text-green-600 dark:text-green-400" />
                    ) : (
                      <EyeOff size={15} className="text-muted-foreground" />
                    )}
                  </button>

                  <button
                    onClick={() => startEdit(career)}
                    disabled={isEditing}
                    className="rounded-lg border border-border p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-40"
                    title="Düzenle"
                  >
                    <Edit3 size={13} />
                  </button>
                  <button
                    onClick={() => handleDelete(career.id, career.title_tr)}
                    disabled={deletingId === career.id}
                    className="rounded-lg border border-border p-2 text-muted-foreground transition-colors hover:border-destructive/50 hover:bg-destructive/10 hover:text-destructive disabled:opacity-40"
                    title="Sil"
                  >
                    {deletingId === career.id ? (
                      <Loader2 size={13} className="animate-spin" />
                    ) : (
                      <Trash2 size={13} />
                    )}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function CareerForm({
  form,
  setForm,
  onSave,
  onCancel,
  saving,
  savingError,
  title,
}: {
  form: CareerFormData;
  setForm: React.Dispatch<React.SetStateAction<CareerFormData>>;
  onSave: () => void;
  onCancel: () => void;
  saving: boolean;
  savingError: string | null;
  title: string;
}) {
  function set(key: keyof CareerFormData) {
    return (v: string | boolean) =>
      setForm((prev) => ({ ...prev, [key]: v }));
  }

  return (
    <div className="rounded-xl border border-primary/30 bg-card p-6 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        <button
          onClick={onCancel}
          className="rounded p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <X size={15} />
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormRow label="Başlık (TR) *">
          <Input value={form.title_tr} onChange={set("title_tr") as (v: string) => void} placeholder="Üretim Operatörü" />
        </FormRow>
        <FormRow label="Başlık (EN)">
          <Input value={form.title_en} onChange={set("title_en") as (v: string) => void} placeholder="Production Operator" />
        </FormRow>

        <FormRow label="Departman *">
          <div className="flex flex-col gap-1">
            <select
              value={DEPARTMENTS.includes(form.department) ? form.department : ""}
              onChange={(e) => {
                if (e.target.value) setForm((prev) => ({ ...prev, department: e.target.value }));
              }}
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              <option value="">Seçin veya yazın</option>
              {DEPARTMENTS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
            <Input
              value={form.department}
              onChange={set("department") as (v: string) => void}
              placeholder="veya özel departman yazın..."
            />
          </div>
        </FormRow>

        <FormRow label="Çalışma Tipi">
          <div className="flex flex-col gap-1">
            <select
              value={JOB_TYPES.includes(form.type) ? form.type : ""}
              onChange={(e) => {
                if (e.target.value) setForm((prev) => ({ ...prev, type: e.target.value }));
              }}
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              <option value="">Seçin</option>
              {JOB_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            <Input
              value={form.type}
              onChange={set("type") as (v: string) => void}
              placeholder="veya özel tip yazın..."
            />
          </div>
        </FormRow>

        <div className="sm:col-span-2">
          <FormRow label="Konum">
            <Input value={form.location} onChange={set("location") as (v: string) => void} placeholder="İstanbul, Türkiye" />
          </FormRow>
        </div>

        <FormRow label="Açıklama (TR)">
          <Textarea value={form.description_tr} onChange={set("description_tr") as (v: string) => void} placeholder="Pozisyon açıklaması..." rows={4} />
        </FormRow>
        <FormRow label="Açıklama (EN)">
          <Textarea value={form.description_en} onChange={set("description_en") as (v: string) => void} placeholder="Position description..." rows={4} />
        </FormRow>

        <FormRow label="Gereksinimler (TR) — her satır bir madde">
          <Textarea
            value={form.requirements_tr}
            onChange={set("requirements_tr") as (v: string) => void}
            placeholder={"En az 2 yıl deneyim\nTakım çalışmasına yatkınlık\n..."}
            rows={5}
          />
        </FormRow>
        <FormRow label="Gereksinimler (EN) — one line per item">
          <Textarea
            value={form.requirements_en}
            onChange={set("requirements_en") as (v: string) => void}
            placeholder={"At least 2 years of experience\nTeam player\n..."}
            rows={5}
          />
        </FormRow>

        <div className="flex items-center gap-3 sm:col-span-2">
          <label className="text-xs font-medium text-muted-foreground">Aktif</label>
          <button
            type="button"
            onClick={() => setForm((prev) => ({ ...prev, is_active: !prev.is_active }))}
            className={`relative h-5 w-9 rounded-full transition-colors ${
              form.is_active ? "bg-primary" : "bg-muted"
            }`}
          >
            <span
              className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${
                form.is_active ? "translate-x-4" : "translate-x-0.5"
              }`}
            />
          </button>
        </div>
      </div>

      {savingError && (
        <div className="mt-4">
          <ErrorBanner message={savingError} />
        </div>
      )}

      <div className="mt-5 flex justify-end gap-3">
        <button
          onClick={onCancel}
          className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted"
        >
          İptal
        </button>
        <button
          onClick={onSave}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-60"
        >
          {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
          Kaydet
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: "sections", label: "Bölümler", icon: <LayoutTemplate size={15} /> },
  { id: "faq", label: "SSS", icon: <HelpCircle size={15} /> },
  { id: "careers", label: "Kariyer", icon: <Briefcase size={15} /> },
];

export default function AdminContentPage() {
  const [activeTab, setActiveTab] = useState<Tab>("sections");

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">İçerik Yönetimi</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Site bölümleri, sık sorulan sorular ve kariyer ilanlarını yönetin
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-xl border border-border bg-muted p-1">
        {TABS.map((tab) => (
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

      {/* Tab Content */}
      {activeTab === "sections" && <SectionsTab />}
      {activeTab === "faq" && <FaqTab />}
      {activeTab === "careers" && <CareersTab />}
    </div>
  );
}
