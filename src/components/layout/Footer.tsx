"use client";

import Link from "@/components/ui/LocaleLink";
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
  QrCode,
} from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";

export default function Footer() {
  const { dict } = useLocale();
  const f = dict.footer;
  const nav = dict.nav;

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
    { name: f.career, href: "/kariyer" },
    { name: f.blog, href: "/blog" },
    { name: dict.components.sustainability, href: "/surdurulebilirlik" },
    { name: dict.components.gallery, href: "/galeri" },
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

      <div className="mx-auto max-w-7xl px-4 py-14 lg:px-6">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-12">
          {/* Brand */}
          <div className="lg:col-span-4">
            <Link href="/" className="mb-5 inline-block">
              <img
                src="/images/logo2.svg"
                alt="Kısmet Plastik"
                className="h-12 w-12 rounded-lg bg-white/10 p-1.5"
              />
            </Link>

            <p className="mb-5 max-w-xs text-[13px] leading-relaxed text-white/60">
              {f.brandDesc}
            </p>
            <div className="space-y-2.5">
              <a
                href="tel:+902125498703"
                className="inline-flex items-center gap-2 text-[13px] text-white/70 transition-colors hover:text-white"
              >
                <Phone size={14} strokeWidth={1.8} />
                0212 549 87 03
              </a>
              <br />
              <a
                href="mailto:bilgi@kismetplastik.com"
                className="inline-flex items-center gap-2 text-[13px] text-white/70 transition-colors hover:text-white"
              >
                <Mail size={14} strokeWidth={1.8} />
                bilgi@kismetplastik.com
              </a>
              <p className="flex items-start gap-2 text-[13px] text-white/50">
                <MapPin size={14} strokeWidth={1.8} className="mt-0.5 shrink-0" />
                İkitelli OSB Mah. İPKAS 4A Blok Sok. No:5 Başakşehir/İstanbul
              </p>
            </div>

            <div className="mt-5 inline-block rounded-lg bg-white p-2">
              <Image
                src="/images/qr.jpg"
                alt="QR Kod"
                width={80}
                height={80}
                className="h-20 w-20 object-contain"
              />
            </div>
          </div>

          {/* Products */}
          <div className="lg:col-span-2 lg:col-start-6">
            <h3 className="mb-3 text-[11px] font-bold uppercase tracking-widest text-white/35">
              {f.productsTitle}
            </h3>
            <ul className="space-y-2">
              {productLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-[13px] text-white/60 transition-colors hover:text-white"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="lg:col-span-3">
            <h3 className="mb-3 text-[11px] font-bold uppercase tracking-widest text-white/35">
              {f.companyTitle}
            </h3>
            <ul className="space-y-2">
              {companyLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-[13px] text-white/60 transition-colors hover:text-white"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="lg:col-span-3">
            <h3 className="mb-3 text-[11px] font-bold uppercase tracking-widest text-white/35">
              {f.supportTitle}
            </h3>
            <ul className="space-y-2">
              {supportLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-1 text-[13px] text-white/60 transition-colors hover:text-white"
                  >
                    {link.name}
                    {"external" in link && link.external && (
                      <ArrowUpRight
                        size={11}
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

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-5 sm:flex-row lg:px-6">
          <p className="text-[12px] text-white/35">
            &copy; {new Date().getFullYear()} {f.copyright}
          </p>
          <div className="flex items-center gap-3">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.href}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/8 text-white/50 transition-colors hover:bg-white/15 hover:text-white"
                aria-label={social.name}
              >
                <social.icon size={15} strokeWidth={1.8} />
              </a>
            ))}
            <span className="h-3.5 w-px bg-white/10" />
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1 text-[12px] text-white/35 transition-colors hover:text-white/60"
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
