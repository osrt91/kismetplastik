"use client";

import { Phone, PenTool, Factory, Truck } from "lucide-react";
import AnimateOnScroll from "@/components/ui/AnimateOnScroll";
import { useLocale } from "@/contexts/LocaleContext";

const stepIcons = [Phone, PenTool, Factory, Truck];

export default function ProcessSteps() {
  const { dict } = useLocale();
  const h = dict.home;

  const steps = [
    { title: h.processStep1, desc: h.processStep1Desc },
    { title: h.processStep2, desc: h.processStep2Desc },
    { title: h.processStep3, desc: h.processStep3Desc },
    { title: h.processStep4, desc: h.processStep4Desc },
  ];

  return (
    <section className="relative overflow-hidden bg-white py-20 dark:bg-neutral-0 lg:py-28">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-primary-500/[0.03] blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-accent-500/[0.03] blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 lg:px-6">
        <AnimateOnScroll animation="fade-up">
          <div className="mb-16 text-center">
            <span className="mb-3 inline-block text-xs font-bold uppercase tracking-[0.2em] bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">
              {h.processOverlineHome}
            </span>
            <h2 className="mb-4 text-3xl font-extrabold text-primary-900 dark:text-white sm:text-4xl lg:text-5xl">
              {h.processTitleHome}
            </h2>
            <p className="mx-auto max-w-2xl text-neutral-600 dark:text-neutral-400">
              {h.processSubtitleHome}
            </p>
          </div>
        </AnimateOnScroll>

        <div className="relative grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="absolute top-16 left-[12%] right-[12%] hidden h-px bg-gradient-to-r from-transparent via-primary-500/20 to-transparent lg:block" />

          {steps.map((step, i) => {
            const Icon = stepIcons[i];
            return (
              <AnimateOnScroll key={i} animation="fade-up" delay={i * 120}>
                <div className="group relative flex flex-col items-center text-center">
                  <div className="relative z-10 mb-6 flex h-[72px] w-[72px] items-center justify-center rounded-2xl border border-neutral-100 bg-white shadow-lg shadow-primary-500/5 transition-all duration-500 group-hover:border-primary-500/30 group-hover:shadow-xl group-hover:shadow-primary-500/10 group-hover:-translate-y-1 dark:border-neutral-700 dark:bg-neutral-800 dark:group-hover:border-primary-500/40">
                    <Icon
                      size={28}
                      strokeWidth={1.5}
                      className="text-primary-500 transition-colors duration-300 group-hover:text-accent-500"
                    />
                    <span className="absolute -top-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-primary-600 text-[11px] font-bold text-white shadow-md">
                      {i + 1}
                    </span>
                  </div>
                  <h3 className="mb-2 text-lg font-bold text-primary-900 dark:text-white">
                    {step.title}
                  </h3>
                  <p className="max-w-[220px] text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
                    {step.desc}
                  </p>
                </div>
              </AnimateOnScroll>
            );
          })}
        </div>
      </div>
    </section>
  );
}
