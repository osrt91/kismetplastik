"use client";

import {
  Factory,
  Recycle,
  Truck,
  HeadphonesIcon,
  Gauge,
  ShieldCheck,
} from "lucide-react";
import AnimateOnScroll from "@/components/ui/AnimateOnScroll";
import { useLocale } from "@/contexts/LocaleContext";

export default function WhyUs() {
  const { dict } = useLocale();
  const h = dict.home;
  const f = dict.homeFeatures as Record<string, string>;
  const features = [
    { icon: Factory, title: f.modernFactory, description: f.modernFactoryDesc },
    { icon: ShieldCheck, title: f.qualityAssurance, description: f.qualityAssuranceDesc },
    { icon: Recycle, title: f.ecoFriendly, description: f.ecoFriendlyDesc },
    { icon: Truck, title: f.fastDelivery, description: f.fastDeliveryDesc },
    { icon: Gauge, title: f.highCapacity, description: f.highCapacityDesc },
    { icon: HeadphonesIcon, title: f.support, description: f.supportDesc },
  ];

  return (
    <section className="bg-neutral-50 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        {/* Section Header */}
        <AnimateOnScroll animation="fade-up">
          <div className="mb-14 text-center">
            <span className="mb-3 inline-block text-sm font-bold uppercase tracking-widest text-accent-500">
              {h.whyUsOverline}
            </span>
            <h2 className="mb-4 text-3xl font-extrabold text-primary-900 sm:text-4xl">
              {h.whyUsTitle}
            </h2>
            <p className="mx-auto max-w-2xl text-neutral-500">
              {h.whyUsSubtitle}
            </p>
          </div>
        </AnimateOnScroll>

        {/* Features Grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <AnimateOnScroll
              key={feature.title}
              animation="fade-up"
              delay={i * 100}
            >
              <div className="group h-full rounded-2xl border border-neutral-100 bg-white p-8 transition-all duration-300 hover:-translate-y-1 hover:border-primary-100 hover:shadow-xl hover:shadow-primary-900/5">
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-primary-50 text-primary-700 transition-all duration-300 group-hover:bg-primary-900 group-hover:text-white group-hover:scale-110 group-hover:rotate-3">
                  <feature.icon size={26} />
                </div>
                <h3 className="mb-3 text-lg font-bold text-primary-900">
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed text-neutral-500">
                  {feature.description}
                </p>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
