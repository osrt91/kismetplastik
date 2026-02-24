"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import AnimateOnScroll from "@/components/ui/AnimateOnScroll";
import { useLocale } from "@/contexts/LocaleContext";

export default function About() {
  const { dict } = useLocale();
  const h = dict.home;
  const strengths = dict.homeStrengths as string[];

  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Left - Visual */}
          <AnimateOnScroll animation="fade-right">
            <div className="relative">
              <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-gradient-to-br from-primary-100 to-primary-50">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <Image
                      src="/images/maskot.jpg"
                      alt="Kismet Plastik"
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

              {/* Floating Badge */}
              <div className="absolute -bottom-6 -right-4 rounded-2xl bg-accent-500 px-6 py-4 shadow-xl transition-transform duration-300 hover:scale-105 sm:right-4">
                <div className="text-3xl font-extrabold text-primary-900">
                  20+
                </div>
                <div className="text-sm font-semibold text-primary-900/70">
                  {h.cardExperienceLabel}
                </div>
              </div>
            </div>
          </AnimateOnScroll>

          {/* Right - Content */}
          <AnimateOnScroll animation="fade-left">
            <div>
              <span className="mb-3 inline-block text-sm font-bold uppercase tracking-widest text-accent-500">
                Hakkımızda
              </span>
              <h2 className="mb-5 text-3xl font-extrabold text-primary-900 sm:text-4xl">
                Plastik Ambalaj Sektöründe{" "}
                <span className="text-accent-500">Güvenin Adı</span>
              </h2>
              <p className="mb-6 leading-relaxed text-neutral-500">
                Kismet Plastik olarak, kurulduğumuz günden bu yana plastik ambalaj
                sektöründe kalite ve güveni bir arada sunuyoruz. Modern üretim
                tesisimiz, deneyimli ekibimiz ve müşteri odaklı yaklaşımımızla
                sektörün önde gelen firmaları arasındayız.
              </p>
              <p className="mb-8 leading-relaxed text-neutral-500">
                B2B müşterilerimize özel üretim, toptan satış ve teknik destek
                hizmetleri sunarak iş ortaklarımızın büyümesine katkı sağlıyoruz.
              </p>

              {/* Strengths */}
              <ul className="mb-8 grid gap-3 sm:grid-cols-2">
                {strengths.map((item, i) => (
                  <li key={item} className="flex items-start gap-2">
                    <CheckCircle2
                      size={18}
                      className="mt-0.5 shrink-0 text-accent-500"
                    />
                    <span className="text-sm text-neutral-700">{item}</span>
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
