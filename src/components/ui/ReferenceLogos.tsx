"use client";

import Image from "next/image";
import { useLocale } from "@/contexts/LocaleContext";
import { references } from "@/data/references";
import { cn } from "@/lib/utils";

interface ReferenceLogosProps {
  variant: "compact" | "full";
  className?: string;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function LogoCard({
  name,
  logo,
  sector,
  sectorEn,
  website,
  variant,
  locale,
}: {
  name: string;
  logo: string;
  sector: string;
  sectorEn: string;
  website?: string;
  variant: "compact" | "full";
  locale: string;
}) {
  const initials = getInitials(name);
  const sectorLabel = locale === "en" ? sectorEn : sector;

  const content = (
    <div
      className={cn(
        "group relative flex items-center justify-center overflow-hidden rounded-xl border border-neutral-100 bg-white transition-all duration-500 dark:border-neutral-700 dark:bg-neutral-800",
        variant === "compact"
          ? "h-20 w-44 shrink-0 px-4"
          : "h-32 flex-col gap-2 p-6 hover:border-primary-200 hover:shadow-lg dark:hover:border-primary-500/30"
      )}
    >
      {/* Logo image with grayscale filter */}
      <div
        className={cn(
          "relative transition-all duration-500",
          "grayscale group-hover:grayscale-0",
          "opacity-70 group-hover:opacity-100",
          variant === "compact" ? "h-10 w-28" : "h-12 w-36"
        )}
      >
        <Image
          src={logo}
          alt={name}
          fill
          className="object-contain"
          onError={(e) => {
            // Hide the image if it fails to load; initials fallback is always shown behind
            (e.target as HTMLImageElement).style.opacity = "0";
          }}
        />
      </div>

      {/* Initials fallback (always present behind the image) */}
      <div
        className={cn(
          "absolute inset-0 -z-10 flex items-center justify-center",
          variant === "compact" ? "flex-row gap-2" : "flex-col gap-1"
        )}
      >
        <span
          className={cn(
            "font-bold text-primary-900/20 transition-colors duration-500 group-hover:text-primary-900/40 dark:text-white/20 dark:group-hover:text-white/40",
            variant === "compact" ? "text-xl" : "text-2xl"
          )}
        >
          {initials}
        </span>
      </div>

      {/* Sector badge (full variant only) */}
      {variant === "full" && (
        <span className="mt-auto text-xs font-medium text-neutral-500 transition-colors group-hover:text-accent-600 dark:text-neutral-400 dark:group-hover:text-accent-400">
          {sectorLabel}
        </span>
      )}

      {/* Company name tooltip on hover */}
      <div
        className={cn(
          "pointer-events-none absolute inset-x-0 bottom-0 translate-y-full bg-primary-900/90 px-3 py-1.5 text-center text-xs font-medium text-white opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100",
          variant === "full" && "rounded-b-xl"
        )}
      >
        {name}
      </div>
    </div>
  );

  if (website) {
    return (
      <a
        href={website}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        {content}
      </a>
    );
  }

  return content;
}

function CompactVariant({ locale }: { locale: string }) {
  // Duplicate references for seamless marquee loop
  const doubled = [...references, ...references];

  return (
    <div className="relative overflow-hidden">
      {/* Fade edges */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-white to-transparent dark:from-neutral-900" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-white to-transparent dark:from-neutral-900" />

      {/* Marquee track */}
      <div className="flex animate-[marquee_30s_linear_infinite] gap-6 hover:[animation-play-state:paused]">
        {doubled.map((ref, i) => (
          <LogoCard
            key={`${ref.id}-${i}`}
            name={ref.name}
            logo={ref.logo}
            sector={ref.sector}
            sectorEn={ref.sectorEn}
            website={ref.website}
            variant="compact"
            locale={locale}
          />
        ))}
      </div>
    </div>
  );
}

function FullVariant({ locale }: { locale: string }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:gap-6">
      {references.map((ref) => (
        <LogoCard
          key={ref.id}
          name={ref.name}
          logo={ref.logo}
          sector={ref.sector}
          sectorEn={ref.sectorEn}
          website={ref.website}
          variant="full"
          locale={locale}
        />
      ))}
    </div>
  );
}

export default function ReferenceLogos({
  variant,
  className,
}: ReferenceLogosProps) {
  const { locale } = useLocale();

  return (
    <div className={cn(className)}>
      {variant === "compact" ? (
        <CompactVariant locale={locale} />
      ) : (
        <FullVariant locale={locale} />
      )}
    </div>
  );
}
