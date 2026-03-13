"use client";

import { useState } from "react";
import { z } from "zod";
import { useLocale } from "@/contexts/LocaleContext";
import Link from "@/components/ui/LocaleLink";
import {
  Building2,
  User,
  Mail,
  Phone,
  MapPin,
  Package,
  Truck,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  AlertCircle,
  Clock,
  Gift,
  Award,
  CalendarDays,
  StickyNote,
  Hash,
} from "lucide-react";
import { getLocalizedFieldSync } from "@/lib/content";
import type { DbContentSection } from "@/types/database";

/* ------------------------------------------------------------------ */
/*  Category keys matching the 8 product categories                   */
/* ------------------------------------------------------------------ */
const CATEGORY_KEYS = [
  "categoryPetBottles",
  "categoryPlasticBottles",
  "categoryCaps",
  "categoryStoppers",
  "categoryFingerSprays",
  "categoryPumps",
  "categoryTriggerSprayers",
  "categoryFunnels",
] as const;

const CATEGORY_SLUGS: Record<string, string> = {
  categoryPetBottles: "pet-siseler",
  categoryPlasticBottles: "plastik-siseler",
  categoryCaps: "kapaklar",
  categoryStoppers: "tipalar",
  categoryFingerSprays: "parmak-spreyler",
  categoryPumps: "pompalar",
  categoryTriggerSprayers: "tetikli-pusturtuculer",
  categoryFunnels: "huniler",
};

/* ------------------------------------------------------------------ */
/*  Zod schemas for each step                                         */
/* ------------------------------------------------------------------ */
const step1Schema = z.object({
  name: z.string().min(1),
  company: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(7),
  address: z.string().optional(),
});

const step2Schema = z.object({
  products: z.array(z.string()).min(1),
  quantity: z.string().optional(),
  notes: z.string().optional(),
});

const step3Schema = z.object({
  deliveryAddress: z.string().optional(),
  urgency: z.enum(["normal", "urgent", "planned"]),
  preferredDate: z.string().optional(),
});

/* ------------------------------------------------------------------ */
/*  Form state type                                                   */
/* ------------------------------------------------------------------ */
interface FormState {
  name: string;
  company: string;
  email: string;
  phone: string;
  address: string;
  products: string[];
  quantity: string;
  notes: string;
  deliveryAddress: string;
  urgency: "normal" | "urgent" | "planned";
  preferredDate: string;
}

const initialState: FormState = {
  name: "",
  company: "",
  email: "",
  phone: "",
  address: "",
  products: [],
  quantity: "",
  notes: "",
  deliveryAddress: "",
  urgency: "normal",
  preferredDate: "",
};

/* ================================================================== */
/*  Component                                                         */
/* ================================================================== */
interface SampleRequestClientProps {
  content?: Record<string, DbContentSection>;
}

