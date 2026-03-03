"use client";

import { useState, useCallback } from "react";
import Link from "@/components/ui/LocaleLink";
import {
  ChevronRight,
  Factory,
  Play,
  Camera,
  Cog,
  Users,
  Package,
  Ruler,
  RotateCcw,
  Expand,
  Droplets,
  Zap,
  Shield,
  Thermometer,
} from "lucide-react";
import { motion } from "framer-motion";
import AnimateOnScroll from "@/components/ui/AnimateOnScroll";
import ImageLightbox from "@/components/ui/ImageLightbox";
import { useLocale } from "@/contexts/LocaleContext";

/* ---------- data ---------- */

interface GalleryPhoto {
  id: number;
  title: string;
  titleEn: string;
  gradient: string;
  icon: React.ElementType;
}

const galleryPhotos: GalleryPhoto[] = [
  {
    id: 1,
    title: "Enjeksiyon Uretim Hatti",
    titleEn: "Injection Production Line",
    gradient: "bg-gradient-to-br from-[#0A1628] via-[#1a2d4a] to-[#0A1628]",
    icon: Thermometer,
  },
  {
    id: 2,
    title: "Sisirme Makineleri",
    titleEn: "Blow Molding Machines",
    gradient: "bg-gradient-to-br from-[#1a2d4a] via-[#0A1628] to-[#1a3050]",
    icon: Zap,
  },
  {
    id: 3,
    title: "Kalite Kontrol Laboratuvari",
    titleEn: "Quality Control Laboratory",
    gradient: "bg-gradient-to-br from-[#0A1628] to-[#F59E0B]/20",
    icon: Shield,
  },
  {
    id: 4,
    title: "Hammadde Depo Alani",
    titleEn: "Raw Material Storage Area",
    gradient: "bg-gradient-to-br from-[#1a3050] via-[#0A1628] to-[#0d1e36]",
    icon: Package,
  },
  {
    id: 5,
    title: "Kalip Atolyesi",
    titleEn: "Mold Workshop",
    gradient: "bg-gradient-to-br from-[#0d1e36] to-[#0A1628]",
    icon: Cog,
  },
  {
    id: 6,
    title: "Paketleme Hatti",
    titleEn: "Packaging Line",
    gradient: "bg-gradient-to-br from-[#0A1628] via-[#1a2d4a] to-[#F59E0B]/10",
    icon: Droplets,
  },
  {
    id: 7,
    title: "Urun Showroom",
    titleEn: "Product Showroom",
    gradient: "bg-gradient-to-br from-[#F59E0B]/15 via-[#0A1628] to-[#1a2d4a]",
    icon: Camera,
  },
  {
    id: 8,
    title: "Idari Bina ve Ofisler",
    titleEn: "Administrative Building & Offices",
    gradient: "bg-gradient-to-br from-[#1a2d4a] to-[#0A1628]",
    icon: Factory,
  },
];

interface FactoryStat {
  value: string;
  label: string;
  labelEn: string;
  icon: React.ElementType;
}

const factoryStats: FactoryStat[] = [
  {
    value: "10,000+",
    label: "m\u00B2 Uretim Alani",
    labelEn: "sqm Production Area",
    icon: Ruler,
  },
  {
    value: "50+",
    label: "Makine",
    labelEn: "Machines",
    icon: Cog,
  },
  {
    value: "1M+",
    label: "Aylik Uretim",
    labelEn: "Monthly Production",
    icon: Package,
  },
  {
    value: "200+",
    label: "Calisan",
    labelEn: "Employees",
    icon: Users,
  },
];

/* ---------- component ---------- */

