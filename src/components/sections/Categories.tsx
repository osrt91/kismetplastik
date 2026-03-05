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
  "pompalar",
  "tetikli-pusturtuculer",
  "huniler",
];
const icons = categoryIconList;
const colors = [
  "from-[#0A1628]/[0.06] to-[#F59E0B]/[0.03]",
  "from-[#F59E0B]/[0.08] to-[#0A1628]/[0.03]",
  "from-[#0A1628]/[0.05] to-[#F59E0B]/[0.04]",
  "from-[#0A1628]/[0.07] to-[#F59E0B]/[0.02]",
  "from-[#F59E0B]/[0.06] to-[#0A1628]/[0.04]",
  "from-[#0A1628]/[0.08] to-[#F59E0B]/[0.03]",
  "from-[#F59E0B]/[0.07] to-[#0A1628]/[0.03]",
  "from-[#0A1628]/[0.06] to-[#F59E0B]/[0.05]",
];
const iconColors = [
  "text-navy-600",
  "text-amber-600",
  "text-navy-500",
  "text-navy-700",
  "text-navy-400",
  "text-navy-800",
  "text-amber-500",
  "text-navy-900",
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
    <section className="relative bg-[#FAFAF7] py-24 dark:bg-[#0A1628] lg:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        {/* Section Header with dot pattern background */}
        <AnimateOnScroll animation="fade-up">
          <div className="relative mb-16 text-center lg:mb-20">
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
              <h2 className="mb-5 text-3xl font-extrabold text-primary-900 dark:text-white sm:text-4xl lg:text-5xl">
                {h.categoriesTitle}
              </h2>
              <div className="mx-auto mb-5 flex items-center justify-center gap-2">
                <span className="h-[3px] w-8 rounded-full bg-[#0A1628]/20 dark:bg-white/20" />
                <span className="h-[3px] w-16 rounded-full bg-[#F59E0B]" />
                <span className="h-[3px] w-8 rounded-full bg-[#0A1628]/20 dark:bg-white/20" />
              </div>
              <p className="mx-auto max-w-2xl text-muted-foreground">
                {h.categoriesSubtitle}
              </p>
            </div>
          </div>
        </AnimateOnScroll>

        {/* Category Grid */}
        <div className="grid gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-7 xl:grid-cols-4">
          {cats.map((cat, i) => (
            <AnimateOnScroll
              key={cat.name}
              animation="fade-up"
              delay={i * 120}
            >
              <Link
                href={cat.href}
                className="group relative block h-full overflow-hidden rounded-2xl border border-border bg-card p-7 shadow-sm transition-all duration-500 ease-out hover:-translate-y-2 hover:border-[#F59E0B]/40 hover:shadow-2xl hover:shadow-[#0A1628]/10 dark:border-[#1e293b] dark:bg-[#0f1d32] dark:shadow-none dark:hover:border-[#F59E0B]/30 dark:hover:shadow-lg dark:hover:shadow-[#F59E0B]/5 sm:p-8"
              >
                {/* Background gradient overlay */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
                />

                {/* Gradient bottom border on hover */}
                <div className="absolute inset-x-0 bottom-0 h-[3px] origin-left scale-x-0 bg-gradient-to-r from-[#F59E0B] via-[#F59E0B]/80 to-[#0A1628] transition-transform duration-500 ease-out group-hover:scale-x-100" />

                {/* Number indicator */}
                <span className="absolute right-5 top-4 font-mono text-[11px] font-medium tracking-wider text-neutral-300 transition-colors duration-500 group-hover:text-[#F59E0B]/60 dark:text-neutral-600 dark:group-hover:text-[#F59E0B]/50">
                  {String(i + 1).padStart(2, "0")}
                </span>

                <div className="relative">
                  <div className="mb-5 flex items-start justify-between">
                    <div
                      className={`flex h-14 w-14 items-center justify-center rounded-xl bg-muted ${cat.iconColor} shadow-sm transition-all duration-500 ease-out group-hover:scale-115 group-hover:bg-card group-hover:shadow-md group-hover:shadow-[#F59E0B]/20 group-hover:animate-[iconBounce_0.6s_ease] dark:bg-[#1e293b] dark:group-hover:bg-[#263044]`}
                    >
                      <cat.icon size={26} />
                    </div>
                    <span className="rounded-full bg-muted px-3 py-1.5 text-xs font-bold text-muted-foreground transition-all duration-300 group-hover:bg-[#F59E0B]/10 group-hover:text-[#F59E0B] dark:bg-[#1e293b] dark:text-neutral-400 dark:group-hover:bg-[#F59E0B]/15 dark:group-hover:text-[#F59E0B]">
                      {cat.count} {h.productsCount}
                    </span>
                  </div>

                  <h3 className="mb-2 text-lg font-bold text-primary-900 dark:text-white">
                    {cat.name}
                  </h3>
                  <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
                    {cat.description}
                  </p>

                  <div className="flex items-center gap-1.5 text-sm font-semibold text-[#0A1628]/70 transition-all duration-300 group-hover:gap-2.5 group-hover:text-[#F59E0B] dark:text-neutral-400 dark:group-hover:text-[#F59E0B]">
                    {h.viewProducts}
                    <ArrowRight
                      size={14}
                      className="transition-transform duration-500 ease-out group-hover:translate-x-1.5"
                    />
                  </div>
                </div>
              </Link>
            </AnimateOnScroll>
          ))}
        </div>
      </div>

      {/* Keyframes for icon bounce */}
      <style jsx>{`
        @keyframes iconBounce {
          0% {
            transform: scale(1.15) rotate(0deg);
          }
          20% {
            transform: scale(1.2) rotate(-5deg);
          }
          40% {
            transform: scale(1.15) rotate(4deg);
          }
          60% {
            transform: scale(1.18) rotate(-2deg);
          }
          80% {
            transform: scale(1.15) rotate(1deg);
          }
          100% {
            transform: scale(1.15) rotate(0deg);
          }
        }
      `}</style>
    </section>
  );
}
