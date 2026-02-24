"use client";

import Link from "next/link";
import {
  ArrowRight,
  Droplets,
  Package,
  CircleDot,
  Cylinder,
  Sparkles,
  Boxes,
} from "lucide-react";
import AnimateOnScroll from "@/components/ui/AnimateOnScroll";
import { useLocale } from "@/contexts/LocaleContext";

const categorySlugs = [
  "pet-siseler",
  "kavanozlar",
  "kapaklar",
  "preformlar",
  "ozel-uretim",
  "ambalaj-setleri",
];
const icons = [Droplets, Package, CircleDot, Cylinder, Sparkles, Boxes];
const colors = [
  "from-blue-500/10 to-blue-600/5",
  "from-amber-500/10 to-amber-600/5",
  "from-emerald-500/10 to-emerald-600/5",
  "from-violet-500/10 to-violet-600/5",
  "from-rose-500/10 to-rose-600/5",
  "from-teal-500/10 to-teal-600/5",
];
const iconColors = [
  "text-blue-600",
  "text-amber-600",
  "text-emerald-600",
  "text-violet-600",
  "text-rose-600",
  "text-teal-600",
];

export default function Categories() {
  const { dict } = useLocale();
  const h = dict.home;
  const cats = (dict.homeCategories as { name: string; description: string; count: string }[]).map(
    (c, i) => ({
      ...c,
      href: `/urunler/${categorySlugs[i]}`,
      icon: icons[i],
      color: colors[i],
      iconColor: iconColors[i],
    })
  );

  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        {/* Section Header */}
        <AnimateOnScroll animation="fade-up">
          <div className="mb-14 text-center">
            <span className="mb-3 inline-block text-sm font-bold uppercase tracking-widest text-accent-500">
              {h.categoriesOverline}
            </span>
            <h2 className="mb-4 text-3xl font-extrabold text-primary-900 sm:text-4xl">
              {h.categoriesTitle}
            </h2>
            <p className="mx-auto max-w-2xl text-neutral-500">
              {h.categoriesSubtitle}
            </p>
          </div>
        </AnimateOnScroll>

        {/* Category Grid - 6 items = balanced 3x2 */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cats.map((cat, i) => (
            <AnimateOnScroll
              key={cat.name}
              animation="fade-up"
              delay={i * 100}
            >
              <Link
                href={cat.href}
                className="group relative block h-full overflow-hidden rounded-2xl border border-neutral-100 bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:border-primary-100 hover:shadow-xl hover:shadow-primary-900/5"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
                />
                <div className="relative">
                  <div className="mb-5 flex items-start justify-between">
                    <div
                      className={`flex h-14 w-14 items-center justify-center rounded-xl bg-neutral-50 ${cat.iconColor} transition-all duration-300 group-hover:bg-white group-hover:scale-110`}
                    >
                      <cat.icon size={26} />
                    </div>
                    <span className="rounded-full bg-neutral-50 px-3 py-1 text-xs font-bold text-neutral-500 transition-colors group-hover:bg-white">
                      {cat.count} {h.productsCount}
                    </span>
                  </div>

                  <h3 className="mb-2 text-lg font-bold text-primary-900">
                    {cat.name}
                  </h3>
                  <p className="mb-5 text-sm leading-relaxed text-neutral-500">
                    {cat.description}
                  </p>

                  <div className="flex items-center gap-1 text-sm font-semibold text-primary-700 transition-colors group-hover:text-accent-600">
                    {h.viewProducts}
                    <ArrowRight
                      size={14}
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </div>
                </div>
              </Link>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
