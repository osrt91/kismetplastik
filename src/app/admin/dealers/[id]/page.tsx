"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Save,
  User,
  Building2,
  Phone,
  MapPin,
  FileText,
  CheckCircle,
  Clock,
  ShoppingCart,
  ClipboardList,
  ToggleLeft,
  ToggleRight,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { DbProfile, DbOrder, DbQuoteRequest, UserRole } from "@/types/database";

const ROLE_LABELS: Record<UserRole, string> = {
  admin: "Yönetici",
  dealer: "Bayi",
  customer: "Müşteri",
};

const ORDER_STATUS_LABELS: Record<string, string> = {
  pending: "Beklemede",
  confirmed: "Onaylandı",
  production: "Üretimde",
  shipping: "Kargoda",
  delivered: "Teslim Edildi",
  cancelled: "İptal Edildi",
};

const QUOTE_STATUS_LABELS: Record<string, string> = {
  pending: "Beklemede",
  reviewing: "İnceleniyor",
  quoted: "Fiyatlandırıldı",
  accepted: "Kabul Edildi",
  rejected: "Reddedildi",
};

interface EditableProfile {
  full_name: string;
  phone: string;
  company_name: string;
  tax_number: string;
  tax_office: string;
  company_address: string;
  city: string;
  district: string;
  role: UserRole;
  is_approved: boolean;
  is_active: boolean;
  notes: string;
}

