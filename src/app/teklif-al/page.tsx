"use client";

import { useState } from "react";
import Link from "next/link";
import { FileText, Send, Building2, Package, ChevronRight } from "lucide-react";
import AnimateOnScroll from "@/components/ui/AnimateOnScroll";
import { categories } from "@/data/products";
import { useLocale } from "@/contexts/LocaleContext";

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
      <div className="bg-gradient-to-br from-primary-900 via-primary-700 to-primary-900 py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <AnimateOnScroll animation="fade-up">
            <nav className="mb-6 flex items-center gap-1.5 text-sm text-white/60">
              <Link href="/" className="hover:text-white">{nav.home}</Link>
              <ChevronRight size={14} />
              <span className="text-white">{nav.quote}</span>
            </nav>
            <h1 className="mb-3 text-3xl font-extrabold text-white sm:text-4xl">
              {q.heroTitle}
            </h1>
            <p className="max-w-2xl text-white/70">{q.heroSubtitle}</p>
          </AnimateOnScroll>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-12 lg:px-6 lg:py-20">
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
              <div className="rounded-xl bg-green-50 p-8 text-center">
                <p className="mb-2 text-lg font-semibold text-green-800">{q.successTitle}</p>
                <p className="text-sm text-green-700">{q.successMessage}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Firma / Kişi Bilgileri */}
                <div>
                  <h3 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-primary-700">
                    <Building2 size={16} />
                    {q.sectionCompany}
                  </h3>
                  <div className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                          {q.fieldName} *
                        </label>
                        <input type="text" name="name" value={formState.name} onChange={handleChange} required className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100" />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                          {q.fieldCompany} *
                        </label>
                        <input type="text" name="company" value={formState.company} onChange={handleChange} required className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100" />
                      </div>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                          {q.fieldEmail} *
                        </label>
                        <input type="email" name="email" value={formState.email} onChange={handleChange} required className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100" />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                          {q.fieldPhone} *
                        </label>
                        <input type="tel" name="phone" value={formState.phone} onChange={handleChange} required className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100" />
                      </div>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                        {q.fieldAddress}
                      </label>
                      <input type="text" name="address" value={formState.address} onChange={handleChange} className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100" />
                    </div>
                  </div>
                </div>

                {/* Ürün Talebi */}
                <div>
                  <h3 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-primary-700">
                    <Package size={16} />
                    {q.sectionProduct}
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                        {q.fieldCategory} *
                      </label>
                      <select name="category" value={formState.category} onChange={handleChange} required className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100">
                        <option value="">{dict.contact.formSubjectPlaceholder}</option>
                        {categories.map((cat) => (
                          <option key={cat.slug} value={cat.slug}>{cat.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                        {q.fieldProductInterest}
                      </label>
                      <input type="text" name="productInterest" value={formState.productInterest} onChange={handleChange} className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100" />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                          {q.fieldQuantity}
                        </label>
                        <input type="text" name="quantity" value={formState.quantity} onChange={handleChange} className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100" />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                          {q.fieldDeliveryDate}
                        </label>
                        <input type="date" name="deliveryDate" value={formState.deliveryDate} onChange={handleChange} className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100" />
                      </div>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                        {q.fieldNotes}
                      </label>
                      <textarea name="message" value={formState.message} onChange={handleChange} rows={4} className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100" />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-accent-500 py-4 font-bold text-primary-900 shadow-md transition-all hover:bg-accent-600 hover:shadow-lg active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed sm:w-auto sm:px-10"
                >
                  <span className="flex items-center justify-center gap-2">
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
      </div>
    </section>
  );
}
