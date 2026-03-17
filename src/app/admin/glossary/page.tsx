"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Plus,
  Edit3,
  Trash2,
  BookOpen,
  X,
  Loader2,
  ToggleLeft,
  ToggleRight,
  Search,
} from "lucide-react";
import type { GlossaryTerm } from "@/types/database";

// ─── Alphabet for filter tabs ────────────────────────────────────────────────

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZÇĞİÖŞÜ".split("");

// ─── Empty form state ────────────────────────────────────────────────────────

const EMPTY_FORM = {
  term_tr: "",
  term_en: "",
  definition_tr: "",
  definition_en: "",
  letter: "",
  display_order: 0,
  is_active: true,
};

type FormState = typeof EMPTY_FORM;

interface ModalState {
  open: boolean;
  mode: "add" | "edit";
  term: GlossaryTerm | null;
}

// ─── Main page ───────────────────────────────────────────────────────────────

export default function AdminGlossaryPage() {
  const [terms, setTerms] = useState<GlossaryTerm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterLetter, setFilterLetter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [modal, setModal] = useState<ModalState>({ open: false, mode: "add", term: null });
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  // ── Fetch ──────────────────────────────────────────────────────────────────

  const fetchTerms = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch((process.env.NEXT_PUBLIC_BASE_PATH || "") + "/api/admin/glossary");
      const json = await res.json();
      if (!json.success) throw new Error(json.error ?? "Yüklenemedi");
      setTerms(json.data ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTerms();
  }, [fetchTerms]);

  // ── Filter ─────────────────────────────────────────────────────────────────

  const filteredTerms = terms.filter((t) => {
    if (filterLetter && t.letter !== filterLetter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        t.term_tr.toLowerCase().includes(q) ||
        t.term_en.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // ── Modal helpers ──────────────────────────────────────────────────────────

  function openAdd() {
    setForm(EMPTY_FORM);
    setFormError(null);
    setModal({ open: true, mode: "add", term: null });
  }

  function openEdit(term: GlossaryTerm) {
    setForm({
      term_tr: term.term_tr,
      term_en: term.term_en,
      definition_tr: term.definition_tr,
      definition_en: term.definition_en,
      letter: term.letter,
      display_order: term.display_order,
      is_active: term.is_active,
    });
    setFormError(null);
    setModal({ open: true, mode: "edit", term });
  }

  function closeModal() {
    setModal({ open: false, mode: "add", term: null });
    setFormError(null);
  }

  // ── Submit ─────────────────────────────────────────────────────────────────

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.term_tr.trim()) {
      setFormError("Türkçe terim zorunludur.");
      return;
    }
    if (!form.definition_tr.trim()) {
      setFormError("Türkçe tanım zorunludur.");
      return;
    }
    if (!form.letter.trim()) {
      setFormError("Harf zorunludur.");
      return;
    }

    setSubmitting(true);
    setFormError(null);

    try {
      if (modal.mode === "add") {
        const res = await fetch((process.env.NEXT_PUBLIC_BASE_PATH || "") + "/api/admin/glossary", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            term_tr: form.term_tr.trim(),
            term_en: form.term_en.trim(),
            definition_tr: form.definition_tr.trim(),
            definition_en: form.definition_en.trim(),
            letter: form.letter.trim().toUpperCase(),
            display_order: form.display_order,
            is_active: form.is_active,
          }),
        });
        const json = await res.json();
        if (!json.success) throw new Error(json.error ?? "Oluşturulamadı");
      } else if (modal.term) {
        const res = await fetch(`/api/admin/glossary/${modal.term.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            term_tr: form.term_tr.trim(),
            term_en: form.term_en.trim(),
            definition_tr: form.definition_tr.trim(),
            definition_en: form.definition_en.trim(),
            letter: form.letter.trim().toUpperCase(),
            display_order: form.display_order,
            is_active: form.is_active,
          }),
        });
        const json = await res.json();
        if (!json.success) throw new Error(json.error ?? "Güncellenemedi");
      }

      await fetchTerms();
      closeModal();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Bir hata oluştu");
    } finally {
      setSubmitting(false);
    }
  }

  // ── Delete ─────────────────────────────────────────────────────────────────

  async function handleDelete(id: string) {
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/glossary/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (!json.success) throw new Error(json.error ?? "Silinemedi");
      setTerms((prev) => prev.filter((t) => t.id !== id));
      setDeleteConfirm(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Silme işlemi başarısız");
    } finally {
      setDeleting(false);
    }
  }

  // ── Toggle active ──────────────────────────────────────────────────────────

  async function handleToggleActive(term: GlossaryTerm) {
    try {
      const res = await fetch(`/api/admin/glossary/${term.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !term.is_active }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error ?? "Güncellenemedi");
      setTerms((prev) =>
        prev.map((t) => (t.id === term.id ? { ...t, is_active: !t.is_active } : t))
      );
    } catch (err) {
      alert(err instanceof Error ? err.message : "Güncelleme başarısız");
    }
  }

  // ── Auto-fill letter from term ─────────────────────────────────────────────

  function handleTermChange(value: string) {
    setForm((f) => {
      const newForm = { ...f, term_tr: value };
      // Auto-fill letter if empty or if it was previously auto-filled
      if (value.trim() && (!f.letter || f.letter === f.term_tr.charAt(0).toUpperCase())) {
        newForm.letter = value.charAt(0).toUpperCase();
      }
      return newForm;
    });
  }

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Sözlük</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {terms.length} terim kayıtlı
          </p>
        </div>
        <button
          onClick={openAdd}
          className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90"
        >
          <Plus size={16} />
          Yeni Terim
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Terim ara..."
          className="w-full rounded-lg border border-border bg-card pl-10 pr-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </div>

      {/* Letter filter tabs */}
      <div className="flex flex-wrap gap-1">
        <button
          onClick={() => setFilterLetter(null)}
          className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
            filterLetter === null
              ? "bg-primary text-primary-foreground shadow-sm"
              : "bg-card text-muted-foreground border border-border hover:bg-muted"
          }`}
        >
          Tümü
        </button>
        {ALPHABET.map((letter) => {
          const count = terms.filter((t) => t.letter === letter).length;
          return (
            <button
              key={letter}
              onClick={() => setFilterLetter(filterLetter === letter ? null : letter)}
              disabled={count === 0}
              className={`rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed ${
                filterLetter === letter
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-card text-muted-foreground border border-border hover:bg-muted"
              }`}
            >
              {letter}
              {count > 0 && (
                <span className="ml-0.5 text-[10px] opacity-60">({count})</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-16 text-muted-foreground">
          <Loader2 size={24} className="animate-spin" />
        </div>
      )}

      {/* Table */}
      {!loading && filteredTerms.length > 0 && (
        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Terim (TR)
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Terim (EN)
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Harf
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Sıra
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Durum
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredTerms.map((term) => (
                  <tr key={term.id} className="transition-colors hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <p className="font-medium text-foreground">{term.term_tr}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">
                        {term.definition_tr}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {term.term_en || <span className="text-xs italic">-</span>}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
                        {term.letter}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center text-muted-foreground">
                      {term.display_order}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleToggleActive(term)}
                        className="inline-flex items-center"
                        title={term.is_active ? "Pasife al" : "Aktif et"}
                      >
                        {term.is_active ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-600">
                            <ToggleRight size={14} />
                            Aktif
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                            <ToggleLeft size={14} />
                            Pasif
                          </span>
                        )}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEdit(term)}
                          className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-border px-3 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted"
                        >
                          <Edit3 size={12} />
                          Düzenle
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(term.id)}
                          className="inline-flex h-10 items-center rounded-lg border border-border px-2.5 text-muted-foreground transition-colors hover:border-destructive/50 hover:bg-destructive/10 hover:text-destructive"
                          title="Sil"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!loading && filteredTerms.length === 0 && !error && (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
          <BookOpen size={40} className="mb-3 opacity-30" />
          <p className="text-sm font-medium">
            {filterLetter || searchQuery ? "Eşleşen terim bulunamadı" : "Henüz terim eklenmemiş"}
          </p>
          {!filterLetter && !searchQuery && (
            <p className="text-xs">Yeni terim eklemek için butona tıklayın</p>
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-xl bg-card p-6 shadow-xl">
            <h2 className="mb-2 text-base font-semibold text-foreground">Terimi Sil</h2>
            <p className="mb-6 text-sm text-muted-foreground">
              Bu terimi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                disabled={deleting}
                className="h-10 rounded-lg border border-border px-4 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted"
              >
                İptal
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                disabled={deleting}
                className="inline-flex h-10 items-center gap-2 rounded-lg bg-destructive px-4 text-sm font-semibold text-destructive-foreground transition-all hover:bg-destructive/90 disabled:opacity-70"
              >
                {deleting && <Loader2 size={14} className="animate-spin" />}
                Sil
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      {modal.open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4 py-8">
          <div className="w-full max-w-lg rounded-xl bg-card shadow-xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <h2 className="text-base font-semibold text-foreground">
                {modal.mode === "add" ? "Yeni Terim Ekle" : "Terimi Düzenle"}
              </h2>
              <button
                onClick={closeModal}
                className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="space-y-5 p-6">
              {formError && (
                <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {formError}
                </div>
              )}

              {/* Term TR / EN */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">
                    Terim (Türkçe) <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.term_tr}
                    onChange={(e) => handleTermChange(e.target.value)}
                    placeholder="Ambalaj"
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">
                    Terim (İngilizce)
                  </label>
                  <input
                    type="text"
                    value={form.term_en}
                    onChange={(e) => setForm((f) => ({ ...f, term_en: e.target.value }))}
                    placeholder="Packaging"
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              {/* Definition TR */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">
                  Tanım (Türkçe) <span className="text-destructive">*</span>
                </label>
                <textarea
                  value={form.definition_tr}
                  onChange={(e) => setForm((f) => ({ ...f, definition_tr: e.target.value }))}
                  rows={3}
                  placeholder="Ürünlerin korunması, saklanması ve taşınması amacıyla kullanılan malzeme..."
                  className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  required
                />
              </div>

              {/* Definition EN */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">
                  Tanım (İngilizce)
                </label>
                <textarea
                  value={form.definition_en}
                  onChange={(e) => setForm((f) => ({ ...f, definition_en: e.target.value }))}
                  rows={3}
                  placeholder="Material used for protection, storage and transportation of products..."
                  className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {/* Letter + Display Order */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">
                    Harf <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.letter}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, letter: e.target.value.toUpperCase().slice(0, 1) }))
                    }
                    placeholder="A"
                    maxLength={1}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">Sıra</label>
                  <input
                    type="number"
                    value={form.display_order}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, display_order: parseInt(e.target.value) || 0 }))
                    }
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              {/* Active toggle */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, is_active: !f.is_active }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    form.is_active ? "bg-emerald-500" : "bg-muted-foreground/30"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 translate-x-1 rounded-full bg-white shadow transition-transform ${
                      form.is_active ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
                <span className="text-sm font-medium text-foreground">
                  {form.is_active ? "Aktif" : "Pasif"}
                </span>
              </div>

              {/* Form actions */}
              <div className="flex justify-end gap-3 border-t border-border pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={submitting}
                  className="h-10 rounded-lg border border-border px-4 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 disabled:opacity-70"
                >
                  {submitting && <Loader2 size={14} className="animate-spin" />}
                  {modal.mode === "add" ? "Ekle" : "Kaydet"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