export default function FactoryClient() {
  const { locale } = useLocale();
  const isTr = locale === "tr";

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const lightboxImages = galleryPhotos.map((photo) => ({
    alt: isTr ? photo.title : photo.titleEn,
    gradient: photo.gradient,
  }));

  const openLightbox = useCallback((index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
  }, []);

  const nextImage = useCallback(() => {
    setLightboxIndex((prev) =>
      prev >= galleryPhotos.length - 1 ? 0 : prev + 1
    );
  }, []);

  const prevImage = useCallback(() => {
    setLightboxIndex((prev) =>
      prev <= 0 ? galleryPhotos.length - 1 : prev - 1
    );
  }, []);

  return (
    <section className="bg-[#FAFAF7]">
      {/* ===== HERO ===== */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#0A1628] via-[#0d1e36] to-[#0A1628] py-24 lg:py-32">
        {/* Dot pattern */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div
            className="h-full w-full"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        {/* Decorative icons */}
        <div className="pointer-events-none absolute -right-20 -top-20 opacity-[0.04]">
          <Factory size={500} className="text-white" strokeWidth={0.7} />
        </div>
        <div className="pointer-events-none absolute -bottom-10 -left-10 opacity-[0.03]">
          <Cog
            size={300}
            className="animate-[spin_60s_linear_infinite] text-white"
            strokeWidth={0.7}
          />
        </div>

        {/* Amber glow */}
        <div
          className="absolute inset-0 animate-pulse bg-gradient-to-r from-[#F59E0B]/5 via-transparent to-[#F59E0B]/5"
          style={{ animationDuration: "6s" }}
        />

        <div className="relative mx-auto max-w-7xl px-4 lg:px-6">
          <AnimateOnScroll animation="fade-up">
            <nav className="mb-6 flex items-center gap-1.5 text-sm text-white/60">
              <Link href="/" className="hover:text-white">
                {isTr ? "Ana Sayfa" : "Home"}
              </Link>
              <ChevronRight size={14} />
              <span className="text-white">
                {isTr ? "Fabrika" : "Factory"}
              </span>
            </nav>

            <h1 className="mb-4 text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl">
              {isTr ? "Uretim Tesisimiz" : "Our Production Facility"}
            </h1>
            <p className="max-w-2xl text-lg text-white/70">
              {isTr
                ? "Modern makine parkuru ve yuksek kapasiteli uretim hatlariyla kozmetik ambalaj sektorunun guvenilir tedarikCisi."
                : "A reliable supplier in the cosmetic packaging sector with modern machinery and high-capacity production lines."}
            </p>
          </AnimateOnScroll>
        </div>
      </div>

      {/* ===== YOUTUBE VIDEO PLACEHOLDER ===== */}
      <div className="mx-auto max-w-7xl px-4 py-16 lg:px-6 lg:py-24">
        <AnimateOnScroll animation="fade-up">
          <div className="mb-12 text-center">
            <span className="mb-3 inline-block text-sm font-bold uppercase tracking-widest text-[#F59E0B]">
              {isTr ? "Tanitim Videosu" : "Introduction Video"}
            </span>
            <h2 className="mb-4 text-3xl font-extrabold text-[#0A1628] sm:text-4xl">
              {isTr ? "Fabrikamizi Kesfet" : "Explore Our Factory"}
            </h2>
            <p className="mx-auto max-w-2xl text-neutral-500">
              {isTr
                ? "Uretim sureclerimizi ve modern tesisimizi yakindan taniyin."
                : "Get to know our production processes and modern facility up close."}
            </p>
          </div>
        </AnimateOnScroll>

        <AnimateOnScroll animation="zoom-in">
          <div className="group relative mx-auto max-w-4xl cursor-pointer overflow-hidden rounded-3xl">
            {/* Video placeholder card */}
            <div className="relative aspect-video overflow-hidden rounded-3xl bg-gradient-to-br from-[#0A1628] via-[#1a2d4a] to-[#0A1628]">
              {/* Grid pattern */}
              <div className="absolute inset-0 opacity-[0.06]">
                <div
                  className="h-full w-full"
                  style={{
                    backgroundImage:
                      "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
                    backgroundSize: "60px 60px",
                  }}
                />
              </div>

              {/* Center play button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex h-20 w-20 items-center justify-center rounded-full bg-[#F59E0B] shadow-lg shadow-[#F59E0B]/30 transition-shadow group-hover:shadow-xl group-hover:shadow-[#F59E0B]/40 sm:h-24 sm:w-24"
                >
                  <Play
                    size={36}
                    className="ml-1 fill-[#0A1628] text-[#0A1628]"
                  />
                </motion.div>
              </div>

              {/* Bottom label */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
                <p className="text-sm font-medium text-white/80">
                  {isTr
                    ? "Kismet Plastik - Fabrika Tanitim Videosu"
                    : "Kismet Plastik - Factory Tour Video"}
                </p>
              </div>
            </div>
          </div>
        </AnimateOnScroll>
      </div>

      {/* ===== PHOTO GALLERY ===== */}
      <div className="bg-white py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <AnimateOnScroll animation="fade-up">
            <div className="mb-12 text-center">
              <span className="mb-3 inline-block text-sm font-bold uppercase tracking-widest text-[#F59E0B]">
                {isTr ? "Foto Galeri" : "Photo Gallery"}
              </span>
              <h2 className="mb-4 text-3xl font-extrabold text-[#0A1628] sm:text-4xl">
                {isTr
                  ? "Tesisimizden Kareler"
                  : "Scenes from Our Facility"}
              </h2>
              <p className="mx-auto max-w-2xl text-neutral-500">
                {isTr
                  ? "Uretim hatlarimiz, laboratuvarimiz ve calisma alanlarimiz."
                  : "Our production lines, laboratory and working areas."}
              </p>
            </div>
          </AnimateOnScroll>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {galleryPhotos.map((photo, i) => {
              const Icon = photo.icon;
              return (
                <AnimateOnScroll
                  key={photo.id}
                  animation="fade-up"
                  delay={Math.min(i * 80, 400)}
                >
                  <button
                    onClick={() => openLightbox(i)}
                    className="group relative block w-full overflow-hidden rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:ring-offset-2"
                    aria-label={isTr ? photo.title : photo.titleEn}
                  >
                    <div
                      className={`aspect-[4/3] ${photo.gradient} transition-transform duration-500 group-hover:scale-110`}
                    >
                      {/* Icon overlay */}
                      <div className="flex h-full items-center justify-center">
                        <Icon
                          size={48}
                          className="text-white/20 transition-all duration-300 group-hover:scale-110 group-hover:text-white/40"
                          strokeWidth={1}
                        />
                      </div>
                    </div>

                    {/* Title overlay */}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-4 pt-12">
                      <p className="text-sm font-semibold text-white">
                        {isTr ? photo.title : photo.titleEn}
                      </p>
                    </div>

                    {/* Hover expand indicator */}
                    <div className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white/0 backdrop-blur-sm transition-all group-hover:bg-white/20 group-hover:text-white/90">
                      <Expand size={14} />
                    </div>
                  </button>
                </AnimateOnScroll>
              );
            })}
          </div>
        </div>
      </div>

      {/* ===== 360 FACTORY TOUR PLACEHOLDER ===== */}
      <div className="mx-auto max-w-7xl px-4 py-16 lg:px-6 lg:py-24">
        <AnimateOnScroll animation="fade-up">
          <div className="mb-12 text-center">
            <span className="mb-3 inline-block text-sm font-bold uppercase tracking-widest text-[#F59E0B]">
              {isTr ? "Sanal Tur" : "Virtual Tour"}
            </span>
            <h2 className="mb-4 text-3xl font-extrabold text-[#0A1628] sm:text-4xl">
              {isTr
                ? "360\u00B0 Fabrika Turu"
                : "360\u00B0 Factory Tour"}
            </h2>
            <p className="mx-auto max-w-2xl text-neutral-500">
              {isTr
                ? "Uretim tesisimizi 360 derece sanal tur ile kesfet."
                : "Explore our production facility with a 360-degree virtual tour."}
            </p>
          </div>
        </AnimateOnScroll>

        <AnimateOnScroll animation="zoom-in">
          <div className="group relative mx-auto max-w-4xl overflow-hidden rounded-3xl">
            <div className="relative aspect-[16/9] overflow-hidden rounded-3xl bg-gradient-to-br from-[#0A1628] via-[#0d1e36] to-[#1a2d4a]">
              {/* Radial grid pattern */}
              <div className="absolute inset-0 opacity-[0.08]">
                <div
                  className="h-full w-full"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle, rgba(245,158,11,0.3) 1px, transparent 1px)",
                    backgroundSize: "30px 30px",
                  }}
                />
              </div>

              {/* Center icon */}
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-[#F59E0B]/30 bg-[#F59E0B]/10 sm:h-24 sm:w-24">
                  <RotateCcw
                    size={36}
                    className="animate-[spin_8s_linear_infinite] text-[#F59E0B]"
                  />
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-white">
                    {isTr ? "360\u00B0 Sanal Tur" : "360\u00B0 Virtual Tour"}
                  </p>
                  <p className="mt-1 text-sm text-white/50">
                    {isTr ? "Cok yakinda..." : "Coming soon..."}
                  </p>
                </div>
              </div>

              {/* Ambient glow */}
              <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#F59E0B]/5 blur-3xl" />
            </div>
          </div>
        </AnimateOnScroll>
      </div>

      {/* ===== FACTORY STATS ===== */}
      <div className="bg-gradient-to-br from-[#0A1628] via-[#0d1e36] to-[#0A1628] py-16 lg:py-24">
        {/* Dot pattern */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
          <div
            className="h-full w-full"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
              backgroundSize: "32px 32px",
            }}
          />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 lg:px-6">
          <AnimateOnScroll animation="fade-up">
            <div className="mb-14 text-center">
              <span className="mb-3 inline-block text-sm font-bold uppercase tracking-widest text-[#F59E0B]">
                {isTr ? "Rakamlarla Tesisimiz" : "Our Facility in Numbers"}
              </span>
              <h2 className="mb-4 text-3xl font-extrabold text-white sm:text-4xl">
                {isTr
                  ? "Uretim Gucumuz"
                  : "Our Production Power"}
              </h2>
            </div>
          </AnimateOnScroll>

          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {factoryStats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <AnimateOnScroll key={stat.label} animation="fade-up" delay={i * 100}>
                  <div className="group rounded-2xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur-sm transition-all hover:border-[#F59E0B]/30 hover:bg-white/10 sm:p-8">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F59E0B]/10 transition-colors group-hover:bg-[#F59E0B]/20">
                      <Icon
                        size={26}
                        className="text-[#F59E0B] transition-transform group-hover:scale-110"
                      />
                    </div>
                    <p className="text-3xl font-black text-white sm:text-4xl">
                      {stat.value}
                    </p>
                    <p className="mt-2 text-sm text-white/60">
                      {isTr ? stat.label : stat.labelEn}
                    </p>
                  </div>
                </AnimateOnScroll>
              );
            })}
          </div>

          {/* CTA */}
          <AnimateOnScroll animation="fade-up">
            <div className="mt-14 text-center">
              <Link
                href="/teklif-al"
                className="inline-flex items-center gap-2.5 rounded-xl bg-[#F59E0B] px-8 py-4 font-bold text-[#0A1628] shadow-lg shadow-[#F59E0B]/20 transition-all hover:bg-[#F59E0B]/90 hover:-translate-y-0.5 hover:shadow-xl"
              >
                <Factory size={18} />
                {isTr
                  ? "Fabrika Turu Randevusu Al"
                  : "Schedule a Factory Tour"}
                <ChevronRight size={16} />
              </Link>
            </div>
          </AnimateOnScroll>
        </div>
      </div>

      {/* ===== LIGHTBOX ===== */}
      {lightboxOpen && (
        <ImageLightbox
          images={lightboxImages}
          currentIndex={lightboxIndex}
          onClose={closeLightbox}
          onNext={nextImage}
          onPrev={prevImage}
        />
      )}
    </section>
  );
}