export default function SampleRequestClient({ content }: SampleRequestClientProps) {
  const { locale, dict } = useLocale();
  const t = dict.sampleRequest;

  const heroSection = content?.sample_hero;
  const dbHeroTitle = heroSection
    ? getLocalizedFieldSync(heroSection, "title", locale)
    : "";
  const dbHeroSubtitle = heroSection
    ? getLocalizedFieldSync(heroSection, "subtitle", locale)
    : "";

  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [apiError, setApiError] = useState("");
  const [sameAddress, setSameAddress] = useState(false);

  /* ---- helpers ---- */
  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });
  };

  const toggleProduct = (slug: string) => {
    setForm((prev) => ({
      ...prev,
      products: prev.products.includes(slug)
        ? prev.products.filter((p) => p !== slug)
        : [...prev.products, slug],
    }));
    setErrors((prev) => {
      const copy = { ...prev };
      delete copy.products;
      return copy;
    });
  };

  /* ---- validation ---- */
  function validateStep(s: number): boolean {
    const newErrors: Record<string, string> = {};

    if (s === 1) {
      const result = step1Schema.safeParse(form);
      if (!result.success) {
        for (const issue of result.error.issues) {
          const field = issue.path[0] as string;
          if (field === "email") {
            newErrors[field] = t.invalidEmail;
          } else if (field === "phone") {
            newErrors[field] = t.invalidPhone;
          } else {
            newErrors[field] = t.requiredField;
          }
        }
      }
    }

    if (s === 2) {
      const result = step2Schema.safeParse(form);
      if (!result.success) {
        for (const issue of result.error.issues) {
          const field = issue.path[0] as string;
          if (field === "products") {
            newErrors[field] = t.selectAtLeastOne;
          } else {
            newErrors[field] = t.requiredField;
          }
        }
      }
    }

    if (s === 3) {
      const result = step3Schema.safeParse(form);
      if (!result.success) {
        for (const issue of result.error.issues) {
          newErrors[issue.path[0] as string] = t.requiredField;
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function goNext() {
    if (validateStep(step)) {
      setStep((s) => Math.min(s + 1, 3));
    }
  }

  function goPrev() {
    setStep((s) => Math.max(s - 1, 1));
  }

  /* ---- submit ---- */
  async function handleSubmit() {
    if (!validateStep(3)) return;
    setSubmitting(true);
    setApiError("");

    const payload = {
      ...form,
      deliveryAddress: sameAddress ? form.address : form.deliveryAddress,
    };

    try {
      const res = await fetch("/api/sample-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        if (res.status === 429) {
          setApiError(t.errorRateLimit);
        } else {
          setApiError(data.error || t.errorGeneral);
        }
        setSubmitting(false);
        return;
      }

      setSubmitted(true);
    } catch {
      setApiError(t.errorConnection);
    } finally {
      setSubmitting(false);
    }
  }

  /* ---- success state ---- */
  if (submitted) {
    return (
      <section className="min-h-[80vh] bg-[#FAFAF7] py-16 lg:py-24">
        <div className="mx-auto max-w-lg px-4 text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
            <CheckCircle2 className="h-10 w-10 text-emerald-600" />
          </div>
          <h1 className="mb-3 text-3xl font-bold text-[#0A1628]">
            {t.successTitle}
          </h1>
          <p className="mb-8 text-neutral-600">{t.successMessage}</p>
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-xl bg-[#0A1628] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#0A1628]/90"
            >
              {t.successBack}
            </Link>
            <button
              onClick={() => {
                setForm(initialState);
                setStep(1);
                setSubmitted(false);
                setApiError("");
                setSameAddress(false);
              }}
              className="inline-flex items-center gap-2 rounded-xl border border-[#0A1628]/20 px-6 py-3 text-sm font-semibold text-[#0A1628] transition-colors hover:bg-[#0A1628]/5"
            >
              {t.successNew}
            </button>
          </div>
        </div>
      </section>
    );
  }

  /* ---- step indicator ---- */
  const steps = [
    { num: 1, label: t.step1Title, icon: Building2 },
    { num: 2, label: t.step2Title, icon: Package },
    { num: 3, label: t.step3Title, icon: Truck },
  ];

  return (
    <section className="min-h-[80vh] bg-[#FAFAF7] py-12 lg:py-20">
      <div className="mx-auto max-w-4xl px-4 lg:px-6">
        {/* Hero */}
        <div className="mb-10 text-center">
          <h1 className="mb-3 text-3xl font-extrabold text-[#0A1628] sm:text-4xl lg:text-5xl">
            {dbHeroTitle || t.heroTitle}
          </h1>
          <p className="mx-auto max-w-2xl text-neutral-600">
            {dbHeroSubtitle || t.heroSubtitle}
          </p>
        </div>

        {/* Benefits Row */}
        <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            { icon: Gift, title: t.benefitFreeTitle, desc: t.benefitFreeDesc },
            { icon: Clock, title: t.benefitFastTitle, desc: t.benefitFastDesc },
            { icon: Award, title: t.benefitQualityTitle, desc: t.benefitQualityDesc },
          ].map((b) => (
            <div
              key={b.title}
              className="flex items-start gap-3 rounded-xl border border-[#0A1628]/10 bg-white p-4"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#F59E0B]/10">
                <b.icon className="h-5 w-5 text-[#F59E0B]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#0A1628]">{b.title}</p>
                <p className="text-xs text-neutral-500">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Step Indicator */}
        <div className="mb-8 flex items-center justify-center gap-2">
          {steps.map((s, i) => {
            const StepIcon = s.icon;
            const isActive = step === s.num;
            const isCompleted = step > s.num;

            return (
              <div key={s.num} className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (isCompleted) setStep(s.num);
                  }}
                  className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all ${
                    isActive
                      ? "bg-[#0A1628] text-white shadow-lg"
                      : isCompleted
                        ? "bg-emerald-100 text-emerald-700 cursor-pointer hover:bg-emerald-200"
                        : "bg-neutral-100 text-neutral-400 cursor-default"
                  }`}
                  disabled={!isCompleted && !isActive}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    <StepIcon className="h-4 w-4" />
                  )}
                  <span className="hidden sm:inline">{s.label}</span>
                  <span className="sm:hidden">{s.num}</span>
                </button>
                {i < steps.length - 1 && (
                  <ChevronRight className={`h-4 w-4 ${isCompleted ? "text-emerald-500" : "text-neutral-300"}`} />
                )}
              </div>
            );
          })}
        </div>

        {/* Form Card */}
        <div className="rounded-2xl border border-[#0A1628]/10 bg-white p-6 shadow-sm sm:p-8">
          {/* Step 1: Company Info */}
          {step === 1 && (
            <div className="space-y-5">
              <h2 className="mb-6 text-xl font-bold text-[#0A1628]">
                {t.step1Title}
              </h2>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {/* Name */}
                <div>
                  <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-[#0A1628]">
                    <User className="h-4 w-4 text-neutral-400" />
                    {t.fieldName} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => set("name", e.target.value)}
                    className={`w-full rounded-xl border bg-[#FAFAF7] px-4 py-3 text-sm outline-none transition-colors focus:border-[#F59E0B] focus:ring-2 focus:ring-[#F59E0B]/20 ${
                      errors.name ? "border-red-400" : "border-neutral-200"
                    }`}
                    placeholder={t.fieldName}
                  />
                  {errors.name && (
                    <p className="mt-1 flex items-center gap-1 text-xs text-red-500">
                      <AlertCircle className="h-3 w-3" /> {errors.name}
                    </p>
                  )}
                </div>

                {/* Company */}
                <div>
                  <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-[#0A1628]">
                    <Building2 className="h-4 w-4 text-neutral-400" />
                    {t.fieldCompany} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.company}
                    onChange={(e) => set("company", e.target.value)}
                    className={`w-full rounded-xl border bg-[#FAFAF7] px-4 py-3 text-sm outline-none transition-colors focus:border-[#F59E0B] focus:ring-2 focus:ring-[#F59E0B]/20 ${
                      errors.company ? "border-red-400" : "border-neutral-200"
                    }`}
                    placeholder={t.fieldCompany}
                  />
                  {errors.company && (
                    <p className="mt-1 flex items-center gap-1 text-xs text-red-500">
                      <AlertCircle className="h-3 w-3" /> {errors.company}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-[#0A1628]">
                    <Mail className="h-4 w-4 text-neutral-400" />
                    {t.fieldEmail} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => set("email", e.target.value)}
                    className={`w-full rounded-xl border bg-[#FAFAF7] px-4 py-3 text-sm outline-none transition-colors focus:border-[#F59E0B] focus:ring-2 focus:ring-[#F59E0B]/20 ${
                      errors.email ? "border-red-400" : "border-neutral-200"
                    }`}
                    placeholder={t.fieldEmail}
                  />
                  {errors.email && (
                    <p className="mt-1 flex items-center gap-1 text-xs text-red-500">
                      <AlertCircle className="h-3 w-3" /> {errors.email}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-[#0A1628]">
                    <Phone className="h-4 w-4 text-neutral-400" />
                    {t.fieldPhone} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => set("phone", e.target.value)}
                    className={`w-full rounded-xl border bg-[#FAFAF7] px-4 py-3 text-sm outline-none transition-colors focus:border-[#F59E0B] focus:ring-2 focus:ring-[#F59E0B]/20 ${
                      errors.phone ? "border-red-400" : "border-neutral-200"
                    }`}
                    placeholder={t.fieldPhone}
                  />
                  {errors.phone && (
                    <p className="mt-1 flex items-center gap-1 text-xs text-red-500">
                      <AlertCircle className="h-3 w-3" /> {errors.phone}
                    </p>
                  )}
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-[#0A1628]">
                  <MapPin className="h-4 w-4 text-neutral-400" />
                  {t.fieldAddress}
                </label>
                <textarea
                  value={form.address}
                  onChange={(e) => set("address", e.target.value)}
                  rows={2}
                  className="w-full rounded-xl border border-neutral-200 bg-[#FAFAF7] px-4 py-3 text-sm outline-none transition-colors focus:border-[#F59E0B] focus:ring-2 focus:ring-[#F59E0B]/20"
                  placeholder={t.fieldAddress}
                />
              </div>
            </div>
          )}

          {/* Step 2: Sample Selection */}
          {step === 2 && (
            <div className="space-y-5">
              <h2 className="mb-2 text-xl font-bold text-[#0A1628]">
                {t.step2Title}
              </h2>
              <p className="mb-6 text-sm text-neutral-500">
                {t.fieldCategoriesHint}
              </p>

              {/* Categories multi-select */}
              <div>
                <label className="mb-3 flex items-center gap-1.5 text-sm font-medium text-[#0A1628]">
                  <Package className="h-4 w-4 text-neutral-400" />
                  {t.fieldCategories} <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {CATEGORY_KEYS.map((key) => {
                    const slug = CATEGORY_SLUGS[key];
                    const isSelected = form.products.includes(slug);
                    const label = t[key as keyof typeof t] as string;

                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => toggleProduct(slug)}
                        className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm font-medium transition-all ${
                          isSelected
                            ? "border-[#F59E0B] bg-[#F59E0B]/10 text-[#0A1628] shadow-sm"
                            : "border-neutral-200 bg-[#FAFAF7] text-neutral-600 hover:border-[#F59E0B]/40 hover:bg-[#F59E0B]/5"
                        }`}
                      >
                        <div
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors ${
                            isSelected
                              ? "border-[#F59E0B] bg-[#F59E0B] text-white"
                              : "border-neutral-300 bg-white"
                          }`}
                        >
                          {isSelected && (
                            <CheckCircle2 className="h-3.5 w-3.5" />
                          )}
                        </div>
                        {label}
                      </button>
                    );
                  })}
                </div>
                {errors.products && (
                  <p className="mt-2 flex items-center gap-1 text-xs text-red-500">
                    <AlertCircle className="h-3 w-3" /> {errors.products}
                  </p>
                )}
              </div>

              {/* Quantity */}
              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-[#0A1628]">
                  <Hash className="h-4 w-4 text-neutral-400" />
                  {t.fieldQuantity}
                </label>
                <input
                  type="text"
                  value={form.quantity}
                  onChange={(e) => set("quantity", e.target.value)}
                  className="w-full rounded-xl border border-neutral-200 bg-[#FAFAF7] px-4 py-3 text-sm outline-none transition-colors focus:border-[#F59E0B] focus:ring-2 focus:ring-[#F59E0B]/20"
                  placeholder={t.fieldQuantity}
                />
              </div>

              {/* Notes */}
              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-[#0A1628]">
                  <StickyNote className="h-4 w-4 text-neutral-400" />
                  {t.fieldNotes}
                </label>
                <textarea
                  value={form.notes}
                  onChange={(e) => set("notes", e.target.value)}
                  rows={3}
                  className="w-full rounded-xl border border-neutral-200 bg-[#FAFAF7] px-4 py-3 text-sm outline-none transition-colors focus:border-[#F59E0B] focus:ring-2 focus:ring-[#F59E0B]/20"
                  placeholder={t.fieldNotes}
                />
              </div>
            </div>
          )}

          {/* Step 3: Delivery Info */}
          {step === 3 && (
            <div className="space-y-5">
              <h2 className="mb-6 text-xl font-bold text-[#0A1628]">
                {t.step3Title}
              </h2>

              {/* Delivery Address */}
              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-[#0A1628]">
                  <Truck className="h-4 w-4 text-neutral-400" />
                  {t.fieldDeliveryAddress}
                </label>

                {form.address && (
                  <label className="mb-2 flex cursor-pointer items-center gap-2 text-sm text-neutral-600">
                    <input
                      type="checkbox"
                      checked={sameAddress}
                      onChange={(e) => {
                        setSameAddress(e.target.checked);
                        if (e.target.checked) {
                          set("deliveryAddress", form.address);
                        }
                      }}
                      className="h-4 w-4 rounded border-neutral-300 text-[#F59E0B] accent-[#F59E0B]"
                    />
                    {t.sameAsCompany}
                  </label>
                )}

                <textarea
                  value={sameAddress ? form.address : form.deliveryAddress}
                  onChange={(e) => set("deliveryAddress", e.target.value)}
                  disabled={sameAddress}
                  rows={2}
                  className={`w-full rounded-xl border border-neutral-200 bg-[#FAFAF7] px-4 py-3 text-sm outline-none transition-colors focus:border-[#F59E0B] focus:ring-2 focus:ring-[#F59E0B]/20 ${
                    sameAddress ? "opacity-60" : ""
                  }`}
                  placeholder={t.fieldDeliveryAddress}
                />
              </div>

              {/* Urgency */}
              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-[#0A1628]">
                  <Clock className="h-4 w-4 text-neutral-400" />
                  {t.fieldUrgency}
                </label>
                <div className="flex flex-wrap gap-3">
                  {(["normal", "urgent", "planned"] as const).map((level) => {
                    const labels: Record<string, string> = {
                      normal: t.urgencyNormal,
                      urgent: t.urgencyUrgent,
                      planned: t.urgencyPlanned,
                    };
                    const isSelected = form.urgency === level;
                    return (
                      <button
                        key={level}
                        type="button"
                        onClick={() => set("urgency", level)}
                        className={`rounded-xl border px-5 py-2.5 text-sm font-medium transition-all ${
                          isSelected
                            ? level === "urgent"
                              ? "border-red-400 bg-red-50 text-red-700"
                              : "border-[#F59E0B] bg-[#F59E0B]/10 text-[#0A1628]"
                            : "border-neutral-200 bg-[#FAFAF7] text-neutral-600 hover:border-neutral-300"
                        }`}
                      >
                        {labels[level]}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Preferred Date */}
              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-[#0A1628]">
                  <CalendarDays className="h-4 w-4 text-neutral-400" />
                  {t.fieldPreferredDate}
                </label>
                <input
                  type="date"
                  value={form.preferredDate}
                  onChange={(e) => set("preferredDate", e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full rounded-xl border border-neutral-200 bg-[#FAFAF7] px-4 py-3 text-sm outline-none transition-colors focus:border-[#F59E0B] focus:ring-2 focus:ring-[#F59E0B]/20 sm:max-w-xs"
                />
              </div>

              {/* API Error */}
              {apiError && (
                <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {apiError}
                </div>
              )}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="mt-8 flex items-center justify-between border-t border-neutral-100 pt-6">
            {step > 1 ? (
              <button
                type="button"
                onClick={goPrev}
                className="inline-flex items-center gap-2 rounded-xl border border-[#0A1628]/20 px-5 py-2.5 text-sm font-semibold text-[#0A1628] transition-colors hover:bg-[#0A1628]/5"
              >
                <ChevronLeft className="h-4 w-4" />
                {t.prev}
              </button>
            ) : (
              <div />
            )}

            {step < 3 ? (
              <button
                type="button"
                onClick={goNext}
                className="inline-flex items-center gap-2 rounded-xl bg-[#0A1628] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#0A1628]/90"
              >
                {t.next}
                <ChevronRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="inline-flex items-center gap-2 rounded-xl bg-[#F59E0B] px-6 py-2.5 text-sm font-bold text-[#0A1628] transition-colors hover:bg-[#F59E0B]/90 disabled:opacity-60"
              >
                {submitting ? t.submitting : t.submitButton}
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
