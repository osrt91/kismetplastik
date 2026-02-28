"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  FileText,
  Save,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Loader2,
  Settings,
  Globe,
  Phone,
  Mail,
  MessageSquare,
  BarChart3,
  HelpCircle,
  Building2,
  Share2,
} from "lucide-react";

interface ContentRecord {
  id: string;
  page_key: string;
  content_data: Record<string, unknown>;
  updated_at: string;
}

interface SectionConfig {
  key: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  color: string;
}

const SECTIONS: SectionConfig[] = [
  { key: "hero", label: "Hero Bölümü", icon: Globe, color: "bg-blue-100 text-blue-700" },
  { key: "stats", label: "İstatistikler", icon: BarChart3, color: "bg-emerald-100 text-emerald-700" },
  { key: "about", label: "Hakkımızda", icon: Building2, color: "bg-purple-100 text-purple-700" },
  { key: "contact", label: "İletişim Bilgileri", icon: Phone, color: "bg-orange-100 text-orange-700" },
  { key: "social", label: "Sosyal Medya", icon: Share2, color: "bg-pink-100 text-pink-700" },
  { key: "faq", label: "SSS (Sıkça Sorulan Sorular)", icon: HelpCircle, color: "bg-amber-100 text-amber-700" },
];

const DEFAULT_CONTENT: Record<string, Record<string, unknown>> = {
  hero: {
    title_tr: "",
    title_en: "",
    subtitle_tr: "",
    subtitle_en: "",
    cta_text_tr: "",
    cta_text_en: "",
    cta_link: "",
  },
  stats: {
    items: [{ label_tr: "", label_en: "", value: "", icon: "" }],
  },
  about: {
    title_tr: "",
    title_en: "",
    content_tr: "",
    content_en: "",
    mission_tr: "",
    mission_en: "",
    vision_tr: "",
    vision_en: "",
  },
  contact: {
    phone: "",
    email: "",
    address_tr: "",
    address_en: "",
    whatsapp: "",
    hours_tr: "",
    hours_en: "",
  },
  social: {
    facebook: "",
    instagram: "",
    twitter: "",
    linkedin: "",
    youtube: "",
  },
  faq: {
    items: [{ question_tr: "", question_en: "", answer_tr: "", answer_en: "" }],
  },
};

