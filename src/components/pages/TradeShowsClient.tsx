"use client";

import { Calendar, MapPin, ExternalLink, Download } from "lucide-react";
import Link from "@/components/ui/LocaleLink";
import AnimateOnScroll from "@/components/ui/AnimateOnScroll";
import { useLocale } from "@/contexts/LocaleContext";
import { tradeShows, type TradeShow } from "@/data/trade-shows";
import { downloadICalEvent } from "@/lib/ical";

export default function TradeShowsClient() {
  const { locale } = useLocale();

  const upcoming = tradeShows.filter((ts) => ts.status === "upcoming");
  const past = tradeShows.filter((ts) => ts.status === "past");

  const formatDateRange = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const loc = locale === "en" ? "en-US" : "tr-TR";

    if (
      start.getMonth() === end.getMonth() &&
      start.getFullYear() === end.getFullYear()
    ) {
      // Same month: "5 - 7 Ekim 2026"
      return `${start.getDate()} - ${end.toLocaleDateString(loc, {
        day: "numeric",
        month: "long",
        year: "numeric",
      })}`;
    }

    // Different months
    return `${start.toLocaleDateString(loc, {
      day: "numeric",
      month: "long",
    })} - ${end.toLocaleDateString(loc, {
      day: "numeric",
      month: "long",
      year: "numeric",
    })}`;
  };

  const handleDownloadIcal = (show: TradeShow) => {
    downloadICalEvent({
      title: locale === "en" ? show.nameEn : show.name,
      description: locale === "en" ? show.descriptionEn : show.description,
      location: locale === "en" ? show.locationEn : show.location,
      startDate: show.startDate,
      endDate: show.endDate,
    });
  };

  const getName = (show: TradeShow) =>
    locale === "en" ? show.nameEn : show.name;
  const getDescription = (show: TradeShow) =>
    locale === "en" ? show.descriptionEn : show.description;
  const getLocation = (show: TradeShow) =>
    locale === "en" ? show.locationEn : show.location;

  return (
    <section className="bg-[#FAFAF7]">
      {/* Hero */}
      <div className="bg-gradient-to-br from-[#0A1628] via-[#0f2240] to-[#0A1628] py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <AnimateOnScroll animation="fade-up">
            <div className="text-center">
              <span className="mb-4 inline-block rounded-full bg-[#F59E0B]/15 px-4 py-1.5 text-sm font-semibold text-[#F59E0B]">
                {locale === "en" ? "Events" : "Etkinlikler"}
              </span>
              <h1 className="mb-4 text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl">
                {locale === "en"
                  ? "Trade Shows & Events"
                  : "Fuarlar & Etkinlikler"}
              </h1>
              <p className="mx-auto max-w-2xl text-lg text-white/70">
                {locale === "en"
                  ? "Meet Kismet Plastik at leading industry trade shows. Discover our latest packaging solutions and explore partnership opportunities."
                  : "Kismet Plastik olarak sektorun onde gelen fuarlarinda yerimizi aliyoruz. En yeni ambalaj cozumlerimizi kesfetmek ve is birligi firsatlarini degerlendirmek icin bizi ziyaret edin."}
              </p>
            </div>
          </AnimateOnScroll>
        </div>
      </div>

      {/* Upcoming Trade Shows */}
      {upcoming.length > 0 && (
        <div className="mx-auto max-w-7xl px-4 py-16 lg:px-6 lg:py-24">
          <AnimateOnScroll animation="fade-up">
            <div className="mb-10">
              <div className="mb-2 flex items-center gap-2">
                <span className="inline-block h-3 w-3 rounded-full bg-green-500" />
                <span className="text-sm font-semibold uppercase tracking-wider text-green-700">
                  {locale === "en" ? "Upcoming" : "Yaklasan"}
                </span>
              </div>
              <h2 className="text-2xl font-extrabold text-[#0A1628] sm:text-3xl">
                {locale === "en" ? "Upcoming Trade Shows" : "Yaklasan Fuarlar"}
              </h2>
            </div>
          </AnimateOnScroll>

          <div className="grid gap-8 lg:grid-cols-2">
            {upcoming.map((show, i) => (
              <AnimateOnScroll
                key={show.id}
                animation="fade-up"
                delay={i * 100}
              >
                <div className="group relative overflow-hidden rounded-2xl border border-[#0A1628]/10 bg-white shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                  {/* Accent bar */}
                  <div className="absolute left-0 top-0 h-full w-1.5 bg-[#F59E0B]" />

                  <div className="p-6 pl-8 sm:p-8 sm:pl-10">
                    {/* Status badge */}
                    <span className="mb-4 inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                      {locale === "en" ? "Upcoming" : "Yaklasan"}
                    </span>

                    <h3 className="mb-3 text-xl font-bold text-[#0A1628] sm:text-2xl">
                      {getName(show)}
                    </h3>

                    <div className="mb-4 space-y-2">
                      <div className="flex items-center gap-2 text-sm text-neutral-600">
                        <Calendar size={16} className="shrink-0 text-[#F59E0B]" />
                        <span>{formatDateRange(show.startDate, show.endDate)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-neutral-600">
                        <MapPin size={16} className="shrink-0 text-[#F59E0B]" />
                        <span>{getLocation(show)}</span>
                      </div>
                    </div>

                    <p className="mb-5 text-sm leading-relaxed text-neutral-500">
                      {getDescription(show)}
                    </p>

                    {show.booth && (
                      <div className="mb-5 rounded-lg bg-[#0A1628]/5 px-4 py-3">
                        <span className="text-xs font-semibold uppercase tracking-wider text-[#0A1628]/60">
                          {locale === "en" ? "Booth" : "Stand"}
                        </span>
                        <p className="mt-0.5 font-bold text-[#0A1628]">
                          {show.booth}
                        </p>
                      </div>
                    )}

                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        onClick={() => handleDownloadIcal(show)}
                        className="inline-flex items-center gap-2 rounded-xl bg-[#0A1628] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#0A1628]/85"
                      >
                        <Download size={16} />
                        {locale === "en"
                          ? "Add to Calendar"
                          : "Takvime Ekle"}
                      </button>
                      {show.website && (
                        <a
                          href={show.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 rounded-xl border border-[#0A1628]/15 px-5 py-2.5 text-sm font-semibold text-[#0A1628] transition-colors hover:bg-[#0A1628]/5"
                        >
                          <ExternalLink size={16} />
                          {locale === "en" ? "Website" : "Web Sitesi"}
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      )}

      {/* Past Trade Shows */}
      {past.length > 0 && (
        <div className="mx-auto max-w-7xl px-4 pb-16 lg:px-6 lg:pb-24">
          <AnimateOnScroll animation="fade-up">
            <div className="mb-10">
              <div className="mb-2 flex items-center gap-2">
                <span className="inline-block h-3 w-3 rounded-full bg-neutral-400" />
                <span className="text-sm font-semibold uppercase tracking-wider text-neutral-500">
                  {locale === "en" ? "Past" : "Gecmis"}
                </span>
              </div>
              <h2 className="text-2xl font-extrabold text-[#0A1628] sm:text-3xl">
                {locale === "en"
                  ? "Past Trade Shows"
                  : "Gecmis Fuarlar"}
              </h2>
            </div>
          </AnimateOnScroll>

          <div className="grid gap-6 lg:grid-cols-2">
            {past.map((show, i) => (
              <AnimateOnScroll
                key={show.id}
                animation="fade-up"
                delay={i * 100}
              >
                <div className="relative overflow-hidden rounded-2xl border border-neutral-200 bg-white/80 shadow-sm">
                  {/* Muted accent bar */}
                  <div className="absolute left-0 top-0 h-full w-1.5 bg-neutral-300" />

                  <div className="p-6 pl-8 sm:p-8 sm:pl-10">
                    <span className="mb-4 inline-block rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold text-neutral-500">
                      {locale === "en" ? "Past" : "Gecmis"}
                    </span>

                    <h3 className="mb-3 text-lg font-bold text-[#0A1628]/80 sm:text-xl">
                      {getName(show)}
                    </h3>

                    <div className="mb-4 space-y-2">
                      <div className="flex items-center gap-2 text-sm text-neutral-500">
                        <Calendar size={16} className="shrink-0 text-neutral-400" />
                        <span>{formatDateRange(show.startDate, show.endDate)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-neutral-500">
                        <MapPin size={16} className="shrink-0 text-neutral-400" />
                        <span>{getLocation(show)}</span>
                      </div>
                    </div>

                    <p className="mb-4 text-sm leading-relaxed text-neutral-400">
                      {getDescription(show)}
                    </p>

                    {show.booth && (
                      <div className="rounded-lg bg-neutral-50 px-4 py-3">
                        <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                          {locale === "en" ? "Booth" : "Stand"}
                        </span>
                        <p className="mt-0.5 font-bold text-neutral-600">
                          {show.booth}
                        </p>
                      </div>
                    )}

                    {show.website && (
                      <div className="mt-4">
                        <a
                          href={show.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-sm font-medium text-neutral-500 transition-colors hover:text-[#0A1628]"
                        >
                          <ExternalLink size={14} />
                          {locale === "en" ? "Website" : "Web Sitesi"}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      )}

      {/* CTA Section - Fuarda Goruselim */}
      <div className="bg-gradient-to-br from-[#0A1628] via-[#0f2240] to-[#0A1628]">
        <div className="mx-auto max-w-7xl px-4 py-16 lg:px-6 lg:py-24">
          <AnimateOnScroll animation="fade-up">
            <div className="text-center">
              <h2 className="mb-4 text-2xl font-extrabold text-white sm:text-3xl lg:text-4xl">
                {locale === "en"
                  ? "Let's Meet at the Fair"
                  : "Fuarda Goruselim"}
              </h2>
              <p className="mx-auto mb-8 max-w-2xl text-lg text-white/70">
                {locale === "en"
                  ? "Planning to attend one of the upcoming trade shows? Contact us beforehand to schedule a meeting and learn about our latest cosmetic packaging solutions."
                  : "Yaklasan fuarlardan birine katilmayi planliyorsaniz, onceden bizimle iletisime gecin. Gorusme planlayalim ve en yeni kozmetik ambalaj cozumlerimizi birlikte inceleyelim."}
              </p>
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link
                  href="/iletisim"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#F59E0B] px-8 py-3.5 text-base font-bold text-[#0A1628] shadow-lg transition-all hover:bg-[#F59E0B]/90 hover:-translate-y-0.5"
                >
                  {locale === "en" ? "Contact Us" : "Bize Ulasin"}
                </Link>
                <Link
                  href="/teklif-al"
                  className="inline-flex items-center gap-2 rounded-xl border-2 border-white/20 px-8 py-3.5 text-base font-bold text-white transition-all hover:border-white/40 hover:bg-white/5"
                >
                  {locale === "en" ? "Request a Quote" : "Teklif Alin"}
                </Link>
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  );
}
