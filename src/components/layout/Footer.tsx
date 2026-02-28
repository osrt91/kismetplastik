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
  ArrowUp,
  Send,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
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

  const certBadges = [
    { label: "ISO 9001", title: "ISO 9001:2015" },
    { label: "ISO 14001", title: "ISO 14001:2015" },
    { label: "FSSC 22000", title: "FSSC 22000" },
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
    <footer className="bg-[#0a1628] text-white">
      <div className="mx-auto max-w-7xl px-4 pb-6 pt-10 lg:px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="mb-4 inline-flex items-center gap-2">
              <Image
                src="/images/logo2.svg"
                alt="Kısmet Plastik"
                width={32}
                height={32}
                className="h-8 w-8 rounded-md bg-white/10 p-0.5 brightness-0 invert"
              />
              <span className="text-[15px] font-bold tracking-tight">
                Kısmet Plastik
              </span>
            </Link>

            <p className="mb-4 max-w-[220px] text-[11px] leading-relaxed text-white/45">
              {f.brandDesc}
            </p>

            <div className="space-y-2">
              <a
                href="tel:+902125498703"
                className="group flex items-center gap-2 text-[12px] text-white/55 transition-colors hover:text-white"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded bg-white/[0.06] transition-colors group-hover:bg-accent/20">
                  <Phone size={11} strokeWidth={1.8} />
                </span>
                0212 549 87 03
              </a>
              <a
                href="mailto:bilgi@kismetplastik.com"
                className="group flex items-center gap-2 text-[12px] text-white/55 transition-colors hover:text-white"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded bg-white/[0.06] transition-colors group-hover:bg-accent/20">
                  <Mail size={11} strokeWidth={1.8} />
                </span>
                bilgi@kismetplastik.com
              </a>
              <div className="flex items-center gap-2 text-[12px] text-white/35">
                <span className="flex h-6 w-6 items-center justify-center rounded bg-white/[0.06]">
                  <MapPin size={11} strokeWidth={1.8} />
                </span>
                İkitelli OSB, Başakşehir / İstanbul
              </div>
            </div>

            <div className="mt-4 flex items-center gap-1.5">
              {certBadges.map((cert) => (
                <span
                  key={cert.label}
                  title={cert.title}
                  className="inline-flex items-center gap-1 rounded border border-white/[0.08] bg-white/[0.03] px-1.5 py-0.5 text-[9px] font-medium text-white/40"
                >
                  <ShieldCheck size={10} strokeWidth={1.6} className="text-accent/60" />
                  {cert.label}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="mb-3 text-[10px] font-bold uppercase tracking-[0.15em] text-accent">
                {f.productsTitle}
              </h3>
              <ul className="space-y-1.5">
                {productLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-[12px] text-white/50 transition-colors hover:text-white"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    href="/urunler"
                    className="inline-flex items-center gap-1 text-[11px] font-medium text-accent/70 transition-colors hover:text-accent"
                  >
                    {nav.allProducts}
                    <ExternalLink size={9} />
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-3 text-[10px] font-bold uppercase tracking-[0.15em] text-accent">
                {f.companyTitle}
              </h3>
              <ul className="space-y-1.5">
                {companyLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-[12px] text-white/50 transition-colors hover:text-white"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-[10px] font-bold uppercase tracking-[0.15em] text-accent">
              {f.supportTitle}
            </h3>
            <ul className="space-y-1.5">
              {supportLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-[12px] text-white/50 transition-colors hover:text-white"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/kvkk"
                  className="text-[11px] text-white/30 transition-colors hover:text-white/60"
                >
                  KVKK
                </Link>
              </li>
            </ul>

            <div className="mt-5">
              <h3 className="mb-2.5 text-[10px] font-bold uppercase tracking-[0.15em] text-accent">
                {f.newsletterTitle}
              </h3>
              <p className="mb-2.5 text-[11px] leading-relaxed text-white/35">
                {f.newsletterDesc}
              </p>
              {subscribed ? (
                <div className="flex items-center gap-1.5 rounded-md border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-[11px] text-emerald-400">
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
                    className="flex items-center justify-center rounded-md bg-accent px-3 py-1.5 text-[11px] font-bold text-accent-foreground transition-colors hover:bg-accent/90"
                  >
                    <Send size={11} />
                  </button>
                </form>
              )}
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-[10px] font-bold uppercase tracking-[0.15em] text-accent">
              {f.socialTitle ?? "Sosyal Medya"}
            </h3>
            <div className="flex items-center gap-1.5">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="flex h-8 w-8 items-center justify-center rounded-md bg-white/[0.05] text-white/40 transition-all hover:bg-accent/20 hover:text-accent"
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

      <div className="border-t border-white/[0.06]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 lg:px-6">
          <span className="text-[10px] text-white/25">
            &copy; {new Date().getFullYear()} {f.copyright}
          </span>
          <button
            onClick={scrollToTop}
            className="flex items-center gap-1 rounded px-2 py-1 text-[10px] text-white/25 transition-colors hover:bg-white/5 hover:text-white/50"
          >
            <ArrowUp size={11} strokeWidth={1.8} />
            {dict.components.scrollUp}
          </button>
        </div>
      </div>
    </footer>
  );
}
