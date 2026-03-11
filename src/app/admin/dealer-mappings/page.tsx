"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Plus,
  Trash2,
  Edit3,
  Users,
  Search,
  X,
  Loader2,
  AlertCircle,
  CheckCircle2,
  XCircle,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import type { DealerPriceType } from "@/types/database";

interface MappingRow {
  id: string;
  profile_id: string;
  dia_cari_kodu: string;
  dia_cari_unvan: string | null;
  is_approved: boolean;
  price_type: DealerPriceType;
  can_direct_order: boolean;
  created_at: string;
  updated_at: string;
  profiles: {
    email: string;
    full_name: string;
    company_name: string | null;
    phone: string | null;
  } | null;
}

const PRICE_TYPES: { value: DealerPriceType; label: string }[] = [
  { value: "standard", label: "Standart" },
  { value: "pesin", label: "Peşin" },
  { value: "vadeli", label: "Vadeli" },
  { value: "ozel", label: "Özel" },
];

// ─── modal ─────────────────────────────────────────────────────────────────

interface FormData {
  profile_id: string;
  dia_cari_kodu: string;
  dia_cari_unvan: string;
  price_type: DealerPriceType;
  can_direct_order: boolean;
}

const EMPTY_FORM: FormData = {
  profile_id: "",
  dia_cari_kodu: "",
  dia_cari_unvan: "",
  price_type: "standard",
  can_direct_order: false,
};

interface DealerProfile {
  id: string;
  email: string;
  full_name: string;
  company_name: string | null;
}

