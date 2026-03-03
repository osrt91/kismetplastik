"use client";

import {
  Shield,
  ShieldCheck,
  BadgeCheck,
  Award,
  CheckCircle,
  FlaskConical,
  Download,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";
import Link from "@/components/ui/LocaleLink";
import AnimateOnScroll from "@/components/ui/AnimateOnScroll";
import { useLocale } from "@/contexts/LocaleContext";
import { certificates } from "@/data/certificates";
import { cn } from "@/lib/utils";

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Shield,
  ShieldCheck,
  BadgeCheck,
  Award,
  CheckCircle,
  FlaskConical,
};

const cardColors = [
  "bg-[#0A1628]/5 text-[#0A1628]",
  "bg-[#0A1628]/5 text-[#0A1628]",
  "bg-[#F59E0B]/10 text-[#F59E0B]",
  "bg-[#0A1628]/5 text-[#0A1628]",
  "bg-[#F59E0B]/10 text-[#F59E0B]",
  "bg-[#0A1628]/5 text-[#0A1628]",
];

export default function CertificatesClient() {
  const { locale } = useLocale();
  const isTr = locale === "tr";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Kısmet Plastik",
    url: "https://www.kismetplastik.com",
    hasCredential: certificates.map((cert) => ({
      "@type": "EducationalOccupationalCredential",
      name: isTr ? cert.name : cert.nameEn,
      credentialCategory: "certification",
      recognizedBy: {
        "@type": "Organization",
        name: cert.issuer,
      },
      validIn: {
        "@type": "AdministrativeArea",
        name: "Global",
      },
      dateCreated: "2020-01-01",
      expires: cert.validUntil,
    })),
  };

  return (
    <section className="bg-[#FAFAF7]">
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#0A1628] via-[#0A1628]/95 to-[#0A1628] py-20 lg:py-28">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div
            className="h-full w-full"
            style={{
              backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        {/* Decorative icons */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-[0.04]">
          <Shield size={400} strokeWidth={0.5} className="text-white" />
        </div>
        <div className="absolute -left-20 bottom-0 opacity-[0.03]">
          <Award size={300} strokeWidth={0.5} className="text-white" />
        </div>

        {/* Gradient orbs */}
        <div className="absolute -left-20 -top-20 h-72 w-72 animate-pulse rounded-full bg-[#F59E0B]/10 blur-3xl" />
        <div
          className="absolute -bottom-16 right-10 h-64 w-64 rounded-full bg-white/5 blur-3xl"
          style={{ animation: "pulse 4s ease-in-out infinite 1s" }}
        />

        <div className="relative mx-auto max-w-7xl px-4 lg:px-6">
          <AnimateOnScroll animation="fade-up">
            <nav className="mb-6 flex items-center gap-1.5 text-sm text-white/60">
              <Link href="/" className="transition-colors hover:text-white">
                {isTr ? "Ana Sayfa" : "Home"}
              </Link>
              <ChevronRight size={14} />
              <span className="text-white">
                {isTr ? "Sertifikalar" : "Certificates"}
              </span>
            </nav>
            <h1 className="mb-4 text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl">
              {isTr ? "Sertifikalar & Belgeler" : "Certificates & Documents"}
            </h1>
            <p className="max-w-2xl text-lg text-white/70">
              {isTr
                ? "Uluslararası standartlarda üretim yapan Kısmet Plastik, sahip olduğu sertifikalarla kalite ve güvenilirliğini belgeler."
                : "Kısmet Plastik, manufacturing at international standards, documents its quality and reliability through its certificates."}
            </p>
          </AnimateOnScroll>
        </div>
      </div>

      {/* Section divider */}
      <div className="h-1 bg-gradient-to-r from-transparent via-[#F59E0B]/40 to-transparent" />

      {/* Certificates Grid */}
      <div className="mx-auto max-w-7xl px-4 py-16 lg:px-6 lg:py-24">
        <AnimateOnScroll animation="fade-up">
          <div className="mb-14 text-center">
            <span className="mb-3 inline-block text-sm font-bold uppercase tracking-widest text-[#F59E0B]">
              {isTr ? "Kalite Belgeleri" : "Quality Documents"}
            </span>
            <h2 className="mb-4 text-3xl font-extrabold text-[#0A1628] sm:text-4xl">
              {isTr ? "Uluslararası Sertifikalarımız" : "Our International Certificates"}
            </h2>
            <p className="mx-auto max-w-2xl text-neutral-500">
              {isTr
                ? "Üretim süreçlerimiz uluslararası standartlara uygunluk açısından bağımsız kuruluşlar tarafından düzenli olarak denetlenmektedir."
                : "Our production processes are regularly audited by independent organizations for compliance with international standards."}
            </p>
          </div>
        </AnimateOnScroll>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {certificates.map((cert, i) => {
            const IconComponent = iconMap[cert.icon] || Shield;
            const colorClass = cardColors[i % cardColors.length];

            return (
              <AnimateOnScroll key={cert.id} animation="fade-up" delay={i * 80}>
                <div
                  className={cn(
                    "group relative flex h-full flex-col overflow-hidden rounded-2xl border border-neutral-100 bg-white p-7",
                    "transition-all duration-300 hover:-translate-y-1 hover:border-[#F59E0B]/30 hover:shadow-xl"
                  )}
                >
                  {/* Ribbon visual */}
                  <div className="absolute -right-4 -top-4 h-20 w-20 rotate-12 opacity-[0.06]">
                    <Award size={80} className="text-[#0A1628]" />
                  </div>

                  {/* Check overlay on hover */}
                  <div className="absolute right-4 top-4 scale-0 transition-transform duration-300 group-hover:scale-100">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/10">
                      <CheckCircle2 size={18} className="text-emerald-500" />
                    </div>
                  </div>

                  {/* Icon */}
                  <div
                    className={cn(
                      "mb-5 flex h-14 w-14 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110",
                      colorClass
                    )}
                  >
                    <IconComponent size={26} />
                  </div>

                  {/* Certificate name */}
                  <h3 className="mb-2 text-lg font-bold text-[#0A1628]">
                    {isTr ? cert.name : cert.nameEn}
                  </h3>

                  {/* Issuer */}
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[#F59E0B]">
                    {cert.issuer}
                  </p>

                  {/* Description */}
                  <p className="mb-2 flex-1 text-sm leading-relaxed text-neutral-500">
                    {isTr ? cert.description : cert.descriptionEn}
                  </p>

                  {/* Valid until */}
                  <p className="mb-5 text-xs text-neutral-400">
                    {isTr ? "Geçerlilik:" : "Valid until:"}{" "}
                    {new Date(cert.validUntil).toLocaleDateString(
                      isTr ? "tr-TR" : "en-US",
                      { day: "numeric", month: "long", year: "numeric" }
                    )}
                  </p>

                  {/* Download button */}
                  <a
                    href={cert.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      "inline-flex items-center gap-2 self-start rounded-xl px-5 py-2.5 text-sm font-semibold",
                      "bg-[#0A1628] text-white transition-all duration-200",
                      "hover:bg-[#F59E0B] hover:text-[#0A1628]"
                    )}
                  >
                    <Download size={14} />
                    {isTr ? "PDF İndir" : "Download PDF"}
                  </a>

                  {/* Bottom accent line */}
                  <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-[#0A1628] to-[#F59E0B] transition-all duration-500 group-hover:w-full" />
                </div>
              </AnimateOnScroll>
            );
          })}
        </div>

        {/* CTA Section */}
        <AnimateOnScroll animation="fade-up" delay={200}>
          <div className="mt-16 rounded-2xl border border-[#F59E0B]/20 bg-gradient-to-br from-[#0A1628] to-[#0A1628]/90 p-8 text-center lg:p-12">
            <h3 className="mb-3 text-2xl font-extrabold text-white sm:text-3xl">
              {isTr
                ? "Sertifikalı Üretim ile Güvence"
                : "Assurance with Certified Production"}
            </h3>
            <p className="mx-auto mb-6 max-w-2xl text-white/70">
              {isTr
                ? "Tüm sertifikalarımız hakkında detaylı bilgi almak veya belgelerimizin güncel kopyalarını talep etmek için bizimle iletişime geçin."
                : "Contact us for detailed information about all our certificates or to request current copies of our documents."}
            </p>
            <Link
              href="/iletisim"
              className={cn(
                "inline-flex items-center gap-2 rounded-xl px-8 py-3.5 font-bold shadow-lg transition-all",
                "bg-[#F59E0B] text-[#0A1628] hover:-translate-y-0.5 hover:bg-[#F59E0B]/90"
              )}
            >
              {isTr ? "İletişime Geçin" : "Contact Us"}
            </Link>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
