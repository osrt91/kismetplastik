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
  Heart,
  CheckCircle2,
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
    { name: "KVKK", href: "/kvkk" },
  ];

  const socialLinks = [
    { name: "Facebook", icon: Facebook, href: "#" },
    { name: "Instagram", icon: Instagram, href: "#" },
    { name: "LinkedIn", icon: Linkedin, href: "#" },
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail("");
    setTimeout(() => setSubscribed(false), 4000);
  };

  return (
    <footer className="relative bg-primary-900 text-white">
      {/* Wave */}
      <div className="pointer-events-none absolute left-0 right-0 top-0 -translate-y-[calc(100%-1px)] overflow-hidden">
        <svg
          className="block h-10 w-full md:h-14 lg:h-16"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0,120 L0,60 C200,10 400,100 600,50 C800,0 1000,90 1200,40 L1200,120 Z"
            fill="var(--primary-900)"
          />
        </svg>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-14 lg:px-6">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-12">
          {/* Brand + Newsletter */}
          <div className="lg:col-span-4">
            <Link href="/" className="mb-4 inline-block">
              <img
                src="/images/logo2.svg"
                alt="Kısmet Plastik"
                className="h-12 w-12 rounded-lg bg-white/10 p-1.5"
              />
            </Link>

            <p className="mb-5 max-w-xs text-[13px] leading-relaxed text-white/55">
              {f.brandDesc}
            </p>

            {/* Contact Info */}
            <div className="mb-6 space-y-2">
              <a
                href="tel:+902125498703"
                className="flex items-center gap-2 text-[13px] text-white/70 transition-colors hover:text-white"
              >
                <Phone size={13} strokeWidth={1.8} />
                0212 549 87 03
              </a>
              <a
                href="mailto:bilgi@kismetplastik.com"
                className="flex items-center gap-2 text-[13px] text-white/70 transition-colors hover:text-white"
              >
                <Mail size={13} strokeWidth={1.8} />
                bilgi@kismetplastik.com
              </a>
              <p className="flex items-start gap-2 text-[13px] text-white/45">
                <MapPin size={13} strokeWidth={1.8} className="mt-0.5 shrink-0" />
                İkitelli OSB, Başakşehir/İstanbul
              </p>
            </div>

            {/* Newsletter */}
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <h4 className="mb-1 text-[13px] font-bold text-white/90">{f.newsletterTitle}</h4>
              <p className="mb-3 text-[11px] text-white/45">{f.newsletterDesc}</p>
              {subscribed ? (
                <div className="flex items-center gap-2 text-sm text-emerald-400">
                  <CheckCircle2 size={16} />
                  {f.newsletterSuccess}
                </div>
              ) : (
                <form onSubmit={handleNewsletter} className="flex gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={f.newsletterPlaceholder}
                    className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-white placeholder-white/30 outline-none transition-colors focus:border-white/25 focus:bg-white/10"
                    required
                  />
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 rounded-lg bg-accent px-3 py-2 text-xs font-semibold text-accent-foreground transition-colors hover:bg-accent/90"
                  >
                    <Send size={12} />
                    {f.newsletterButton}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Products */}
          <div className="lg:col-span-2 lg:col-start-6">
            <h3 className="mb-3 text-[11px] font-bold uppercase tracking-widest text-white/30">
              {f.productsTitle}
            </h3>
            <ul className="space-y-2">
              {productLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-[13px] text-white/55 transition-colors hover:text-white"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="lg:col-span-3">
            <h3 className="mb-3 text-[11px] font-bold uppercase tracking-widest text-white/30">
              {f.companyTitle}
            </h3>
            <ul className="space-y-2">
              {companyLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-[13px] text-white/55 transition-colors hover:text-white"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="lg:col-span-3">
            <h3 className="mb-3 text-[11px] font-bold uppercase tracking-widest text-white/30">
              {f.supportTitle}
            </h3>
            <ul className="space-y-2">
              {supportLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-[13px] text-white/55 transition-colors hover:text-white"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-5 sm:flex-row lg:px-6">
          <div className="flex items-center gap-2 text-[12px] text-white/30">
            <span>&copy; {new Date().getFullYear()} {f.copyright}</span>
            <span className="hidden sm:inline">·</span>
            <span className="hidden items-center gap-1 sm:inline-flex">
              <Heart size={10} className="text-red-400" />
              {f.madeWith}
            </span>
          </div>
          <div className="flex items-center gap-3">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.href}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/6 text-white/40 transition-colors hover:bg-white/12 hover:text-white"
                aria-label={social.name}
                target="_blank"
                rel="noopener noreferrer"
              >
                <social.icon size={15} strokeWidth={1.8} />
              </a>
            ))}
            <span className="h-3.5 w-px bg-white/10" />
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1 text-[12px] text-white/30 transition-colors hover:text-white/60"
            >
              <ArrowUp size={12} strokeWidth={1.8} />
              <span className="hidden sm:inline">{dict.components.scrollUp}</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
