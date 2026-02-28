"use client";

import Image from "next/image";
import Link from "@/components/ui/LocaleLink";
import { ArrowRight, Check } from "lucide-react";
import AnimateOnScroll from "@/components/ui/AnimateOnScroll";
import { useLocale } from "@/contexts/LocaleContext";

export default function About() {
  const { dict } = useLocale();
  const h = dict.home;
  const strengths = dict.homeStrengths as string[];

  return (
    <section className="bg-white py-20 dark:bg-neutral-0 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <div className="relative grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Vertical accent divider – desktop only */}
          <div className="pointer-events-none absolute inset-y-4 left-1/2 hidden w-px bg-gradient-to-b from-transparent via-primary-200 to-transparent lg:block" />

          {/* Left – Visual */}
          <AnimateOnScroll animation="fade-right">
            <div className="relative">
              <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-gradient-to-br from-primary-100 via-primary-50 to-accent-50/30 shadow-lg ring-1 ring-primary-100">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="mx-auto mb-5 flex h-36 w-36 items-center justify-center rounded-2xl bg-white/80 shadow-xl ring-1 ring-primary-100/50 backdrop-blur-sm">
                      <Image
                        src="/images/logo2.svg"
                        alt="Kısmet Plastik"
                        width={120}
                        height={120}
                        className="h-28 w-28 drop-shadow-2xl transition-transform duration-500 hover:scale-110"
                      />
                    </div>
                    <p className="text-sm font-semibold text-primary-700">
                      {h.aboutFacility}
                    </p>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-accent-500 via-primary-500 to-primary-900" />
              </div>

              <div className="mt-4 grid grid-cols-3 gap-3">
                <div className="rounded-xl border border-primary-100 bg-white px-3 py-3 text-center shadow-sm dark:border-neutral-700 dark:bg-neutral-800">
                  <div className="text-xl font-extrabold text-primary-900 dark:text-white">{h.cardExperience}</div>
                  <div className="text-[11px] font-medium text-primary-600 dark:text-neutral-400">{h.cardExperienceLabel}</div>
                </div>
                <div className="rounded-xl border border-accent-200 bg-accent-50 px-3 py-3 text-center shadow-sm dark:border-accent-500/30 dark:bg-accent-500/10">
                  <div className="text-xl font-extrabold text-accent-600">{h.cardProducts}</div>
                  <div className="text-[11px] font-medium text-accent-700 dark:text-accent-400">{h.cardProductsLabel}</div>
                </div>
                <div className="rounded-xl border border-primary-100 bg-white px-3 py-3 text-center shadow-sm dark:border-neutral-700 dark:bg-neutral-800">
                  <div className="text-xl font-extrabold text-primary-900 dark:text-white">{h.cardCustomers}</div>
                  <div className="text-[11px] font-medium text-primary-600 dark:text-neutral-400">{h.cardCustomersLabel}</div>
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
              <h2 className="mb-5 text-3xl font-extrabold text-primary-900 dark:text-white sm:text-4xl">
                {h.aboutTitle}{" "}
                <span className="relative text-accent-500">
                  {h.aboutTitleAccent}
                  <span className="absolute -bottom-1 left-0 h-[3px] w-full rounded-full bg-accent-400/50" />
                </span>
              </h2>
              <p className="mb-6 leading-relaxed text-neutral-500 dark:text-neutral-400">
                {h.aboutLead1}
              </p>
              <p className="mb-8 leading-relaxed text-neutral-500 dark:text-neutral-400">
                {h.aboutLead2}
              </p>

              {/* Strengths */}
              <ul className="mb-8 grid gap-3 sm:grid-cols-2">
                {strengths.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 rounded-xl border border-neutral-100 bg-neutral-50/60 px-4 py-3 transition-colors duration-200 hover:border-accent-200 hover:bg-accent-50/40 dark:border-neutral-700 dark:bg-neutral-800/60 dark:hover:border-accent-500/30"
                  >
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-500 text-primary-900">
                      <Check size={12} strokeWidth={3} />
                    </span>
                    <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
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
