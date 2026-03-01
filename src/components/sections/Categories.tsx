"use client";

import Link from "@/components/ui/LocaleLink";
import { ArrowRight } from "lucide-react";
import { categoryIconList } from "@/components/ui/CategoryIcons";
import AnimateOnScroll from "@/components/ui/AnimateOnScroll";
import { useLocale } from "@/contexts/LocaleContext";

const categorySlugs = [
  "pet-siseler",
  "plastik-siseler",
  "kapaklar",
  "tipalar",
  "parmak-spreyler",
  "diger-urunler",
];
const icons = categoryIconList;
const colors = [
  "from-blue-500/10 to-blue-600/5",
  "from-amber-500/10 to-amber-600/5",
  "from-rose-500/10 to-rose-600/5",
  "from-violet-500/10 to-violet-600/5",
  "from-emerald-500/10 to-emerald-600/5",
  "from-teal-500/10 to-teal-600/5",
  "from-amber-500/10 to-amber-600/5",
  "from-cyan-500/10 to-cyan-600/5",
];
const iconColors = [
  "text-blue-600",
  "text-amber-600",
  "text-rose-600",
  "text-violet-600",
  "text-emerald-600",
  "text-teal-600",
  "text-amber-700",
  "text-cyan-600",
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
    <section className="relative bg-white py-20 dark:bg-neutral-0 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        {/* Section Header with dot pattern background */}
        <AnimateOnScroll animation="fade-up">
          <div className="relative mb-14 text-center">
            <div
              className="pointer-events-none absolute -top-10 left-1/2 -z-0 h-48 w-[28rem] -translate-x-1/2"
              style={{
                backgroundImage:
                  "radial-gradient(circle, var(--primary-300) 0.8px, transparent 0.8px)",
                backgroundSize: "18px 18px",
                opacity: 0.18,
              }}
            />
            <div className="relative z-10">
              <span className="mb-3 inline-block text-sm font-bold uppercase tracking-widest text-accent-500">
                {h.categoriesOverline}
              </span>
              <h2 className="mb-4 text-3xl font-extrabold text-primary-900 dark:text-white sm:text-4xl">
                {h.categoriesTitle}
              </h2>
              <p className="mx-auto max-w-2xl text-neutral-500 dark:text-neutral-400">
                {h.categoriesSubtitle}
              </p>
            </div>
          </div>
        </AnimateOnScroll>

        {/* Category Grid — 3 columns for 6 categories */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {cats.map((cat, i) => (
            <AnimateOnScroll
              key={cat.name}
              animation="fade-up"
              delay={i * 80}
            >
              <Link
                href={cat.href}
                className="card-border-gradient group relative flex h-full items-start gap-5 overflow-hidden rounded-2xl border border-neutral-100 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary-100 hover:shadow-xl hover:shadow-primary-900/5 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:border-primary-500/30"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
                />

                <div className="absolute inset-x-0 bottom-0 h-[3px] bg-gradient-to-r from-accent-400 via-accent-500 to-primary-500 opacity-0 transition-all duration-500 group-hover:opacity-100" />

                <div className="relative shrink-0">
                  <div
                    className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${cat.color} ${cat.iconColor} ring-1 ring-neutral-100 transition-all duration-300 group-hover:scale-110 group-hover:ring-primary-200 group-hover:shadow-lg group-hover:shadow-primary-500/10 dark:ring-neutral-600`}
                  >
                    <cat.icon size={28} />
                  </div>
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent-500/90 text-[9px] font-bold text-white shadow-sm">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>

                <div className="relative min-w-0 flex-1">
                  <div className="mb-1 flex items-center justify-between gap-2">
                    <h3 className="text-lg font-bold text-primary-900 dark:text-white">
                      {cat.name}
                    </h3>
                    <span className="shrink-0 rounded-full bg-neutral-50 px-2.5 py-0.5 text-[10px] font-bold text-neutral-500 transition-colors group-hover:bg-accent-50 group-hover:text-accent-700 dark:bg-neutral-700 dark:text-neutral-400">
                      {cat.count}
                    </span>
                  </div>
                  <p className="mb-3 text-sm leading-relaxed text-neutral-500 dark:text-neutral-400 line-clamp-2">
                    {cat.description}
                  </p>
                  <div className="flex items-center gap-1 text-sm font-semibold text-primary-600 transition-colors group-hover:text-accent-600 dark:text-primary-400">
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
