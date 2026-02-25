"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Phone,
  Mail,
  MapPin,
  Facebook,
  Instagram,
  Linkedin,
  ArrowUpRight,
  ArrowUp,
} from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";

export default function Footer() {
  const { dict } = useLocale();
  const f = dict.footer;
  const nav = dict.nav;

  const productLinks = [
    { name: "PET Şişeler", href: "/urunler/pet-siseler" },
    { name: "Plastik Şişeler", href: "/urunler/plastik-siseler" },
    { name: "Kapaklar", href: "/urunler/kapaklar" },
    { name: "Tıpalar", href: "/urunler/tipalar" },
    { name: "Parmak Spreyler", href: "/urunler/parmak-spreyler" },
  ];

  const companyLinks = [
    { name: nav.about, href: "/hakkimizda" },
    { name: f.qualityCerts, href: "/kalite" },
    { name: f.productionFacility, href: "/uretim" },
    { name: f.career, href: "/kariyer" },
    { name: f.blog, href: "/blog" },
    { name: "Sürdürülebilirlik", href: "/surdurulebilirlik" },
    { name: "Galeri", href: "/galeri" },
  ];

  const supportLinks = [
    { name: f.contact, href: "/iletisim" },
    { name: nav.quote, href: "/teklif-al", external: true },
    { name: f.dealerLogin, href: "/bayi-girisi" },
    { name: f.faq, href: "/sss" },
    { name: f.downloadCatalog, href: "/katalog", external: true },
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

  return (
    <footer className="relative bg-primary-900 text-white">
      {/* Decorative Wave SVG */}
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

      <div className="mx-auto max-w-7xl px-4 py-16 lg:px-6">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="mb-4 inline-flex items-center gap-3">
              <Image
                src="/images/logo.jpg"
                alt="Kısmet Plastik"
                width={48}
                height={48}
                className="h-12 w-12 rounded-lg bg-white object-contain p-1"
              />
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight">KİSMET</span>
                <span className="-mt-1 text-[10px] font-semibold tracking-[0.25em] text-white/60">
                  PLASTİK
                </span>
              </div>
            </Link>

            {/* Animated accent underline */}
            <div className="mb-6 h-[2px] w-24 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full w-full rounded-full bg-gradient-to-r from-accent-400 via-accent-500 to-accent-400"
                style={{
                  backgroundSize: "200% 100%",
                  animation: "shimmer 4s ease-in-out infinite",
                }}
              />
            </div>

            <p className="mb-6 max-w-sm text-sm leading-relaxed text-white/70">
              {f.brandDesc}
            </p>
            <div className="space-y-3">
              <a
                href="tel:+902125498703"
                className="flex items-center gap-3 text-sm text-white/70 transition-colors hover:text-accent-400"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-white/10">
                  <Phone size={14} />
                </div>
                0212 549 87 03
              </a>
              <a
                href="mailto:bilgi@kismetplastik.com"
                className="flex items-center gap-3 text-sm text-white/70 transition-colors hover:text-accent-400"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-white/10">
                  <Mail size={14} />
                </div>
                bilgi@kismetplastik.com
              </a>
              <div className="flex items-center gap-3 text-sm text-white/70">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-white/10">
                  <MapPin size={14} />
                </div>
                İkitelli OSB Mah. İPKAS 4A Blok Sok. No:5 Başakşehir/İstanbul
              </div>
            </div>
          </div>

          {/* Products */}
          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-white/40">
              {f.productsTitle}
            </h3>
            <ul className="space-y-3">
              {productLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="inline-block text-sm text-white/70 transition-all duration-200 hover:translate-x-1.5 hover:text-accent-400"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-white/40">
              {f.companyTitle}
            </h3>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="inline-block text-sm text-white/70 transition-all duration-200 hover:translate-x-1.5 hover:text-accent-400"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-white/40">
              {f.supportTitle}
            </h3>
            <ul className="space-y-3">
              {supportLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-1 text-sm text-white/70 transition-all duration-200 hover:translate-x-1.5 hover:text-accent-400"
                  >
                    {link.name}
                    {"external" in link && link.external && (
                      <ArrowUpRight
                        size={12}
                        className="opacity-0 transition-opacity group-hover:opacity-100"
                      />
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Gradient Divider */}
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </div>

      {/* Bottom Bar */}
      <div>
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-6 sm:flex-row lg:px-6">
          <p className="text-xs text-white/40">
            &copy; {new Date().getFullYear()} {f.copyright}
          </p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <div key={social.name} className="group relative">
                  <a
                    href={social.href}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/60 transition-all duration-200 hover:scale-110 hover:bg-accent-500 hover:text-primary-900"
                    aria-label={social.name}
                  >
                    <social.icon size={16} />
                  </a>
                  <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-white px-2 py-1 text-[10px] font-semibold text-primary-900 opacity-0 shadow-lg transition-all duration-200 group-hover:-top-9 group-hover:opacity-100">
                    {social.name}
                  </span>
                </div>
              ))}
            </div>
            <div className="h-4 w-px bg-white/10" />
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1.5 text-xs text-white/40 transition-colors hover:text-accent-400"
            >
              <ArrowUp size={12} />
              <span className="hidden sm:inline">Yukarı</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
