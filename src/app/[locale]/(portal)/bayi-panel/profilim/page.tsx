"use client";

import { useState, useEffect } from "react";
import {
  User,
  Building2,
  Phone,
  Mail,
  MapPin,
  FileText,
  Save,
  Loader2,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import { usePortalLocale } from "@/hooks/usePortalLocale";
import { supabaseBrowser } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

interface ProfileForm {
  full_name: string;
  email: string;
  phone: string;
  company_name: string;
  tax_number: string;
  tax_office: string;
  company_address: string;
  city: string;
  district: string;
}

export default function ProfilimPage() {
  const { locale, dict: portalDict } = usePortalLocale();
  const t = portalDict.profile;

  const [form, setForm] = useState<ProfileForm>({
    full_name: "",
    email: "",
    phone: "",
    company_name: "",
    tax_number: "",
    tax_office: "",
    company_address: "",
    city: "",
    district: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [role, setRole] = useState<string>("");
  const [isApproved, setIsApproved] = useState(false);
  const [memberSince, setMemberSince] = useState<string>("");

  useEffect(() => {
    async function loadProfile() {
      try {
        const supabase = supabaseBrowser();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) return;

        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (profile) {
          setForm({
            full_name: profile.full_name || "",
            email: profile.email || user.email || "",
            phone: profile.phone || "",
            company_name: profile.company_name || "",
            tax_number: profile.tax_number || "",
            tax_office: profile.tax_office || "",
            company_address: profile.company_address || "",
            city: profile.city || "",
            district: profile.district || "",
          });
          setRole(profile.role || "");
          setIsApproved(profile.is_approved ?? false);
          setMemberSince(profile.created_at || "");
        }
      } catch (err) {
        console.error("Failed to load profile:", err);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  const handleChange = (field: keyof ProfileForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setSuccessMsg(null);
    setErrorMsg(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    try {
      const supabase = supabaseBrowser();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setErrorMsg(t.saveError);
        return;
      }

      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: form.full_name,
          phone: form.phone || null,
          company_name: form.company_name || null,
          tax_number: form.tax_number || null,
          tax_office: form.tax_office || null,
          company_address: form.company_address || null,
          city: form.city || null,
          district: form.district || null,
        })
        .eq("id", user.id);

      if (error) {
        console.error("Profile update error:", error);
        setErrorMsg(t.saveError);
      } else {
        setSuccessMsg(t.saveSuccess);
      }
    } catch (err) {
      console.error("Profile save error:", err);
      setErrorMsg(t.saveError);
    } finally {
      setSaving(false);
    }
  };

  const roleLabel = role === "dealer" ? t.dealer : role === "admin" ? t.admin : t.customer;

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex items-center gap-3 text-neutral-500 dark:text-neutral-400">
          <span className="h-6 w-6 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
          {t.loading}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-900/10 text-primary-900 dark:bg-white/10 dark:text-white">
          <User size={22} />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold text-[#0A1628] dark:text-white">
            {t.title}
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            {t.subtitle}
          </p>
        </div>
      </div>

      {/* Account info badges */}
      <div className="flex flex-wrap gap-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-1.5 text-sm dark:border-neutral-700 dark:bg-neutral-800">
          <span className="text-neutral-500 dark:text-neutral-400">{t.role}:</span>
          <span className="font-medium text-[#0A1628] dark:text-white">{roleLabel}</span>
        </div>

        <div
          className={cn(
            "inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm",
            isApproved
              ? "border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-900/20"
              : "border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/20"
          )}
        >
          {isApproved ? (
            <CheckCircle size={14} className="text-emerald-600 dark:text-emerald-400" />
          ) : (
            <AlertTriangle size={14} className="text-amber-600 dark:text-amber-400" />
          )}
          <span
            className={cn(
              "font-medium",
              isApproved
                ? "text-emerald-700 dark:text-emerald-400"
                : "text-amber-700 dark:text-amber-400"
            )}
          >
            {isApproved ? t.approved : t.pendingApproval}
          </span>
        </div>

        {memberSince && (
          <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-1.5 text-sm dark:border-neutral-700 dark:bg-neutral-800">
            <span className="text-neutral-500 dark:text-neutral-400">{t.memberSince}:</span>
            <span className="font-medium text-[#0A1628] dark:text-white">
              {new Date(memberSince).toLocaleDateString(
                locale === "tr" ? "tr-TR" : "en-US",
                { year: "numeric", month: "long", day: "numeric" }
              )}
            </span>
          </div>
        )}
      </div>

      {/* Success / Error messages */}
      {successMsg && (
        <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400">
          <CheckCircle size={16} className="shrink-0" />
          {successMsg}
        </div>
      )}

      {errorMsg && (
        <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
          <AlertTriangle size={16} className="shrink-0" />
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information */}
        <div className="rounded-xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-700 dark:bg-neutral-800">
          <div className="flex items-center gap-2 border-b border-neutral-100 px-6 py-4 dark:border-neutral-700">
            <User size={16} className="text-neutral-400" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-400">
              {t.personalInfo}
            </h2>
          </div>
          <div className="grid gap-5 p-6 sm:grid-cols-2">
            {/* Full Name */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-neutral-500 dark:text-neutral-400">
                {t.fullName}
              </label>
              <div className="relative">
                <User
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
                />
                <input
                  type="text"
                  value={form.full_name}
                  onChange={(e) => handleChange("full_name", e.target.value)}
                  required
                  className="w-full rounded-lg border border-neutral-200 bg-white py-2.5 pl-10 pr-4 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 dark:border-neutral-600 dark:bg-neutral-700 dark:text-white dark:placeholder:text-neutral-500"
                />
              </div>
            </div>

            {/* Email (read-only) */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-neutral-500 dark:text-neutral-400">
                {t.email}
              </label>
              <div className="relative">
                <Mail
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
                />
                <input
                  type="email"
                  value={form.email}
                  readOnly
                  className="w-full cursor-not-allowed rounded-lg border border-neutral-200 bg-neutral-50 py-2.5 pl-10 pr-4 text-sm text-neutral-500 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-400"
                />
              </div>
              <p className="mt-1 text-xs text-neutral-400 dark:text-neutral-500">
                {t.emailHint}
              </p>
            </div>

            {/* Phone */}
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-medium text-neutral-500 dark:text-neutral-400">
                {t.phone}
              </label>
              <div className="relative">
                <Phone
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
                />
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  placeholder={t.phonePlaceholder}
                  className="w-full rounded-lg border border-neutral-200 bg-white py-2.5 pl-10 pr-4 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 dark:border-neutral-600 dark:bg-neutral-700 dark:text-white dark:placeholder:text-neutral-500 sm:max-w-md"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Company Information */}
        <div className="rounded-xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-700 dark:bg-neutral-800">
          <div className="flex items-center gap-2 border-b border-neutral-100 px-6 py-4 dark:border-neutral-700">
            <Building2 size={16} className="text-neutral-400" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-400">
              {t.companyInfo}
            </h2>
          </div>
          <div className="grid gap-5 p-6 sm:grid-cols-2">
            {/* Company Name */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-neutral-500 dark:text-neutral-400">
                {t.companyName}
              </label>
              <div className="relative">
                <Building2
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
                />
                <input
                  type="text"
                  value={form.company_name}
                  onChange={(e) => handleChange("company_name", e.target.value)}
                  className="w-full rounded-lg border border-neutral-200 bg-white py-2.5 pl-10 pr-4 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 dark:border-neutral-600 dark:bg-neutral-700 dark:text-white dark:placeholder:text-neutral-500"
                />
              </div>
            </div>

            {/* Tax Number */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-neutral-500 dark:text-neutral-400">
                {t.taxNumber}
              </label>
              <div className="relative">
                <FileText
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
                />
                <input
                  type="text"
                  value={form.tax_number}
                  onChange={(e) => handleChange("tax_number", e.target.value)}
                  className="w-full rounded-lg border border-neutral-200 bg-white py-2.5 pl-10 pr-4 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 dark:border-neutral-600 dark:bg-neutral-700 dark:text-white dark:placeholder:text-neutral-500"
                />
              </div>
            </div>

            {/* Tax Office */}
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-medium text-neutral-500 dark:text-neutral-400">
                {t.taxOffice}
              </label>
              <input
                type="text"
                value={form.tax_office}
                onChange={(e) => handleChange("tax_office", e.target.value)}
                className="w-full rounded-lg border border-neutral-200 bg-white py-2.5 px-4 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 dark:border-neutral-600 dark:bg-neutral-700 dark:text-white dark:placeholder:text-neutral-500 sm:max-w-md"
              />
            </div>
          </div>
        </div>

        {/* Address Information */}
        <div className="rounded-xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-700 dark:bg-neutral-800">
          <div className="flex items-center gap-2 border-b border-neutral-100 px-6 py-4 dark:border-neutral-700">
            <MapPin size={16} className="text-neutral-400" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-400">
              {t.addressInfo}
            </h2>
          </div>
          <div className="grid gap-5 p-6 sm:grid-cols-2">
            {/* City */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-neutral-500 dark:text-neutral-400">
                {t.city}
              </label>
              <input
                type="text"
                value={form.city}
                onChange={(e) => handleChange("city", e.target.value)}
                placeholder={t.cityPlaceholder}
                className="w-full rounded-lg border border-neutral-200 bg-white py-2.5 px-4 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 dark:border-neutral-600 dark:bg-neutral-700 dark:text-white dark:placeholder:text-neutral-500"
              />
            </div>

            {/* District */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-neutral-500 dark:text-neutral-400">
                {t.district}
              </label>
              <input
                type="text"
                value={form.district}
                onChange={(e) => handleChange("district", e.target.value)}
                placeholder={t.districtPlaceholder}
                className="w-full rounded-lg border border-neutral-200 bg-white py-2.5 px-4 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 dark:border-neutral-600 dark:bg-neutral-700 dark:text-white dark:placeholder:text-neutral-500"
              />
            </div>

            {/* Company Address */}
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-medium text-neutral-500 dark:text-neutral-400">
                {t.companyAddress}
              </label>
              <textarea
                value={form.company_address}
                onChange={(e) => handleChange("company_address", e.target.value)}
                rows={3}
                className="w-full rounded-lg border border-neutral-200 bg-white py-2.5 px-4 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 dark:border-neutral-600 dark:bg-neutral-700 dark:text-white dark:placeholder:text-neutral-500"
              />
            </div>
          </div>
        </div>

        {/* Save button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-6 py-3 text-sm font-semibold text-[#0A1628] shadow-sm transition-all hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Save size={16} />
            )}
            {saving ? t.saving : t.save}
          </button>
        </div>
      </form>
    </div>
  );
}
