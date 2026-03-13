"use client";

import { useState } from "react";
import { z } from "zod";
import Link from "@/components/ui/LocaleLink";
import {
  Package,
  Send,
  Building2,
  ChevronRight,
  User,
  Mail,
  Phone,
  Calendar,
  Hash,
  CheckCircle,
  Clock,
  ShieldCheck,
  Bell,
  MessageSquare,
  Loader2,
} from "lucide-react";
import AnimateOnScroll from "@/components/ui/AnimateOnScroll";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/contexts/LocaleContext";
import { cn } from "@/lib/utils";
import { getLocalizedFieldSync } from "@/lib/content";
import type { DbContentSection } from "@/types/database";

const preOrderSchema = z.object({
  name: z.string().min(2, "Ad Soyad en az 2 karakter olmalıdır."),
  company: z.string().min(2, "Firma adı en az 2 karakter olmalıdır."),
  email: z.string().email("Geçerli bir e-posta adresi giriniz."),
  phone: z.string().min(7, "Geçerli bir telefon numarası giriniz."),
  productName: z.string().min(2, "Ürün adı/kodu gereklidir."),
  quantity: z.number().int().positive("Miktar pozitif bir sayı olmalıdır."),
  preferredDate: z.string().optional(),
  notes: z.string().optional(),
});

const texts = {
  tr: {
    breadcrumbHome: "Ana Sayfa",
    breadcrumbPreOrder: "Ön Sipariş",
    heroTitle: "Ön Sipariş",
    heroSubtitle:
      "Stokta bulunmayan veya özel üretim ürünler için ön sipariş verin. Üretim planlamamıza dahil edelim ve size en kısa sürede temin edelim.",
    step1: "Formu Doldurun",
    step2: "Onay Alın",
    step3: "Üretim Başlat",
    formTitle: "Ön Sipariş Formu",
    formHint: "Tüm zorunlu alanları doldurunuz.",
    sectionContact: "İletişim Bilgileri",
    sectionProduct: "Ürün Bilgileri",
    fieldName: "Ad Soyad",
    fieldCompany: "Firma Adı",
    fieldEmail: "E-posta",
    fieldPhone: "Telefon",
    fieldProduct: "Ürün Adı / Kodu",
    fieldProductPlaceholder: "Örn: PET Şişe 100ml, KP-2045",
    fieldQuantity: "Miktar (adet)",
    fieldQuantityPlaceholder: "Örn: 5000",
    fieldDate: "Tercih Edilen Teslim Tarihi",
    fieldNotes: "Ek Notlar",
    fieldNotesPlaceholder:
      "Özel üretim detayları, renk, boyut veya diğer isteklerinizi belirtiniz...",
    submitButton: "Ön Sipariş Gönder",
    submitting: "Gönderiliyor...",
    successTitle: "Ön Siparişiniz Alındı!",
    successMessage:
      "Talebiniz başarıyla kaydedildi. Ekibimiz en kısa sürede sizinle iletişime geçecektir.",
    errorGeneral: "Bir hata oluştu. Lütfen tekrar deneyin.",
    errorConnection:
      "Bağlantı hatası. Lütfen internet bağlantınızı kontrol edin.",
    errorTooMany:
      "Çok fazla istek gönderdiniz. Lütfen biraz bekleyip tekrar deneyin.",
    whyPreOrder: "Ön Sipariş Avantajları",
    benefit1Title: "Üretim Önceliği",
    benefit1Desc: "Ön siparişler üretim kuyruğunda öncelikli olarak planlanır.",
    benefit2Title: "Fiyat Garantisi",
    benefit2Desc: "Sipariş anındaki fiyat üzerinden fatura kesilir.",
    benefit3Title: "Stok Bildirimi",
    benefit3Desc: "Ürün hazır olduğunda anında bilgilendirilirsiniz.",
    haveQuestions: "Sorularınız mı var?",
  },
  en: {
    breadcrumbHome: "Home",
    breadcrumbPreOrder: "Pre-Order",
    heroTitle: "Pre-Order",
    heroSubtitle:
      "Place pre-orders for out-of-stock or custom production products. We will include them in our production plan and deliver as soon as possible.",
    step1: "Fill the Form",
    step2: "Get Confirmation",
    step3: "Start Production",
    formTitle: "Pre-Order Form",
    formHint: "Please fill all required fields.",
    sectionContact: "Contact Information",
    sectionProduct: "Product Information",
    fieldName: "Full Name",
    fieldCompany: "Company Name",
    fieldEmail: "Email",
    fieldPhone: "Phone",
    fieldProduct: "Product Name / Code",
    fieldProductPlaceholder: "E.g. PET Bottle 100ml, KP-2045",
    fieldQuantity: "Quantity (pcs)",
    fieldQuantityPlaceholder: "E.g. 5000",
    fieldDate: "Preferred Delivery Date",
    fieldNotes: "Additional Notes",
    fieldNotesPlaceholder:
      "Specify custom production details, color, size or other requests...",
    submitButton: "Submit Pre-Order",
    submitting: "Submitting...",
    successTitle: "Pre-Order Received!",
    successMessage:
      "Your request has been successfully recorded. Our team will contact you shortly.",
    errorGeneral: "An error occurred. Please try again.",
    errorConnection: "Connection error. Please check your internet connection.",
    errorTooMany: "Too many requests. Please wait and try again.",
    whyPreOrder: "Pre-Order Benefits",
    benefit1Title: "Production Priority",
    benefit1Desc: "Pre-orders are prioritized in the production queue.",
    benefit2Title: "Price Guarantee",
    benefit2Desc: "You are invoiced at the price at the time of order.",
    benefit3Title: "Stock Notification",
    benefit3Desc: "You will be notified immediately when the product is ready.",
    haveQuestions: "Have questions?",
  },
};

