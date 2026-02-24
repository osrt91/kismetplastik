"use client";

import Link from "next/link";
import { ArrowRight, FileText, Phone } from "lucide-react";
import AnimateOnScroll from "@/components/ui/AnimateOnScroll";
import { useLocale } from "@/contexts/LocaleContext";

export default function CTA() {
  const { dict } = useLocale();
  const h = dict.home;

  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-primary-900 via-primary-700 to-primary-900 py-20 lg:py-24">
      {/* Background */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div
          className="h-full w-full"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>
      <div className="absolute -left-20 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-accent-500/10 blur-3xl animate-pulse" />
      <div className="absolute -right-20 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-primary-300/10 blur-3xl animate-pulse" />

      <div className="relative mx-auto max-w-4xl px-4 text-center lg:px-6">
        <AnimateOnScroll animation="fade-up">
          <h2 className="mb-5 text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl">
            {h.ctaTitle}{" "}
            <span className="text-accent-400">{h.ctaTitleAccent}</span> {h.ctaTitleSuffix}
          </h2>
        </AnimateOnScroll>

        <AnimateOnScroll animation="fade-up" delay={100}>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-white/70">
            {h.ctaSubtitle}
          </p>
        </AnimateOnScroll>

        <AnimateOnScroll animation="zoom-in" delay={200}>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/teklif-al"
              className="group inline-flex items-center gap-2 rounded-xl bg-accent-500 px-8 py-4 text-base font-bold text-primary-900 shadow-lg shadow-accent-500/25 transition-all duration-300 hover:bg-accent-400 hover:shadow-xl hover:-translate-y-0.5 active:scale-[0.98]"
            >
              <FileText size={18} />
              {h.ctaForm}
              <ArrowRight
                size={16}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
            <a
              href="tel:+902121234567"
              className="inline-flex items-center gap-2 rounded-xl border-2 border-white/20 px-8 py-4 text-base font-semibold text-white transition-all duration-300 hover:border-white/40 hover:bg-white/10 hover:-translate-y-0.5"
            >
              <Phone size={18} />
              {h.ctaCall}
            </a>
          </div>
        </AnimateOnScroll>

        <AnimateOnScroll animation="fade" delay={400}>
          <p className="mt-6 text-sm text-white/40">
            {h.ctaNote}
          </p>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
