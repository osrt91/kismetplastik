"use client";

import { useState } from "react";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  Building2,
} from "lucide-react";
import AnimateOnScroll from "@/components/ui/AnimateOnScroll";
import { useLocale } from "@/contexts/LocaleContext";

export default function IletisimPage() {
  const { dict } = useLocale();
  const c = dict.contact;

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
    { icon: Phone, label: c.phoneLabel, value: "+90 (212) 123 45 67", href: "tel:+902121234567" },
    { icon: Mail, label: c.emailLabel, value: "info@kismetplastik.com", href: "mailto:info@kismetplastik.com" },
    { icon: MapPin, label: c.addressLabel, value: c.addressValue, href: "https://maps.google.com" },
    { icon: Clock, label: c.hoursLabel, value: c.hoursValue },
  ];

  return (
    <section className="bg-white">
      {/* Hero */}
      <div className="bg-primary-900 py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <AnimateOnScroll animation="fade-up">
            <h1 className="mb-3 text-3xl font-extrabold text-white sm:text-4xl">
              {c.heroTitle}
            </h1>
            <p className="max-w-2xl text-white/70">{c.heroSubtitle}</p>
          </AnimateOnScroll>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-6 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-3">
          {/* İletişim Bilgileri */}
          <AnimateOnScroll animation="fade-right">
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-primary-900">{c.infoTitle}</h2>
              {contactItems.map((item) => (
                <div key={item.label} className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-700">
                    <item.icon size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-neutral-500">{item.label}</p>
                    {item.href ? (
                      <a
                        href={item.href}
                        target={item.href.startsWith("http") ? "_blank" : undefined}
                        rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                        className="text-primary-900 hover:text-primary-700 hover:underline"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <p className="text-primary-900">{item.value}</p>
                    )}
                  </div>
                </div>
              ))}

              <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-5">
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
                <div className="rounded-xl bg-green-50 p-6 text-center">
                  <p className="font-semibold text-green-800">{c.formSuccess}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                        {c.formName} *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formState.name}
                        onChange={handleChange}
                        required
                        className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                        {c.formEmail} *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formState.email}
                        onChange={handleChange}
                        required
                        className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                      />
                    </div>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                        {c.formPhone}
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formState.phone}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                        {c.formCompany}
                      </label>
                      <input
                        type="text"
                        name="company"
                        value={formState.company}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                      />
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
                      className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
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
                      className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center gap-2 rounded-xl bg-accent-500 px-6 py-3.5 font-bold text-primary-900 shadow-md transition-all hover:bg-accent-600 hover:shadow-lg active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <span className="h-5 w-5 animate-spin rounded-full border-2 border-primary-900 border-t-transparent" />
                    ) : (
                      <Send size={18} />
                    )}
                    {loading ? c.submitting : c.formSubmit}
                  </button>
                </form>
              )}
            </div>
          </AnimateOnScroll>
        </div>

        {/* Harita */}
        <AnimateOnScroll animation="fade-up" className="mt-12">
          <div className="overflow-hidden rounded-2xl border border-neutral-200">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d192697.79327647842!2d28.847252!3d41.005264!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14caa7040068086b%3A0xe1ccfe98bc01b0d0!2zxLBzdGFuYnVs!5e0!3m2!1str!2str!4v1709000000000!5m2!1str!2str"
              className="aspect-[21/9] w-full border-0"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Kismet Plastik Konum"
            />
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
