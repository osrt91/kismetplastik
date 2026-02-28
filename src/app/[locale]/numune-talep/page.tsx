"use client";

import { useState } from "react";
import Link from "@/components/ui/LocaleLink";
import { ChevronRight, Send, CheckCircle, Package, User, Mail, Phone, MapPin, MessageSquare } from "lucide-react";
import { FaBoxOpen } from "react-icons/fa6";
import AnimateOnScroll from "@/components/ui/AnimateOnScroll";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/contexts/LocaleContext";
import { categories } from "@/data/products";

const labels: Record<string, Record<string, string>> = {
  tr: {
    title: "Numune Talebi",
    subtitle: "Ürünlerimizi test etmek için ücretsiz numune talep edin. Kargo masrafları firmamıza aittir.",
    formTitle: "Numune Talep Formu",
    freeBadge: "Ücretsiz Numune Gönderimi",
    fieldName: "Ad Soyad",
    fieldCompany: "Firma Adı",
    fieldEmail: "E-posta",
    fieldPhone: "Telefon",
    fieldAddress: "Teslimat Adresi",
    fieldCategory: "Ürün Kategorisi",
    fieldNotes: "Ek Notlar",
    selectPlaceholder: "Kategori Seçin",
    submitButton: "Numune Talebi Gönder",
    submitting: "Gönderiliyor...",
    successTitle: "Talebiniz Alındı",
    successMessage: "Numune talebiniz başarıyla alındı. En kısa sürede numuneleriniz hazırlanıp adresinize gönderilecektir.",
  },
  en: {
    title: "Sample Request",
    subtitle: "Request free samples to test our products. Shipping costs are on us.",
    formTitle: "Sample Request Form",
    freeBadge: "Free Sample Shipping",
    fieldName: "Full Name",
    fieldCompany: "Company Name",
    fieldEmail: "Email",
    fieldPhone: "Phone",
    fieldAddress: "Delivery Address",
    fieldCategory: "Product Category",
    fieldNotes: "Additional Notes",
    selectPlaceholder: "Select Category",
    submitButton: "Submit Sample Request",
    submitting: "Submitting...",
    successTitle: "Request Received",
    successMessage: "Your sample request has been received. Your samples will be prepared and shipped to your address as soon as possible.",
  },
};

export default function NumuneTalepPage() {
  const { locale, dict } = useLocale();
  const t = labels[locale] || labels.tr;
  const nav = dict.nav;

  const [formState, setFormState] = useState({
    name: "", company: "", email: "", phone: "", address: "", category: "", notes: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormState((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await new Promise((r) => setTimeout(r, 1000));
      setSubmitted(true);
    } catch {
      setError("Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-white">
      <div className="relative overflow-hidden bg-gradient-to-br from-primary-900 via-primary-700 to-primary-900 py-16 lg:py-20">
        <FaBoxOpen size={260} className="pointer-events-none absolute -right-8 top-1/2 -translate-y-1/2 text-white/[0.04]" />
        <div className="relative mx-auto max-w-7xl px-4 lg:px-6">
          <AnimateOnScroll animation="fade-up">
            <nav className="mb-6 flex items-center gap-1.5 text-sm text-white/60">
              <Link href="/" className="transition-colors hover:text-white">{nav.home}</Link>
              <ChevronRight size={14} />
              <span className="text-white">{t.title}</span>
            </nav>
            <h1 className="mb-3 text-3xl font-extrabold text-white sm:text-4xl">{t.title}</h1>
            <p className="max-w-2xl text-white/70">{t.subtitle}</p>
            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-accent-500/20 px-4 py-2 text-sm font-semibold text-accent-400">
              <Package size={16} />
              {t.freeBadge}
            </div>
          </AnimateOnScroll>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-4 py-12 lg:py-20">
        <AnimateOnScroll animation="fade-up">
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm lg:p-10">
            <h2 className="mb-6 text-xl font-bold text-primary-900">{t.formTitle}</h2>

            {error && (
              <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
            )}

            {submitted ? (
              <div className="rounded-xl bg-emerald-50 p-10 text-center">
                <CheckCircle size={48} className="mx-auto mb-4 text-emerald-500" />
                <p className="mb-2 text-lg font-semibold text-emerald-700">{t.successTitle}</p>
                <p className="text-sm text-emerald-600">{t.successMessage}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="relative">
                    <Input name="name" value={formState.name} onChange={handleChange} required placeholder={t.fieldName} className="peer pl-10" />
                    <User size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                  </div>
                  <div className="relative">
                    <Input name="company" value={formState.company} onChange={handleChange} required placeholder={t.fieldCompany} className="peer pl-10" />
                    <Package size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                  </div>
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="relative">
                    <Input name="email" type="email" value={formState.email} onChange={handleChange} required placeholder={t.fieldEmail} className="peer pl-10" />
                    <Mail size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                  </div>
                  <div className="relative">
                    <Input name="phone" type="tel" value={formState.phone} onChange={handleChange} required placeholder={t.fieldPhone} className="peer pl-10" />
                    <Phone size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                  </div>
                </div>
                <div className="relative">
                  <Input name="address" value={formState.address} onChange={handleChange} required placeholder={t.fieldAddress} className="peer pl-10" />
                  <MapPin size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                </div>
                <select name="category" value={formState.category} onChange={handleChange} required className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm">
                  <option value="">{t.selectPlaceholder}</option>
                  {categories.map((cat) => (
                    <option key={cat.slug} value={cat.slug}>{cat.name}</option>
                  ))}
                </select>
                <div className="relative">
                  <textarea name="notes" value={formState.notes} onChange={handleChange} rows={3} placeholder={t.fieldNotes} className="peer w-full resize-none rounded-md border border-input bg-transparent py-3 pl-10 pr-4 text-sm" />
                  <MessageSquare size={16} className="pointer-events-none absolute left-3 top-3.5 text-neutral-400" />
                </div>
                <Button type="submit" disabled={loading} size="lg" className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                  {loading ? <span className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" /> : <Send size={18} />}
                  {loading ? t.submitting : t.submitButton}
                </Button>
              </form>
            )}
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
