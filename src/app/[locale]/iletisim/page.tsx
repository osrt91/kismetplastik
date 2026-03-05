"use client";

import { useState } from "react";
import Link from "@/components/ui/LocaleLink";
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
  Loader2,
} from "lucide-react";
import AnimateOnScroll from "@/components/ui/AnimateOnScroll";
import { useLocale } from "@/contexts/LocaleContext";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

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
    { icon: Phone, label: c.phoneLabel, value: "0212 549 87 03", href: "tel:+902125498703" },
    { icon: Mail, label: c.emailLabel, value: "bilgi@kismetplastik.com", href: "mailto:bilgi@kismetplastik.com" },
    { icon: MapPin, label: c.addressLabel, value: c.addressValue, href: "https://maps.google.com" },
    { icon: Clock, label: c.hoursLabel, value: c.hoursValue },
  ];

  return (
    <section className="bg-cream-50 dark:bg-navy-950">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-navy-950 via-navy-900 to-navy-950 py-20 lg:py-28">
        <Mail
          size={320}
          strokeWidth={0.4}
          className="pointer-events-none absolute -right-10 top-1/2 -translate-y-1/2 text-white/[0.03] lg:right-20"
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        {/* Amber accent line at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 lg:px-6">
          <AnimateOnScroll animation="fade-up">
            <nav className="mb-6 flex items-center gap-1.5 text-sm text-white/50">
              <Link href="/" className="transition-colors hover:text-amber-400">
                {nav.home}
              </Link>
              <ChevronRight size={14} className="text-amber-500/60" />
              <span className="font-medium text-amber-400">{nav.contact}</span>
            </nav>
            <h1 className="mb-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
              {c.heroTitle}
            </h1>
            <p className="max-w-2xl text-lg text-white/60">{c.heroSubtitle}</p>
          </AnimateOnScroll>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-6 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-3 lg:gap-12">
          {/* Contact Info Sidebar */}
          <AnimateOnScroll animation="fade-right">
            <div className="space-y-4">
              <h2 className="mb-3 text-xl font-bold text-navy-900 dark:text-cream-50">{c.infoTitle}</h2>

              {contactItems.map((item) => (
                <div
                  key={item.label}
                  className="group relative flex items-start gap-4 rounded-xl border border-white/60 bg-white/70 p-4 shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-amber-500/5 dark:border-navy-700/50 dark:bg-navy-800/60"
                >
                  {/* Left accent bar */}
                  <div className="absolute inset-y-2 left-0 w-1 rounded-full bg-gradient-to-b from-amber-400 to-amber-600 opacity-80 transition-opacity group-hover:opacity-100" />
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-navy-900/5 text-navy-700 transition-colors duration-300 group-hover:bg-amber-500/10 group-hover:text-amber-600 dark:bg-cream-50/10 dark:text-cream-200 dark:group-hover:bg-amber-500/15 dark:group-hover:text-amber-400">
                    <item.icon size={20} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wider text-navy-400 dark:text-cream-50/50">
                      {item.label}
                    </p>
                    {item.href ? (
                      <a
                        href={item.href}
                        target={item.href.startsWith("http") ? "_blank" : undefined}
                        rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                        className="text-sm font-medium text-navy-900 transition-colors hover:text-amber-600 dark:text-cream-50 dark:hover:text-amber-400"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <p className="text-sm font-medium text-navy-900 dark:text-cream-50">{item.value}</p>
                    )}
                  </div>
                </div>
              ))}

              <div className="relative overflow-hidden rounded-xl border border-white/60 bg-white/70 p-5 shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg dark:border-navy-700/50 dark:bg-navy-800/60">
                <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-amber-500/5 dark:bg-amber-500/10" />
                <Building2 size={24} className="mb-2 text-amber-500" />
                <p className="text-sm font-semibold text-navy-900 dark:text-cream-50">{c.companyName}</p>
                <p className="text-sm text-navy-500 dark:text-cream-50/50">{c.taxNo}</p>
              </div>
            </div>
          </AnimateOnScroll>

          {/* Form */}
          <AnimateOnScroll animation="fade-left" className="lg:col-span-2">
            <div className="rounded-2xl border border-white/60 bg-white/80 p-6 shadow-sm backdrop-blur-md dark:border-navy-700/50 dark:bg-navy-800/70 lg:p-8">
              <h2 className="mb-6 flex items-center gap-2.5 text-xl font-bold text-navy-900 dark:text-cream-50">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10 dark:bg-amber-500/15">
                  <MessageSquare size={20} className="text-amber-500" />
                </span>
                {c.formTitle}
              </h2>

              {error && (
                <div className="mb-5 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/40">
                    <span className="text-base">!</span>
                  </div>
                  {error}
                </div>
              )}

              {submitted ? (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-10 text-center dark:border-emerald-900/40 dark:bg-emerald-950/20">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                    <CheckCircle size={32} className="text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <p className="text-lg font-semibold text-navy-900 dark:text-cream-50">{c.formSuccess}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label htmlFor="name" className="text-navy-700 dark:text-cream-200">{c.formName} *</Label>
                      <Input id="name" name="name" value={formState.name} onChange={handleChange} required className="border-navy-200 bg-white/60 focus-visible:border-amber-500 focus-visible:ring-amber-500/20 dark:border-navy-600 dark:bg-navy-900/40 dark:focus-visible:border-amber-400 dark:focus-visible:ring-amber-400/20" />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="email" className="text-navy-700 dark:text-cream-200">{c.formEmail} *</Label>
                      <Input id="email" name="email" type="email" value={formState.email} onChange={handleChange} required className="border-navy-200 bg-white/60 focus-visible:border-amber-500 focus-visible:ring-amber-500/20 dark:border-navy-600 dark:bg-navy-900/40 dark:focus-visible:border-amber-400 dark:focus-visible:ring-amber-400/20" />
                    </div>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label htmlFor="phone" className="text-navy-700 dark:text-cream-200">{c.formPhone}</Label>
                      <Input id="phone" name="phone" type="tel" value={formState.phone} onChange={handleChange} className="border-navy-200 bg-white/60 focus-visible:border-amber-500 focus-visible:ring-amber-500/20 dark:border-navy-600 dark:bg-navy-900/40 dark:focus-visible:border-amber-400 dark:focus-visible:ring-amber-400/20" />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="company" className="text-navy-700 dark:text-cream-200">{c.formCompany}</Label>
                      <Input id="company" name="company" value={formState.company} onChange={handleChange} className="border-navy-200 bg-white/60 focus-visible:border-amber-500 focus-visible:ring-amber-500/20 dark:border-navy-600 dark:bg-navy-900/40 dark:focus-visible:border-amber-400 dark:focus-visible:ring-amber-400/20" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-navy-700 dark:text-cream-200">{c.formSubject} *</Label>
                    <select name="subject" value={formState.subject} onChange={handleChange} required className="flex h-9 w-full rounded-md border border-navy-200 bg-white/60 px-3 py-1 text-sm shadow-xs transition-all focus-visible:border-amber-500 focus-visible:ring-amber-500/20 focus-visible:ring-[3px] focus-visible:outline-none dark:border-navy-600 dark:bg-navy-900/40 dark:text-cream-50 dark:focus-visible:border-amber-400 dark:focus-visible:ring-amber-400/20">
                      <option value="">{c.formSubjectPlaceholder}</option>
                      <option value="teklif">{c.formSubjectQuote}</option>
                      <option value="bilgi">{c.formSubjectInfo}</option>
                      <option value="sikayet">{c.formSubjectComplaint}</option>
                      <option value="diger">{c.formSubjectOther}</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-navy-700 dark:text-cream-200">{c.formMessage} *</Label>
                    <Textarea name="message" value={formState.message} onChange={handleChange} required rows={5} className="border-navy-200 bg-white/60 focus-visible:border-amber-500 focus-visible:ring-amber-500/20 dark:border-navy-600 dark:bg-navy-900/40 dark:focus-visible:border-amber-400 dark:focus-visible:ring-amber-400/20" />
                  </div>

                  <Button type="submit" disabled={loading} size="lg" className="bg-amber-500 font-semibold text-navy-950 shadow-md shadow-amber-500/20 transition-all hover:bg-amber-400 hover:shadow-lg hover:shadow-amber-500/30 active:bg-amber-600 disabled:shadow-none">
                    {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                    {loading ? c.submitting : c.formSubmit}
                  </Button>
                </form>
              )}
            </div>
          </AnimateOnScroll>
        </div>

        {/* Google Maps */}
        <AnimateOnScroll animation="fade-up" className="mt-14">
          <div className="relative overflow-hidden rounded-2xl border border-white/60 shadow-xl shadow-navy-900/5 dark:border-navy-700/50 dark:shadow-black/20">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3008.5!2d28.7927!3d41.0681!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14caa51f2e66f7c7%3A0x3a0a3e0a3c5a1b0d!2zxLBraXRlbGxpIE9TQg!5e0!3m2!1str!2str!4v1709000000000!5m2!1str!2str"
              className="aspect-[21/9] w-full border-0"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Kısmet Plastik Konum - İkitelli OSB, Başakşehir"
            />
            <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-lg border border-white/40 bg-white/90 px-3.5 py-2.5 text-sm font-bold text-navy-900 shadow-lg backdrop-blur-md dark:border-navy-700 dark:bg-navy-900/90 dark:text-cream-50">
              <MapPin size={16} className="text-amber-500" />
              Kısmet Plastik - İkitelli OSB
            </div>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
