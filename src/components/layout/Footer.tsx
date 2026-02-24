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
} from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";

export default function Footer() {
  const { dict } = useLocale();
  const f = dict.footer;
  const nav = dict.nav;

  const productLinks = [
    { name: "PET Şişeler", href: "/urunler/pet-siseler" },
    { name: "Kavanozlar", href: "/urunler/kavanozlar" },
    { name: "Kapaklar", href: "/urunler/kapaklar" },
    { name: "Preformlar", href: "/urunler/preformlar" },
    { name: "Özel Üretim", href: "/urunler/ozel-uretim" },
  ];

  const companyLinks = [
    { name: nav.about, href: "/hakkimizda" },
    { name: f.qualityCerts, href: "/kalite" },
    { name: f.productionFacility, href: "/uretim" },
    { name: f.career, href: "/kariyer" },
    { name: f.blog, href: "/blog" },
  ];

  const supportLinks = [
    { name: f.contact, href: "/iletisim" },
    { name: nav.quote, href: "/teklif-al", external: true },
    { name: f.dealerLogin, href: "/bayi-girisi" },
    { name: f.faq, href: "/sss" },
    { name: f.downloadCatalog, href: "/katalog", external: true },
  ];

  return (
    <footer className="bg-primary-900 text-white">
      <div className="mx-auto max-w-7xl px-4 py-16 lg:px-6">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="mb-6 inline-flex items-center gap-3">
              <Image
                src="/images/maskot.jpg"
                alt="Kismet Plastik"
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
            <p className="mb-6 max-w-sm text-sm leading-relaxed text-white/70">
              {f.brandDesc}
            </p>
            <div className="space-y-3">
              <a
                href="tel:+902121234567"
                className="flex items-center gap-3 text-sm text-white/70 transition-colors hover:text-accent-400"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-white/10">
                  <Phone size={14} />
                </div>
                +90 (212) 123 45 67
              </a>
              <a
                href="mailto:info@kismetplastik.com"
                className="flex items-center gap-3 text-sm text-white/70 transition-colors hover:text-accent-400"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-white/10">
                  <Mail size={14} />
                </div>
                info@kismetplastik.com
              </a>
              <div className="flex items-center gap-3 text-sm text-white/70">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-white/10">
                  <MapPin size={14} />
                </div>
                Organize Sanayi Bölgesi, İstanbul, Türkiye
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
                    className="text-sm text-white/70 transition-colors hover:text-accent-400"
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
                    className="text-sm text-white/70 transition-colors hover:text-accent-400"
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
                    className="group flex items-center gap-1 text-sm text-white/70 transition-colors hover:text-accent-400"
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

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-6 sm:flex-row lg:px-6">
          <p className="text-xs text-white/40">
            &copy; {new Date().getFullYear()} {f.copyright}
          </p>
          <div className="flex items-center gap-3">
            <a
              href="#"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/60 transition-all duration-200 hover:bg-accent-500 hover:text-primary-900 hover:scale-110"
              aria-label="Facebook"
            >
              <Facebook size={16} />
            </a>
            <a
              href="#"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/60 transition-all duration-200 hover:bg-accent-500 hover:text-primary-900 hover:scale-110"
              aria-label="Instagram"
            >
              <Instagram size={16} />
            </a>
            <a
              href="#"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/60 transition-all duration-200 hover:bg-accent-500 hover:text-primary-900 hover:scale-110"
              aria-label="LinkedIn"
            >
              <Linkedin size={16} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
