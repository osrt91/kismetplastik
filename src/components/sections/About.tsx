"use client";

import Link from "@/components/ui/LocaleLink";
import Image from "next/image";
import { ArrowRight, Check } from "lucide-react";
import AnimateOnScroll from "@/components/ui/AnimateOnScroll";
import { useLocale } from "@/contexts/LocaleContext";

export default function About() {
  const { dict } = useLocale();
  const h = dict.home;
  const strengths = dict.homeStrengths as string[];

  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <div className="relative grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Vertical accent divider – desktop only */}
          <div className="pointer-events-none absolute inset-y-4 left-1/2 hidden w-px bg-gradient-to-b from-transparent via-primary-200 to-transparent lg:block" />

          {/* Left – Visual */}
          <AnimateOnScroll animation="fade-right">
            <div className="relative">
              {/* Decorative geometric shapes */}
              <div className="absolute -left-4 -top-4 h-16 w-16 rounded-full border-2 border-primary-100 opacity-60" />
              <div className="absolute -right-3 top-8 h-10 w-10 rotate-12 rounded-lg border-2 border-accent-300 opacity-50" />
              <div className="absolute -bottom-3 left-12 h-8 w-8 rounded-full bg-accent-100 opacity-40" />
              <div className="absolute -right-6 bottom-16 h-6 w-6 rotate-45 bg-primary-100 opacity-50" />

              <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-gradient-to-br from-primary-100 to-primary-50">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <Image
                      src="/images/logo.jpg"
                      alt="Kısmet Plastik"
                      width={180}
                      height={180}
                      className="mx-auto mb-4 rounded-3xl shadow-2xl transition-transform duration-500 hover:scale-110 hover:rotate-3"
                    />
                    <p className="text-sm font-semibold text-primary-700">
                      {h.aboutFacility}
                    </p>
                  </div>
                </div>

                {/* Accent Decoration */}
                <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-accent-500 via-primary-500 to-primary-900" />
              </div>

              {/* Floating Badge with pulse-glow */}
              <div
                className="absolute -bottom-6 -right-4 rounded-2xl bg-accent-500 px-6 py-4 shadow-xl transition-transform duration-300 hover:scale-105 sm:right-4"
                style={{ animation: "pulse-glow 2.5s ease-in-out infinite" }}
              >
                <div className="text-3xl font-extrabold text-primary-900">
                  55+
                </div>
                <div className="text-sm font-semibold text-primary-900/70">
                  {h.cardExperienceLabel}
                </div>
              </div>
            </div>
          </AnimateOnScroll>

          {/* Right – Content */}
          <AnimateOnScroll animation="fade-left">
            <div>
              <span className="mb-3 inline-block text-sm font-bold uppercase tracking-widest text-accent-500">
                {h.aboutOverline}
              </span>
              <h2 className="mb-5 text-3xl font-extrabold text-primary-900 sm:text-4xl">
                Kozmetik Ambalaj Sektöründe{" "}
                <span className="relative text-accent-500">
                  Güvenin Adı
                  <span className="absolute -bottom-1 left-0 h-[3px] w-full rounded-full bg-accent-400/50" />
                </span>
              </h2>
              <p className="mb-6 leading-relaxed text-neutral-500">
                Kısmet Plastik olarak, 1969&apos;dan bu yana kozmetik sektörüne özel
                kozmetik ambalaj üretiminde kalite ve güveni bir arada sunuyoruz.
                Geniş ürün yelpazemizle kozmetik sektörünün tüm ihtiyaçlarını
                karşılayabiliyoruz.
              </p>
              <p className="mb-8 leading-relaxed text-neutral-500">
                PET şişeler, plastik şişeler, kolonya şişeleri, sprey ambalajlar,
                oda parfümü şişeleri, sıvı sabun şişeleri ve kapaklar dahil olmak üzere
                birçok kozmetik ambalaj çözümüyle B2B müşterilerimize hizmet veriyoruz.
              </p>

              {/* Strengths */}
              <ul className="mb-8 grid gap-3 sm:grid-cols-2">
                {strengths.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 rounded-xl border border-neutral-100 bg-neutral-50/60 px-4 py-3 transition-colors duration-200 hover:border-accent-200 hover:bg-accent-50/40"
                  >
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-500 text-primary-900">
                      <Check size={12} strokeWidth={3} />
                    </span>
                    <span className="text-sm font-medium text-neutral-700">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>

              <Link
                href="/hakkimizda"
                className="group inline-flex items-center gap-2 rounded-xl bg-primary-900 px-7 py-3.5 text-sm font-bold text-white transition-all duration-300 hover:bg-primary-700 hover:-translate-y-0.5 hover:shadow-lg active:scale-[0.98]"
              >
                {h.aboutMore}
                <ArrowRight
                  size={16}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
            </div>
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  );
}
