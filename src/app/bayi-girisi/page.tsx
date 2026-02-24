"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ChevronRight,
  Lock,
  Mail,
  Eye,
  EyeOff,
  Building2,
  TrendingUp,
  Headphones,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import AnimateOnScroll from "@/components/ui/AnimateOnScroll";
import { useLocale } from "@/contexts/LocaleContext";

export default function BayiGirisiPage() {
  const { dict } = useLocale();
  const d = dict.dealer;
  const nav = dict.nav;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const benefits = [
    { icon: TrendingUp, title: d.benefitPricing, description: d.benefitPricingDesc },
    { icon: Building2, title: d.benefitOrders, description: d.benefitOrdersDesc },
    { icon: Headphones, title: d.benefitSupport, description: d.benefitSupportDesc },
    { icon: ShieldCheck, title: d.benefitRegion, description: d.benefitRegionDesc },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(d.notActiveYet);
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
              <span className="text-white">{nav.dealer}</span>
            </nav>
            <h1 className="mb-3 text-3xl font-extrabold text-white sm:text-4xl">
              {d.heroTitle}
            </h1>
            <p className="max-w-2xl text-white/70">
              {d.heroSubtitle}
            </p>
          </AnimateOnScroll>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-6 lg:py-20">
        <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Login Form */}
          <AnimateOnScroll animation="fade-right">
            <div className="mx-auto max-w-md lg:mx-0">
              <div className="rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
                <div className="mb-8 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50">
                    <Lock size={24} className="text-primary-700" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-primary-900">{d.loginTitle}</h2>
                    <p className="text-sm text-neutral-500">{d.loginSubtitle}</p>
                  </div>
                </div>

                {error && (
                  <div className="mb-6 rounded-xl bg-amber-50 border border-amber-200 p-4 text-sm text-amber-800">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                      {d.fieldEmail}
                    </label>
                    <div className="relative">
                      <Mail
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
                      />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full rounded-xl border border-neutral-200 py-3 pl-11 pr-4 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                        placeholder="bayi@firma.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                      {d.fieldPassword}
                    </label>
                    <div className="relative">
                      <Lock
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
                      />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full rounded-xl border border-neutral-200 py-3 pl-11 pr-12 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 text-sm text-neutral-600">
                      <input type="checkbox" className="rounded border-neutral-300" />
                      {d.rememberMe}
                    </label>
                    <a href="#" className="text-sm font-medium text-primary-700 hover:text-primary-900">
                      {d.forgotPassword}
                    </a>
                  </div>

                  <button
                    type="submit"
                    className="w-full rounded-xl bg-accent-500 py-3.5 font-bold text-primary-900 shadow-md transition-all hover:bg-accent-600 hover:shadow-lg active:scale-[0.99]"
                  >
                    {d.loginButton}
                  </button>
                </form>

                <div className="mt-6 border-t border-neutral-100 pt-6 text-center">
                  <p className="text-sm text-neutral-500">
                    {d.notDealer}{" "}
                    <Link
                      href="/iletisim"
                      className="font-semibold text-primary-700 hover:text-primary-900"
                    >
                      {d.applyDealer}
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </AnimateOnScroll>

          {/* Benefits */}
          <AnimateOnScroll animation="fade-left">
            <div>
              <span className="mb-3 inline-block text-sm font-bold uppercase tracking-widest text-accent-500">
                {d.benefitsOverline}
              </span>
              <h2 className="mb-6 text-2xl font-extrabold text-primary-900 sm:text-3xl">
                {d.benefitsTitle}
              </h2>
              <p className="mb-8 leading-relaxed text-neutral-600">
                {d.benefitsDesc}
              </p>

              <div className="space-y-4">
                {benefits.map((b) => (
                  <div
                    key={b.title}
                    className="flex items-start gap-4 rounded-xl border border-neutral-100 bg-neutral-50 p-5 transition-all hover:border-primary-100 hover:bg-white hover:shadow-sm"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-100 text-primary-700">
                      <b.icon size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-primary-900">{b.title}</h3>
                      <p className="text-sm text-neutral-500">{b.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <Link
                  href="/iletisim"
                  className="inline-flex items-center gap-2 font-semibold text-primary-700 transition-colors hover:text-accent-600"
                >
                  {d.contactForDealer}
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  );
}
