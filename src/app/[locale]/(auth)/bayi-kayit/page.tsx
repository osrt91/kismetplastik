"use client";

import { useState, useMemo } from "react";
import Link from "@/components/ui/LocaleLink";
import {
  ChevronRight,
  Lock,
  Mail,
  Eye,
  EyeOff,
  User,
  Phone,
  Building2,
  FileText,
  MapPin,
  Map,
  ArrowRight,
  Shield,
  CheckCircle2,
  Check,
  X,
  UserPlus,
  Loader2,
} from "lucide-react";
import AnimateOnScroll from "@/components/ui/AnimateOnScroll";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/contexts/LocaleContext";

interface PasswordRequirement {
  key: string;
  label: string;
  test: (pw: string) => boolean;
}

export default function BayiKayitPage() {
  const { dict } = useLocale();
  const d = dict.dealerRegister;
  const nav = dict.nav;

  const [form, setForm] = useState({
    email: "",
    password: "",
    full_name: "",
    phone: "",
    company_name: "",
    tax_number: "",
    tax_office: "",
    company_address: "",
    city: "",
    district: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const passwordRequirements: PasswordRequirement[] = useMemo(
    () => [
      {
        key: "length",
        label: d.pwReqLength,
        test: (pw: string) => pw.length >= 8,
      },
      {
        key: "uppercase",
        label: d.pwReqUppercase,
        test: (pw: string) => /[A-Z]/.test(pw),
      },
      {
        key: "number",
        label: d.pwReqNumber,
        test: (pw: string) => /[0-9]/.test(pw),
      },
    ],
    [d]
  );

  const allPasswordMet = passwordRequirements.every((req) =>
    req.test(form.password)
  );

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!allPasswordMet) {
      setError(d.errorPasswordReqs);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (data.success) {
        setSuccess(true);
      } else {
        setError(data.error || d.errorGeneric);
      }
    } catch {
      setError(d.errorConnection);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <section className="bg-white">
        {/* Hero */}
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
                <span className="text-white">{d.breadcrumb}</span>
              </nav>
              <h1 className="mb-3 text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl">
                {d.heroTitle}
              </h1>
              <p className="max-w-2xl text-lg text-white/70">
                {d.heroSubtitle}
              </p>
            </AnimateOnScroll>
          </div>
        </div>

        {/* Success state */}
        <div className="mx-auto max-w-lg px-4 py-20 lg:px-6">
          <AnimateOnScroll animation="fade-up">
            <div className="rounded-2xl bg-white p-8 text-center shadow-lg">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                <CheckCircle2 size={40} className="text-green-600" />
              </div>
              <h2 className="mb-3 text-2xl font-extrabold text-primary-900">
                {d.successTitle}
              </h2>
              <p className="mb-8 leading-relaxed text-neutral-600">
                {d.successMessage}
              </p>
              <Link
                href="/bayi-girisi"
                className="group inline-flex items-center gap-2 rounded-xl bg-accent-500 px-6 py-3.5 font-bold text-primary-900 shadow-md transition-all duration-300 hover:scale-[1.02] hover:bg-accent-600 hover:shadow-lg active:scale-[0.98]"
              >
                {d.goToLogin}
                <ArrowRight
                  size={16}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
            </div>
          </AnimateOnScroll>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white">
      {/* Hero */}
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
          style={{ animation: "float 8s ease-in-out infinite" }}
        >
          <UserPlus size={100} strokeWidth={0.5} className="text-white" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 lg:px-6">
          <AnimateOnScroll animation="fade-up">
            <nav className="mb-6 flex items-center gap-1.5 text-sm text-white/60">
              <Link href="/" className="transition-colors hover:text-white">
                {nav.home}
              </Link>
              <ChevronRight size={14} />
              <span className="text-white">{d.breadcrumb}</span>
            </nav>
            <h1 className="mb-3 text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl">
              {d.heroTitle}
            </h1>
            <p className="max-w-2xl text-lg text-white/70">
              {d.heroSubtitle}
            </p>
          </AnimateOnScroll>
        </div>
      </div>

      {/* Form */}
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-6 lg:py-20">
        <div className="grid items-start gap-12 lg:grid-cols-5 lg:gap-16">
          {/* Registration Form - takes 3 cols */}
          <AnimateOnScroll animation="fade-right" className="lg:col-span-3">
            <div className="relative mx-auto max-w-2xl lg:mx-0">
              {/* Decorative shapes */}
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
                <div className="rounded-2xl bg-white p-6 shadow-lg sm:p-8">
                  {/* Header */}
                  <div className="mb-8 flex flex-col items-center text-center">
                    <div
                      className="relative mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-700 to-primary-900 shadow-lg"
                      style={{
                        animation: "pulse-glow 3s ease-in-out infinite",
                      }}
                    >
                      <UserPlus size={36} className="text-white" />
                      <div className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-accent-500 shadow-md">
                        <Shield size={12} className="text-primary-900" />
                      </div>
                    </div>
                    <h2 className="text-xl font-bold text-primary-900">
                      {d.formTitle}
                    </h2>
                    <p className="mt-1 text-sm text-neutral-500">
                      {d.formSubtitle}
                    </p>
                  </div>

                  {/* Error message */}
                  {error && (
                    <div
                      className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
                      style={{
                        animation:
                          "slide-down-fade 0.4s cubic-bezier(0.16,1,0.3,1) forwards",
                      }}
                    >
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Section: Personal info */}
                    <div>
                      <h3 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-primary-900">
                        <User size={16} className="text-accent-500" />
                        {d.sectionPersonal}
                      </h3>
                      <div className="grid gap-4 sm:grid-cols-2">
                        {/* Full name */}
                        <div className="sm:col-span-2">
                          <Label
                            htmlFor="full_name"
                            className="mb-1.5 text-neutral-700"
                          >
                            {d.fieldFullName}{" "}
                            <span className="text-red-500">*</span>
                          </Label>
                          <div className="group relative">
                            <User
                              size={18}
                              className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 transition-colors duration-300 group-focus-within:text-primary-500"
                            />
                            <Input
                              id="full_name"
                              type="text"
                              value={form.full_name}
                              onChange={(e) =>
                                updateField("full_name", e.target.value)
                              }
                              required
                              className="h-11 pl-10"
                              placeholder={d.placeholderFullName}
                            />
                          </div>
                        </div>

                        {/* Email */}
                        <div>
                          <Label
                            htmlFor="email"
                            className="mb-1.5 text-neutral-700"
                          >
                            {d.fieldEmail}{" "}
                            <span className="text-red-500">*</span>
                          </Label>
                          <div className="group relative">
                            <Mail
                              size={18}
                              className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 transition-colors duration-300 group-focus-within:text-primary-500"
                            />
                            <Input
                              id="email"
                              type="email"
                              value={form.email}
                              onChange={(e) =>
                                updateField("email", e.target.value)
                              }
                              required
                              className="h-11 pl-10"
                              placeholder={d.placeholderEmail}
                            />
                          </div>
                        </div>

                        {/* Phone */}
                        <div>
                          <Label
                            htmlFor="phone"
                            className="mb-1.5 text-neutral-700"
                          >
                            {d.fieldPhone}
                          </Label>
                          <div className="group relative">
                            <Phone
                              size={18}
                              className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 transition-colors duration-300 group-focus-within:text-primary-500"
                            />
                            <Input
                              id="phone"
                              type="tel"
                              value={form.phone}
                              onChange={(e) =>
                                updateField("phone", e.target.value)
                              }
                              className="h-11 pl-10"
                              placeholder={d.placeholderPhone}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Section: Password */}
                    <div>
                      <Label
                        htmlFor="password"
                        className="mb-1.5 text-neutral-700"
                      >
                        {d.fieldPassword}{" "}
                        <span className="text-red-500">*</span>
                      </Label>
                      <div className="group relative">
                        <Lock
                          size={18}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 transition-colors duration-300 group-focus-within:text-primary-500"
                        />
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          value={form.password}
                          onChange={(e) =>
                            updateField("password", e.target.value)
                          }
                          required
                          className="h-11 pl-10 pr-12"
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-neutral-400 transition-all duration-300 hover:text-neutral-600"
                          aria-label={
                            showPassword ? d.hidePassword : d.showPassword
                          }
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

                      {/* Password requirements */}
                      <div className="mt-3 space-y-1.5">
                        {passwordRequirements.map((req) => {
                          const met = req.test(form.password);
                          const active = form.password.length > 0;
                          return (
                            <div
                              key={req.key}
                              className={`flex items-center gap-2 text-xs transition-colors duration-200 ${
                                active
                                  ? met
                                    ? "text-green-600"
                                    : "text-red-500"
                                  : "text-neutral-400"
                              }`}
                            >
                              {active && met ? (
                                <Check size={14} className="shrink-0" />
                              ) : active && !met ? (
                                <X size={14} className="shrink-0" />
                              ) : (
                                <div className="h-3.5 w-3.5 shrink-0 rounded-full border border-neutral-300" />
                              )}
                              {req.label}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Section: Company info */}
                    <div>
                      <h3 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-primary-900">
                        <Building2 size={16} className="text-accent-500" />
                        {d.sectionCompany}
                      </h3>
                      <div className="grid gap-4 sm:grid-cols-2">
                        {/* Company name */}
                        <div className="sm:col-span-2">
                          <Label
                            htmlFor="company_name"
                            className="mb-1.5 text-neutral-700"
                          >
                            {d.fieldCompanyName}{" "}
                            <span className="text-red-500">*</span>
                          </Label>
                          <div className="group relative">
                            <Building2
                              size={18}
                              className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 transition-colors duration-300 group-focus-within:text-primary-500"
                            />
                            <Input
                              id="company_name"
                              type="text"
                              value={form.company_name}
                              onChange={(e) =>
                                updateField("company_name", e.target.value)
                              }
                              required
                              className="h-11 pl-10"
                              placeholder={d.placeholderCompanyName}
                            />
                          </div>
                        </div>

                        {/* Tax number */}
                        <div>
                          <Label
                            htmlFor="tax_number"
                            className="mb-1.5 text-neutral-700"
                          >
                            {d.fieldTaxNumber}
                          </Label>
                          <div className="group relative">
                            <FileText
                              size={18}
                              className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 transition-colors duration-300 group-focus-within:text-primary-500"
                            />
                            <Input
                              id="tax_number"
                              type="text"
                              value={form.tax_number}
                              onChange={(e) =>
                                updateField("tax_number", e.target.value)
                              }
                              className="h-11 pl-10"
                              placeholder={d.placeholderTaxNumber}
                            />
                          </div>
                        </div>

                        {/* Tax office */}
                        <div>
                          <Label
                            htmlFor="tax_office"
                            className="mb-1.5 text-neutral-700"
                          >
                            {d.fieldTaxOffice}
                          </Label>
                          <div className="group relative">
                            <FileText
                              size={18}
                              className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 transition-colors duration-300 group-focus-within:text-primary-500"
                            />
                            <Input
                              id="tax_office"
                              type="text"
                              value={form.tax_office}
                              onChange={(e) =>
                                updateField("tax_office", e.target.value)
                              }
                              className="h-11 pl-10"
                              placeholder={d.placeholderTaxOffice}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Section: Address */}
                    <div>
                      <h3 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-primary-900">
                        <MapPin size={16} className="text-accent-500" />
                        {d.sectionAddress}
                      </h3>
                      <div className="grid gap-4 sm:grid-cols-2">
                        {/* Company address */}
                        <div className="sm:col-span-2">
                          <Label
                            htmlFor="company_address"
                            className="mb-1.5 text-neutral-700"
                          >
                            {d.fieldCompanyAddress}
                          </Label>
                          <div className="group relative">
                            <MapPin
                              size={18}
                              className="absolute left-3 top-3 text-neutral-400 transition-colors duration-300 group-focus-within:text-primary-500"
                            />
                            <textarea
                              id="company_address"
                              value={form.company_address}
                              onChange={(e) =>
                                updateField("company_address", e.target.value)
                              }
                              rows={3}
                              className="w-full min-w-0 rounded-md border border-input bg-transparent py-2.5 pl-10 pr-3 text-base shadow-xs transition-[color,box-shadow] outline-none placeholder:text-muted-foreground focus-visible:border-navy-700 focus-visible:ring-navy-700/20 focus-visible:ring-[3px] md:text-sm"
                              placeholder={d.placeholderCompanyAddress}
                            />
                          </div>
                        </div>

                        {/* City */}
                        <div>
                          <Label
                            htmlFor="city"
                            className="mb-1.5 text-neutral-700"
                          >
                            {d.fieldCity}
                          </Label>
                          <div className="group relative">
                            <Map
                              size={18}
                              className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 transition-colors duration-300 group-focus-within:text-primary-500"
                            />
                            <Input
                              id="city"
                              type="text"
                              value={form.city}
                              onChange={(e) =>
                                updateField("city", e.target.value)
                              }
                              className="h-11 pl-10"
                              placeholder={d.placeholderCity}
                            />
                          </div>
                        </div>

                        {/* District */}
                        <div>
                          <Label
                            htmlFor="district"
                            className="mb-1.5 text-neutral-700"
                          >
                            {d.fieldDistrict}
                          </Label>
                          <div className="group relative">
                            <Map
                              size={18}
                              className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 transition-colors duration-300 group-focus-within:text-primary-500"
                            />
                            <Input
                              id="district"
                              type="text"
                              value={form.district}
                              onChange={(e) =>
                                updateField("district", e.target.value)
                              }
                              className="h-11 pl-10"
                              placeholder={d.placeholderDistrict}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Required fields note */}
                    <p className="text-xs text-neutral-400">
                      <span className="text-red-500">*</span>{" "}
                      {d.requiredFieldsNote}
                    </p>

                    {/* Submit */}
                    <Button
                      type="submit"
                      disabled={loading}
                      size="lg"
                      className="w-full rounded-xl py-3.5 text-base font-bold shadow-md transition-all duration-300 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] disabled:hover:scale-100"
                    >
                      {loading ? (
                        <Loader2 size={20} className="animate-spin" />
                      ) : (
                        <ArrowRight
                          size={16}
                          className="transition-transform duration-300 group-hover:translate-x-1"
                        />
                      )}
                      {loading ? d.submitting : d.submitButton}
                    </Button>
                  </form>

                  {/* Link to login */}
                  <div className="mt-6 border-t border-neutral-100 pt-6 text-center">
                    <p className="text-sm text-neutral-500">
                      {d.alreadyDealer}{" "}
                      <Link
                        href="/bayi-girisi"
                        className="font-semibold text-primary-700 transition-colors hover:text-primary-900"
                      >
                        {d.loginLink}
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </AnimateOnScroll>

          {/* Right side - Info panel */}
          <AnimateOnScroll animation="fade-left" className="lg:col-span-2">
            <div>
              <span className="mb-3 inline-block text-sm font-bold uppercase tracking-widest text-accent-500">
                {d.infoOverline}
              </span>
              <h2 className="mb-6 text-2xl font-extrabold text-primary-900 sm:text-3xl">
                {d.infoTitle}
              </h2>
              <p className="mb-8 leading-relaxed text-neutral-600">
                {d.infoDesc}
              </p>

              {/* Steps */}
              <div className="relative space-y-4">
                <div className="absolute bottom-8 left-[2.4rem] top-8 w-px bg-gradient-to-b from-primary-200 via-accent-300 to-primary-200 opacity-50" />

                {[
                  {
                    icon: FileText,
                    title: d.step1Title,
                    desc: d.step1Desc,
                  },
                  {
                    icon: Shield,
                    title: d.step2Title,
                    desc: d.step2Desc,
                  },
                  {
                    icon: CheckCircle2,
                    title: d.step3Title,
                    desc: d.step3Desc,
                  },
                ].map((step, i) => (
                  <div
                    key={step.title}
                    className="group relative flex items-start gap-4 rounded-xl border border-neutral-100 bg-neutral-50 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary-200 hover:bg-white hover:shadow-md"
                  >
                    <div className="absolute left-0 top-0 h-full w-1 rounded-l-xl bg-accent-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                    <div className="relative shrink-0">
                      <span className="absolute -left-1 -top-2 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-accent-500 text-[10px] font-bold text-primary-900 shadow-sm transition-transform duration-300 group-hover:scale-110">
                        {i + 1}
                      </span>
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100 text-primary-700 transition-all duration-300 group-hover:bg-primary-700 group-hover:text-white group-hover:shadow-lg">
                        <step.icon size={20} />
                      </div>
                    </div>

                    <div>
                      <h3 className="font-bold text-primary-900 transition-colors duration-300 group-hover:text-primary-700">
                        {step.title}
                      </h3>
                      <p className="text-sm text-neutral-500 transition-colors duration-300 group-hover:text-neutral-600">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <Link
                  href="/iletisim"
                  className="group inline-flex items-center gap-2 font-semibold text-primary-700 transition-colors hover:text-accent-600"
                >
                  {d.contactLink}
                  <ArrowRight
                    size={16}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </Link>
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  );
}
