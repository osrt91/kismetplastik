"use client";

import { useState } from "react";
import Link from "@/components/ui/LocaleLink";
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
  Shield,
  Percent,
  Clock,
  Truck,
} from "lucide-react";
import AnimateOnScroll from "@/components/ui/AnimateOnScroll";
import { useLocale } from "@/contexts/LocaleContext";

const stats = [
  { value: 30, label: "İndirim", prefix: "%", suffix: "", icon: Percent },
  { value: 100, label: "Destek", prefix: "%", suffix: "", icon: Headphones },
  { value: 24, label: "Hizmet", prefix: "", suffix: "/7", icon: Clock },
  {
    value: 50,
    label: "Daha Hızlı Teslimat",
    prefix: "%",
    suffix: "",
    icon: Truck,
  },
];

export default function BayiGirisiPage() {
  const { dict } = useLocale();
  const d = dict.dealer;
  const nav = dict.nav;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const benefits = [
    {
      icon: TrendingUp,
      title: d.benefitPricing,
      description: d.benefitPricingDesc,
    },
    {
      icon: Building2,
      title: d.benefitOrders,
      description: d.benefitOrdersDesc,
    },
    {
      icon: Headphones,
      title: d.benefitSupport,
      description: d.benefitSupportDesc,
    },
    {
      icon: ShieldCheck,
      title: d.benefitRegion,
      description: d.benefitRegionDesc,
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(d.notActiveYet);
  };

  return (
    <section className="bg-white">
      {/* ── Hero ── */}
      <div
        className="relative overflow-hidden bg-gradient-to-br from-primary-900 via-primary-700 to-primary-900 py-16 lg:py-24"
        style={{
          backgroundSize: "200% 200%",
          animation: "gradient-shift 8s ease infinite",
        }}
      >
        {/* Shield watermark */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-end overflow-hidden opacity-[0.03]">
          <Shield
            size={420}
            strokeWidth={0.5}
            className="translate-x-1/4 text-white"
            style={{ animation: "float 6s ease-in-out infinite" }}
          />
        </div>
        <div
          className="pointer-events-none absolute left-8 top-12 opacity-[0.04]"
          style={{ animation: "particle-float 8s ease-in-out infinite" }}
        >
          <Lock size={100} strokeWidth={0.5} className="text-white" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 lg:px-6">
          <AnimateOnScroll animation="fade-up">
            <nav className="mb-6 flex items-center gap-1.5 text-sm text-white/60">
              <Link href="/" className="transition-colors hover:text-white">
                {nav.home}
              </Link>
              <ChevronRight size={14} />
              <span className="text-white">{nav.dealer}</span>
            </nav>
            <h1 className="mb-3 text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl">
              {d.heroTitle}
            </h1>
            <p className="max-w-2xl text-lg text-white/70">{d.heroSubtitle}</p>
          </AnimateOnScroll>
        </div>
      </div>

      {/* ── Login + Benefits ── */}
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-6 lg:py-20">
        <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Login Form */}
          <AnimateOnScroll animation="fade-right">
            <div className="relative mx-auto max-w-md lg:mx-0">
              {/* Decorative geometric shapes */}
              <div
                className="pointer-events-none absolute -left-8 -top-8 hidden h-24 w-24 rounded-2xl border-2 border-primary-100/60 lg:block"
                style={{
                  animation: "float 5s ease-in-out infinite",
                  transform: "rotate(12deg)",
                }}
              />
              <div
                className="pointer-events-none absolute -bottom-6 -right-6 hidden h-16 w-16 rounded-full border-2 border-accent-300/40 lg:block"
                style={{ animation: "float 7s ease-in-out infinite 1s" }}
              />
              <div
                className="pointer-events-none absolute -right-10 top-1/3 hidden h-12 w-12 rounded-lg bg-primary-100/30 lg:block"
                style={{
                  animation: "particle-float 6s ease-in-out infinite 0.5s",
                  transform: "rotate(-15deg)",
                }}
              />
              <div
                className="pointer-events-none absolute -left-4 bottom-1/4 hidden h-8 w-8 rounded-full bg-accent-400/20 lg:block"
                style={{
                  animation: "particle-float 8s ease-in-out infinite 2s",
                }}
              />
              <div
                className="pointer-events-none absolute -right-14 top-12 hidden h-6 w-6 rotate-45 border-2 border-primary-200/40 lg:block"
                style={{ animation: "float 9s ease-in-out infinite 0.5s" }}
              />

              {/* Card with animated gradient border */}
              <div className="animated-border-gradient rounded-2xl">
                <div className="rounded-2xl bg-white p-8 shadow-lg">
                  {/* Logo / mascot header */}
                  <div className="mb-8 flex flex-col items-center text-center">
                    <div
                      className="relative mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-700 to-primary-900 shadow-lg"
                      style={{
                        animation: "pulse-glow 3s ease-in-out infinite",
                      }}
                    >
                      <Shield size={36} className="text-white" />
                      <div className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-accent-500 shadow-md">
                        <Lock size={12} className="text-primary-900" />
                      </div>
                    </div>
                    <h2 className="text-xl font-bold text-primary-900">
                      {d.loginTitle}
                    </h2>
                    <p className="mt-1 text-sm text-neutral-500">
                      {d.loginSubtitle}
                    </p>
                  </div>

                  {/* Error / info – animated slide-down entrance */}
                  {error && (
                    <div
                      className="mb-6 rounded-xl border border-accent-300 bg-accent-100 p-4 text-sm text-accent-600"
                      style={{
                        animation:
                          "slide-down-fade 0.4s cubic-bezier(0.16,1,0.3,1) forwards",
                      }}
                    >
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                        {d.fieldEmail}
                      </label>
                      <div className="group relative">
                        <Mail
                          size={18}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 transition-colors duration-300 group-focus-within:text-primary-500"
                        />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="w-full rounded-xl border border-neutral-200 py-3 pl-11 pr-4 text-sm outline-none transition-all duration-300 focus:border-primary-500 focus:scale-[1.01] focus:shadow-[0_0_0_4px_rgba(46,106,175,0.1)]"
                          placeholder="bayi@firma.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                        {d.fieldPassword}
                      </label>
                      <div className="group relative">
                        <Lock
                          size={18}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 transition-colors duration-300 group-focus-within:text-primary-500"
                        />
                        <input
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          className="w-full rounded-xl border border-neutral-200 py-3 pl-11 pr-12 text-sm outline-none transition-all duration-300 focus:border-primary-500 focus:scale-[1.01] focus:shadow-[0_0_0_4px_rgba(46,106,175,0.1)]"
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 transition-all duration-300 hover:scale-110 hover:text-neutral-600 active:scale-95"
                        >
                          <span className="relative block h-[18px] w-[18px]">
                            <Eye
                              size={18}
                              className={`absolute inset-0 transition-all duration-300 ${
                                showPassword
                                  ? "rotate-90 scale-0 opacity-0"
                                  : "rotate-0 scale-100 opacity-100"
                              }`}
                            />
                            <EyeOff
                              size={18}
                              className={`absolute inset-0 transition-all duration-300 ${
                                showPassword
                                  ? "rotate-0 scale-100 opacity-100"
                                  : "-rotate-90 scale-0 opacity-0"
                              }`}
                            />
                          </span>
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-2 text-sm text-neutral-600">
                        <input
                          type="checkbox"
                          className="rounded border-neutral-300"
                        />
                        {d.rememberMe}
                      </label>
                      <a
                        href="#"
                        className="text-sm font-medium text-primary-700 transition-colors hover:text-primary-900"
                      >
                        {d.forgotPassword}
                      </a>
                    </div>

                    <button
                      type="submit"
                      className="group w-full rounded-xl bg-accent-500 py-3.5 font-bold text-primary-900 shadow-md transition-all duration-300 hover:scale-[1.02] hover:bg-accent-600 hover:shadow-lg active:scale-[0.98]"
                    >
                      <span className="inline-flex items-center gap-2">
                        {d.loginButton}
                        <ArrowRight
                          size={16}
                          className="transition-transform duration-300 group-hover:translate-x-1"
                        />
                      </span>
                    </button>
                  </form>

                  <div className="mt-6 border-t border-neutral-100 pt-6 text-center">
                    <p className="text-sm text-neutral-500">
                      {d.notDealer}{" "}
                      <Link
                        href="/iletisim"
                        className="font-semibold text-primary-700 transition-colors hover:text-primary-900"
                      >
                        {d.applyDealer}
                      </Link>
                    </p>
                  </div>
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

              <div className="relative space-y-4">
                {/* Connecting line between cards */}
                <div className="absolute bottom-8 left-[2.4rem] top-8 w-px bg-gradient-to-b from-primary-200 via-accent-300 to-primary-200 opacity-50" />

                {benefits.map((b, i) => (
                  <div
                    key={b.title}
                    className="group relative flex items-start gap-4 rounded-xl border border-neutral-100 bg-neutral-50 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary-200 hover:bg-white hover:shadow-md"
                  >
                    {/* Accent bar on hover */}
                    <div className="absolute left-0 top-0 h-full w-1 rounded-l-xl bg-accent-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                    <div className="relative shrink-0">
                      {/* Numbered indicator */}
                      <span className="absolute -left-1 -top-2 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-accent-500 text-[10px] font-bold text-primary-900 shadow-sm transition-transform duration-300 group-hover:scale-110">
                        {i + 1}
                      </span>
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100 text-primary-700 transition-all duration-300 group-hover:bg-primary-700 group-hover:text-white group-hover:shadow-lg">
                        <b.icon size={20} />
                      </div>
                    </div>

                    <div>
                      <h3 className="font-bold text-primary-900 transition-colors duration-300 group-hover:text-primary-700">
                        {b.title}
                      </h3>
                      <p className="text-sm text-neutral-500 transition-colors duration-300 group-hover:text-neutral-600">
                        {b.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <Link
                  href="/iletisim"
                  className="group inline-flex items-center gap-2 font-semibold text-primary-700 transition-colors hover:text-accent-600"
                >
                  {d.contactForDealer}
                  <ArrowRight
                    size={16}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </Link>
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </div>

      {/* ── Neden Bayi Olmalısınız? ── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary-900 to-primary-700 py-16 lg:py-24">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-accent-500/10 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-48 w-48 rounded-full bg-primary-300/10 blur-3xl" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 lg:px-6">
          <AnimateOnScroll animation="fade-up">
            <div className="mb-12 text-center">
              <span className="mb-3 inline-block text-sm font-bold uppercase tracking-widest text-accent-400">
                Avantajlar
              </span>
              <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                Neden Bayi Olmalısınız?
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-white/60">
                Kısmet Plastik bayi ağına katılarak ayrıcalıklı fiyatlandırma ve
                özel destekten yararlanın.
              </p>
            </div>
          </AnimateOnScroll>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, i) => (
              <AnimateOnScroll
                key={stat.label}
                animation="fade-up"
                delay={i * 150}
              >
                <div className="group relative rounded-2xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur-sm transition-all duration-500 hover:-translate-y-1 hover:border-white/20 hover:bg-white/10 hover:shadow-2xl">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-accent-500/20 text-accent-400 transition-all duration-300 group-hover:scale-110 group-hover:bg-accent-500/30">
                    <stat.icon size={28} />
                  </div>

                  <div className="mb-2 text-4xl font-extrabold text-white">
                    {stat.prefix}
                    {stat.value}
                    {stat.suffix}
                  </div>

                  <p className="font-semibold text-white/80">{stat.label}</p>

                  <div className="mx-auto mt-4 h-1.5 w-3/4 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-accent-400 to-accent-500 transition-all duration-1000 ease-out"
                      style={{ width: `${Math.min(stat.value, 100)}%` }}
                    />
                  </div>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