function MappingModal({
  initial,
  onClose,
  onSaved,
}: {
  initial?: MappingRow | null;
  onClose: () => void;
  onSaved: (m: MappingRow) => void;
}) {
  const isEdit = Boolean(initial);
  const [form, setForm] = useState<FormData>(
    initial
      ? {
          profile_id: initial.profile_id,
          dia_cari_kodu: initial.dia_cari_kodu,
          dia_cari_unvan: initial.dia_cari_unvan ?? "",
          price_type: initial.price_type,
          can_direct_order: initial.can_direct_order,
        }
      : EMPTY_FORM
  );
  const [dealers, setDealers] = useState<DealerProfile[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isEdit) {
      fetch("/api/admin/dealers")
        .then((r) => r.json())
        .then((json) => {
          if (json.success) setDealers(json.data ?? []);
        })
        .catch(() => {});
    }
  }, [isEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);

    try {
      const method = isEdit ? "PUT" : "POST";
      const body = isEdit ? { id: initial!.id, ...form } : form;

      const res = await fetch("/api/admin/dealer-mappings", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...body,
          dia_cari_unvan: form.dia_cari_unvan.trim() || null,
        }),
      });
      const json = await res.json();

      if (!json.success) {
        setError(json.error ?? "Hata oluştu");
        return;
      }

      onSaved(json.data);
    } catch {
      setError("Sunucuya bağlanılamadı");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-2xl border border-border bg-card shadow-xl">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="text-base font-semibold text-foreground">
            {isEdit ? "Eşleştirmeyi Düzenle" : "Yeni Bayi-Cari Eşleştirme"}
          </h2>
          <button onClick={onClose} className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          {error && (
            <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2.5 text-sm text-destructive">
              <AlertCircle size={15} className="shrink-0" />
              {error}
            </div>
          )}

          {!isEdit && (
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                Bayi <span className="text-destructive">*</span>
              </label>
              <select
                value={form.profile_id}
                onChange={(e) => setForm((p) => ({ ...p, profile_id: e.target.value }))}
                required
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              >
                <option value="">Bayi seçin...</option>
                {dealers.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.company_name ?? d.full_name} ({d.email})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
              DIA Cari Kodu <span className="text-destructive">*</span>
            </label>
            <input
              value={form.dia_cari_kodu}
              onChange={(e) => setForm((p) => ({ ...p, dia_cari_kodu: e.target.value }))}
              placeholder="Örn: 120.01.001"
              required
              className="w-full rounded-lg border border-border bg-background px-3 py-2 font-mono text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
              DIA Cari Ünvan
            </label>
            <input
              value={form.dia_cari_unvan}
              onChange={(e) => setForm((p) => ({ ...p, dia_cari_unvan: e.target.value }))}
              placeholder="Firma ünvanı"
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Fiyat Tipi</label>
              <select
                value={form.price_type}
                onChange={(e) => setForm((p) => ({ ...p, price_type: e.target.value as DealerPriceType }))}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              >
                {PRICE_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm cursor-pointer w-full">
                <input
                  type="checkbox"
                  checked={form.can_direct_order}
                  onChange={(e) => setForm((p) => ({ ...p, can_direct_order: e.target.checked }))}
                  className="h-4 w-4 rounded border-border text-primary focus:ring-primary/20"
                />
                Direkt Sipariş
              </label>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 border-t border-border pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
            >
              {saving && <Loader2 size={14} className="animate-spin" />}
              {isEdit ? "Kaydet" : "Eşleştir"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── main page ───────────────────────────────────────────────────────────────

export default function AdminDealerMappingsPage() {
  const [mappings, setMappings] = useState<MappingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<MappingRow | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchMappings = useCallback(async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const res = await fetch("/api/admin/dealer-mappings");
      const json = await res.json();
      if (json.success) setMappings(json.data);
      else setFetchError(json.error);
    } catch {
      setFetchError("Sunucuya bağlanılamadı");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMappings();
  }, [fetchMappings]);

  const handleSaved = (saved: MappingRow) => {
    setMappings((prev) => {
      const idx = prev.findIndex((m) => m.id === saved.id);
      if (idx !== -1) {
        const next = [...prev];
        next[idx] = saved;
        return next;
      }
      return [saved, ...prev];
    });
    setModalOpen(false);
    setEditTarget(null);
  };

  const handleToggle = async (mapping: MappingRow, field: "is_approved" | "can_direct_order") => {
    setTogglingId(mapping.id);
    try {
      const res = await fetch("/api/admin/dealer-mappings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: mapping.id, [field]: !mapping[field] }),
      });
      const json = await res.json();
      if (json.success) {
        setMappings((prev) => prev.map((m) => (m.id === mapping.id ? json.data : m)));
      }
    } catch {
      /* ignore */
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/dealer-mappings?id=${id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        setMappings((prev) => prev.filter((m) => m.id !== id));
      }
    } catch {
      /* ignore */
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = mappings.filter((m) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      m.dia_cari_kodu.toLowerCase().includes(q) ||
      (m.dia_cari_unvan ?? "").toLowerCase().includes(q) ||
      (m.profiles?.email ?? "").toLowerCase().includes(q) ||
      (m.profiles?.company_name ?? "").toLowerCase().includes(q)
    );
  });

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Bayi-Cari Eşleştirme</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {mappings.length} eşleştirme · {mappings.filter((m) => m.is_approved).length} onaylı
            </p>
          </div>
          <button
            onClick={() => {
              setEditTarget(null);
              setModalOpen(true);
            }}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90"
          >
            <Plus size={16} />
            Yeni Eşleştirme
          </button>
        </div>

        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari kodu, ünvan veya email ile ara..."
            className="w-full rounded-lg border border-border bg-background py-2.5 pl-10 pr-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={28} className="animate-spin text-muted-foreground" />
          </div>
        ) : fetchError ? (
          <div className="flex flex-col items-center py-16 text-muted-foreground">
            <AlertCircle size={36} className="mb-3 text-destructive opacity-60" />
            <p className="text-sm font-medium text-destructive">{fetchError}</p>
            <button onClick={fetchMappings} className="mt-3 rounded-lg border border-border px-4 py-2 text-xs hover:bg-muted">
              Tekrar Dene
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center py-20 text-muted-foreground">
            <Users size={44} className="mb-3 opacity-20" />
            <p className="text-sm font-medium">
              {search ? "Aramayla eşleşen kayıt yok" : "Henüz eşleştirme yapılmamış"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Bayi</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Email</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">DIA Cari</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Ünvan</th>
                  <th className="px-4 py-3 text-center font-medium text-muted-foreground">Fiyat</th>
                  <th className="px-4 py-3 text-center font-medium text-muted-foreground">Onaylı</th>
                  <th className="px-4 py-3 text-center font-medium text-muted-foreground">Direkt</th>
                  <th className="px-4 py-3 text-right font-medium text-muted-foreground">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((m) => (
                  <tr key={m.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                    <td className="px-4 py-3 text-sm font-medium">
                      {m.profiles?.company_name ?? m.profiles?.full_name ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {m.profiles?.email ?? "—"}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs font-medium">{m.dia_cari_kodu}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground truncate max-w-[180px]">
                      {m.dia_cari_unvan ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-flex rounded-full bg-muted px-2 py-0.5 text-xs font-medium">
                        {PRICE_TYPES.find((t) => t.value === m.price_type)?.label ?? m.price_type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleToggle(m, "is_approved")}
                        disabled={togglingId === m.id}
                        className="inline-flex items-center justify-center"
                      >
                        {togglingId === m.id ? (
                          <Loader2 size={16} className="animate-spin text-muted-foreground" />
                        ) : m.is_approved ? (
                          <CheckCircle2 size={18} className="text-emerald-500" />
                        ) : (
                          <XCircle size={18} className="text-red-400" />
                        )}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleToggle(m, "can_direct_order")}
                        disabled={togglingId === m.id}
                        className="inline-flex items-center justify-center"
                      >
                        {m.can_direct_order ? (
                          <ToggleRight size={20} className="text-emerald-500" />
                        ) : (
                          <ToggleLeft size={20} className="text-muted-foreground" />
                        )}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => {
                            setEditTarget(m);
                            setModalOpen(true);
                          }}
                          className="rounded-lg p-1.5 text-muted-foreground hover:bg-primary/10 hover:text-primary"
                        >
                          <Edit3 size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(m.id)}
                          disabled={deletingId === m.id}
                          className="rounded-lg p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive disabled:opacity-50"
                        >
                          {deletingId === m.id ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : (
                            <Trash2 size={14} />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modalOpen && (
        <MappingModal
          initial={editTarget}
          onClose={() => {
            setModalOpen(false);
            setEditTarget(null);
          }}
          onSaved={handleSaved}
        />
      )}
    </>
  );
}
