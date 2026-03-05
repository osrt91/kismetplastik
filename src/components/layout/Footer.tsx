"use client";

import { useState } from "react";
import Link from "@/components/ui/LocaleLink";
import {
  Phone,
  Mail,
  MapPin,
  Facebook,
  Instagram,
  Linkedin,
  ArrowUp,
  Send,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";

export default function Footer() {
  const { dict } = useLocale();
  const f = dict.footer;
  const nav = dict.nav;
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const categories = (dict.homeCategories as { name: string }[])?.slice(0, 5) ?? [];
  const productHrefs = [
    "/urunler/pet-siseler",
    "/urunler/plastik-siseler",
    "/urunler/kapaklar",
    "/urunler/tipalar",
    "/urunler/parmak-spreyler",
  ];
  const productLinks = productHrefs.map((href, i) => ({ name: categories[i]?.name ?? "", href }));

  const companyLinks = [
    { name: nav.about, href: "/hakkimizda" },
    { name: f.qualityCerts, href: "/kalite" },
    { name: f.productionFacility, href: "/uretim" },
    { name: dict.components.sustainability, href: "/surdurulebilirlik" },
    { name: f.career, href: "/kariyer" },
  ];

  const supportLinks = [
    { name: f.contact, href: "/iletisim" },
    { name: nav.quote, href: "/teklif-al" },
    { name: f.dealerLogin, href: "/bayi-girisi" },
    { name: f.faq, href: "/sss" },
    { name: f.downloadCatalog, href: "/katalog" },
  ];

  const socialLinks = [
    { name: "Facebook", icon: Facebook, href: "https://www.facebook.com/kismetplastik" },
    { name: "Instagram", icon: Instagram, href: "https://www.instagram.com/kismetplastik" },
    { name: "LinkedIn", icon: Linkedin, href: "https://www.linkedin.com/company/kismetplastik" },
  ];

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail("");
    setTimeout(() => setSubscribed(false), 4000);
  };

  return (
    <footer className="relative bg-[var(--color-navy,#0a1628)] text-white overflow-hidden">
      {/* Subtle background pattern overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(245,158,11,0.4) 1px, transparent 0)",
          backgroundSize: "40px 40px",
        }}
      />
      {/* Gradient overlay for depth */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20" />

      {/* Decorative top border */}
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[var(--accent-500,#F59E0B)] to-transparent" />

      {/* Main Footer */}
      <div className="relative mx-auto max-w-7xl px-4 pb-10 pt-14 lg:px-6">
        <div className="grid gap-10 lg:grid-cols-12">
          {/* Brand */}
          <div className="lg:col-span-4">
            <Link href="/" className="mb-5 inline-flex items-center gap-2.5">
              <img
                src="/images/logo2.svg"
                alt="Kısmet Plastik"
                className="h-10 w-10 rounded-lg bg-white/10 p-1 brightness-0 invert"
              />
              <span className="text-lg font-bold tracking-tight">
                Kısmet Plastik
              </span>
            </Link>

            <p className="mb-6 max-w-xs text-[13px] leading-relaxed text-white/50">
              {f.brandDesc}
            </p>

            {/* Contact */}
            <div className="space-y-2.5">
              <a
                href="tel:+902125498703"
                className="group flex items-center gap-2.5 text-[13px] text-white/60 transition-colors hover:text-white"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-white/[0.06] transition-colors group-hover:bg-accent/20">
                  <Phone size={12} strokeWidth={1.8} />
                </span>
                0212 549 87 03
              </a>
              <a
                href="mailto:bilgi@kismetplastik.com"
                className="group flex items-center gap-2.5 text-[13px] text-white/60 transition-colors hover:text-white"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-white/[0.06] transition-colors group-hover:bg-accent/20">
                  <Mail size={12} strokeWidth={1.8} />
                </span>
                bilgi@kismetplastik.com
              </a>
              <div className="flex items-center gap-2.5 text-[13px] text-white/40">
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-white/[0.06]">
                  <MapPin size={12} strokeWidth={1.8} />
                </span>
                İkitelli OSB, Başakşehir / İstanbul
              </div>
            </div>
          </div>

          {/* Navigation Columns */}
          <div className="grid gap-8 sm:grid-cols-3 lg:col-span-5 lg:col-start-6">
            {/* Products */}
            <div>
              <h3 className="mb-4 text-[11px] font-bold uppercase tracking-[0.15em] text-accent">
                {f.productsTitle}
              </h3>
              <ul className="space-y-2">
                {productLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="inline-block text-[13px] text-white/50 transition-all duration-200 hover:text-[var(--accent-500,#F59E0B)] hover:translate-x-1"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    href="/urunler"
                    className="inline-flex items-center gap-1 text-[12px] font-medium text-accent/70 transition-all duration-200 hover:text-accent hover:translate-x-1"
                  >
                    {nav.allProducts}
                    <ExternalLink size={10} />
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="mb-4 text-[11px] font-bold uppercase tracking-[0.15em] text-accent">
                {f.companyTitle}
              </h3>
              <ul className="space-y-2">
                {companyLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="inline-block text-[13px] text-white/50 transition-all duration-200 hover:text-[var(--accent-500,#F59E0B)] hover:translate-x-1"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="mb-4 text-[11px] font-bold uppercase tracking-[0.15em] text-accent">
                {f.supportTitle}
              </h3>
              <ul className="space-y-2">
                {supportLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="inline-block text-[13px] text-white/50 transition-all duration-200 hover:text-[var(--accent-500,#F59E0B)] hover:translate-x-1"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    href="/kvkk"
                    className="inline-block text-[12px] text-white/30 transition-all duration-200 hover:text-white/60 hover:translate-x-1"
                  >
                    KVKK
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-3">
            <h3 className="mb-4 text-[11px] font-bold uppercase tracking-[0.15em] text-accent">
              {f.newsletterTitle}
            </h3>
            <p className="mb-4 text-[12px] leading-relaxed text-white/40">
              {f.newsletterDesc}
            </p>
            {subscribed ? (
              <div className="flex items-center gap-2 rounded-lg border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-400">
                <CheckCircle2 size={16} />
                {f.newsletterSuccess}
              </div>
            ) : (
              <form onSubmit={handleNewsletter} className="space-y-2.5">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={f.newsletterPlaceholder}
                  className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3.5 py-2.5 text-xs text-white placeholder-white/25 outline-none transition-all duration-200 focus:border-[var(--accent-500,#F59E0B)]/50 focus:bg-white/[0.06] focus:ring-2 focus:ring-[var(--accent-500,#F59E0B)]/20 focus:ring-offset-0"
                  required
                />
                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-xs font-bold text-accent-foreground transition-all duration-200 hover:bg-accent/90 hover:shadow-[0_0_20px_rgba(245,158,11,0.3)]"
                >
                  <Send size={12} />
                  {f.newsletterButton}
                </button>
              </form>
            )}

            {/* Social */}
            <div className="mt-6 flex items-center gap-2">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.05] text-white/40 transition-all duration-200 hover:scale-110 hover:bg-[var(--accent-500,#F59E0B)]/20 hover:text-[var(--accent-500,#F59E0B)] hover:shadow-[0_0_12px_rgba(245,158,11,0.25)]"
                  aria-label={social.name}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <social.icon size={16} strokeWidth={1.6} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative">
        {/* Gradient divider */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="relative mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 sm:flex-row lg:px-6">
          <span className="text-[11px] text-white/30">
            &copy; {new Date().getFullYear()} {f.copyright}
          </span>
          <button
            onClick={scrollToTop}
            className="group flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[11px] text-white/30 transition-all duration-200 hover:bg-white/5 hover:text-[var(--accent-500,#F59E0B)]"
          >
            <ArrowUp size={12} strokeWidth={1.8} className="transition-transform duration-200 group-hover:-translate-y-0.5" />
            {dict.components.scrollUp}
          </button>
        </div>
      </div>
    </footer>
  );
}