export default function DealerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const [profile, setProfile] = useState<DbProfile | null>(null);
  const [orders, setOrders] = useState<DbOrder[]>([]);
  const [quotes, setQuotes] = useState<DbQuoteRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [form, setForm] = useState<EditableProfile>({
    full_name: "",
    phone: "",
    company_name: "",
    tax_number: "",
    tax_office: "",
    company_address: "",
    city: "",
    district: "",
    role: "dealer",
    is_approved: false,
    is_active: true,
    notes: "",
  });

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      setError(null);
      try {
        const [profileRes, ordersRes, quotesRes] = await Promise.all([
          fetch(`/api/admin/dealers/${id}`),
          fetch(`/api/admin/dealers/${id}/orders`),
          fetch(`/api/admin/dealers/${id}/quotes`),
        ]);

        const profileJson = await profileRes.json();
        if (!profileJson.success) throw new Error(profileJson.error || "Profil bulunamadı.");

        const p: DbProfile = profileJson.data;
        setProfile(p);
        setForm({
          full_name: p.full_name || "",
          phone: p.phone || "",
          company_name: p.company_name || "",
          tax_number: p.tax_number || "",
          tax_office: p.tax_office || "",
          company_address: p.company_address || "",
          city: p.city || "",
          district: p.district || "",
          role: p.role,
          is_approved: p.is_approved,
          is_active: p.is_active,
          notes: p.notes || "",
        });

        const ordersJson = await ordersRes.json();
        if (ordersJson.success) setOrders(ordersJson.data || []);

        const quotesJson = await quotesRes.json();
        if (quotesJson.success) setQuotes(quotesJson.data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Bir hata oluştu.");
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [id]);

  const handleSave = async () => {
    setSaving(true);
    setSaveSuccess(false);
    try {
      const res = await fetch(`/api/admin/dealers/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Kayıt başarısız.");
      setProfile(json.data);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Kaydetme hatası.");
    } finally {
      setSaving(false);
    }
  };

  const setField = <K extends keyof EditableProfile>(key: K, value: EditableProfile[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 size={28} className="animate-spin text-primary" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
        <AlertTriangle size={36} className="mb-3 text-destructive/60" />
        <p className="text-sm font-medium">{error || "Profil bulunamadı."}</p>
        <button
          onClick={() => router.back()}
          className="mt-4 text-sm text-primary hover:underline"
        >
          Geri Dön
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/admin/dealers")}
            className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted"
          >
            <ArrowLeft size={15} />
            Geri
          </button>
          <div>
            <h1 className="text-xl font-bold text-foreground">
              {profile.full_name || "Adsız Kullanıcı"}
            </h1>
            <p className="text-sm text-muted-foreground">{profile.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {saveSuccess && (
            <span className="flex items-center gap-1.5 text-sm text-green-600">
              <CheckCircle size={15} />
              Kaydedildi
            </span>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 disabled:opacity-60"
          >
            {saving ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <Save size={15} />
            )}
            Kaydet
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left column: form */}
        <div className="space-y-5 lg:col-span-2">
          {/* Status toggles */}
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold text-foreground">Durum & Erişim</h2>
            <div className="flex flex-wrap gap-6">
              {/* Role */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-muted-foreground">Rol</label>
                <select
                  value={form.role}
                  onChange={(e) => setField("role", e.target.value as UserRole)}
                  className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                >
                  <option value="dealer">Bayi</option>
                  <option value="customer">Müşteri</option>
                  <option value="admin">Yönetici</option>
                </select>
              </div>

              {/* Approved */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-muted-foreground">Onay Durumu</label>
                <button
                  onClick={() => setField("is_approved", !form.is_approved)}
                  className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                    form.is_approved
                      ? "border-green-200 bg-green-50 text-green-700"
                      : "border-amber-200 bg-amber-50 text-amber-700"
                  }`}
                >
                  {form.is_approved ? (
                    <>
                      <CheckCircle size={15} />
                      Onaylı
                    </>
                  ) : (
                    <>
                      <Clock size={15} />
                      Beklemede
                    </>
                  )}
                </button>
              </div>

              {/* Active */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-muted-foreground">Aktiflik</label>
                <button
                  onClick={() => setField("is_active", !form.is_active)}
                  className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                    form.is_active
                      ? "border-green-200 bg-green-50 text-green-700"
                      : "border-border bg-muted text-muted-foreground"
                  }`}
                >
                  {form.is_active ? (
                    <>
                      <ToggleRight size={17} />
                      Aktif
                    </>
                  ) : (
                    <>
                      <ToggleLeft size={17} />
                      Pasif
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Personal info */}
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-foreground">
              <User size={15} />
              Kişisel Bilgiler
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Ad Soyad"
                value={form.full_name}
                onChange={(v) => setField("full_name", v)}
                icon={<User size={13} />}
              />
              <Field
                label="Telefon"
                value={form.phone}
                onChange={(v) => setField("phone", v)}
                icon={<Phone size={13} />}
                type="tel"
              />
            </div>
          </div>

          {/* Company info */}
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-foreground">
              <Building2 size={15} />
              Firma Bilgileri
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Firma Adı"
                value={form.company_name}
                onChange={(v) => setField("company_name", v)}
                icon={<Building2 size={13} />}
              />
              <Field
                label="Vergi No"
                value={form.tax_number}
                onChange={(v) => setField("tax_number", v)}
              />
              <Field
                label="Vergi Dairesi"
                value={form.tax_office}
                onChange={(v) => setField("tax_office", v)}
              />
              <Field
                label="Şehir"
                value={form.city}
                onChange={(v) => setField("city", v)}
                icon={<MapPin size={13} />}
              />
              <Field
                label="İlçe"
                value={form.district}
                onChange={(v) => setField("district", v)}
              />
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                  Firma Adresi
                </label>
                <textarea
                  value={form.company_address}
                  onChange={(e) => setField("company_address", e.target.value)}
                  rows={2}
                  className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
          </div>

          {/* Admin notes */}
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-foreground">
              <FileText size={15} />
              Admin Notları
            </h2>
            <textarea
              value={form.notes}
              onChange={(e) => setField("notes", e.target.value)}
              rows={4}
              placeholder="Bu kullanıcı hakkında notlar..."
              className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        {/* Right column: meta + orders + quotes */}
        <div className="space-y-5">
          {/* Profile meta */}
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <h2 className="mb-3 text-sm font-semibold text-foreground">Bilgiler</h2>
            <dl className="space-y-2 text-xs">
              <div className="flex justify-between gap-2">
                <dt className="text-muted-foreground">E-posta</dt>
                <dd className="font-medium text-foreground truncate">{profile.email}</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-muted-foreground">Kayıt Tarihi</dt>
                <dd className="font-medium text-foreground">
                  {new Date(profile.created_at).toLocaleDateString("tr-TR")}
                </dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-muted-foreground">Güncellenme</dt>
                <dd className="font-medium text-foreground">
                  {new Date(profile.updated_at).toLocaleDateString("tr-TR")}
                </dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-muted-foreground">Rol (kaydedilmiş)</dt>
                <dd className="font-medium text-foreground">{ROLE_LABELS[profile.role]}</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-muted-foreground">Onay</dt>
                <dd>
                  {profile.is_approved ? (
                    <span className="flex items-center gap-1 text-green-600">
                      <CheckCircle size={12} /> Onaylı
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-amber-600">
                      <Clock size={12} /> Beklemede
                    </span>
                  )}
                </dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-muted-foreground">Aktif</dt>
                <dd>
                  {profile.is_active ? (
                    <span className="text-green-600">Evet</span>
                  ) : (
                    <span className="text-muted-foreground">Hayır</span>
                  )}
                </dd>
              </div>
            </dl>
          </div>

          {/* Orders */}
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
              <ShoppingCart size={14} />
              Siparişler
              <span className="ml-auto rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                {orders.length}
              </span>
            </h2>
            {orders.length === 0 ? (
              <p className="text-xs text-muted-foreground">Henüz sipariş yok.</p>
            ) : (
              <ul className="space-y-2">
                {orders.map((order) => (
                  <li
                    key={order.id}
                    className="rounded-lg border border-border bg-muted/30 px-3 py-2 text-xs"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-medium text-foreground">
                        #{order.order_number || order.id.slice(0, 8)}
                      </span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                          order.status === "delivered"
                            ? "bg-green-100 text-green-700"
                            : order.status === "cancelled"
                            ? "bg-red-100 text-red-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {ORDER_STATUS_LABELS[order.status] || order.status}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center justify-between text-muted-foreground">
                      <span>{new Date(order.created_at).toLocaleDateString("tr-TR")}</span>
                      <span className="font-medium text-foreground">
                        {order.total_amount?.toLocaleString("tr-TR")} ₺
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Quotes */}
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
              <ClipboardList size={14} />
              Teklif Talepleri
              <span className="ml-auto rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                {quotes.length}
              </span>
            </h2>
            {quotes.length === 0 ? (
              <p className="text-xs text-muted-foreground">Henüz teklif talebi yok.</p>
            ) : (
              <ul className="space-y-2">
                {quotes.map((quote) => (
                  <li
                    key={quote.id}
                    className="rounded-lg border border-border bg-muted/30 px-3 py-2 text-xs"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-medium text-foreground line-clamp-1">
                        {quote.company_name || quote.contact_name}
                      </span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                          quote.status === "accepted"
                            ? "bg-green-100 text-green-700"
                            : quote.status === "rejected"
                            ? "bg-red-100 text-red-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {QUOTE_STATUS_LABELS[quote.status] || quote.status}
                      </span>
                    </div>
                    <div className="mt-1 text-muted-foreground">
                      {new Date(quote.created_at).toLocaleDateString("tr-TR")}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  icon,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  icon?: React.ReactNode;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</label>
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {icon}
          </span>
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full rounded-lg border border-border bg-background py-2 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 ${
            icon ? "pl-8 pr-3" : "px-3"
          }`}
        />
      </div>
    </div>
  );
}
