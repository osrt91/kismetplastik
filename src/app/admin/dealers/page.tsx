"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  Search,
  Check,
  X,
  Building2,
  Mail,
  Phone,
  MapPin,
  Clock,
  Shield,
  Loader2,
} from "lucide-react";

interface Dealer {
  id: string;
  company_name: string;
  full_name: string;
  email: string;
  phone: string;
  city: string;
  is_approved: boolean;
  created_at: string;
}

type TabFilter = "all" | "pending" | "approved";

export default function AdminDealersPage() {
  const router = useRouter();
  const [dealers, setDealers] = useState<Dealer[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<TabFilter>("all");
  const [error, setError] = useState("");

  const fetchDealers = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/dealers", { credentials: "include" });
      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }
      if (!res.ok) throw new Error("Bayiler yüklenemedi.");
      const data = await res.json();
      setDealers(data.dealers || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchDealers();
  }, [fetchDealers]);

  const handleApprove = async (id: string) => {
    setActionLoading(id);
    try {
      const res = await fetch("/api/admin/dealers", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ id, is_approved: true }),
      });
      if (!res.ok) throw new Error("Onaylama başarısız.");
      setDealers((prev) =>
        prev.map((d) => (d.id === id ? { ...d, is_approved: true } : d))
      );
    } catch {
      setError("Onaylama sırasında hata oluştu.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id: string) => {
    if (!confirm("Bu bayiyi silmek istediğinize emin misiniz?")) return;
    setActionLoading(id);
    try {
      const res = await fetch(`/api/admin/dealers?id=${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Silme başarısız.");
      setDealers((prev) => prev.filter((d) => d.id !== id));
    } catch {
      setError("Silme sırasında hata oluştu.");
    } finally {
      setActionLoading(null);
    }
  };

  const filtered = useMemo(() => {
    return dealers.filter((d) => {
      const matchTab =
        tab === "all" ||
        (tab === "pending" && !d.is_approved) ||
        (tab === "approved" && d.is_approved);
      const q = search.toLowerCase();
      const matchSearch =
        !search ||
        (d.company_name || "").toLowerCase().includes(q) ||
        (d.email || "").toLowerCase().includes(q);
      return matchTab && matchSearch;
    });
  }, [dealers, tab, search]);

  const counts = useMemo(
    () => ({
      all: dealers.length,
      pending: dealers.filter((d) => !d.is_approved).length,
      approved: dealers.filter((d) => d.is_approved).length,
    }),
    [dealers]
  );

  const tabs: { key: TabFilter; label: string }[] = [
    { key: "all", label: "Tümü" },
    { key: "pending", label: "Bekleyen" },
    { key: "approved", label: "Onaylı" },
  ];

  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleDateString("tr-TR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
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
          <h1 className="text-2xl font-bold text-foreground">Bayiler</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {dealers.length} bayi kayıtlı
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-2 text-sm font-medium text-primary">
          <Shield size={16} />
          Onay Yönetimi
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
          <button onClick={() => setError("")} className="ml-2 font-bold">
            ×
          </button>
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Firma adı veya e-posta ile ara..."
            className="w-full rounded-lg border border-border bg-card py-2.5 pl-9 pr-4 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div className="flex rounded-lg border border-border bg-card">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-4 py-2.5 text-sm font-medium transition-colors ${
                tab === t.key
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted"
              } ${t.key === "all" ? "rounded-l-lg" : ""} ${
                t.key === "approved" ? "rounded-r-lg" : ""
              }`}
            >
              {t.label} ({counts[t.key]})
            </button>
          ))}
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        {filtered.length} sonuç gösteriliyor
      </p>

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted">
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Building2 size={14} />
                    Firma
                  </div>
                </th>
                <th className="hidden px-4 py-3 text-left font-semibold text-muted-foreground md:table-cell">
                  <div className="flex items-center gap-1.5">
                    <Mail size={14} />
                    E-posta
                  </div>
                </th>
                <th className="hidden px-4 py-3 text-left font-semibold text-muted-foreground lg:table-cell">
                  <div className="flex items-center gap-1.5">
                    <Phone size={14} />
                    Telefon
                  </div>
                </th>
                <th className="hidden px-4 py-3 text-left font-semibold text-muted-foreground lg:table-cell">
                  <div className="flex items-center gap-1.5">
                    <MapPin size={14} />
                    Şehir
                  </div>
                </th>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">
                  Durum
                </th>
                <th className="hidden px-4 py-3 text-left font-semibold text-muted-foreground md:table-cell">
                  <div className="flex items-center gap-1.5">
                    <Clock size={14} />
                    Kayıt Tarihi
                  </div>
                </th>
                <th className="px-4 py-3 text-right font-semibold text-muted-foreground">
                  İşlem
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((dealer) => (
                <tr
                  key={dealer.id}
                  className="border-b border-border transition-colors last:border-0 hover:bg-muted/50"
                >
                  <td className="px-4 py-3">
                    <div>
                      <span className="font-medium text-foreground">
                        {dealer.company_name || "-"}
                      </span>
                      <p className="text-xs text-muted-foreground">
                        {dealer.full_name || "-"}
                      </p>
                    </div>
                  </td>
                  <td className="hidden px-4 py-3 text-muted-foreground md:table-cell">
                    {dealer.email || "-"}
                  </td>
                  <td className="hidden px-4 py-3 text-muted-foreground lg:table-cell">
                    {dealer.phone || "-"}
                  </td>
                  <td className="hidden px-4 py-3 text-muted-foreground lg:table-cell">
                    {dealer.city || "-"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                        dealer.is_approved
                          ? "bg-success/10 text-success"
                          : "bg-amber-500/10 text-amber-600"
                      }`}
                    >
                      {dealer.is_approved ? "Onaylı" : "Bekliyor"}
                    </span>
                  </td>
                  <td className="hidden px-4 py-3 text-xs text-muted-foreground md:table-cell">
                    {formatDate(dealer.created_at)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      {!dealer.is_approved && (
                        <button
                          onClick={() => handleApprove(dealer.id)}
                          disabled={actionLoading === dealer.id}
                          className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-success/10 hover:text-success disabled:opacity-50"
                          title="Onayla"
                        >
                          {actionLoading === dealer.id ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : (
                            <Check size={14} />
                          )}
                        </button>
                      )}
                      <button
                        onClick={() => handleReject(dealer.id)}
                        disabled={actionLoading === dealer.id}
                        className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive disabled:opacity-50"
                        title="Reddet / Sil"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <Users size={40} className="mb-3 opacity-30" />
            <p className="text-sm font-medium">Bayi bulunamadı</p>
            <p className="text-xs">Arama kriterlerini değiştirmeyi deneyin</p>
          </div>
        )}
      </div>
    </div>
  );
}
