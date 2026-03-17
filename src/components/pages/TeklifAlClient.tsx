"use client";

import { useState, useEffect } from "react";
import Link from "@/components/ui/LocaleLink";
import {
  FileText,
  Send,
  Building2,
  Package,
  ChevronRight,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Hash,
  CheckCircle,
  Clock,
  Headphones,
  Shield,
  Truck,
  MessageSquare,
  Search,
} from "lucide-react";
import AnimateOnScroll from "@/components/ui/AnimateOnScroll";
import { Input } from "@/components/ui/input";
import type { Category } from "@/types/product";
import { useLocale } from "@/contexts/LocaleContext";
import { getLocalizedFieldSync } from "@/lib/content";
import type { DbContentSection } from "@/types/database";

interface TeklifAlClientProps {
  content?: Record<string, DbContentSection>;
  settings?: Record<string, string>;
}

const iconWrap =
  "pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 transition-colors duration-200 peer-focus:text-amber-500";

const inputClass =
  "peer h-12 w-full rounded-xl border border-neutral-200 bg-white pl-11 pr-4 text-sm outline-none transition-all duration-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 focus:shadow-[0_0_0_4px_rgba(245,158,11,0.08)] dark:border-neutral-700 dark:bg-neutral-800/80 dark:text-neutral-100 dark:placeholder:text-neutral-500 dark:focus:border-amber-500 dark:focus:ring-amber-500/20";

const labelClass =
  "mb-1.5 block text-sm font-semibold text-[#0A1628] dark:text-neutral-200";

const benefitIcons = [Clock, Headphones, Shield, Truck];

/* Category icon mapping */
const categoryIcons: Record<string, typeof Package> = {
  "pet-siseler": Package,
  "plastik-siseler": Package,
  kapaklar: Package,
  tipalar: Package,
  "parmak-spreyler": Package,
  pompalar: Package,
  "tetikli-pusturtuculer": Package,
  huniler: Package,
};

