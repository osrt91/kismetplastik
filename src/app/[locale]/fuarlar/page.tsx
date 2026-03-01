"use client";

import Link from "@/components/ui/LocaleLink";
import { ChevronRight, Calendar, MapPin, ExternalLink } from "lucide-react";
import { FaCalendarDays } from "react-icons/fa6";
import AnimateOnScroll from "@/components/ui/AnimateOnScroll";
import { useLocale } from "@/contexts/LocaleContext";

interface FairEvent {
  title: string;
  description: string;
  location: string;
  city: string;
  dates: string;
  upcoming: boolean;
  website?: string;
}

const events: Record<string, FairEvent[]> = {
  tr: [],
  en: [],
};

const labels: Record<string, Record<string, string>> = {
  tr: {
    title: "Fuar & Etkinlik Takvimi",
    subtitle: "Uluslararası fuarlara katılım hazırlıklarımız devam etmektedir.",
    upcoming: "Yaklaşan Fuarlar",
    past: "Geçmiş Fuarlar",
    visitWebsite: "Fuar Sitesi",
    ctaTitle: "Fuarlara Hazırlanıyoruz!",
    ctaDesc: "Çok yakında uluslararası kozmetik ve ambalaj fuarlarında yerimizi alacağız. Gelişmeler için bizi takip edin.",
    ctaButton: "İletişime Geç",
    preparingTitle: "Çok Yakında Fuarlardayız!",
    preparingDesc: "Kısmet Plastik olarak uluslararası kozmetik ve ambalaj fuarlarına katılım hazırlıklarımız devam etmektedir. Fuar takvimimiz ve stand bilgilerimiz için bizi takip etmeye devam edin.",
  },
  en: {
    title: "Fair & Event Calendar",
    subtitle: "We are preparing to participate in international fairs.",
    upcoming: "Upcoming Fairs",
    past: "Past Fairs",
    visitWebsite: "Fair Website",
    ctaTitle: "We Are Preparing for Fairs!",
    ctaDesc: "We will soon take our place at international cosmetics and packaging fairs. Follow us for updates.",
    ctaButton: "Contact Us",
    preparingTitle: "Coming Soon to Fairs!",
    preparingDesc: "We are preparing to participate in international cosmetics and packaging fairs. Stay tuned for our fair calendar and booth information.",
  },
};

export default function FuarlarPage() {
  const { locale, dict } = useLocale();
  const t = labels[locale] || labels.tr;
  const nav = dict.nav;
  const eventList = events[locale] || events.tr;

  const upcomingEvents = eventList.filter((e) => e.upcoming);
  const pastEvents = eventList.filter((e) => !e.upcoming);

  return (
    <section className="bg-white dark:bg-neutral-0">
      <div className="relative overflow-hidden bg-gradient-to-br from-primary-900 via-primary-700 to-primary-900 py-20 lg:py-28">
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="h-full w-full" style={{ backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`, backgroundSize: "40px 40px" }} />
        </div>
        <FaCalendarDays size={300} className="pointer-events-none absolute -right-10 top-1/2 -translate-y-1/2 text-white/[0.04]" />
        <div className="relative mx-auto max-w-7xl px-4 lg:px-6">
          <AnimateOnScroll animation="fade-up">
            <nav className="mb-6 flex items-center gap-1.5 text-sm text-white/60">
              <Link href="/" className="transition-colors hover:text-white">{nav.home}</Link>
              <ChevronRight size={14} />
              <span className="text-white">{t.title}</span>
            </nav>
            <h1 className="mb-4 text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl">{t.title}</h1>
            <p className="max-w-2xl text-lg text-white/70">{t.subtitle}</p>
          </AnimateOnScroll>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-6 lg:py-20">
        {upcomingEvents.length > 0 ? (
          <>
            <AnimateOnScroll animation="fade-up">
              <h2 className="mb-8 text-2xl font-extrabold text-primary-900">{t.upcoming}</h2>
            </AnimateOnScroll>
            <div className="mb-16 grid gap-6 lg:grid-cols-3">
              {upcomingEvents.map((event, i) => (
                <AnimateOnScroll key={event.title} animation="fade-up" delay={i * 100}>
                  <div className="group relative overflow-hidden rounded-2xl border-2 border-accent-200 bg-accent-50/30 p-6 transition-all hover:-translate-y-1 hover:shadow-xl">
                    <div className="absolute right-3 top-3 rounded-full bg-accent-500 px-3 py-1 text-[10px] font-bold text-primary-900">
                      {locale === "tr" ? "Yaklaşan" : "Upcoming"}
                    </div>
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent-100 text-accent-600">
                      <Calendar size={24} />
                    </div>
                    <h3 className="mb-2 text-lg font-bold text-primary-900">{event.title}</h3>
                    <p className="mb-4 text-sm leading-relaxed text-neutral-600">{event.description}</p>
                    <div className="space-y-1.5 text-sm text-neutral-500">
                      <div className="flex items-center gap-2"><Calendar size={14} className="text-accent-500" /> {event.dates}</div>
                      <div className="flex items-center gap-2"><MapPin size={14} className="text-accent-500" /> {event.location}, {event.city}</div>
                    </div>
                    {event.website && (
                      <a href={event.website} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary-700 hover:text-accent-600">
                        {t.visitWebsite} <ExternalLink size={12} />
                      </a>
                    )}
                  </div>
                </AnimateOnScroll>
              ))}
            </div>
          </>
        ) : (
          <AnimateOnScroll animation="fade-up">
            <div className="mb-16 rounded-2xl border-2 border-dashed border-accent-300 bg-accent-50/20 p-10 text-center lg:p-16">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-accent-100 text-accent-600">
                <Calendar size={40} />
              </div>
              <h2 className="mb-4 text-2xl font-extrabold text-primary-900 sm:text-3xl">
                {t.preparingTitle}
              </h2>
              <p className="mx-auto max-w-2xl text-lg leading-relaxed text-neutral-600">
                {t.preparingDesc}
              </p>
            </div>
          </AnimateOnScroll>
        )}

        {pastEvents.length > 0 && (
          <>
            <AnimateOnScroll animation="fade-up">
              <h2 className="mb-8 text-2xl font-extrabold text-primary-900">{t.past}</h2>
            </AnimateOnScroll>
            <div className="mb-16 grid gap-4 lg:grid-cols-2">
              {pastEvents.map((event, i) => (
                <AnimateOnScroll key={event.title} animation="fade-up" delay={i * 80}>
                  <div className="flex items-start gap-4 rounded-xl border border-neutral-100 bg-neutral-50 p-5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-neutral-200 text-neutral-500">
                      <Calendar size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-neutral-700">{event.title}</h3>
                      <p className="text-sm text-neutral-500">{event.dates} &middot; {event.city}</p>
                    </div>
                  </div>
                </AnimateOnScroll>
              ))}
            </div>
          </>
        )}

        <AnimateOnScroll animation="fade-up">
          <div className="rounded-2xl bg-gradient-to-r from-primary-900 to-primary-700 p-8 text-center lg:p-12">
            <h3 className="mb-2 text-2xl font-bold text-white">{t.ctaTitle}</h3>
            <p className="mb-6 text-white/60">{t.ctaDesc}</p>
            <Link href="/iletisim" className="inline-flex items-center gap-2 rounded-xl bg-accent-500 px-8 py-3.5 font-bold text-primary-900 transition-all hover:bg-accent-600 hover:scale-105">
              {t.ctaButton}
            </Link>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
