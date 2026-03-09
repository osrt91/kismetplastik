"use client";

import { Layers, Factory, ShieldCheck, Truck, Camera } from "lucide-react";
import AnimateOnScroll from "@/components/ui/AnimateOnScroll";
import { useLocale } from "@/contexts/LocaleContext";

const stepIcons = [Layers, Factory, ShieldCheck, Truck];

export default function WhyUs() {
  const { dict } = useLocale();
  const h = dict.home;
  const f = dict.homeFeatures as Record<string, string>;

  const steps = [
    { title: f.processStep1Title, description: f.processStep1Desc },
    { title: f.processStep2Title, description: f.processStep2Desc },
    { title: f.processStep3Title, description: f.processStep3Desc },
    { title: f.processStep4Title, description: f.processStep4Desc },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#FAFAF7] via-white to-[#FAFAF7] py-20 dark:from-[#0A1628] dark:via-neutral-900 dark:to-[#0A1628] lg:py-28">
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        {/* Section Header */}
        <AnimateOnScroll animation="fade-up">
          <div className="mb-14 text-center lg:mb-20">
            <span className="mb-3 inline-block rounded-full bg-amber-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-amber-600 dark:bg-amber-500/20 dark:text-amber-400">
              {h.whyUsOverline}
            </span>
            <h2 className="font-display mb-4 text-3xl font-extrabold text-[#0A1628] dark:text-white sm:text-4xl lg:text-5xl">
              {h.whyUsTitle}
            </h2>
            <p className="font-body mx-auto max-w-2xl text-base leading-relaxed text-muted-foreground">
              {h.whyUsSubtitle}
            </p>
          </div>
        </AnimateOnScroll>

        {/* Desktop: Horizontal Timeline */}
        <div className="hidden lg:block">
          {/* Connecting line */}
          <div className="relative mx-auto mb-12 max-w-5xl">
            <div className="absolute left-[12.5%] right-[12.5%] top-[28px] h-[3px] rounded-full bg-gradient-to-r from-[#F59E0B]/20 via-[#F59E0B] to-[#F59E0B]/20" />

            {/* Step circles on the line */}
            <div className="relative grid grid-cols-4 gap-8">
              {steps.map((step, i) => {
                const Icon = stepIcons[i];
                return (
                  <AnimateOnScroll
                    key={i}
                    animation="fade-up"
                    delay={i * 150}
                  >
                    <div className="flex flex-col items-center text-center">
                      {/* Circle with icon */}
                      <div className="relative z-10 mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-[#0A1628] shadow-lg shadow-[#0A1628]/20 ring-4 ring-[#FAFAF7] dark:bg-[#F59E0B] dark:ring-neutral-900">
                        <Icon size={24} className="text-white" />
                        {/* Step number badge */}
                        <span className="font-mono absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#F59E0B] text-[10px] font-bold text-white dark:bg-[#0A1628]">
                          {i + 1}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="font-display mb-2 text-lg font-bold text-[#0A1628] dark:text-white">
                        {step.title}
                      </h3>

                      {/* Description */}
                      <p className="font-body mb-5 text-sm leading-relaxed text-muted-foreground">
                        {step.description}
                      </p>

                      {/* Photo placeholder */}
                      <div className="flex aspect-video w-full items-center justify-center rounded-xl bg-neutral-100 dark:bg-[#1a2744]">
                        <div className="flex flex-col items-center gap-1.5">
                          <Camera size={24} className="text-neutral-300 dark:text-neutral-600" />
                          <span className="font-body text-xs text-neutral-400 dark:text-neutral-500">
                            {f.processPhotoPlaceholder}
                          </span>
                        </div>
                      </div>
                    </div>
                  </AnimateOnScroll>
                );
              })}
            </div>
          </div>
        </div>

        {/* Mobile: Vertical Timeline */}
        <div className="lg:hidden">
          <div className="relative pl-10">
            {/* Vertical line */}
            <div className="absolute bottom-0 left-[18px] top-0 w-[3px] rounded-full bg-gradient-to-b from-[#F59E0B]/20 via-[#F59E0B] to-[#F59E0B]/20" />

            <div className="space-y-10">
              {steps.map((step, i) => {
                const Icon = stepIcons[i];
                return (
                  <AnimateOnScroll
                    key={i}
                    animation="fade-up"
                    delay={i * 120}
                  >
                    <div className="relative">
                      {/* Circle on line */}
                      <div className="absolute -left-10 top-0 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-[#0A1628] shadow-md ring-4 ring-[#FAFAF7] dark:bg-[#F59E0B] dark:ring-neutral-900">
                        <Icon size={18} className="text-white" />
                        <span className="font-mono absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#F59E0B] text-[9px] font-bold text-white dark:bg-[#0A1628]">
                          {i + 1}
                        </span>
                      </div>

                      {/* Content */}
                      <div>
                        <h3 className="font-display mb-1.5 text-lg font-bold text-[#0A1628] dark:text-white">
                          {step.title}
                        </h3>
                        <p className="font-body mb-4 text-sm leading-relaxed text-muted-foreground">
                          {step.description}
                        </p>

                        {/* Photo placeholder */}
                        <div className="flex aspect-video w-full max-w-sm items-center justify-center rounded-xl bg-neutral-100 dark:bg-[#1a2744]">
                          <div className="flex flex-col items-center gap-1.5">
                            <Camera size={20} className="text-neutral-300 dark:text-neutral-600" />
                            <span className="font-body text-xs text-neutral-400 dark:text-neutral-500">
                              {f.processPhotoPlaceholder}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </AnimateOnScroll>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