export default function TeklifAlClient({ content, settings }: TeklifAlClientProps) {
  const { dict, locale } = useLocale();
  const q = dict.quote;
  const nav = dict.nav;

  // Fetch categories from API instead of static import
  const [categories, setCategories] = useState<Category[]>([]);
  useEffect(() => {
    let cancelled = false;
    fetch((process.env.NEXT_PUBLIC_BASE_PATH || "") + "/api/products/categories")
      .then((res) => res.json())
      .then((json) => {
        if (!cancelled && json.success && json.data) {
          setCategories(json.data);
        }
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  /* Helper: read from DB content with dict fallback */
  const t = (sectionKey: string, field: string, fallback: string): string => {
    const section = content?.[sectionKey];
    if (section) {
      const val = getLocalizedFieldSync(section, field, locale);
      if (val) return val;
    }
    return fallback;
  };

  const [formState, setFormState] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    address: "",
    category: "",
    productInterest: "",
    quantity: "",
    deliveryDate: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch((process.env.NEXT_PUBLIC_BASE_PATH || "") + "/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formState),
      });
      const data = await res.json();

      if (data.success) {
        setSubmitted(true);
        setFormState({
          name: "", email: "", phone: "", company: "", address: "",
          category: "", productInterest: "", quantity: "", deliveryDate: "", message: "",
        });
      } else {
        setError(data.error || q.errorGeneral);
      }
    } catch {
      setError(q.errorConnection);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormState((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const phoneValue = settings?.company_phone || "0212 549 87 03";
  const phoneHref = `tel:${(settings?.company_phone || "+902125498703").replace(/\s/g, "")}`;

  /* Build benefits from DB content or use dict defaults */
  const benefits = [
    {
      title: t("quote_benefit_1", "title", q.benefitFastTitle),
      desc: t("quote_benefit_1", "subtitle", q.benefitFastDesc),
    },
    {
      title: t("quote_benefit_2", "title", q.benefitConsultTitle),
      desc: t("quote_benefit_2", "subtitle", q.benefitConsultDesc),
    },
    {
      title: t("quote_benefit_3", "title", q.benefitQualityTitle),
      desc: t("quote_benefit_3", "subtitle", q.benefitQualityDesc),
    },
    {
      title: t("quote_benefit_4", "title", q.benefitDeliveryTitle),
      desc: t("quote_benefit_4", "subtitle", q.benefitDeliveryDesc),
    },
  ];

  return (
    <section className="min-h-screen bg-[#FAFAF7] dark:bg-neutral-950">
      {/* Hero Banner - Navy */}
      <div className="relative overflow-hidden bg-[#0A1628] py-16 lg:py-24">
        {/* Subtle grid pattern */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        {/* Amber accent line at bottom */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent" />
        {/* Decorative icon */}
        <FileText
          size={280}
          strokeWidth={0.4}
          className="pointer-events-none absolute -right-10 top-1/2 -translate-y-1/2 text-white/[0.03] lg:right-16"
        />

        <div className="relative mx-auto max-w-7xl px-4 lg:px-6">
          <AnimateOnScroll animation="fade-up">
            <nav className="mb-8 flex items-center gap-1.5 text-sm text-white/50">
              <Link href="/" className="transition-colors hover:text-amber-400">{nav.home}</Link>
              <ChevronRight size={14} />
              <span className="font-medium text-amber-400">{nav.quote}</span>
            </nav>

            <div className="max-w-2xl">
              <h1 className="mb-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
                {t("quote_hero", "title", q.heroTitle)}
              </h1>
              <p className="text-lg leading-relaxed text-neutral-400">
                {t("quote_hero", "subtitle", q.heroSubtitle)}
              </p>
            </div>

            {/* Steps Pipeline */}
            <div className="mt-10 flex flex-wrap items-center gap-3 sm:gap-4">
              {[q.step1, q.step2, q.step3].map((label, i) => (
                <div key={i} className="flex items-center gap-3 sm:gap-4">
                  <div
                    className={`flex items-center gap-2.5 rounded-full px-5 py-2.5 text-sm font-semibold transition-all ${
                      i === 0
                        ? "bg-amber-500 text-[#0A1628] shadow-lg shadow-amber-500/25"
                        : "border border-white/10 bg-white/5 text-white/50"
                    }`}
                  >
                    <span
                      className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                        i === 0
                          ? "bg-[#0A1628] text-amber-400"
                          : "bg-white/10 text-white/60"
                      }`}
                    >
                      {i + 1}
                    </span>
                    <span className="hidden sm:inline">{label}</span>
                  </div>
                  {i < 2 && (
                    <div className="flex items-center gap-1">
                      <span className="h-px w-3 bg-white/20 sm:w-6" />
                      <ChevronRight size={14} className="text-white/20" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </AnimateOnScroll>
        </div>
      </div>

      {/* Form Content */}
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-6 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-[1fr_340px]">
          {/* Main Form */}
          <AnimateOnScroll animation="fade-up">
            <div className="space-y-6">
              {/* Form Header Card */}
              <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 lg:p-8">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400">
                    <FileText size={26} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-[#0A1628] dark:text-white">{q.formTitle}</h2>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">{q.formHint}</p>
                  </div>
                </div>
              </div>

              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/50 dark:text-red-400">
                  {error}
                </div>
              )}

              {submitted ? (
                <div
                  className="relative overflow-hidden rounded-2xl border border-emerald-200 bg-emerald-50 p-12 text-center dark:border-emerald-800 dark:bg-emerald-950/30"
                  style={{ animation: "scale-in 0.4s ease-out" }}
                >
                  <div className="relative z-10">
                    <div
                      className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-emerald-100 shadow-lg shadow-emerald-500/20 dark:bg-emerald-500/20"
                      style={{ animation: "scale-in 0.5s ease-out 0.1s both" }}
                    >
                      <CheckCircle
                        size={48}
                        className="text-emerald-600 dark:text-emerald-400"
                        style={{ animation: "scale-in 0.4s ease-out 0.3s both" }}
                      />
                    </div>
                    <p className="mb-2 text-xl font-bold text-emerald-800 dark:text-emerald-300">
                      {q.successTitle}
                    </p>
                    <p className="text-sm text-emerald-700 dark:text-emerald-400">{q.successMessage}</p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Section 1: Company / Contact */}
                  <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 lg:p-8">
                    <h3 className="mb-6 flex items-center gap-3 text-sm font-bold uppercase tracking-wider text-[#0A1628] dark:text-neutral-200">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0A1628] text-xs font-bold text-amber-400 dark:bg-amber-500/10">
                        1
                      </span>
                      {q.sectionCompany}
                    </h3>
                    <div className="space-y-5">
                      <div className="grid gap-5 sm:grid-cols-2">
                        <div>
                          <label className={labelClass}>
                            {q.fieldName} <span className="text-amber-500">*</span>
                          </label>
                          <div className="relative">
                            <Input
                              type="text"
                              name="name"
                              value={formState.name}
                              onChange={handleChange}
                              required
                              className={inputClass}
                            />
                            <User size={16} className={iconWrap} />
                          </div>
                        </div>
                        <div>
                          <label className={labelClass}>
                            {q.fieldCompany} <span className="text-amber-500">*</span>
                          </label>
                          <div className="relative">
                            <Input
                              type="text"
                              name="company"
                              value={formState.company}
                              onChange={handleChange}
                              required
                              className={inputClass}
                            />
                            <Building2 size={16} className={iconWrap} />
                          </div>
                        </div>
                      </div>
                      <div className="grid gap-5 sm:grid-cols-2">
                        <div>
                          <label className={labelClass}>
                            {q.fieldEmail} <span className="text-amber-500">*</span>
                          </label>
                          <div className="relative">
                            <Input
                              type="email"
                              name="email"
                              value={formState.email}
                              onChange={handleChange}
                              required
                              className={inputClass}
                            />
                            <Mail size={16} className={iconWrap} />
                          </div>
                        </div>
                        <div>
                          <label className={labelClass}>
                            {q.fieldPhone} <span className="text-amber-500">*</span>
                          </label>
                          <div className="relative">
                            <Input
                              type="tel"
                              name="phone"
                              value={formState.phone}
                              onChange={handleChange}
                              required
                              className={inputClass}
                            />
                            <Phone size={16} className={iconWrap} />
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className={labelClass}>
                          {q.fieldAddress}
                        </label>
                        <div className="relative">
                          <Input
                            type="text"
                            name="address"
                            value={formState.address}
                            onChange={handleChange}
                            className={inputClass}
                          />
                          <MapPin size={16} className={iconWrap} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Section 2: Product Request */}
                  <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 lg:p-8">
                    <h3 className="mb-6 flex items-center gap-3 text-sm font-bold uppercase tracking-wider text-[#0A1628] dark:text-neutral-200">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0A1628] text-xs font-bold text-amber-400 dark:bg-amber-500/10">
                        2
                      </span>
                      {q.sectionProduct}
                    </h3>
                    <div className="space-y-5">
                      {/* Category Selection - Card Grid */}
                      <div>
                        <label className={labelClass}>
                          {q.fieldCategory} <span className="text-amber-500">*</span>
                        </label>
                        <div className="mt-2 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
                          {categories.map((cat) => {
                            const isSelected = formState.category === cat.slug;
                            const CatIcon = categoryIcons[cat.slug] || Package;
                            return (
                              <button
                                key={cat.slug}
                                type="button"
                                onClick={() =>
                                  setFormState((prev) => ({
                                    ...prev,
                                    category: prev.category === cat.slug ? "" : cat.slug,
                                  }))
                                }
                                className={`group relative flex flex-col items-center gap-2 rounded-xl border-2 px-3 py-4 text-center text-xs font-medium transition-all duration-200 ${
                                  isSelected
                                    ? "border-amber-400 bg-amber-50 text-[#0A1628] shadow-md shadow-amber-500/10 dark:border-amber-500 dark:bg-amber-500/10 dark:text-amber-300"
                                    : "border-neutral-200 bg-neutral-50/50 text-neutral-600 hover:border-amber-300 hover:bg-amber-50/50 hover:shadow-sm dark:border-neutral-700 dark:bg-neutral-800/50 dark:text-neutral-400 dark:hover:border-amber-600 dark:hover:bg-amber-500/5"
                                }`}
                              >
                                <CatIcon
                                  size={22}
                                  className={`transition-colors duration-200 ${
                                    isSelected
                                      ? "text-amber-600 dark:text-amber-400"
                                      : "text-neutral-400 group-hover:text-amber-500 dark:text-neutral-500"
                                  }`}
                                />
                                <span className="leading-tight">{cat.name}</span>
                                {isSelected && (
                                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-white shadow-sm">
                                    <CheckCircle size={12} />
                                  </span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                        {/* Hidden input to maintain form validation */}
                        <input
                          type="text"
                          name="category"
                          value={formState.category}
                          onChange={() => {}}
                          required
                          className="sr-only"
                          tabIndex={-1}
                          aria-hidden="true"
                        />
                      </div>

                      <div>
                        <label className={labelClass}>
                          {q.fieldProductInterest}
                        </label>
                        <div className="relative">
                          <Input
                            type="text"
                            name="productInterest"
                            value={formState.productInterest}
                            onChange={handleChange}
                            className={inputClass}
                          />
                          <Search size={16} className={iconWrap} />
                        </div>
                      </div>
                      <div className="grid gap-5 sm:grid-cols-2">
                        <div>
                          <label className={labelClass}>
                            {q.fieldQuantity}
                          </label>
                          <div className="relative">
                            <Input
                              type="text"
                              name="quantity"
                              value={formState.quantity}
                              onChange={handleChange}
                              className={inputClass}
                            />
                            <Hash size={16} className={iconWrap} />
                          </div>
                        </div>
                        <div>
                          <label className={labelClass}>
                            {q.fieldDeliveryDate}
                          </label>
                          <div className="relative">
                            <Input
                              type="date"
                              name="deliveryDate"
                              value={formState.deliveryDate}
                              onChange={handleChange}
                              className={inputClass}
                            />
                            <Calendar size={16} className={iconWrap} />
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className={labelClass}>
                          {q.fieldNotes}
                        </label>
                        <div className="relative">
                          <textarea
                            name="message"
                            value={formState.message}
                            onChange={handleChange}
                            rows={4}
                            className="peer w-full resize-none rounded-xl border border-neutral-200 bg-white py-3 pl-11 pr-4 text-sm outline-none transition-all duration-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 focus:shadow-[0_0_0_4px_rgba(245,158,11,0.08)] dark:border-neutral-700 dark:bg-neutral-800/80 dark:text-neutral-100 dark:placeholder:text-neutral-500 dark:focus:border-amber-500 dark:focus:ring-amber-500/20"
                          />
                          <MessageSquare
                            size={16}
                            className="pointer-events-none absolute left-3.5 top-3.5 text-neutral-400 transition-colors duration-200 peer-focus:text-amber-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button - Large Amber CTA */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="group relative flex w-full items-center justify-center gap-3 rounded-2xl bg-amber-500 px-8 py-5 text-base font-bold text-[#0A1628] shadow-lg shadow-amber-500/25 transition-all duration-300 hover:bg-amber-400 hover:shadow-xl hover:shadow-amber-500/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:py-4 dark:shadow-amber-500/10 dark:hover:shadow-amber-500/20"
                  >
                    {/* Glow effect */}
                    <span className="pointer-events-none absolute inset-0 rounded-2xl bg-amber-400/0 transition-all duration-300 group-hover:bg-amber-400/20 group-hover:blur-xl" />
                    <span className="relative flex items-center gap-3">
                      {loading ? (
                        <span className="h-5 w-5 animate-spin rounded-full border-2 border-[#0A1628] border-t-transparent" />
                      ) : (
                        <Send size={20} className="transition-transform duration-200 group-hover:translate-x-0.5" />
                      )}
                      {loading ? q.submitting : q.submitButton}
                    </span>
                  </button>
                </form>
              )}
            </div>
          </AnimateOnScroll>

          {/* Benefits Sidebar */}
          <div className="order-first lg:order-last">
            <AnimateOnScroll animation="fade-left" className="hidden lg:block">
              <div className="sticky top-28 space-y-4">
                <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-[#0A1628] dark:text-neutral-300">
                  {q.whyKismet}
                </h3>

                {benefits.map((b, i) => {
                  const Icon = benefitIcons[i];
                  return (
                    <div
                      key={i}
                      className="group flex gap-3.5 rounded-xl border border-neutral-200/80 bg-white p-4 transition-all duration-300 hover:border-amber-300 hover:shadow-md hover:shadow-amber-500/5 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-amber-600"
                      style={{
                        animation: `fade-in-up 0.5s ease-out ${0.1 + i * 0.1}s both`,
                      }}
                    >
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#0A1628] text-amber-400 transition-all duration-300 group-hover:bg-amber-500 group-hover:text-[#0A1628] group-hover:shadow-lg group-hover:shadow-amber-500/20">
                        <Icon size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[#0A1628] dark:text-neutral-100">{b.title}</p>
                        <p className="mt-0.5 text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">{b.desc}</p>
                      </div>
                    </div>
                  );
                })}

                <div className="mt-6 rounded-xl border-2 border-dashed border-amber-300 bg-amber-50/50 p-5 text-center dark:border-amber-700 dark:bg-amber-500/5">
                  <p className="text-sm font-semibold text-[#0A1628] dark:text-neutral-200">
                    {q.haveQuestions}
                  </p>
                  <a
                    href={phoneHref}
                    className="mt-2 inline-flex items-center gap-2 rounded-lg bg-[#0A1628] px-4 py-2 text-sm font-bold text-amber-400 transition-all duration-200 hover:bg-[#0A1628]/90 hover:shadow-lg dark:bg-amber-500/10 dark:text-amber-400 dark:hover:bg-amber-500/20"
                  >
                    <Phone size={14} />
                    {phoneValue}
                  </a>
                </div>
              </div>
            </AnimateOnScroll>

            {/* Mobile Benefits - shown below form on mobile */}
            <div className="mt-8 space-y-3 lg:hidden">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#0A1628] dark:text-neutral-300">
                {q.whyKismet}
              </h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {benefits.map((b, i) => {
                  const Icon = benefitIcons[i];
                  return (
                    <div
                      key={i}
                      className="flex gap-3 rounded-xl border border-neutral-200/80 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#0A1628] text-amber-400">
                        <Icon size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[#0A1628] dark:text-neutral-100">{b.title}</p>
                        <p className="text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">{b.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
