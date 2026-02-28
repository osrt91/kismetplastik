"use client";

import { useState } from "react";
import Link from "@/components/ui/LocaleLink";
import {
  ChevronRight,
  User,
  Building2,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Mail,
  Lock,
  Phone,
  MapPin,
  FileCheck,
  Loader2,
  Shield,
  Eye,
  EyeOff,
} from "lucide-react";
import AnimateOnScroll from "@/components/ui/AnimateOnScroll";
import { useLocale } from "@/contexts/LocaleContext";

const labels = {
  tr: {
    pageTitle: "Bayi Kayıt",
    heroTitle: "Bayilik Başvurusu",
    heroSubtitle:
      "Kısmet Plastik bayi ağına katılın, özel fiyatlandırma ve ayrıcalıklı hizmetlerden yararlanın.",
    step1: "Kişisel Bilgiler",
    step2: "Firma Bilgileri",
    step3: "Onay & Gönder",
    fullName: "Ad Soyad",
    email: "E-posta Adresi",
    password: "Şifre",
    confirmPassword: "Şifre Tekrar",
    phone: "Telefon",
    companyName: "Firma Adı",
    taxNumber: "Vergi Numarası",
    taxOffice: "Vergi Dairesi",
    companyAddress: "Firma Adresi",
    city: "İl",
    district: "İlçe",
    reviewTitle: "Başvuru Özeti",
    personalInfo: "Kişisel Bilgiler",
    companyInfo: "Firma Bilgileri",
    termsLabel: "Bayi sözleşmesi şartlarını okudum ve kabul ediyorum.",
    next: "Devam Et",
    back: "Geri",
    submit: "Başvuruyu Gönder",
    submitting: "Gönderiliyor...",
    successTitle: "Başvurunuz Alındı!",
    successMessage:
      "Bayilik başvurunuz başarıyla alınmıştır. Ekibimiz en kısa sürede sizinle iletişime geçecektir.",
    backToHome: "Ana Sayfaya Dön",
    goToLogin: "Bayi Girişi",
    alreadyDealer: "Zaten bayimiz misiniz?",
    loginLink: "Giriş yapın",
    errorGeneral: "Bir hata oluştu. Lütfen tekrar deneyin.",
    errorConnection: "Bağlantı hatası. Lütfen tekrar deneyin.",
    validationRequired: "Bu alan zorunludur.",
    validationEmail: "Geçerli bir e-posta adresi girin.",
    validationPasswordMin: "Şifre en az 8 karakter olmalıdır.",
    validationPasswordMatch: "Şifreler eşleşmiyor.",
    fullNamePlaceholder: "Adınız Soyadınız",
    emailPlaceholder: "ornek@firma.com",
    passwordPlaceholder: "En az 8 karakter",
    confirmPasswordPlaceholder: "Şifrenizi tekrar girin",
    phonePlaceholder: "05XX XXX XX XX",
    companyNamePlaceholder: "Firma ünvanı",
    taxNumberPlaceholder: "Vergi numaranız",
    taxOfficePlaceholder: "Vergi dairesi adı",
    companyAddressPlaceholder: "Açık adres",
    cityPlaceholder: "İl seçin",
    districtPlaceholder: "İlçe seçin",
  },
  en: {
    pageTitle: "Dealer Registration",
    heroTitle: "Dealer Application",
    heroSubtitle:
      "Join the Kısmet Plastik dealer network and benefit from exclusive pricing and premium services.",
    step1: "Personal Info",
    step2: "Company Info",
    step3: "Review & Submit",
    fullName: "Full Name",
    email: "Email Address",
    password: "Password",
    confirmPassword: "Confirm Password",
    phone: "Phone",
    companyName: "Company Name",
    taxNumber: "Tax Number",
    taxOffice: "Tax Office",
    companyAddress: "Company Address",
    city: "City",
    district: "District",
    reviewTitle: "Application Summary",
    personalInfo: "Personal Information",
    companyInfo: "Company Information",
    termsLabel:
      "I have read and accept the dealer agreement terms and conditions.",
    next: "Continue",
    back: "Back",
    submit: "Submit Application",
    submitting: "Submitting...",
    successTitle: "Application Received!",
    successMessage:
      "Your dealer application has been successfully received. Our team will contact you shortly.",
    backToHome: "Back to Home",
    goToLogin: "Dealer Login",
    alreadyDealer: "Already a dealer?",
    loginLink: "Sign in",
    errorGeneral: "An error occurred. Please try again.",
    errorConnection: "Connection error. Please try again.",
    validationRequired: "This field is required.",
    validationEmail: "Enter a valid email address.",
    validationPasswordMin: "Password must be at least 8 characters.",
    validationPasswordMatch: "Passwords do not match.",
    fullNamePlaceholder: "Your full name",
    emailPlaceholder: "example@company.com",
    passwordPlaceholder: "At least 8 characters",
    confirmPasswordPlaceholder: "Re-enter your password",
    phonePlaceholder: "+90 5XX XXX XX XX",
    companyNamePlaceholder: "Company title",
    taxNumberPlaceholder: "Your tax number",
    taxOfficePlaceholder: "Tax office name",
    companyAddressPlaceholder: "Full address",
    cityPlaceholder: "Select city",
    districtPlaceholder: "Select district",
  },
};

