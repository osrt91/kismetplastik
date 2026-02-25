"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  Building2,
  ChevronRight,
  CheckCircle,
  User,
} from "lucide-react";
import AnimateOnScroll from "@/components/ui/AnimateOnScroll";
import { useLocale } from "@/contexts/LocaleContext";

const inputBase =
  "peer w-full rounded-xl border border-neutral-200 bg-white px-4 pb-2.5 pt-5 text-sm outline-none transition-all duration-300 placeholder-transparent focus:border-primary-500 focus:ring-2 focus:ring-primary-100 focus:shadow-[0_0_0_6px_rgba(46,106,175,0.08)]";

const floatingLabel =
  "pointer-events-none absolute left-4 top-3.5 text-sm text-neutral-400 transition-all duration-200 peer-focus:top-1 peer-focus:text-[11px] peer-focus:font-medium peer-focus:text-primary-600 peer-[:not(:placeholder-shown)]:top-1 peer-[:not(:placeholder-shown)]:text-[11px] peer-[:not(:placeholder-shown)]:font-medium peer-[:not(:placeholder-shown)]:text-primary-600";

export default function IletisimPage() {
  const { dict } = useLocale();
  const c = dict.contact;
  const nav = dict.nav;

  const [formState, setFormState] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    subject: "",
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
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formState),
      });
      const data = await res.json();

      if (data.success) {
        setSubmitted(true);
        setFormState({ name: "", email: "", phone: "", company: "", subject: "", message: "" });
      } else {
        setError(data.error || c.errorGeneral);
      }
    } catch {
      setError(c.errorConnection);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormState((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const contactItems = [
    { icon: Phone, label: c.phoneLabel, value: "0212 549 87 03", href: "tel:+902125498703", accent: "border-l-primary-500" },
    { icon: Mail, label: c.emailLabel, value: "bilgi@kismetplastik.com", href: "mailto:bilgi@kismetplastik.com", accent: "border-l-accent-500" },
    { icon: MapPin, label: c.addressLabel, value: c.addressValue, href: "https://maps.google.com", accent: "border-l-green-500" },
    { icon: Clock, label: c.hoursLabel, value: c.hoursValue, accent: "border-l-orange-400" },
  ];

  return (
    <section className="bg-white">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary-900 via-primary-700 to-primary-900 py-16 lg:py-20">
        <Mail
          size={280}
          strokeWidth={0.5}
          className="pointer-events-none absolute -right-10 top-1/2 -translate-y-1/2 text-white/[0.04] lg:right-16"
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="relative mx-auto max-w-7xl px-4 lg:px-6">
          <AnimateOnScroll animation="fade-up">
            <nav className="mb-6 flex items-center gap-1.5 text-sm text-white/60">
              <Link href="/" className="transition-colors hover:text-white">
                {nav.home}
              </Link>
              <ChevronRight size={14} />
              <span className="text-white">{nav.contact}</span>
            </nav>
            <h1 className="mb-3 text-3xl font-extrabold text-white sm:text-4xl">
              {c.heroTitle}
            </h1>
            <p className="max-w-2xl text-white/70">{c.heroSubtitle}</p>
          </AnimateOnScroll>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-6 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-3">
          {/* Contact Info Sidebar */}
          <AnimateOnScroll animation="fade-right">
            <div className="space-y-4">
              <h2 className="mb-2 text-xl font-bold text-primary-900">{c.infoTitle}</h2>

              {contactItems.map((item) => (
                <div
                  key={item.label}
                  className={`group flex items-start gap-4 rounded-xl border border-neutral-200 border-l-4 ${item.accent} bg-white p-4 shadow-sm transition-all duration-300 hover:scale-[1.03] hover:shadow-md`}
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-700 transition-colors duration-300 group-hover:bg-primary-100">
                    <item.icon size={20} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                      {item.label}
                    </p>
                    {item.href ? (
                      <a
                        href={item.href}
                        target={item.href.startsWith("http") ? "_blank" : undefined}
                        rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                        className="text-sm font-medium text-primary-900 transition-colors hover:text-primary-700 hover:underline"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <p className="text-sm font-medium text-primary-900">{item.value}</p>
                    )}
                  </div>
                </div>
              ))}

              <div className="rounded-xl border border-neutral-200 border-l-4 border-l-primary-700 bg-neutral-50 p-5 transition-all duration-300 hover:scale-[1.03] hover:shadow-md">
                <Building2 size={24} className="mb-2 text-primary-700" />
                <p className="text-sm font-semibold text-primary-900">{c.companyName}</p>
                <p className="text-sm text-neutral-500">{c.taxNo}</p>
              </div>
            </div>
          </AnimateOnScroll>

          {/* Form */}
          <AnimateOnScroll animation="fade-left" className="lg:col-span-2">
            <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm lg:p-8">
              <h2 className="mb-6 flex items-center gap-2 text-xl font-bold text-primary-900">
                <MessageSquare size={24} className="text-accent-500" />
                {c.formTitle}
              </h2>

              {error && (
                <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                  {error}
                </div>
              )}

              {submitted ? (
                <div
                  className="rounded-xl bg-green-50 p-8 text-center"
                  style={{ animation: "scale-in 0.4s ease-out" }}
                >
                  <div
                    className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-100"
                    style={{ animation: "scale-in 0.5s ease-out 0.1s both" }}
                  >
                    <CheckCircle
                      size={40}
                      className="text-green-600"
                      style={{ animation: "scale-in 0.4s ease-out 0.3s both" }}
                    />
                  </div>
                  <p className="text-lg font-semibold text-green-800">{c.formSuccess}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="relative">
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formState.name}
                        onChange={handleChange}
                        required
                        placeholder=" "
                        className={inputBase}
                      />
                      <label htmlFor="name" className={floatingLabel}>
                        <span className="flex items-center gap-1.5">
                          <User size={13} className="opacity-60" />
                          {c.formName} *
                        </span>
                      </label>
                    </div>
                    <div className="relative">
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formState.email}
                        onChange={handleChange}
                        required
                        placeholder=" "
                        className={inputBase}
                      />
                      <label htmlFor="email" className={floatingLabel}>
                        <span className="flex items-center gap-1.5">
                          <Mail size={13} className="opacity-60" />
                          {c.formEmail} *
                        </span>
                      </label>
                    </div>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="relative">
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formState.phone}
                        onChange={handleChange}
                        placeholder=" "
                        className={inputBase}
                      />
                      <label htmlFor="phone" className={floatingLabel}>
                        <span className="flex items-center gap-1.5">
                          <Phone size={13} className="opacity-60" />
                          {c.formPhone}
                        </span>
                      </label>
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        id="company"
                        name="company"
                        value={formState.company}
                        onChange={handleChange}
                        placeholder=" "
                        className={inputBase}
                      />
                      <label htmlFor="company" className={floatingLabel}>
                        <span className="flex items-center gap-1.5">
                          <Building2 size={13} className="opacity-60" />
                          {c.formCompany}
                        </span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                      {c.formSubject} *
                    </label>
                    <select
                      name="subject"
                      value={formState.subject}
                      onChange={handleChange}
                      required
                      className="w-full cursor-pointer appearance-none rounded-xl border border-neutral-200 bg-white bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23999%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:16px] bg-[right_12px_center] bg-no-repeat px-4 py-3 pr-10 text-sm outline-none transition-all duration-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 focus:shadow-[0_0_0_6px_rgba(46,106,175,0.08)]"
                    >
                      <option value="">{c.formSubjectPlaceholder}</option>
                      <option value="teklif">{c.formSubjectQuote}</option>
                      <option value="bilgi">{c.formSubjectInfo}</option>
                      <option value="sikayet">{c.formSubjectComplaint}</option>
                      <option value="diger">{c.formSubjectOther}</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                      {c.formMessage} *
                    </label>
                    <textarea
                      name="message"
                      value={formState.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      placeholder={c.heroSubtitle ? " " : " "}
                      className="w-full resize-none rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none transition-all duration-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 focus:shadow-[0_0_0_6px_rgba(46,106,175,0.08)]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="group relative inline-flex items-center gap-2 overflow-hidden rounded-xl bg-accent-500 px-7 py-3.5 font-bold text-primary-900 shadow-md transition-all duration-300 hover:bg-accent-600 hover:shadow-lg active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />
                    <span className="relative flex items-center gap-2">
                      {loading ? (
                        <span className="h-5 w-5 animate-spin rounded-full border-2 border-primary-900 border-t-transparent" />
                      ) : (
                        <Send size={18} />
                      )}
                      {loading ? c.submitting : c.formSubmit}
                    </span>
                  </button>
                </form>
              )}
            </div>
          </AnimateOnScroll>
        </div>

        {/* Google Maps */}
        <AnimateOnScroll animation="fade-up" className="mt-12">
          <div className="relative overflow-hidden rounded-2xl border border-neutral-200 shadow-lg">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3008.5!2d28.7927!3d41.0681!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14caa51f2e66f7c7%3A0x3a0a3e0a3c5a1b0d!2zxLBraXRlbGxpIE9TQg!5e0!3m2!1str!2str!4v1709000000000!5m2!1str!2str"
              className="aspect-[21/9] w-full border-0"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Kısmet Plastik Konum - İkitelli OSB, Başakşehir"
            />
            <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-lg bg-white/95 px-3 py-2 text-sm font-bold text-primary-900 shadow-md backdrop-blur-sm">
              <MapPin size={16} className="text-accent-500" />
              Kısmet Plastik - İkitelli OSB
            </div>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
