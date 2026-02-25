"use client";

import { useState } from "react";
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
import { categories } from "@/data/products";
import { useLocale } from "@/contexts/LocaleContext";

const inputBase =
  "w-full rounded-xl border border-neutral-200 bg-white py-3 pl-11 pr-4 text-sm outline-none transition-all duration-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 focus:shadow-[0_0_0_6px_rgba(46,106,175,0.08)]";

const iconWrap =
  "pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 transition-colors duration-200 peer-focus:text-primary-500";

const steps = [
  { num: 1, label: "Bilgi Doldurun" },
  { num: 2, label: "Teklif Alın" },
  { num: 3, label: "Sipariş Verin" },
];

const benefits = [
  {
    icon: Clock,
    title: "24 Saat İçinde Dönüş",
    desc: "Teklif taleplerinize hızla yanıt veriyoruz.",
  },
  {
    icon: Headphones,
    title: "Ücretsiz Teknik Danışmanlık",
    desc: "Uzman ekibimizle teknik destek alın.",
  },
  {
    icon: Shield,
    title: "Kalite Garantisi",
    desc: "ISO sertifikalı üretim standartları.",
  },
  {
    icon: Truck,
    title: "Hızlı Teslimat",
    desc: "Türkiye geneli lojistik ağı ile hızlı sevkiyat.",
  },
];

