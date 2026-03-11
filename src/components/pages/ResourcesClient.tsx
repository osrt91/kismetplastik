"use client";

import { useState } from "react";
import Link from "@/components/ui/LocaleLink";
import {
  FileText,
  Download,
  X,
  ChevronRight,
  BookOpen,
  AlertCircle,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import { resources } from "@/data/resources";
import { cn } from "@/lib/utils";
import type { Resource } from "@/data/resources";

interface LeadForm {
  name: string;
  email: string;
  company: string;
}

interface FormErrors {
  name?: string;
  email?: string;
}

const categoryColors: Record<string, { badge: string; accent: string; gradient: string }> = {
  Rehber: {
    badge: "bg-amber-100 text-amber-700",
    accent: "text-amber-500",
    gradient: "from-amber-50 to-amber-100/50",
  },
  "Teknik Dokuman": {
    badge: "bg-sky-100 text-sky-700",
    accent: "text-sky-500",
    gradient: "from-sky-50 to-sky-100/50",
  },
  Rapor: {
    badge: "bg-emerald-100 text-emerald-700",
    accent: "text-emerald-500",
    gradient: "from-emerald-50 to-emerald-100/50",
  },
  Kalite: {
    badge: "bg-violet-100 text-violet-700",
    accent: "text-violet-500",
    gradient: "from-violet-50 to-violet-100/50",
  },
};

const defaultCategoryColor = {
  badge: "bg-neutral-100 text-neutral-700",
  accent: "text-neutral-500",
  gradient: "from-neutral-50 to-neutral-100/50",
};

function getCategoryColor(category: string) {
  return categoryColors[category] || defaultCategoryColor;
}

export default function ResourcesClient() {
  const { locale } = useLocale();
  const isTr = locale === "tr";

  const [modalResource, setModalResource] = useState<Resource | null>(null);
  const [form, setForm] = useState<LeadForm>({ name: "", email: "", company: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{
    success: boolean;
    message: string;
    downloadUrl?: string;
  } | null>(null);

  function openModal(resource: Resource) {
    setModalResource(resource);
    setForm({ name: "", email: "", company: "" });
    setErrors({});
    setSubmitResult(null);
  }

  function closeModal() {
    setModalResource(null);
    setForm({ name: "", email: "", company: "" });
    setErrors({});
    setSubmitResult(null);
    setSubmitting(false);
  }

  function validate(): boolean {
    const newErrors: FormErrors = {};

    if (!form.name.trim()) {
      newErrors.name = isTr ? "Ad Soyad zorunludur." : "Full name is required.";
    } else if (form.name.trim().length < 2) {
      newErrors.name = isTr ? "Ad Soyad en az 2 karakter olmalıdır." : "Full name must be at least 2 characters.";
    }

    if (!form.email.trim()) {
      newErrors.email = isTr ? "E-posta zorunludur." : "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = isTr ? "Geçerli bir e-posta adresi giriniz." : "Please enter a valid email address.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!validate() || !modalResource) return;

    setSubmitting(true);
    setSubmitResult(null);

    try {
      const res = await fetch("/api/resources/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          company: form.company.trim(),
          resourceId: modalResource.id,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setSubmitResult({
          success: true,
          message: isTr
            ? "İndirme bağlantınız hazır!"
            : "Your download link is ready!",
          downloadUrl: data.downloadUrl,
        });
      } else {
        setSubmitResult({
          success: false,
          message: data.error || (isTr ? "Bir hata oluştu." : "An error occurred."),
        });
      }
    } catch {
      setSubmitResult({
        success: false,
        message: isTr
          ? "Bir hata oluştu. Lütfen tekrar deneyin."
          : "An error occurred. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="min-h-screen bg-[#FAFAF7]">
      {/* Hero */}
      <div className="bg-gradient-to-br from-[#0A1628] via-[#0A1628]/95 to-[#0A1628] py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <nav className="mb-6 flex items-center gap-1.5 text-sm text-white/60">
            <Link href="/" className="hover:text-white">
              {isTr ? "Ana Sayfa" : "Home"}
            </Link>
            <ChevronRight size={14} />
            <span className="text-white">
              {isTr ? "Kaynaklar" : "Resources"}
            </span>
          </nav>
          <h1 className="mb-3 text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl">
            {isTr ? "Kaynaklar & Rehberler" : "Resources & Guides"}
          </h1>
          <p className="max-w-2xl text-lg text-white/70">
            {isTr
              ? "Kozmetik ambalaj sektörü için hazırlanan teknik rehberler, spesifikasyonlar ve sürdürülebilirlik raporları."
              : "Technical guides, specifications and sustainability reports prepared for the cosmetic packaging industry."}
          </p>
        </div>
      </div>

      {/* Resource Cards Grid */}
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-6 lg:py-20">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {resources.map((resource) => {
            const color = getCategoryColor(resource.category);
            const title = isTr ? resource.title : resource.titleEn;
            const description = isTr ? resource.description : resource.descriptionEn;
            const category = isTr ? resource.category : resource.categoryEn;

            return (
              <article
                key={resource.id}
                className="group flex flex-col overflow-hidden rounded-2xl border border-neutral-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                {/* Cover Image Placeholder */}
                <div
                  className={cn(
                    "relative flex h-48 items-center justify-center bg-gradient-to-br",
                    color.gradient
                  )}
                >
                  <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                      backgroundImage:
                        "radial-gradient(circle, currentColor 1px, transparent 1px)",
                      backgroundSize: "20px 20px",
                    }}
                  />
                  <FileText
                    size={48}
                    className={cn("transition-transform duration-300 group-hover:scale-110", color.accent)}
                  />
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col p-6">
                  <div className="mb-3 flex items-center gap-3">
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-1 text-xs font-semibold",
                        color.badge
                      )}
                    >
                      {category}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-neutral-400">
                      <BookOpen size={12} />
                      {resource.pageCount} {isTr ? "sayfa" : "pages"}
                    </span>
                  </div>

                  <h2 className="mb-2 text-lg font-bold text-[#0A1628] transition-colors group-hover:text-[#F59E0B]">
                    {title}
                  </h2>

                  <p className="mb-6 flex-1 text-sm leading-relaxed text-neutral-500">
                    {description}
                  </p>

                  <button
                    onClick={() => openModal(resource)}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0A1628] px-5 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-[#0A1628]/90 hover:shadow-md active:scale-[0.98]"
                  >
                    <Download size={16} />
                    {isTr ? "Ucretsiz Indir" : "Download Free"}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* Lead Capture Modal */}
      {modalResource && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
            {/* Modal Header */}
            <div className="relative bg-gradient-to-r from-[#0A1628] to-[#0A1628]/90 px-6 py-5">
              <button
                onClick={closeModal}
                className="absolute right-4 top-4 rounded-full p-1 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
                aria-label={isTr ? "Kapat" : "Close"}
              >
                <X size={20} />
              </button>
              <h3 className="pr-8 text-lg font-bold text-white">
                {isTr ? "Kaynak Indir" : "Download Resource"}
              </h3>
              <p className="mt-1 text-sm text-white/60">
                {isTr
                  ? modalResource.title
                  : modalResource.titleEn}
              </p>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {submitResult?.success ? (
                <div className="text-center">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100">
                    <CheckCircle size={28} className="text-emerald-600" />
                  </div>
                  <p className="mb-2 text-lg font-semibold text-[#0A1628]">
                    {submitResult.message}
                  </p>
                  <p className="mb-6 text-sm text-neutral-500">
                    {isTr
                      ? "Asagidaki butona tiklayarak dosyanizi indirebilirsiniz."
                      : "Click the button below to download your file."}
                  </p>
                  <a
                    href={submitResult.downloadUrl}
                    download
                    className="inline-flex items-center gap-2 rounded-xl bg-[#F59E0B] px-6 py-3 text-sm font-semibold text-[#0A1628] transition-all hover:bg-[#F59E0B]/90 hover:shadow-md"
                  >
                    <Download size={16} />
                    {isTr ? "PDF Indir" : "Download PDF"}
                  </a>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate>
                  {submitResult && !submitResult.success && (
                    <div className="mb-4 flex items-start gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                      <AlertCircle size={16} className="mt-0.5 shrink-0" />
                      {submitResult.message}
                    </div>
                  )}

                  {/* Name Field */}
                  <div className="mb-4">
                    <label
                      htmlFor="lead-name"
                      className="mb-1.5 block text-sm font-medium text-[#0A1628]"
                    >
                      {isTr ? "Ad Soyad" : "Full Name"} <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="lead-name"
                      type="text"
                      value={form.name}
                      onChange={(e) => {
                        setForm((prev) => ({ ...prev, name: e.target.value }));
                        if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
                      }}
                      placeholder={isTr ? "Adiniz Soyadiniz" : "Your full name"}
                      className={cn(
                        "w-full rounded-xl border bg-[#FAFAF7] px-4 py-3 text-sm text-[#0A1628] outline-none transition-colors placeholder:text-neutral-400 focus:ring-2",
                        errors.name
                          ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                          : "border-neutral-200 focus:border-[#F59E0B] focus:ring-[#F59E0B]/20"
                      )}
                    />
                    {errors.name && (
                      <p className="mt-1 text-xs text-red-600">{errors.name}</p>
                    )}
                  </div>

                  {/* Email Field */}
                  <div className="mb-4">
                    <label
                      htmlFor="lead-email"
                      className="mb-1.5 block text-sm font-medium text-[#0A1628]"
                    >
                      {isTr ? "E-posta" : "Email"} <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="lead-email"
                      type="email"
                      value={form.email}
                      onChange={(e) => {
                        setForm((prev) => ({ ...prev, email: e.target.value }));
                        if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                      }}
                      placeholder={isTr ? "ornek@firma.com" : "example@company.com"}
                      className={cn(
                        "w-full rounded-xl border bg-[#FAFAF7] px-4 py-3 text-sm text-[#0A1628] outline-none transition-colors placeholder:text-neutral-400 focus:ring-2",
                        errors.email
                          ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                          : "border-neutral-200 focus:border-[#F59E0B] focus:ring-[#F59E0B]/20"
                      )}
                    />
                    {errors.email && (
                      <p className="mt-1 text-xs text-red-600">{errors.email}</p>
                    )}
                  </div>

                  {/* Company Field */}
                  <div className="mb-6">
                    <label
                      htmlFor="lead-company"
                      className="mb-1.5 block text-sm font-medium text-[#0A1628]"
                    >
                      {isTr ? "Firma" : "Company"}
                    </label>
                    <input
                      id="lead-company"
                      type="text"
                      value={form.company}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, company: e.target.value }))
                      }
                      placeholder={isTr ? "Firma adiniz (opsiyonel)" : "Your company name (optional)"}
                      className="w-full rounded-xl border border-neutral-200 bg-[#FAFAF7] px-4 py-3 text-sm text-[#0A1628] outline-none transition-colors placeholder:text-neutral-400 focus:border-[#F59E0B] focus:ring-2 focus:ring-[#F59E0B]/20"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className={cn(
                      "flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-all duration-200",
                      submitting
                        ? "cursor-not-allowed bg-neutral-300 text-neutral-500"
                        : "bg-[#F59E0B] text-[#0A1628] hover:bg-[#F59E0B]/90 hover:shadow-md active:scale-[0.98]"
                    )}
                  >
                    {submitting ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        {isTr ? "Gönderiliyor..." : "Submitting..."}
                      </>
                    ) : (
                      <>
                        <Download size={16} />
                        {isTr ? "Gonder ve Indir" : "Submit & Download"}
                      </>
                    )}
                  </button>

                  <p className="mt-3 text-center text-xs text-neutral-400">
                    {isTr
                      ? "Bilgileriniz gizli tutulacaktir. Spam gondermeyiz."
                      : "Your information will be kept confidential. We do not send spam."}
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
