"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "@/components/ui/LocaleLink";
import {
  Phone,
  Mail,
  MapPin,
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
  ArrowUp,
  Send,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";

export default function Footer() {
  const { dict } = useLocale();
  const f = dict.footer;
  const nav = dict.nav;
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const categories =
    (dict.homeCategories as { name: string }[])?.slice(0, 5) ?? [];
  const productHrefs = [
    "/urunler/pet-siseler",
    "/urunler/plastik-siseler",
    "/urunler/kapaklar",
    "/urunler/tipalar",
    "/urunler/parmak-spreyler",
  ];
  const productLinks = productHrefs.map((href, i) => ({
    name: categories[i]?.name ?? "",
    href,
  }));

  const corporateLinks = [
    { name: nav.about, href: "/hakkimizda" },
    { name: f.qualityCerts, href: "/kalite" },
    { name: f.productionFacility, href: "/uretim" },
    { name: f.contact, href: "/iletisim" },
    { name: nav.quote, href: "/teklif-al" },
    { name: f.faq, href: "/sss" },
    { name: f.dealerLogin, href: "/bayi-girisi" },
    { name: f.downloadCatalog, href: "/katalog" },
  ];

  const socialLinks = [
    {
      name: "Facebook",
      icon: Facebook,
      href: "https://www.facebook.com/kismetplastik",
    },
    {
      name: "Instagram",
      icon: Instagram,
      href: "https://www.instagram.com/kismetplastik",
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      href: "https://www.linkedin.com/company/kismetplastik",
    },
    {
      name: "YouTube",
      icon: Youtube,
      href: "https://www.youtube.com/@kismetplastik",
    },
  ];

  const certBadges = [
    { label: "ISO 9001", title: "ISO 9001:2015" },
    { label: "ISO 14001", title: "ISO 14001:2015" },
    { label: "FSSC 22000", title: "FSSC 22000" },
  ];

  const scrollToTop = () =>
    window.scrollTo({ top: 0, behavior: "smooth" });

  const [submitting, setSubmitting] = useState(false);

  const handleNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || submitting) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      if (res.ok) {
        setSubscribed(true);
        setEmail("");
        setTimeout(() => setSubscribed(false), 4000);
      }
    } catch {
      /* network error - silent fail */
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <footer className="relative bg-[#0A1628] text-white">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#2D9CDB]/40 to-transparent" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 20% 50%, rgba(45,156,219,0.04), transparent 60%), radial-gradient(ellipse at 80% 80%, rgba(242,153,74,0.02), transparent 60%)" }}
      />

      {/* Back to top floating button */}
      <button
        onClick={scrollToTop}
        className="absolute -top-5 right-8 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#2D9CDB] to-[#2D9CDB]/80 text-white shadow-lg shadow-[#2D9CDB]/20 transition-all hover:shadow-xl hover:shadow-[#2D9CDB]/30 hover:scale-110 active:scale-95"
        aria-label={dict.components.scrollUp}
      >
        <ArrowUp size={18} strokeWidth={2} />
      </button>

      <div className="relative mx-auto max-w-7xl px-4 pb-3 pt-10 lg:px-6">
        <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-[1.2fr_0.8fr_0.8fr_1.2fr]">
          <div>
            <Link href="/" className="mb-3 inline-flex items-center gap-2.5 group">
              <Image
                src="/images/logo2.svg"
                alt="Kısmet Plastik"
                width={32}
                height={32}
                className="h-8 w-8 rounded-lg bg-white/10 p-0.5 brightness-0 invert transition-transform group-hover:scale-105"
              />
              <span className="text-[15px] font-bold tracking-tight text-white/90">
                Kısmet Plastik
              </span>
            </Link>

            <p className="mb-3 max-w-[220px] text-[11px] leading-relaxed text-white/50">
              {f.brandDesc}
            </p>

            <div className="space-y-1">
              <a
                href="tel:+902125498703"
                className="group flex items-center gap-2 text-[12px] text-white/55 transition-colors hover:text-white"
              >
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-white/[0.06] transition-all group-hover:bg-[#2D9CDB]/20 group-hover:scale-110">
                  <Phone size={10} strokeWidth={1.8} />
                </span>
                0212 549 87 03
              </a>
              <a
                href="mailto:bilgi@kismetplastik.com"
                className="group flex items-center gap-2 text-[12px] text-white/55 transition-colors hover:text-white"
              >
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-white/[0.06] transition-all group-hover:bg-[#2D9CDB]/20 group-hover:scale-110">
                  <Mail size={10} strokeWidth={1.8} />
                </span>
                bilgi@kismetplastik.com
              </a>
              <div className="flex items-center gap-2 text-[12px] text-white/35">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-white/[0.06]">
                  <MapPin size={10} strokeWidth={1.8} />
                </span>
                İkitelli OSB, Başakşehir / İstanbul
              </div>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-1.5">
              {certBadges.map((cert) => (
                <span
                  key={cert.label}
                  title={cert.title}
                  className="inline-flex items-center gap-1 rounded-md border border-[#2D9CDB]/10 bg-white/[0.03] px-2 py-0.5 text-[9px] font-semibold text-white/45 uppercase tracking-wider transition-colors hover:border-[#2D9CDB]/25 hover:text-white/60"
                >
                  <ShieldCheck
                    size={9}
                    strokeWidth={1.6}
                    className="text-[#2D9CDB]/50"
                  />
                  {cert.label}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-2.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#2D9CDB]/80">
              {f.productsTitle}
            </h3>
            <ul className="space-y-1">
              {productLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-1 text-[12px] text-white/55 transition-colors hover:text-white"
                  >
                    <span className="h-px w-0 bg-[#F2994A] transition-all duration-200 group-hover:w-2" />
                    {link.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/urunler"
                  className="inline-flex items-center gap-1 text-[12px] font-medium text-[#2D9CDB]/70 transition-colors hover:text-[#2D9CDB]"
                >
                  {nav.allProducts} &rarr;
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-2.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#2D9CDB]/80">
              {f.companyTitle}
            </h3>
            <ul className="space-y-1">
              {corporateLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-1 text-[12px] text-white/55 transition-colors hover:text-white"
                  >
                    <span className="h-px w-0 bg-[#F2994A] transition-all duration-200 group-hover:w-2" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-2.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#2D9CDB]/80">
              {f.newsletterTitle}
            </h3>
            {subscribed ? (
              <div className="flex items-center gap-1.5 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-[11px] text-emerald-400">
                <CheckCircle2 size={13} />
                {f.newsletterSuccess}
              </div>
            ) : (
              <form onSubmit={handleNewsletter} className="flex gap-1.5">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={f.newsletterPlaceholder}
                  className="min-w-0 flex-1 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-[11px] text-white placeholder-white/25 outline-none transition-all focus:border-[#2D9CDB]/40 focus:bg-white/[0.06] focus:ring-1 focus:ring-[#2D9CDB]/20"
                  required
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center justify-center rounded-lg bg-gradient-to-r from-[#F2994A] to-[#D98A35] px-3.5 py-2 text-[11px] font-bold text-white transition-all hover:shadow-md hover:shadow-[#F2994A]/20 hover:brightness-110 active:scale-95 disabled:opacity-50"
                >
                  <Send size={12} className={submitting ? "animate-pulse" : ""} />
                </button>
              </form>
            )}

            <h3 className="mb-2 mt-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[#2D9CDB]/80">
              {f.socialTitle ?? "Sosyal Medya"}
            </h3>
            <div className="flex items-center gap-2">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.05] text-white/40 transition-all duration-200 hover:bg-gradient-to-br hover:from-[#2D9CDB]/20 hover:to-[#F2994A]/10 hover:text-white hover:scale-110 hover:shadow-md hover:shadow-[#2D9CDB]/10"
                  aria-label={social.name}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <social.icon size={15} strokeWidth={1.6} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="relative">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
        <div className="mx-auto flex h-10 max-w-7xl items-center justify-between px-4 lg:px-6">
          <span className="text-[10px] text-white/35">
            &copy; 2026 {f.copyright}
          </span>
          <div className="flex items-center gap-3 text-[10px]">
            <Link
              href="/kvkk"
              className="text-white/30 transition-colors hover:text-white/60"
            >
              KVKK
            </Link>
            <span className="h-2.5 w-px bg-white/10" />
            <Link
              href="/gizlilik"
              className="text-white/30 transition-colors hover:text-white/60"
            >
              Gizlilik
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
