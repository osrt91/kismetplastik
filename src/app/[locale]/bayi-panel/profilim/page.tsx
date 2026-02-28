"use client";

import { useState, useEffect } from "react";
import {
  User,
  Building2,
  MapPin,
  Phone,
  Mail,
  Shield,
  Save,
  Key,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import { getSupabaseBrowser } from "@/lib/supabase-browser";

interface Profile {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  company_name: string;
  tax_number: string;
  tax_office: string;
  company_address: string;
  city: string;
  district: string;
  role: string;
  is_approved: boolean;
  created_at: string;
}

const labels: Record<string, Record<string, string>> = {
  tr: {
    title: "Profilim",
    personalInfo: "Kişisel Bilgiler",
    companyInfo: "Firma Bilgileri",
    accountStatus: "Hesap Durumu",
    changePassword: "Şifre Değiştir",
    fullName: "Ad Soyad",
    email: "E-posta",
    phone: "Telefon",
    companyName: "Firma Adı",
    taxNumber: "Vergi Numarası",
    taxOffice: "Vergi Dairesi",
    companyAddress: "Firma Adresi",
    city: "İl",
    district: "İlçe",
    role: "Rol",
    approved: "Onay Durumu",
    approvedYes: "Onaylandı",
    approvedNo: "Onay Bekliyor",
    memberSince: "Üyelik Tarihi",
    newPassword: "Yeni Şifre",
    confirmPassword: "Şifre Tekrar",
    save: "Kaydet",
    updatePassword: "Şifreyi Güncelle",
    saving: "Kaydediliyor...",
    profileUpdated: "Profil başarıyla güncellendi.",
    passwordUpdated: "Şifre başarıyla güncellendi.",
    passwordMismatch: "Şifreler eşleşmiyor.",
    passwordTooShort: "Şifre en az 6 karakter olmalıdır.",
    errorOccurred: "Bir hata oluştu. Lütfen tekrar deneyin.",
    loading: "Yükleniyor...",
    dealer: "Bayi",
    admin: "Yönetici",
  },
  en: {
    title: "My Profile",
    personalInfo: "Personal Information",
    companyInfo: "Company Information",
    accountStatus: "Account Status",
    changePassword: "Change Password",
    fullName: "Full Name",
    email: "Email",
    phone: "Phone",
    companyName: "Company Name",
    taxNumber: "Tax Number",
    taxOffice: "Tax Office",
    companyAddress: "Company Address",
    city: "City",
    district: "District",
    role: "Role",
    approved: "Approval Status",
    approvedYes: "Approved",
    approvedNo: "Pending Approval",
    memberSince: "Member Since",
    newPassword: "New Password",
    confirmPassword: "Confirm Password",
    save: "Save",
    updatePassword: "Update Password",
    saving: "Saving...",
    profileUpdated: "Profile updated successfully.",
    passwordUpdated: "Password updated successfully.",
    passwordMismatch: "Passwords do not match.",
    passwordTooShort: "Password must be at least 6 characters.",
    errorOccurred: "An error occurred. Please try again.",
    loading: "Loading...",
    dealer: "Dealer",
    admin: "Admin",
  },
};

export default function ProfilimPage() {
  const { locale } = useLocale();
  const t = labels[locale] || labels.tr;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const [profile, setProfile] = useState<Profile>({
    id: "",
    full_name: "",
    email: "",
    phone: "",
    company_name: "",
    tax_number: "",
    tax_office: "",
    company_address: "",
    city: "",
    district: "",
    role: "",
    is_approved: false,
    created_at: "",
  });

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    async function loadProfile() {
      try {
        const supabase = getSupabaseBrowser();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          const { data } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single();

          if (data) {
            setProfile({
              id: data.id ?? "",
              full_name: data.full_name ?? "",
              email: user.email ?? "",
              phone: data.phone ?? "",
              company_name: data.company_name ?? "",
              tax_number: data.tax_number ?? "",
              tax_office: data.tax_office ?? "",
              company_address: data.company_address ?? "",
              city: data.city ?? "",
              district: data.district ?? "",
              role: data.role ?? "",
              is_approved: data.is_approved ?? false,
              created_at: data.created_at ?? "",
            });
          }
        }
      } catch {
        showToast("error", t.errorOccurred);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [t.errorOccurred]);

  function showToast(type: "success" | "error", message: string) {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  }

  function handleChange(field: keyof Profile, value: string) {
    setProfile((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSaveProfile() {
    setSaving(true);
    try {
      const supabase = getSupabaseBrowser();
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: profile.full_name,
          phone: profile.phone,
          company_name: profile.company_name,
          tax_number: profile.tax_number,
          tax_office: profile.tax_office,
          company_address: profile.company_address,
          city: profile.city,
          district: profile.district,
        })
        .eq("id", profile.id);

      if (error) throw error;
      showToast("success", t.profileUpdated);
    } catch {
      showToast("error", t.errorOccurred);
    } finally {
      setSaving(false);
    }
  }

  async function handleChangePassword() {
    if (newPassword.length < 6) {
      showToast("error", t.passwordTooShort);
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast("error", t.passwordMismatch);
      return;
    }

    setSavingPassword(true);
    try {
      const supabase = getSupabaseBrowser();
      const { error } = await supabase.auth.updateUser({ password: newPassword });

      if (error) throw error;
      showToast("success", t.passwordUpdated);
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      showToast("error", t.errorOccurred);
    } finally {
      setSavingPassword(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 size={32} className="animate-spin text-primary-700" />
        <span className="ml-3 text-neutral-500">{t.loading}</span>
      </div>
    );
  }

  const inputClass =
    "w-full rounded-lg border border-neutral-200 bg-white px-4 py-2.5 text-sm text-neutral-900 outline-none transition-colors focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 disabled:bg-neutral-50 disabled:text-neutral-400";

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h2 className="text-2xl font-bold text-primary-900">{t.title}</h2>

      {toast && (
        <div
          className={`flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium ${
            toast.type === "success"
              ? "border-green-200 bg-green-50 text-green-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {toast.type === "success" ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          {toast.message}
        </div>
      )}

      <div className="rounded-xl border border-neutral-200 bg-white">
        {/* Personal Info */}
        <div className="p-6">
          <div className="mb-5 flex items-center gap-2 text-primary-900">
            <User size={20} />
            <h3 className="text-lg font-bold">{t.personalInfo}</h3>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-neutral-500">
                {t.fullName}
              </label>
              <input
                type="text"
                className={inputClass}
                value={profile.full_name}
                onChange={(e) => handleChange("full_name", e.target.value)}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-neutral-500">
                <Mail size={12} className="mr-1 inline" />
                {t.email}
              </label>
              <input type="email" className={inputClass} value={profile.email} disabled />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-neutral-500">
                <Phone size={12} className="mr-1 inline" />
                {t.phone}
              </label>
              <input
                type="tel"
                className={inputClass}
                value={profile.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="border-t border-neutral-100" />

        {/* Company Info */}
        <div className="p-6">
          <div className="mb-5 flex items-center gap-2 text-primary-900">
            <Building2 size={20} />
            <h3 className="text-lg font-bold">{t.companyInfo}</h3>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-semibold text-neutral-500">
                {t.companyName}
              </label>
              <input
                type="text"
                className={inputClass}
                value={profile.company_name}
                onChange={(e) => handleChange("company_name", e.target.value)}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-neutral-500">
                {t.taxNumber}
              </label>
              <input
                type="text"
                className={inputClass}
                value={profile.tax_number}
                onChange={(e) => handleChange("tax_number", e.target.value)}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-neutral-500">
                {t.taxOffice}
              </label>
              <input
                type="text"
                className={inputClass}
                value={profile.tax_office}
                onChange={(e) => handleChange("tax_office", e.target.value)}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-semibold text-neutral-500">
                <MapPin size={12} className="mr-1 inline" />
                {t.companyAddress}
              </label>
              <input
                type="text"
                className={inputClass}
                value={profile.company_address}
                onChange={(e) => handleChange("company_address", e.target.value)}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-neutral-500">
                {t.city}
              </label>
              <input
                type="text"
                className={inputClass}
                value={profile.city}
                onChange={(e) => handleChange("city", e.target.value)}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-neutral-500">
                {t.district}
              </label>
              <input
                type="text"
                className={inputClass}
                value={profile.district}
                onChange={(e) => handleChange("district", e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="border-t border-neutral-100" />

        {/* Account Status */}
        <div className="p-6">
          <div className="mb-5 flex items-center gap-2 text-primary-900">
            <Shield size={20} />
            <h3 className="text-lg font-bold">{t.accountStatus}</h3>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-800">
              <Shield size={13} />
              {profile.role === "admin" ? t.admin : t.dealer}
            </span>
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                profile.is_approved
                  ? "bg-green-50 text-green-700"
                  : "bg-amber-50 text-amber-700"
              }`}
            >
              {profile.is_approved ? <CheckCircle size={13} /> : <AlertCircle size={13} />}
              {profile.is_approved ? t.approvedYes : t.approvedNo}
            </span>
            {profile.created_at && (
              <span className="text-xs text-neutral-400">
                {t.memberSince}:{" "}
                {new Date(profile.created_at).toLocaleDateString(
                  locale === "tr" ? "tr-TR" : "en-US",
                  { year: "numeric", month: "long", day: "numeric" }
                )}
              </span>
            )}
          </div>
        </div>

        <div className="border-t border-neutral-100" />

        {/* Save Button */}
        <div className="flex justify-end p-6">
          <button
            onClick={handleSaveProfile}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl bg-accent-500 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-600 disabled:opacity-60"
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {saving ? t.saving : t.save}
          </button>
        </div>
      </div>

      {/* Change Password */}
      <div className="rounded-xl border border-neutral-200 bg-white p-6">
        <div className="mb-5 flex items-center gap-2 text-primary-900">
          <Key size={20} />
          <h3 className="text-lg font-bold">{t.changePassword}</h3>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-neutral-500">
              {t.newPassword}
            </label>
            <input
              type="password"
              className={inputClass}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-neutral-500">
              {t.confirmPassword}
            </label>
            <input
              type="password"
              className={inputClass}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
        </div>
        <div className="mt-5 flex justify-end">
          <button
            onClick={handleChangePassword}
            disabled={savingPassword || !newPassword}
            className="inline-flex items-center gap-2 rounded-xl bg-accent-500 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-600 disabled:opacity-60"
          >
            {savingPassword ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Key size={16} />
            )}
            {savingPassword ? t.saving : t.updatePassword}
          </button>
        </div>
      </div>
    </div>
  );
}
