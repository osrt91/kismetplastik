"use client";

import { ShieldCheck, Award, Leaf, Lock, FlaskConical, CheckCircle2 } from "lucide-react";
import AnimateOnScroll from "@/components/ui/AnimateOnScroll";
import { useLocale } from "@/contexts/LocaleContext";

const certifications = [
  { code: "ISO 9001", full: "ISO 9001:2015", icon: ShieldCheck, color: "from-primary-500 to-primary-600" },
  { code: "ISO 14001", full: "ISO 14001:2015", icon: Leaf, color: "from-eco-500 to-eco-400" },
  { code: "ISO 45001", full: "ISO 45001:2018", icon: Award, color: "from-accent-500 to-accent-400" },
  { code: "ISO 10002", full: "ISO 10002:2018", icon: CheckCircle2, color: "from-primary-500 to-accent-500" },
  { code: "ISO/IEC 27001", full: "ISO/IEC 27001", icon: Lock, color: "from-primary-600 to-primary-500" },
  { code: "CE", full: "CE Marking", icon: Award, color: "from-accent-400 to-eco-500" },
];

export default function Certificates() {
  const { dict } = useLocale();
  const h = dict.home;

  return (
    <section className="relative overflow-hidden bg-white py-20 dark:bg-neutral-0 lg:py-28">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-0 w-[500px] h-[500px] -translate-y-1/2 rounded-full bg-primary-500/[0.02] blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 lg:px-6">
        <AnimateOnScroll animation="fade-up">
          <div className="mb-16 text-center">
            <span className="mb-3 inline-block text-xs font-bold uppercase tracking-[0.2em] bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">
              {h.certsOverline}
            </span>
            <h2 className="mb-4 text-3xl font-extrabold text-primary-900 dark:text-white sm:text-4xl lg:text-5xl">
              {h.certsTitle}
            </h2>
            <p className="mx-auto max-w-2xl text-neutral-600 dark:text-neutral-400">
              {h.certsSubtitle}
            </p>
          </div>
        </AnimateOnScroll>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {certifications.map((cert, i) => {
            const Icon = cert.icon;
            return (
              <AnimateOnScroll key={cert.code} animation="fade-up" delay={i * 80}>
                <div className="group relative flex items-center gap-4 rounded-2xl border border-neutral-100 bg-white p-5 transition-all duration-300 hover:border-primary-500/20 hover:shadow-lg hover:shadow-primary-500/5 hover:-translate-y-0.5 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:border-primary-500/30">
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${cert.color} text-white shadow-md transition-transform duration-300 group-hover:scale-110`}>
                    <Icon size={22} strokeWidth={1.8} />
                  </div>
                  <div>
                    <div className="text-base font-bold text-primary-900 dark:text-white">
                      {cert.code}
                    </div>
                    <div className="text-xs text-neutral-500 dark:text-neutral-400">
                      {cert.full}
                    </div>
                  </div>
                </div>
              </AnimateOnScroll>
            );
          })}
        </div>

        <AnimateOnScroll animation="fade-up" delay={500}>
          <div className="mt-12 rounded-2xl border border-primary-500/10 bg-gradient-to-br from-primary-50 to-white p-8 dark:border-primary-500/20 dark:from-neutral-800 dark:to-neutral-900">
            <div className="flex flex-col items-center gap-6 lg:flex-row">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/20">
                <FlaskConical size={28} strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="mb-2 text-xl font-bold text-primary-900 dark:text-white">
                  {h.certsLabTitle}
                </h3>
                <p className="max-w-2xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                  {h.certsLabDesc}
                </p>
              </div>
            </div>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
