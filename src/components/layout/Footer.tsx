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

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail("");
    setTimeout(() => setSubscribed(false), 4000);
  };

  return (
    <footer className="relative bg-[#0A1628] text-white">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#2D9CDB]/40 to-transparent" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 20% 50%, rgba(45,156,219,0.04), transparent 60%)" }}
      />
      <div className="relative mx-auto max-w-7xl px-4 pb-4 pt-12 lg:px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="mb-3 inline-flex items-center gap-2">
              <Image
                src="/images/logo2.svg"
                alt="Kısmet Plastik"
                width={32}
                height={32}
                className="h-8 w-8 rounded-md bg-white/10 p-0.5 brightness-0 invert"
              />
              <span className="text-[15px] font-bold tracking-tight text-white/90">
                Kısmet Plastik
              </span>
            </Link>

            <p className="mb-3 max-w-[220px] text-[11px] leading-relaxed text-white/60">
              {f.brandDesc}
            </p>

            <div className="space-y-1.5">
              <a
                href="tel:+902125498703"
                className="group flex items-center gap-2 text-[12px] text-white/60 transition-colors hover:text-white"
              >
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-white/[0.06] transition-colors group-hover:bg-accent/20">
                  <Phone size={10} strokeWidth={1.8} />
                </span>
                0212 549 87 03
              </a>
              <a
                href="mailto:bilgi@kismetplastik.com"
                className="group flex items-center gap-2 text-[12px] text-white/60 transition-colors hover:text-white"
              >
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-white/[0.06] transition-colors group-hover:bg-accent/20">
                  <Mail size={10} strokeWidth={1.8} />
                </span>
                bilgi@kismetplastik.com
              </a>
              <div className="flex items-center gap-2 text-[12px] text-white/40">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-white/[0.06]">
                  <MapPin size={10} strokeWidth={1.8} />
                </span>
                İkitelli OSB, Başakşehir / İstanbul
              </div>
            </div>

            <div className="mt-3 flex items-center gap-1.5">
              {certBadges.map((cert) => (
                <span
                  key={cert.label}
                  title={cert.title}
                  className="inline-flex items-center gap-1 rounded border-l-2 border-[#2D9CDB]/40 border-r-0 border-t-0 border-b-0 bg-white/[0.03] px-2 py-0.5 text-[10px] font-medium text-white/50"
                >
                  <ShieldCheck
                    size={10}
                    strokeWidth={1.6}
                    className="text-accent/60"
                  />
                  {cert.label}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-2 text-[10px] font-bold uppercase tracking-widest bg-gradient-to-r from-[#2D9CDB] to-[#F2994A] bg-clip-text text-transparent">
              {f.productsTitle}
            </h3>
            <ul className="space-y-1">
              {productLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-[12px] text-white/60 transition-colors hover:text-white"
                  >
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
            <h3 className="mb-2 text-[10px] font-bold uppercase tracking-widest bg-gradient-to-r from-[#2D9CDB] to-[#F2994A] bg-clip-text text-transparent">
              {f.companyTitle}
            </h3>
            <ul className="space-y-1">
              {corporateLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-[12px] text-white/60 transition-colors hover:text-white"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-2 text-[10px] font-bold uppercase tracking-widest bg-gradient-to-r from-[#2D9CDB] to-[#F2994A] bg-clip-text text-transparent">
              {f.newsletterTitle}
            </h3>
            {subscribed ? (
              <div className="flex items-center gap-1.5 rounded-md border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-[11px] text-emerald-400">
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
                  className="min-w-0 flex-1 rounded-md border border-white/10 bg-white/[0.04] px-2.5 py-1.5 text-[11px] text-white placeholder-white/25 outline-none transition-colors focus:border-accent/40 focus:bg-white/[0.06]"
                  required
                />
                <button
                  type="submit"
                  className="flex items-center justify-center rounded-md bg-gradient-to-r from-[#F2994A] to-[#2D9CDB] px-3 py-1.5 text-[11px] font-bold text-white transition-all hover:brightness-110"
                >
                  <Send size={11} />
                </button>
              </form>
            )}

            <h3 className="mb-2 mt-5 text-[10px] font-bold uppercase tracking-widest bg-gradient-to-r from-[#2D9CDB] to-[#F2994A] bg-clip-text text-transparent">
              {f.socialTitle ?? "Sosyal Medya"}
            </h3>
            <div className="flex items-center gap-1.5">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="flex h-8 w-8 items-center justify-center rounded-md bg-white/[0.05] text-white/40 transition-all hover:bg-[#2D9CDB]/15 hover:text-[#2D9CDB] hover:ring-2 hover:ring-[#2D9CDB]/25"
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
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#2D9CDB]/20 to-transparent" />
        <div className="mx-auto flex h-10 max-w-7xl items-center justify-between px-4 lg:px-6">
          <span className="text-[10px] text-white/40">
            &copy; 2026 {f.copyright}
          </span>
          <div className="flex items-center gap-2 text-[10px]">
            <Link
              href="/kvkk"
              className="text-white/30 transition-colors hover:text-white/60"
            >
              KVKK
            </Link>
            <span className="text-white/15">|</span>
            <Link
              href="/gizlilik"
              className="text-white/30 transition-colors hover:text-white/60"
            >
              Gizlilik
            </Link>
          </div>
          <button
            onClick={scrollToTop}
            className="flex h-6 w-6 items-center justify-center rounded text-white/25 transition-colors hover:bg-white/5 hover:text-white/50"
            aria-label={dict.components.scrollUp}
          >
            <ArrowUp size={12} strokeWidth={1.8} />
          </button>
        </div>
      </div>
    </footer>
  );
}
