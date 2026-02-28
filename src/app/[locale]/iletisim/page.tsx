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
import dynamic from "next/dynamic";

const QRCodeComponent = dynamic(() => import("@/components/ui/QRCode"), {
  ssr: false,
});

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
    { icon: Clock, label: c.hoursLabel, value: c.hoursValue, accent: "border-l-amber-400" },
  ];

  return (
    <section className="bg-white dark:bg-neutral-0">
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
              <h2 className="mb-2 text-xl font-bold text-primary-900 dark:text-white">{c.infoTitle}</h2>

              {contactItems.map((item) => (
                <div
                  key={item.label}
                  className={`group flex items-start gap-4 rounded-xl border border-neutral-200 border-l-4 ${item.accent} bg-white p-4 shadow-sm transition-all duration-300 hover:scale-[1.03] hover:shadow-md dark:border-neutral-700 dark:bg-neutral-800`}
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
                        className="text-sm font-medium text-primary-900 transition-colors hover:text-primary-700 hover:underline dark:text-white"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <p className="text-sm font-medium text-primary-900 dark:text-white">{item.value}</p>
                    )}
                  </div>
                </div>
              ))}

              <div className="rounded-xl border border-neutral-200 border-l-4 border-l-primary-700 bg-neutral-50 p-5 transition-all duration-300 hover:scale-[1.03] hover:shadow-md dark:border-neutral-700 dark:bg-neutral-800">
                <Building2 size={24} className="mb-2 text-primary-700" />
                <p className="text-sm font-semibold text-primary-900 dark:text-white">{c.companyName}</p>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">{c.taxNo}</p>
              </div>
            </div>
          </AnimateOnScroll>

          {/* Form */}
          <AnimateOnScroll animation="fade-left" className="lg:col-span-2">
            <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-700 dark:bg-neutral-800 lg:p-8">
              <h2 className="mb-6 flex items-center gap-2 text-xl font-bold text-primary-900 dark:text-white">
                <MessageSquare size={24} className="text-accent-500" />
                {c.formTitle}
              </h2>

              {error && (
                <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                  {error}
                </div>
              )}

              {submitted ? (
                <div className="rounded-lg bg-success/10 p-8 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success/20">
                    <CheckCircle size={32} className="text-success" />
                  </div>
                  <p className="text-lg font-semibold text-foreground">{c.formSuccess}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label htmlFor="name">{c.formName} *</Label>
                      <Input id="name" name="name" value={formState.name} onChange={handleChange} required />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="email">{c.formEmail} *</Label>
                      <Input id="email" name="email" type="email" value={formState.email} onChange={handleChange} required />
                    </div>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label htmlFor="phone">{c.formPhone}</Label>
                      <Input id="phone" name="phone" type="tel" value={formState.phone} onChange={handleChange} />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="company">{c.formCompany}</Label>
                      <Input id="company" name="company" value={formState.company} onChange={handleChange} />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label>{c.formSubject} *</Label>
                    <select name="subject" value={formState.subject} onChange={handleChange} required className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-1">
                      <option value="">{c.formSubjectPlaceholder}</option>
                      <option value="teklif">{c.formSubjectQuote}</option>
                      <option value="bilgi">{c.formSubjectInfo}</option>
                      <option value="sikayet">{c.formSubjectComplaint}</option>
                      <option value="diger">{c.formSubjectOther}</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <Label>{c.formMessage} *</Label>
                    <Textarea name="message" value={formState.message} onChange={handleChange} required rows={5} />
                  </div>

                  <Button type="submit" disabled={loading} className="bg-accent text-accent-foreground hover:bg-accent/90">
                    {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                    {loading ? c.submitting : c.formSubmit}
                  </Button>
                </form>
              )}
            </div>
          </AnimateOnScroll>
        </div>

        {/* Google Maps */}
        <AnimateOnScroll animation="fade-up" className="mt-12">
          <div className="relative overflow-hidden rounded-2xl border border-neutral-200 shadow-lg dark:border-neutral-700">
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

        {/* QR Code */}
        <AnimateOnScroll animation="fade-up" className="mt-12">
          <div className="flex flex-col items-center rounded-2xl border border-neutral-200 bg-neutral-50 p-8 shadow-sm dark:border-neutral-700 dark:bg-neutral-800">
            <h3 className="mb-2 text-lg font-bold text-primary-900 dark:text-white">
              {c.qrTitle}
            </h3>
            <p className="mb-6 text-sm text-neutral-500 dark:text-neutral-400">
              {c.qrDescription}
            </p>
            <QRCodeComponent
              url={process.env.NEXT_PUBLIC_SITE_URL || "https://kismetplastik.vercel.app"}
              size={200}
              color="#002060"
              downloadLabel={c.qrDownload}
            />
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