const iconWrap =
  "pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 transition-colors duration-200 peer-focus:text-primary-500";

interface PreOrderClientProps {
  content?: Record<string, DbContentSection>;
}

export default function PreOrderClient({ content }: PreOrderClientProps) {
  const { locale } = useLocale();
  const t = texts[locale === "en" ? "en" : "tr"];

  const heroSection = content?.preorder_hero;
  const dbHeroTitle = heroSection
    ? getLocalizedFieldSync(heroSection, "title", locale)
    : "";
  const dbHeroSubtitle = heroSection
    ? getLocalizedFieldSync(heroSection, "subtitle", locale)
    : "";

  const [formState, setFormState] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    productName: "",
    quantity: "",
    preferredDate: "",
    notes: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setFieldErrors({});

    // Validate with Zod
    const parsed = preOrderSchema.safeParse({
      ...formState,
      quantity: parseInt(formState.quantity, 10) || 0,
    });

    if (!parsed.success) {
      const errors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const field = issue.path[0]?.toString();
        if (field && !errors[field]) {
          errors[field] = issue.message;
        }
      }
      setFieldErrors(errors);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/orders/pre-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const data = await res.json();

      if (res.status === 429) {
        setError(t.errorTooMany);
      } else if (data.success) {
        setSubmitted(true);
        setFormState({
          name: "",
          company: "",
          email: "",
          phone: "",
          productName: "",
          quantity: "",
          preferredDate: "",
          notes: "",
        });
      } else {
        setError(data.error || t.errorGeneral);
      }
    } catch {
      setError(t.errorConnection);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
    // Clear field error on change
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const benefitIcons = [Clock, ShieldCheck, Bell];
  const benefits = [
    { title: t.benefit1Title, desc: t.benefit1Desc },
    { title: t.benefit2Title, desc: t.benefit2Desc },
    { title: t.benefit3Title, desc: t.benefit3Desc },
  ];

  return (
    <section className="bg-[#FAFAF7] dark:bg-[#0A1628]">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#0A1628] via-[#0A1628]/90 to-[#0A1628] py-16 lg:py-20">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        <Package
          size={260}
          strokeWidth={0.5}
          className="pointer-events-none absolute -right-8 top-1/2 -translate-y-1/2 text-white/[0.04] lg:right-20"
        />

        <div className="relative mx-auto max-w-7xl px-4 lg:px-6">
          <AnimateOnScroll animation="fade-up">
            <nav className="mb-6 flex items-center gap-1.5 text-sm text-white/60">
              <Link href="/" className="transition-colors hover:text-white">
                {t.breadcrumbHome}
              </Link>
              <ChevronRight size={14} />
              <span className="text-white">{t.breadcrumbPreOrder}</span>
            </nav>
            <h1 className="mb-3 text-3xl font-extrabold text-white sm:text-4xl">
              {dbHeroTitle || t.heroTitle}
            </h1>
            <p className="max-w-2xl text-white/70">{dbHeroSubtitle || t.heroSubtitle}</p>

            {/* Steps Pipeline */}
            <div className="mt-8 flex flex-wrap items-center gap-2 sm:gap-3">
              {[t.step1, t.step2, t.step3].map((label, i) => (
                <div key={i} className="flex items-center gap-2 sm:gap-3">
                  <div
                    className={cn(
                      "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all",
                      i === 0
                        ? "bg-[#F59E0B] text-[#0A1628] shadow-lg shadow-[#F59E0B]/20"
                        : "bg-white/10 text-white/70"
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold",
                        i === 0
                          ? "bg-[#0A1628] text-white"
                          : "bg-white/20 text-white"
                      )}
                    >
                      {i + 1}
                    </span>
                    <span className="hidden sm:inline">{label}</span>
                  </div>
                  {i < 2 && (
                    <ChevronRight size={16} className="text-white/30" />
                  )}
                </div>
              ))}
            </div>
          </AnimateOnScroll>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-6 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
          {/* Main Form */}
          <AnimateOnScroll animation="fade-up">
            <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-700 dark:bg-neutral-900 lg:p-10">
              <div className="mb-8 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F59E0B]/10 text-[#F59E0B]">
                  <Package size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[#0A1628] dark:text-white">
                    {t.formTitle}
                  </h2>
                  <p className="text-sm text-neutral-500">{t.formHint}</p>
                </div>
              </div>

              {error && (
                <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-400">
                  {error}
                </div>
              )}

              {submitted ? (
                <div
                  className="relative overflow-hidden rounded-xl bg-green-50 p-10 text-center dark:bg-green-950/20"
                  style={{ animation: "scale-in 0.4s ease-out" }}
                >
                  <div className="relative z-10">
                    <div
                      className="mx-auto mb-5 flex h-24 w-24 items-center justify-center rounded-full bg-green-100 shadow-lg shadow-green-500/20 dark:bg-green-900/30"
                      style={{
                        animation: "scale-in 0.5s ease-out 0.1s both",
                      }}
                    >
                      <CheckCircle
                        size={48}
                        className="text-green-600 dark:text-green-400"
                        style={{
                          animation: "scale-in 0.4s ease-out 0.3s both",
                        }}
                      />
                    </div>
                    <p className="mb-2 text-lg font-semibold text-green-700 dark:text-green-400">
                      {t.successTitle}
                    </p>
                    <p className="text-sm text-green-600 dark:text-green-500">
                      {t.successMessage}
                    </p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Section 1: Contact Info */}
                  <div>
                    <h3 className="mb-5 flex items-center gap-3 text-sm font-bold uppercase tracking-wider text-[#0A1628] dark:text-white">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0A1628] text-xs font-bold text-white">
                        1
                      </span>
                      {t.sectionContact}
                    </h3>
                    <div className="space-y-4">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <Label
                            htmlFor="preorder-name"
                            className="mb-1.5 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
                          >
                            {t.fieldName} *
                          </Label>
                          <div className="relative">
                            <Input
                              id="preorder-name"
                              type="text"
                              name="name"
                              value={formState.name}
                              onChange={handleChange}
                              required
                              className={cn(
                                "peer pl-10",
                                fieldErrors.name && "border-red-500"
                              )}
                            />
                            <User size={16} className={iconWrap} />
                          </div>
                          {fieldErrors.name && (
                            <p className="mt-1 text-xs text-red-600">
                              {fieldErrors.name}
                            </p>
                          )}
                        </div>
                        <div>
                          <Label
                            htmlFor="preorder-company"
                            className="mb-1.5 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
                          >
                            {t.fieldCompany} *
                          </Label>
                          <div className="relative">
                            <Input
                              id="preorder-company"
                              type="text"
                              name="company"
                              value={formState.company}
                              onChange={handleChange}
                              required
                              className={cn(
                                "peer pl-10",
                                fieldErrors.company && "border-red-500"
                              )}
                            />
                            <Building2 size={16} className={iconWrap} />
                          </div>
                          {fieldErrors.company && (
                            <p className="mt-1 text-xs text-red-600">
                              {fieldErrors.company}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <Label
                            htmlFor="preorder-email"
                            className="mb-1.5 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
                          >
                            {t.fieldEmail} *
                          </Label>
                          <div className="relative">
                            <Input
                              id="preorder-email"
                              type="email"
                              name="email"
                              value={formState.email}
                              onChange={handleChange}
                              required
                              className={cn(
                                "peer pl-10",
                                fieldErrors.email && "border-red-500"
                              )}
                            />
                            <Mail size={16} className={iconWrap} />
                          </div>
                          {fieldErrors.email && (
                            <p className="mt-1 text-xs text-red-600">
                              {fieldErrors.email}
                            </p>
                          )}
                        </div>
                        <div>
                          <Label
                            htmlFor="preorder-phone"
                            className="mb-1.5 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
                          >
                            {t.fieldPhone} *
                          </Label>
                          <div className="relative">
                            <Input
                              id="preorder-phone"
                              type="tel"
                              name="phone"
                              value={formState.phone}
                              onChange={handleChange}
                              required
                              className={cn(
                                "peer pl-10",
                                fieldErrors.phone && "border-red-500"
                              )}
                            />
                            <Phone size={16} className={iconWrap} />
                          </div>
                          {fieldErrors.phone && (
                            <p className="mt-1 text-xs text-red-600">
                              {fieldErrors.phone}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <hr className="border-neutral-100 dark:border-neutral-800" />

                  {/* Section 2: Product Info */}
                  <div>
                    <h3 className="mb-5 flex items-center gap-3 text-sm font-bold uppercase tracking-wider text-[#0A1628] dark:text-white">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0A1628] text-xs font-bold text-white">
                        2
                      </span>
                      {t.sectionProduct}
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <Label
                          htmlFor="preorder-product"
                          className="mb-1.5 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
                        >
                          {t.fieldProduct} *
                        </Label>
                        <div className="relative">
                          <Input
                            id="preorder-product"
                            type="text"
                            name="productName"
                            value={formState.productName}
                            onChange={handleChange}
                            required
                            placeholder={t.fieldProductPlaceholder}
                            className={cn(
                              "peer pl-10",
                              fieldErrors.productName && "border-red-500"
                            )}
                          />
                          <Package size={16} className={iconWrap} />
                        </div>
                        {fieldErrors.productName && (
                          <p className="mt-1 text-xs text-red-600">
                            {fieldErrors.productName}
                          </p>
                        )}
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <Label
                            htmlFor="preorder-quantity"
                            className="mb-1.5 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
                          >
                            {t.fieldQuantity} *
                          </Label>
                          <div className="relative">
                            <Input
                              id="preorder-quantity"
                              type="number"
                              name="quantity"
                              value={formState.quantity}
                              onChange={handleChange}
                              required
                              min={1}
                              placeholder={t.fieldQuantityPlaceholder}
                              className={cn(
                                "peer pl-10",
                                fieldErrors.quantity && "border-red-500"
                              )}
                            />
                            <Hash size={16} className={iconWrap} />
                          </div>
                          {fieldErrors.quantity && (
                            <p className="mt-1 text-xs text-red-600">
                              {fieldErrors.quantity}
                            </p>
                          )}
                        </div>
                        <div>
                          <Label
                            htmlFor="preorder-date"
                            className="mb-1.5 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
                          >
                            {t.fieldDate}
                          </Label>
                          <div className="relative">
                            <Input
                              id="preorder-date"
                              type="date"
                              name="preferredDate"
                              value={formState.preferredDate}
                              onChange={handleChange}
                              className="peer pl-10"
                            />
                            <Calendar size={16} className={iconWrap} />
                          </div>
                        </div>
                      </div>
                      <div>
                        <Label
                          htmlFor="preorder-notes"
                          className="mb-1.5 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
                        >
                          {t.fieldNotes}
                        </Label>
                        <div className="relative">
                          <Textarea
                            id="preorder-notes"
                            name="notes"
                            value={formState.notes}
                            onChange={handleChange}
                            rows={4}
                            placeholder={t.fieldNotesPlaceholder}
                            className="peer pl-10"
                          />
                          <MessageSquare
                            size={16}
                            className="pointer-events-none absolute left-3.5 top-3.5 text-neutral-400 transition-colors duration-200 peer-focus:text-primary-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    size="lg"
                    className="w-full bg-[#F59E0B] text-[#0A1628] hover:bg-[#F59E0B]/90 sm:w-auto"
                  >
                    {loading ? (
                      <Loader2 size={20} className="animate-spin" />
                    ) : (
                      <Send size={20} />
                    )}
                    {loading ? t.submitting : t.submitButton}
                  </Button>
                </form>
              )}
            </div>
          </AnimateOnScroll>

          {/* Benefits Sidebar */}
          <AnimateOnScroll animation="fade-left" className="hidden lg:block">
            <div className="sticky top-28 space-y-4">
              <h3 className="mb-2 text-sm font-bold uppercase tracking-wider text-[#0A1628] dark:text-white">
                {t.whyPreOrder}
              </h3>

              {benefits.map((b, i) => {
                const Icon = benefitIcons[i];
                return (
                  <div
                    key={i}
                    className="group flex gap-3 rounded-xl border border-neutral-100 bg-white p-4 transition-all duration-300 hover:border-[#F59E0B]/30 hover:bg-[#F59E0B]/5 hover:shadow-sm dark:border-neutral-700 dark:bg-neutral-900 dark:hover:border-[#F59E0B]/40"
                    style={{
                      animation: `fade-in-up 0.5s ease-out ${0.1 + i * 0.1}s both`,
                    }}
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#0A1628]/5 text-[#0A1628] transition-colors duration-300 group-hover:bg-[#F59E0B] group-hover:text-[#0A1628] dark:bg-white/10 dark:text-white">
                      <Icon size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#0A1628] dark:text-white">
                        {b.title}
                      </p>
                      <p className="text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
                        {b.desc}
                      </p>
                    </div>
                  </div>
                );
              })}

              <div className="mt-6 rounded-xl border border-[#F59E0B]/30 bg-[#F59E0B]/10 p-4 text-center dark:border-[#F59E0B]/40 dark:bg-[#F59E0B]/5">
                <p className="text-sm font-semibold text-[#0A1628] dark:text-white">
                  {t.haveQuestions}
                </p>
                <a
                  href="tel:+902125498703"
                  className="mt-1 inline-flex items-center gap-1.5 text-sm font-bold text-[#0A1628] transition-colors hover:text-[#F59E0B] dark:text-white dark:hover:text-[#F59E0B]"
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