const stepIcons = [User, Building2, FileCheck];

export default function BayiKayitPage() {
  const { locale, dict } = useLocale();
  const nav = dict.nav;
  const t = labels[locale];

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    confirm_password: "",
    phone: "",
    company_name: "",
    tax_number: "",
    tax_office: "",
    company_address: "",
    city: "",
    district: "",
  });

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setFieldErrors((fe) => ({ ...fe, [key]: "" }));
  };

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validateStep1 = () => {
    const errs: Record<string, string> = {};
    if (!form.full_name.trim()) errs.full_name = t.validationRequired;
    if (!form.email.trim()) errs.email = t.validationRequired;
    else if (!emailRegex.test(form.email)) errs.email = t.validationEmail;
    if (!form.password) errs.password = t.validationRequired;
    else if (form.password.length < 8) errs.password = t.validationPasswordMin;
    if (!form.confirm_password) errs.confirm_password = t.validationRequired;
    else if (form.password !== form.confirm_password)
      errs.confirm_password = t.validationPasswordMatch;
    if (!form.phone.trim()) errs.phone = t.validationRequired;
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep2 = () => {
    const errs: Record<string, string> = {};
    if (!form.company_name.trim()) errs.company_name = t.validationRequired;
    if (!form.tax_number.trim()) errs.tax_number = t.validationRequired;
    if (!form.tax_office.trim()) errs.tax_office = t.validationRequired;
    if (!form.company_address.trim()) errs.company_address = t.validationRequired;
    if (!form.city.trim()) errs.city = t.validationRequired;
    if (!form.district.trim()) errs.district = t.validationRequired;
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const goNext = () => {
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    setStep((s) => Math.min(s + 1, 3));
  };

  const goBack = () => {
    setFieldErrors({});
    setStep((s) => Math.max(s - 1, 1));
  };

  const handleSubmit = async () => {
    if (!termsAccepted) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: form.full_name,
          email: form.email,
          password: form.password,
          phone: form.phone,
          company_name: form.company_name,
          tax_number: form.tax_number,
          tax_office: form.tax_office,
          company_address: form.company_address,
          city: form.city,
          district: form.district,
        }),
      });
      const data = await res.json();

      if (data.success) {
        setSuccess(true);
      } else {
        setError(data.error || t.errorGeneral);
      }
    } catch {
      setError(t.errorConnection);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (field: string) =>
    `w-full rounded-xl border ${
      fieldErrors[field] ? "border-red-400" : "border-neutral-200"
    } py-3 pl-11 pr-4 text-sm outline-none transition-all duration-300 focus:border-primary-500 focus:scale-[1.01] focus:shadow-[0_0_0_4px_rgba(46,106,175,0.1)]`;

  const stepLabels = [t.step1, t.step2, t.step3];

  if (success) {
    return (
      <section className="bg-white">
        <div
          className="relative overflow-hidden bg-gradient-to-br from-primary-900 via-primary-700 to-primary-900 py-16 lg:py-24"
          style={{
            backgroundSize: "200% 200%",
            animation: "gradient-shift 8s ease infinite",
          }}
        >
          <div className="pointer-events-none absolute inset-0 flex items-center justify-end overflow-hidden opacity-[0.03]">
            <Shield
              size={420}
              strokeWidth={0.5}
              className="translate-x-1/4 text-white"
              style={{ animation: "float 6s ease-in-out infinite" }}
            />
          </div>
          <div className="relative z-10 mx-auto max-w-7xl px-4 lg:px-6">
            <AnimateOnScroll animation="fade-up">
              <nav className="mb-6 flex items-center gap-1.5 text-sm text-white/60">
                <Link href="/" className="transition-colors hover:text-white">
                  {nav.home}
                </Link>
                <ChevronRight size={14} />
                <span className="text-white">{t.pageTitle}</span>
              </nav>
              <h1 className="mb-3 text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl">
                {t.heroTitle}
              </h1>
              <p className="max-w-2xl text-lg text-white/70">
                {t.heroSubtitle}
              </p>
            </AnimateOnScroll>
          </div>
        </div>

        <div className="mx-auto max-w-xl px-4 py-20 text-center">
          <AnimateOnScroll animation="zoom-in">
            <div className="mb-6 inline-flex h-24 w-24 items-center justify-center rounded-full bg-green-100">
              <CheckCircle
                size={48}
                className="text-green-600"
                style={{ animation: "pulse-glow 2s ease-in-out infinite" }}
              />
            </div>
            <h2 className="mb-3 text-2xl font-extrabold text-primary-900">
              {t.successTitle}
            </h2>
            <p className="mb-8 text-neutral-600">{t.successMessage}</p>
            <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-xl bg-primary-700 px-6 py-3 font-bold text-white transition-all duration-300 hover:bg-primary-800"
              >
                {t.backToHome}
              </Link>
              <Link
                href="/bayi-girisi"
                className="inline-flex items-center gap-2 rounded-xl border border-primary-200 px-6 py-3 font-bold text-primary-700 transition-all duration-300 hover:bg-primary-50"
              >
                {t.goToLogin}
                <ArrowRight size={16} />
              </Link>
            </div>
          </AnimateOnScroll>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white">
      <div
        className="relative overflow-hidden bg-gradient-to-br from-primary-900 via-primary-700 to-primary-900 py-16 lg:py-24"
        style={{
          backgroundSize: "200% 200%",
          animation: "gradient-shift 8s ease infinite",
        }}
      >
        <div className="pointer-events-none absolute inset-0 flex items-center justify-end overflow-hidden opacity-[0.03]">
          <Shield
            size={420}
            strokeWidth={0.5}
            className="translate-x-1/4 text-white"
            style={{ animation: "float 6s ease-in-out infinite" }}
          />
        </div>
        <div
          className="pointer-events-none absolute left-8 top-12 opacity-[0.04]"
          style={{ animation: "particle-float 8s ease-in-out infinite" }}
        >
          <User size={100} strokeWidth={0.5} className="text-white" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 lg:px-6">
          <AnimateOnScroll animation="fade-up">
            <nav className="mb-6 flex items-center gap-1.5 text-sm text-white/60">
              <Link href="/" className="transition-colors hover:text-white">
                {nav.home}
              </Link>
              <ChevronRight size={14} />
              <span className="text-white">{t.pageTitle}</span>
            </nav>
            <h1 className="mb-3 text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl">
              {t.heroTitle}
            </h1>
            <p className="max-w-2xl text-lg text-white/70">
              {t.heroSubtitle}
            </p>
          </AnimateOnScroll>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-4 py-12 lg:py-20">
        <AnimateOnScroll animation="fade-up">
          <div className="mb-10 flex items-center justify-between">
            {stepLabels.map((label, i) => {
              const Icon = stepIcons[i];
              const stepNum = i + 1;
              const isActive = step === stepNum;
              const isComplete = step > stepNum;
              return (
                <div key={label} className="flex flex-1 items-center">
                  <div className="flex flex-col items-center gap-1.5">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                        isComplete
                          ? "border-green-500 bg-green-500 text-white"
                          : isActive
                            ? "border-primary-600 bg-primary-600 text-white shadow-lg"
                            : "border-neutral-200 bg-white text-neutral-400"
                      }`}
                    >
                      {isComplete ? (
                        <CheckCircle size={18} />
                      ) : (
                        <Icon size={18} />
                      )}
                    </div>
                    <span
                      className={`hidden text-xs font-semibold sm:block ${
                        isActive
                          ? "text-primary-700"
                          : isComplete
                            ? "text-green-600"
                            : "text-neutral-400"
                      }`}
                    >
                      {label}
                    </span>
                  </div>
                  {i < 2 && (
                    <div
                      className={`mx-2 h-0.5 flex-1 rounded-full transition-all duration-500 ${
                        isComplete ? "bg-green-400" : "bg-neutral-200"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </AnimateOnScroll>

        <AnimateOnScroll animation="fade-up" delay={100}>
          <div className="relative">
            <div
              className="pointer-events-none absolute -left-8 -top-8 hidden h-24 w-24 rounded-2xl border-2 border-primary-100/60 lg:block"
              style={{
                animation: "float 5s ease-in-out infinite",
                transform: "rotate(12deg)",
              }}
            />
            <div
              className="pointer-events-none absolute -bottom-6 -right-6 hidden h-16 w-16 rounded-full border-2 border-accent-300/40 lg:block"
              style={{ animation: "float 7s ease-in-out infinite 1s" }}
            />

            <div className="animated-border-gradient rounded-2xl">
              <div className="rounded-2xl bg-white p-8 shadow-lg">
                {error && (
                  <div
                    className="mb-6 rounded-xl border border-red-300 bg-red-50 p-4 text-sm text-red-600"
                    style={{
                      animation:
                        "slide-down-fade 0.4s cubic-bezier(0.16,1,0.3,1) forwards",
                    }}
                  >
                    {error}
                  </div>
                )}

                {step === 1 && (
                  <div className="space-y-5">
                    <div className="mb-6 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-100 text-primary-700">
                        <User size={20} />
                      </div>
                      <h2 className="text-lg font-bold text-primary-900">
                        {t.step1}
                      </h2>
                    </div>

                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                        {t.fullName}
                      </label>
                      <div className="group relative">
                        <User
                          size={18}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 transition-colors duration-300 group-focus-within:text-primary-500"
                        />
                        <input
                          type="text"
                          value={form.full_name}
                          onChange={set("full_name")}
                          className={inputClass("full_name")}
                          placeholder={t.fullNamePlaceholder}
                        />
                      </div>
                      {fieldErrors.full_name && (
                        <p className="mt-1 text-xs text-red-500">
                          {fieldErrors.full_name}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                        {t.email}
                      </label>
                      <div className="group relative">
                        <Mail
                          size={18}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 transition-colors duration-300 group-focus-within:text-primary-500"
                        />
                        <input
                          type="email"
                          value={form.email}
                          onChange={set("email")}
                          className={inputClass("email")}
                          placeholder={t.emailPlaceholder}
                        />
                      </div>
                      {fieldErrors.email && (
                        <p className="mt-1 text-xs text-red-500">
                          {fieldErrors.email}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                        {t.password}
                      </label>
                      <div className="group relative">
                        <Lock
                          size={18}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 transition-colors duration-300 group-focus-within:text-primary-500"
                        />
                        <input
                          type={showPassword ? "text" : "password"}
                          value={form.password}
                          onChange={set("password")}
                          className={`${inputClass("password")} !pr-12`}
                          placeholder={t.passwordPlaceholder}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 transition-all duration-300 hover:scale-110 hover:text-neutral-600 active:scale-95"
                        >
                          <span className="relative block h-[18px] w-[18px]">
                            <Eye
                              size={18}
                              className={`absolute inset-0 transition-all duration-300 ${
                                showPassword
                                  ? "rotate-90 scale-0 opacity-0"
                                  : "rotate-0 scale-100 opacity-100"
                              }`}
                            />
                            <EyeOff
                              size={18}
                              className={`absolute inset-0 transition-all duration-300 ${
                                showPassword
                                  ? "rotate-0 scale-100 opacity-100"
                                  : "-rotate-90 scale-0 opacity-0"
                              }`}
                            />
                          </span>
                        </button>
                      </div>
                      {fieldErrors.password && (
                        <p className="mt-1 text-xs text-red-500">
                          {fieldErrors.password}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                        {t.confirmPassword}
                      </label>
                      <div className="group relative">
                        <Lock
                          size={18}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 transition-colors duration-300 group-focus-within:text-primary-500"
                        />
                        <input
                          type={showConfirm ? "text" : "password"}
                          value={form.confirm_password}
                          onChange={set("confirm_password")}
                          className={`${inputClass("confirm_password")} !pr-12`}
                          placeholder={t.confirmPasswordPlaceholder}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirm(!showConfirm)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 transition-all duration-300 hover:scale-110 hover:text-neutral-600 active:scale-95"
                        >
                          <span className="relative block h-[18px] w-[18px]">
                            <Eye
                              size={18}
                              className={`absolute inset-0 transition-all duration-300 ${
                                showConfirm
                                  ? "rotate-90 scale-0 opacity-0"
                                  : "rotate-0 scale-100 opacity-100"
                              }`}
                            />
                            <EyeOff
                              size={18}
                              className={`absolute inset-0 transition-all duration-300 ${
                                showConfirm
                                  ? "rotate-0 scale-100 opacity-100"
                                  : "-rotate-90 scale-0 opacity-0"
                              }`}
                            />
                          </span>
                        </button>
                      </div>
                      {fieldErrors.confirm_password && (
                        <p className="mt-1 text-xs text-red-500">
                          {fieldErrors.confirm_password}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                        {t.phone}
                      </label>
                      <div className="group relative">
                        <Phone
                          size={18}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 transition-colors duration-300 group-focus-within:text-primary-500"
                        />
                        <input
                          type="tel"
                          value={form.phone}
                          onChange={set("phone")}
                          className={inputClass("phone")}
                          placeholder={t.phonePlaceholder}
                        />
                      </div>
                      {fieldErrors.phone && (
                        <p className="mt-1 text-xs text-red-500">
                          {fieldErrors.phone}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-5">
                    <div className="mb-6 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-100 text-primary-700">
                        <Building2 size={20} />
                      </div>
                      <h2 className="text-lg font-bold text-primary-900">
                        {t.step2}
                      </h2>
                    </div>

                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                        {t.companyName}
                      </label>
                      <div className="group relative">
                        <Building2
                          size={18}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 transition-colors duration-300 group-focus-within:text-primary-500"
                        />
                        <input
                          type="text"
                          value={form.company_name}
                          onChange={set("company_name")}
                          className={inputClass("company_name")}
                          placeholder={t.companyNamePlaceholder}
                        />
                      </div>
                      {fieldErrors.company_name && (
                        <p className="mt-1 text-xs text-red-500">
                          {fieldErrors.company_name}
                        </p>
                      )}
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                          {t.taxNumber}
                        </label>
                        <div className="group relative">
                          <FileCheck
                            size={18}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 transition-colors duration-300 group-focus-within:text-primary-500"
                          />
                          <input
                            type="text"
                            value={form.tax_number}
                            onChange={set("tax_number")}
                            className={inputClass("tax_number")}
                            placeholder={t.taxNumberPlaceholder}
                          />
                        </div>
                        {fieldErrors.tax_number && (
                          <p className="mt-1 text-xs text-red-500">
                            {fieldErrors.tax_number}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                          {t.taxOffice}
                        </label>
                        <div className="group relative">
                          <FileCheck
                            size={18}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 transition-colors duration-300 group-focus-within:text-primary-500"
                          />
                          <input
                            type="text"
                            value={form.tax_office}
                            onChange={set("tax_office")}
                            className={inputClass("tax_office")}
                            placeholder={t.taxOfficePlaceholder}
                          />
                        </div>
                        {fieldErrors.tax_office && (
                          <p className="mt-1 text-xs text-red-500">
                            {fieldErrors.tax_office}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                        {t.companyAddress}
                      </label>
                      <div className="group relative">
                        <MapPin
                          size={18}
                          className="absolute left-4 top-3.5 text-neutral-400 transition-colors duration-300 group-focus-within:text-primary-500"
                        />
                        <textarea
                          value={form.company_address}
                          onChange={set("company_address")}
                          rows={2}
                          className={`${inputClass("company_address")} resize-none`}
                          placeholder={t.companyAddressPlaceholder}
                        />
                      </div>
                      {fieldErrors.company_address && (
                        <p className="mt-1 text-xs text-red-500">
                          {fieldErrors.company_address}
                        </p>
                      )}
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                          {t.city}
                        </label>
                        <div className="group relative">
                          <MapPin
                            size={18}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 transition-colors duration-300 group-focus-within:text-primary-500"
                          />
                          <input
                            type="text"
                            value={form.city}
                            onChange={set("city")}
                            className={inputClass("city")}
                            placeholder={t.cityPlaceholder}
                          />
                        </div>
                        {fieldErrors.city && (
                          <p className="mt-1 text-xs text-red-500">
                            {fieldErrors.city}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                          {t.district}
                        </label>
                        <div className="group relative">
                          <MapPin
                            size={18}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 transition-colors duration-300 group-focus-within:text-primary-500"
                          />
                          <input
                            type="text"
                            value={form.district}
                            onChange={set("district")}
                            className={inputClass("district")}
                            placeholder={t.districtPlaceholder}
                          />
                        </div>
                        {fieldErrors.district && (
                          <p className="mt-1 text-xs text-red-500">
                            {fieldErrors.district}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-6">
                    <div className="mb-6 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-100 text-primary-700">
                        <FileCheck size={20} />
                      </div>
                      <h2 className="text-lg font-bold text-primary-900">
                        {t.reviewTitle}
                      </h2>
                    </div>

                    <div className="rounded-xl border border-neutral-100 bg-neutral-50 p-5">
                      <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-primary-800">
                        <User size={16} />
                        {t.personalInfo}
                      </h3>
                      <dl className="grid gap-2 text-sm sm:grid-cols-2">
                        <div>
                          <dt className="text-neutral-500">{t.fullName}</dt>
                          <dd className="font-medium text-neutral-800">
                            {form.full_name}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-neutral-500">{t.email}</dt>
                          <dd className="font-medium text-neutral-800">
                            {form.email}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-neutral-500">{t.phone}</dt>
                          <dd className="font-medium text-neutral-800">
                            {form.phone}
                          </dd>
                        </div>
                      </dl>
                    </div>

                    <div className="rounded-xl border border-neutral-100 bg-neutral-50 p-5">
                      <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-primary-800">
                        <Building2 size={16} />
                        {t.companyInfo}
                      </h3>
                      <dl className="grid gap-2 text-sm sm:grid-cols-2">
                        <div>
                          <dt className="text-neutral-500">{t.companyName}</dt>
                          <dd className="font-medium text-neutral-800">
                            {form.company_name}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-neutral-500">{t.taxNumber}</dt>
                          <dd className="font-medium text-neutral-800">
                            {form.tax_number}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-neutral-500">{t.taxOffice}</dt>
                          <dd className="font-medium text-neutral-800">
                            {form.tax_office}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-neutral-500">{t.city}</dt>
                          <dd className="font-medium text-neutral-800">
                            {form.city} / {form.district}
                          </dd>
                        </div>
                        <div className="sm:col-span-2">
                          <dt className="text-neutral-500">
                            {t.companyAddress}
                          </dt>
                          <dd className="font-medium text-neutral-800">
                            {form.company_address}
                          </dd>
                        </div>
                      </dl>
                    </div>

                    <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-neutral-200 p-4 transition-colors hover:bg-neutral-50">
                      <input
                        type="checkbox"
                        checked={termsAccepted}
                        onChange={(e) => setTermsAccepted(e.target.checked)}
                        className="mt-0.5 rounded border-neutral-300"
                      />
                      <span className="text-sm text-neutral-600">
                        {t.termsLabel}
                      </span>
                    </label>
                  </div>
                )}

                <div className="mt-8 flex items-center justify-between gap-4">
                  {step > 1 ? (
                    <button
                      type="button"
                      onClick={goBack}
                      className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 px-5 py-3 text-sm font-semibold text-neutral-700 transition-all duration-300 hover:bg-neutral-50"
                    >
                      <ArrowLeft size={16} />
                      {t.back}
                    </button>
                  ) : (
                    <div />
                  )}

                  {step < 3 ? (
                    <button
                      type="button"
                      onClick={goNext}
                      className="group inline-flex items-center gap-2 rounded-xl bg-accent-500 px-6 py-3 font-bold text-primary-900 shadow-md transition-all duration-300 hover:scale-[1.02] hover:bg-accent-600 hover:shadow-lg active:scale-[0.98]"
                    >
                      {t.next}
                      <ArrowRight
                        size={16}
                        className="transition-transform duration-300 group-hover:translate-x-1"
                      />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={loading || !termsAccepted}
                      className="group inline-flex items-center gap-2 rounded-xl bg-accent-500 px-6 py-3 font-bold text-primary-900 shadow-md transition-all duration-300 hover:scale-[1.02] hover:bg-accent-600 hover:shadow-lg active:scale-[0.98] disabled:opacity-60 disabled:hover:scale-100"
                    >
                      {loading ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          {t.submitting}
                        </>
                      ) : (
                        <>
                          <CheckCircle size={16} />
                          {t.submit}
                        </>
                      )}
                    </button>
                  )}
                </div>

                <div className="mt-6 border-t border-neutral-100 pt-6 text-center">
                  <p className="text-sm text-neutral-500">
                    {t.alreadyDealer}{" "}
                    <Link
                      href="/bayi-girisi"
                      className="font-semibold text-primary-700 transition-colors hover:text-primary-900"
                    >
                      {t.loginLink}
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