export default function AdminContentPage() {
  const router = useRouter();
  const [records, setRecords] = useState<Record<string, ContentRecord>>({});
  const [editData, setEditData] = useState<Record<string, Record<string, unknown>>>({});
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(["hero"]));
  const [feedback, setFeedback] = useState<{ key: string; type: "success" | "error"; message: string } | null>(null);

  const fetchContent = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/content", { credentials: "include" });
      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }
      if (!res.ok) throw new Error("İçerik yüklenemedi.");
      const data = await res.json();
      const contentArray: ContentRecord[] = data.content || data.data || [];
      const mapped: Record<string, ContentRecord> = {};
      const edits: Record<string, Record<string, unknown>> = {};
      for (const record of contentArray) {
        mapped[record.page_key] = record;
        edits[record.page_key] = { ...record.content_data };
      }
      for (const section of SECTIONS) {
        if (!edits[section.key]) {
          edits[section.key] = { ...DEFAULT_CONTENT[section.key] };
        }
      }
      setRecords(mapped);
      setEditData(edits);
    } catch (err) {
      console.error("İçerik yüklenemedi:", err);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  const toggleSection = (key: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const updateField = (sectionKey: string, field: string, value: unknown) => {
    setEditData((prev) => ({
      ...prev,
      [sectionKey]: { ...prev[sectionKey], [field]: value },
    }));
  };

  const updateArrayItem = (sectionKey: string, index: number, field: string, value: string) => {
    setEditData((prev) => {
      const items = [...(prev[sectionKey]?.items as Record<string, string>[]) || []];
      items[index] = { ...items[index], [field]: value };
      return { ...prev, [sectionKey]: { ...prev[sectionKey], items } };
    });
  };

  const addArrayItem = (sectionKey: string) => {
    setEditData((prev) => {
      const items = [...(prev[sectionKey]?.items as Record<string, string>[]) || []];
      const template: Record<string, string> = sectionKey === "stats"
        ? { label_tr: "", label_en: "", value: "", icon: "" }
        : { question_tr: "", question_en: "", answer_tr: "", answer_en: "" };
      items.push(template);
      return { ...prev, [sectionKey]: { ...prev[sectionKey], items } };
    });
  };

  const removeArrayItem = (sectionKey: string, index: number) => {
    setEditData((prev) => {
      const items = [...(prev[sectionKey]?.items as Record<string, string>[]) || []];
      items.splice(index, 1);
      return { ...prev, [sectionKey]: { ...prev[sectionKey], items } };
    });
  };

  const handleSave = async (sectionKey: string) => {
    setSavingKey(sectionKey);
    setFeedback(null);
    try {
      const res = await fetch("/api/admin/content", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          page_key: sectionKey,
          content_data: editData[sectionKey],
        }),
      });
      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Kaydetme başarısız.");
      }
      setFeedback({ key: sectionKey, type: "success", message: "Başarıyla kaydedildi." });
      setTimeout(() => setFeedback((f) => f?.key === sectionKey ? null : f), 3000);
    } catch (err) {
      setFeedback({
        key: sectionKey,
        type: "error",
        message: err instanceof Error ? err.message : "Bir hata oluştu.",
      });
    } finally {
      setSavingKey(null);
    }
  };

  const renderTextField = (sectionKey: string, field: string, label: string, placeholder?: string) => (
    <div key={field}>
      <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">{label}</label>
      <input
        type="text"
        value={(editData[sectionKey]?.[field] as string) || ""}
        onChange={(e) => updateField(sectionKey, field, e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
      />
    </div>
  );

  const renderTextarea = (sectionKey: string, field: string, label: string, rows = 3) => (
    <div key={field}>
      <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">{label}</label>
      <textarea
        value={(editData[sectionKey]?.[field] as string) || ""}
        onChange={(e) => updateField(sectionKey, field, e.target.value)}
        rows={rows}
        className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
      />
    </div>
  );

  const renderBilingualField = (
    sectionKey: string,
    fieldTr: string,
    fieldEn: string,
    label: string,
    type: "text" | "textarea" = "text"
  ) => (
    <div key={fieldTr} className="grid gap-3 sm:grid-cols-2">
      {type === "text"
        ? renderTextField(sectionKey, fieldTr, `${label} (TR)`)
        : renderTextarea(sectionKey, fieldTr, `${label} (TR)`)}
      {type === "text"
        ? renderTextField(sectionKey, fieldEn, `${label} (EN)`)
        : renderTextarea(sectionKey, fieldEn, `${label} (EN)`)}
    </div>
  );

  const renderHeroSection = () => (
    <div className="space-y-4">
      {renderBilingualField("hero", "title_tr", "title_en", "Başlık")}
      {renderBilingualField("hero", "subtitle_tr", "subtitle_en", "Alt Başlık", "textarea")}
      {renderBilingualField("hero", "cta_text_tr", "cta_text_en", "CTA Butonu")}
      {renderTextField("hero", "cta_link", "CTA Linki", "/urunler")}
    </div>
  );

  const renderStatsSection = () => {
    const items = (editData.stats?.items as Record<string, string>[]) || [];
    return (
      <div className="space-y-4">
        {items.map((item, i) => (
          <div key={i} className="rounded-lg border border-border bg-muted/30 p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground">
                İstatistik #{i + 1}
              </span>
              {items.length > 1 && (
                <button
                  onClick={() => removeArrayItem("stats", i)}
                  className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">Etiket (TR)</label>
                <input
                  type="text"
                  value={item.label_tr || ""}
                  onChange={(e) => updateArrayItem("stats", i, "label_tr", e.target.value)}
                  placeholder="Yıllık Deneyim"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">Etiket (EN)</label>
                <input
                  type="text"
                  value={item.label_en || ""}
                  onChange={(e) => updateArrayItem("stats", i, "label_en", e.target.value)}
                  placeholder="Years of Experience"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">Değer</label>
                <input
                  type="text"
                  value={item.value || ""}
                  onChange={(e) => updateArrayItem("stats", i, "value", e.target.value)}
                  placeholder="25+"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">İkon</label>
                <input
                  type="text"
                  value={item.icon || ""}
                  onChange={(e) => updateArrayItem("stats", i, "icon", e.target.value)}
                  placeholder="factory"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
          </div>
        ))}
        <button
          onClick={() => addArrayItem("stats")}
          className="inline-flex items-center gap-2 rounded-lg border border-dashed border-border px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:border-primary hover:bg-primary/5 hover:text-primary"
        >
          <Plus size={16} />
          Yeni İstatistik Ekle
        </button>
      </div>
    );
  };

  const renderAboutSection = () => (
    <div className="space-y-4">
      {renderBilingualField("about", "title_tr", "title_en", "Başlık")}
      {renderBilingualField("about", "content_tr", "content_en", "İçerik", "textarea")}
      {renderBilingualField("about", "mission_tr", "mission_en", "Misyon", "textarea")}
      {renderBilingualField("about", "vision_tr", "vision_en", "Vizyon", "textarea")}
    </div>
  );

  const renderContactSection = () => (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">
            <span className="inline-flex items-center gap-1.5"><Phone size={12} /> Telefon</span>
          </label>
          <input
            type="text"
            value={(editData.contact?.phone as string) || ""}
            onChange={(e) => updateField("contact", "phone", e.target.value)}
            placeholder="+90 212 xxx xx xx"
            className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">
            <span className="inline-flex items-center gap-1.5"><Mail size={12} /> E-posta</span>
          </label>
          <input
            type="email"
            value={(editData.contact?.email as string) || ""}
            onChange={(e) => updateField("contact", "email", e.target.value)}
            placeholder="info@kismetplastik.com"
            className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">
            <span className="inline-flex items-center gap-1.5"><MessageSquare size={12} /> WhatsApp</span>
          </label>
          <input
            type="text"
            value={(editData.contact?.whatsapp as string) || ""}
            onChange={(e) => updateField("contact", "whatsapp", e.target.value)}
            placeholder="+90 5xx xxx xx xx"
            className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">
            <span className="inline-flex items-center gap-1.5"><Settings size={12} /> Çalışma Saatleri (TR)</span>
          </label>
          <input
            type="text"
            value={(editData.contact?.hours_tr as string) || ""}
            onChange={(e) => updateField("contact", "hours_tr", e.target.value)}
            placeholder="Pzt-Cum: 08:00 - 18:00"
            className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {renderTextField("contact", "hours_en", "Çalışma Saatleri (EN)", "Mon-Fri: 08:00 - 18:00")}
      </div>
      {renderBilingualField("contact", "address_tr", "address_en", "Adres", "textarea")}
    </div>
  );

  const renderSocialSection = () => (
    <div className="grid gap-4 sm:grid-cols-2">
      {renderTextField("social", "facebook", "Facebook", "https://facebook.com/...")}
      {renderTextField("social", "instagram", "Instagram", "https://instagram.com/...")}
      {renderTextField("social", "twitter", "Twitter / X", "https://x.com/...")}
      {renderTextField("social", "linkedin", "LinkedIn", "https://linkedin.com/...")}
      {renderTextField("social", "youtube", "YouTube", "https://youtube.com/...")}
    </div>
  );

  const renderFaqSection = () => {
    const items = (editData.faq?.items as Record<string, string>[]) || [];
    return (
      <div className="space-y-4">
        {items.map((item, i) => (
          <div key={i} className="rounded-lg border border-border bg-muted/30 p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground">
                Soru #{i + 1}
              </span>
              {items.length > 1 && (
                <button
                  onClick={() => removeArrayItem("faq", i)}
                  className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
            <div className="space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">Soru (TR)</label>
                  <input
                    type="text"
                    value={item.question_tr || ""}
                    onChange={(e) => updateArrayItem("faq", i, "question_tr", e.target.value)}
                    placeholder="Soru metni..."
                    className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">Soru (EN)</label>
                  <input
                    type="text"
                    value={item.question_en || ""}
                    onChange={(e) => updateArrayItem("faq", i, "question_en", e.target.value)}
                    placeholder="Question text..."
                    className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">Cevap (TR)</label>
                  <textarea
                    value={item.answer_tr || ""}
                    onChange={(e) => updateArrayItem("faq", i, "answer_tr", e.target.value)}
                    rows={3}
                    placeholder="Cevap metni..."
                    className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">Cevap (EN)</label>
                  <textarea
                    value={item.answer_en || ""}
                    onChange={(e) => updateArrayItem("faq", i, "answer_en", e.target.value)}
                    rows={3}
                    placeholder="Answer text..."
                    className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
        <button
          onClick={() => addArrayItem("faq")}
          className="inline-flex items-center gap-2 rounded-lg border border-dashed border-border px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:border-primary hover:bg-primary/5 hover:text-primary"
        >
          <Plus size={16} />
          Yeni Soru Ekle
        </button>
      </div>
    );
  };

  const renderSectionContent = (key: string) => {
    switch (key) {
      case "hero": return renderHeroSection();
      case "stats": return renderStatsSection();
      case "about": return renderAboutSection();
      case "contact": return renderContactSection();
      case "social": return renderSocialSection();
      case "faq": return renderFaqSection();
      default: return null;
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 size={32} className="animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">İçerik Yönetimi</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Site içeriklerini bu sayfadan düzenleyebilirsiniz.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-2 text-sm font-medium text-primary">
          <FileText size={16} />
          {SECTIONS.length} Bölüm
        </div>
      </div>

      <div className="space-y-4">
        {SECTIONS.map((section) => {
          const isExpanded = expandedSections.has(section.key);
          const isSaving = savingKey === section.key;
          const sectionFeedback = feedback?.key === section.key ? feedback : null;

          return (
            <div
              key={section.key}
              className="overflow-hidden rounded-xl border border-border bg-card shadow-sm"
            >
              <button
                onClick={() => toggleSection(section.key)}
                className="flex w-full items-center gap-3 px-5 py-4 text-left transition-colors hover:bg-muted/50"
              >
                <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${section.color}`}>
                  <section.icon size={18} />
                </div>
                <div className="flex-1">
                  <h2 className="text-sm font-semibold text-foreground">{section.label}</h2>
                  {records[section.key] && (
                    <p className="text-[11px] text-muted-foreground">
                      Son güncelleme: {new Date(records[section.key].updated_at).toLocaleDateString("tr-TR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  )}
                </div>
                {isExpanded ? (
                  <ChevronUp size={18} className="text-muted-foreground" />
                ) : (
                  <ChevronDown size={18} className="text-muted-foreground" />
                )}
              </button>

              {isExpanded && (
                <div className="border-t border-border px-5 py-5">
                  {renderSectionContent(section.key)}

                  {sectionFeedback && (
                    <div
                      className={`mt-4 rounded-lg border px-4 py-3 text-sm ${
                        sectionFeedback.type === "success"
                          ? "border-success/30 bg-success/10 text-success"
                          : "border-destructive/30 bg-destructive/10 text-destructive"
                      }`}
                    >
                      {sectionFeedback.message}
                    </div>
                  )}

                  <div className="mt-5 flex justify-end border-t border-border pt-4">
                    <button
                      onClick={() => handleSave(section.key)}
                      disabled={isSaving}
                      className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isSaving ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <Save size={16} />
                      )}
                      {isSaving ? "Kaydediliyor..." : "Kaydet"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
