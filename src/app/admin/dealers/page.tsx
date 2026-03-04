"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Building2,
  Mail,
  Shield,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { DbProfile, UserRole } from "@/types/database";

type FilterRole = "all" | UserRole;
type FilterApproved = "all" | "true" | "false";

const ROLE_COLORS: Record<UserRole, string> = {
  admin: "bg-purple-100 text-purple-700",
  dealer: "bg-blue-100 text-blue-700",
  customer: "bg-gray-100 text-gray-700",
};

export default function AdminDealersPage() {
  const router = useRouter();

  const [dealers, setDealers] = useState<DbProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<FilterRole>("all");
  const [approvedFilter, setApprovedFilter] = useState<FilterApproved>("all");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const [togglingId, setTogglingId] = useState<string | null>(null);

  const fetchDealers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: "20",
      });
      if (search) params.set("search", search);
      if (roleFilter !== "all") params.set("role", roleFilter);
      if (approvedFilter !== "all") params.set("approved", approvedFilter);

      const res = await fetch(`/api/admin/dealers?${params.toString()}`);
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Veri alınamadı.");
      setDealers(json.data || []);
      setTotal(json.pagination?.total || 0);
      setTotalPages(json.pagination?.totalPages || 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  }, [page, search, roleFilter, approvedFilter]);

  useEffect(() => {
    const timer = setTimeout(fetchDealers, search ? 400 : 0);
    return () => clearTimeout(timer);
  }, [fetchDealers, search]);

  const toggleField = async (
    dealer: DbProfile,
    field: "is_approved" | "is_active"
  ) => {
    setTogglingId(dealer.id + field);
    try {
      const res = await fetch(`/api/admin/dealers/${dealer.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: !dealer[field] }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      setDealers((prev) =>
        prev.map((d) =>
          d.id === dealer.id ? { ...d, [field]: !dealer[field] } : d
        )
      );
    } catch (err) {
      alert(err instanceof Error ? err.message : "Hata oluştu.");
    } finally {
      setTogglingId(null);
    }
  };

  const changeRole = async (dealer: DbProfile, role: UserRole) => {
    try {
      const res = await fetch(`/api/admin/dealers/${dealer.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      setDealers((prev) =>
        prev.map((d) => (d.id === dealer.id ? { ...d, role } : d))
      );
    } catch (err) {
      alert(err instanceof Error ? err.message : "Hata oluştu.");
    }
  };

  const handleSearchChange = (val: string) => {
    setSearch(val);
    setPage(1);
  };

  const handleRoleChange = (val: FilterRole) => {
    setRoleFilter(val);
    setPage(1);
  };

  const handleApprovedChange = (val: FilterApproved) => {
    setApprovedFilter(val);
    setPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Bayiler</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {total} kayıtlı kullanıcı
          </p>
        </div>
        <button
          onClick={fetchDealers}
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-medium text-muted-foreground shadow-sm transition-colors hover:bg-muted"
        >
          <RefreshCw size={15} />
          Yenile
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        {/* Search */}
        <div className="relative min-w-[220px] flex-1">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Ad, e-posta veya firma ara..."
            className="w-full rounded-lg border border-border bg-card py-2.5 pl-9 pr-4 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {/* Role filter */}
        <select
          value={roleFilter}
          onChange={(e) => handleRoleChange(e.target.value as FilterRole)}
          className="rounded-lg border border-border bg-card px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        >
          <option value="all">Tüm Roller</option>
          <option value="dealer">Bayi</option>
          <option value="customer">Müşteri</option>
          <option value="admin">Yönetici</option>
        </select>

        {/* Approval filter */}
        <select
          value={approvedFilter}
          onChange={(e) => handleApprovedChange(e.target.value as FilterApproved)}
          className="rounded-lg border border-border bg-card px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        >
          <option value="all">Tüm Durumlar</option>
          <option value="true">Onaylı</option>
          <option value="false">Beklemede</option>
        </select>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Kullanıcı
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Firma
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Rol
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Onay
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Aktif
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Kayıt Tarihi
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} className="border-b border-border">
                    {Array.from({ length: 6 }).map((_, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="h-4 animate-pulse rounded bg-muted" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : dealers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-16 text-center text-muted-foreground">
                    <Users size={36} className="mx-auto mb-3 opacity-30" />
                    <p className="text-sm font-medium">Kullanıcı bulunamadı</p>
                  </td>
                </tr>
              ) : (
                dealers.map((dealer) => (
                  <tr
                    key={dealer.id}
                    className="cursor-pointer border-b border-border transition-colors last:border-0 hover:bg-muted/40"
                    onClick={() => router.push(`/admin/dealers/${dealer.id}`)}
                  >
                    {/* User */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                          {dealer.full_name?.charAt(0)?.toUpperCase() || "?"}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">
                            {dealer.full_name || "-"}
                          </p>
                          <p className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Mail size={11} />
                            {dealer.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Company */}
                    <td className="px-4 py-3">
                      {dealer.company_name ? (
                        <span className="flex items-center gap-1.5 text-sm text-foreground">
                          <Building2 size={13} className="text-muted-foreground" />
                          {dealer.company_name}
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground">-</span>
                      )}
                    </td>

                    {/* Role */}
                    <td
                      className="px-4 py-3"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center gap-2">
                        <Shield size={13} className="text-muted-foreground" />
                        <select
                          value={dealer.role}
                          onChange={(e) =>
                            changeRole(dealer, e.target.value as UserRole)
                          }
                          className={`rounded-full px-2.5 py-0.5 text-xs font-medium outline-none ${ROLE_COLORS[dealer.role]}`}
                        >
                          <option value="dealer">Bayi</option>
                          <option value="customer">Müşteri</option>
                          <option value="admin">Yönetici</option>
                        </select>
                      </div>
                    </td>

                    {/* Approved */}
                    <td
                      className="px-4 py-3"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        disabled={togglingId === dealer.id + "is_approved"}
                        onClick={() => toggleField(dealer, "is_approved")}
                        className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition-colors"
                        style={{}}
                      >
                        {dealer.is_approved ? (
                          <>
                            <CheckCircle size={13} className="text-green-600" />
                            <span className="text-green-700">Onaylı</span>
                          </>
                        ) : (
                          <>
                            <Clock size={13} className="text-amber-500" />
                            <span className="text-amber-600">Beklemede</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Active */}
                    <td
                      className="px-4 py-3"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        disabled={togglingId === dealer.id + "is_active"}
                        onClick={() => toggleField(dealer, "is_active")}
                        className="transition-opacity disabled:opacity-50"
                        title={dealer.is_active ? "Aktif — kapat" : "Pasif — aç"}
                      >
                        {dealer.is_active ? (
                          <ToggleRight size={22} className="text-green-600" />
                        ) : (
                          <ToggleLeft size={22} className="text-muted-foreground" />
                        )}
                      </button>
                    </td>

                    {/* Date */}
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {new Date(dealer.created_at).toLocaleDateString("tr-TR")}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-border px-4 py-3">
            <p className="text-xs text-muted-foreground">
              Sayfa {page} / {totalPages} — toplam {total} kayıt
            </p>
            <div className="flex items-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:bg-muted disabled:opacity-40"
              >
                <ChevronLeft size={14} />
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:bg-muted disabled:opacity-40"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <XCircle size={12} className="text-destructive/60" />
          Satıra tıklayarak detay sayfasına gidin
        </span>
        <span className="flex items-center gap-1.5">
          <CheckCircle size={12} className="text-green-600" />
          Onay / Toggle butonları satır tıklamasını tetiklemez
        </span>
      </div>
    </div>
  );
}