export default function TeklifAlPage() {
  const { dict } = useLocale();
  const q = dict.quote;
  const nav = dict.nav;

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
      const res = await fetch("/api/quote", {
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

  return (
    <section className="bg-white">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary-900 via-primary-700 to-primary-900 py-16 lg:py-20">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        <FileText
          size={260}
          strokeWidth={0.5}
          className="pointer-events-none absolute -right-8 top-1/2 -translate-y-1/2 text-white/[0.04] lg:right-20"
        />

        <div className="relative mx-auto max-w-7xl px-4 lg:px-6">
          <AnimateOnScroll animation="fade-up">
            <nav className="mb-6 flex items-center gap-1.5 text-sm text-white/60">
              <Link href="/" className="transition-colors hover:text-white">{nav.home}</Link>
              <ChevronRight size={14} />
              <span className="text-white">{nav.quote}</span>
            </nav>
            <h1 className="mb-3 text-3xl font-extrabold text-white sm:text-4xl">
              {q.heroTitle}
            </h1>
            <p className="max-w-2xl text-white/70">{q.heroSubtitle}</p>

            {/* Steps Pipeline */}
            <div className="mt-8 flex flex-wrap items-center gap-2 sm:gap-3">
              {steps.map((step, i) => (
                <div key={step.num} className="flex items-center gap-2 sm:gap-3">
                  <div
                    className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all ${
                      i === 0
                        ? "bg-accent-500 text-primary-900 shadow-lg shadow-accent-500/20"
                        : "bg-white/10 text-white/70"
                    }`}
                  >
                    <span
                      className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                        i === 0
                          ? "bg-primary-900 text-white"
                          : "bg-white/20 text-white"
                      }`}
                    >
                      {step.num}
                    </span>
                    <span className="hidden sm:inline">{step.label}</span>
                  </div>
                  {i < steps.length - 1 && (
                    <ChevronRight size={16} className="text-white/30" />
                  )}
                </div>
              ))}
            </div>
          </AnimateOnScroll>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-6 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
          {/* Main Form */}
          <AnimateOnScroll animation="fade-up">
            <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm lg:p-10">
              <div className="mb-8 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-100 text-accent-600">
                  <FileText size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-primary-900">{q.formTitle}</h2>
                  <p className="text-sm text-neutral-500">{q.formHint}</p>
                </div>
              </div>

              {error && (
                <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                  {error}
                </div>
              )}

              {submitted ? (
                <div
                  className="relative overflow-hidden rounded-xl bg-green-50 p-10 text-center"
                  style={{ animation: "scale-in 0.4s ease-out" }}
                >
                  {/* Celebration particles */}
                  {Array.from({ length: 14 }).map((_, i) => (
                    <span
                      key={i}
                      className="absolute rounded-full"
                      style={{
                        width: `${4 + (i % 3) * 3}px`,
                        height: `${4 + (i % 3) * 3}px`,
                        left: `${6 + i * 6.5}%`,
                        top: `${8 + (i % 4) * 22}%`,
                        backgroundColor: [
                          "var(--accent-500)",
                          "var(--primary-500)",
                          "var(--primary-300)",
                          "#22c55e",
                        ][i % 4],
                        animation: `particle-float ${2 + (i % 3)}s ease-in-out infinite`,
                        animationDelay: `${i * 0.12}s`,
                        opacity: 0.5,
                      }}
                    />
                  ))}
                  <div className="relative z-10">
                    <div
                      className="mx-auto mb-5 flex h-24 w-24 items-center justify-center rounded-full bg-green-100 shadow-lg shadow-green-200/50"
                      style={{ animation: "scale-in 0.5s ease-out 0.1s both" }}
                    >
                      <CheckCircle
                        size={48}
                        className="text-green-600"
                        style={{ animation: "scale-in 0.4s ease-out 0.3s both" }}
                      />
                    </div>
                    <p className="mb-2 text-lg font-semibold text-green-800">
                      {q.successTitle}
                    </p>
                    <p className="text-sm text-green-700">{q.successMessage}</p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Section 1: Company / Contact */}
                  <div>
                    <h3 className="mb-5 flex items-center gap-3 text-sm font-bold uppercase tracking-wider text-primary-700">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-900 text-xs font-bold text-white">
                        1
                      </span>
                      {q.sectionCompany}
                    </h3>
                    <div className="space-y-4">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                            {q.fieldName} *
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              name="name"
                              value={formState.name}
                              onChange={handleChange}
                              required
                              className={`peer ${inputBase}`}
                            />
                            <User size={16} className={iconWrap} />
                          </div>
                        </div>
                        <div>
                          <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                            {q.fieldCompany} *
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              name="company"
                              value={formState.company}
                              onChange={handleChange}
                              required
                              className={`peer ${inputBase}`}
                            />
                            <Building2 size={16} className={iconWrap} />
                          </div>
                        </div>
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                            {q.fieldEmail} *
                          </label>
                          <div className="relative">
                            <input
                              type="email"
                              name="email"
                              value={formState.email}
                              onChange={handleChange}
                              required
                              className={`peer ${inputBase}`}
                            />
                            <Mail size={16} className={iconWrap} />
                          </div>
                        </div>
                        <div>
                          <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                            {q.fieldPhone} *
                          </label>
                          <div className="relative">
                            <input
                              type="tel"
                              name="phone"
                              value={formState.phone}
                              onChange={handleChange}
                              required
                              className={`peer ${inputBase}`}
                            />
                            <Phone size={16} className={iconWrap} />
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                          {q.fieldAddress}
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            name="address"
                            value={formState.address}
                            onChange={handleChange}
                            className={`peer ${inputBase}`}
                          />
                          <MapPin size={16} className={iconWrap} />
                        </div>
                      </div>
                    </div>
                  </div>

                  <hr className="border-neutral-100" />

                  {/* Section 2: Product Request */}
                  <div>
                    <h3 className="mb-5 flex items-center gap-3 text-sm font-bold uppercase tracking-wider text-primary-700">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-900 text-xs font-bold text-white">
                        2
                      </span>
                      {q.sectionProduct}
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                          {q.fieldCategory} *
                        </label>
                        <div className="relative">
                          <select
                            name="category"
                            value={formState.category}
                            onChange={handleChange}
                            required
                            className="peer w-full cursor-pointer appearance-none rounded-xl border border-neutral-200 bg-white py-3 pl-11 pr-10 text-sm outline-none transition-all duration-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 focus:shadow-[0_0_0_6px_rgba(46,106,175,0.08)]"
                            style={{
                              backgroundImage:
                                "url(\"data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
                              backgroundSize: "16px",
                              backgroundPosition: "right 12px center",
                              backgroundRepeat: "no-repeat",
                            }}
                          >
                            <option value="">{dict.contact.formSubjectPlaceholder}</option>
                            {categories.map((cat) => (
                              <option key={cat.slug} value={cat.slug}>
                                {cat.name}
                              </option>
                            ))}
                          </select>
                          <Package size={16} className={iconWrap} />
                        </div>
                      </div>
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                          {q.fieldProductInterest}
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            name="productInterest"
                            value={formState.productInterest}
                            onChange={handleChange}
                            className={`peer ${inputBase}`}
                          />
                          <Search size={16} className={iconWrap} />
                        </div>
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                            {q.fieldQuantity}
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              name="quantity"
                              value={formState.quantity}
                              onChange={handleChange}
                              className={`peer ${inputBase}`}
                            />
                            <Hash size={16} className={iconWrap} />
                          </div>
                        </div>
                        <div>
                          <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                            {q.fieldDeliveryDate}
                          </label>
                          <div className="relative">
                            <input
                              type="date"
                              name="deliveryDate"
                              value={formState.deliveryDate}
                              onChange={handleChange}
                              className={`peer ${inputBase}`}
                            />
                            <Calendar size={16} className={iconWrap} />
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                          {q.fieldNotes}
                        </label>
                        <div className="relative">
                          <textarea
                            name="message"
                            value={formState.message}
                            onChange={handleChange}
                            rows={4}
                            className="peer w-full resize-none rounded-xl border border-neutral-200 bg-white py-3 pl-11 pr-4 text-sm outline-none transition-all duration-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 focus:shadow-[0_0_0_6px_rgba(46,106,175,0.08)]"
                          />
                          <MessageSquare
                            size={16}
                            className="pointer-events-none absolute left-3.5 top-3.5 text-neutral-400 transition-colors duration-200 peer-focus:text-primary-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="group relative w-full overflow-hidden rounded-xl py-4 font-bold text-primary-900 shadow-md transition-all duration-300 hover:shadow-lg active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:px-12"
                    style={{
                      backgroundImage:
                        "linear-gradient(90deg, var(--accent-500), var(--accent-400), var(--accent-600), var(--accent-500))",
                      backgroundSize: "300% 100%",
                      animation: "shimmer 4s ease infinite",
                    }}
                  >
                    <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />
                    <span className="relative flex items-center justify-center gap-2">
                      {loading ? (
                        <span className="h-5 w-5 animate-spin rounded-full border-2 border-primary-900 border-t-transparent" />
                      ) : (
                        <Send size={20} />
                      )}
                      {loading ? q.submitting : q.submitButton}
                    </span>
                  </button>
                </form>
              )}
            </div>
          </AnimateOnScroll>

          {/* Benefits Sidebar */}
          <AnimateOnScroll animation="fade-left" className="hidden lg:block">
            <div className="sticky top-28 space-y-4">
              <h3 className="mb-2 text-sm font-bold uppercase tracking-wider text-primary-700">
                Neden Kısmet Plastik?
              </h3>

              {benefits.map((b, i) => (
                <div
                  key={b.title}
                  className="group flex gap-3 rounded-xl border border-neutral-100 bg-neutral-50 p-4 transition-all duration-300 hover:border-primary-100 hover:bg-primary-50/50 hover:shadow-sm"
                  style={{
                    animation: `fade-in-up 0.5s ease-out ${0.1 + i * 0.1}s both`,
                  }}
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-100 text-primary-700 transition-colors duration-300 group-hover:bg-primary-500 group-hover:text-white">
                    <b.icon size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-primary-900">{b.title}</p>
                    <p className="text-xs leading-relaxed text-neutral-500">{b.desc}</p>
                  </div>
                </div>
              ))}

              <div className="mt-6 rounded-xl border border-accent-200 bg-accent-100/50 p-4 text-center">
                <p className="text-sm font-semibold text-primary-900">
                  Sorularınız mı var?
                </p>
                <a
                  href="tel:+902125498703"
                  className="mt-1 inline-flex items-center gap-1.5 text-sm font-bold text-primary-700 transition-colors hover:text-primary-900"
                >
                  <Phone size={14} />
                  0212 549 87 03
                </a>
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  );
}
