import Hero from "@/components/sections/Hero";
import TrustBar from "@/components/public/TrustBar";
import Categories from "@/components/sections/Categories";
import WhyUs from "@/components/sections/WhyUs";
import Stats from "@/components/sections/Stats";
import About from "@/components/sections/About";
import dynamic from "next/dynamic";
import { getSettings, getPageContent } from "@/lib/content";
import { getDictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/locales";

const Sectors = dynamic(() => import("@/components/sections/Sectors"));
const Testimonials = dynamic(() => import("@/components/sections/Testimonials"));
const CTA = dynamic(() => import("@/components/sections/CTA"));

const ReferenceLogos = dynamic(() => import("@/components/ui/ReferenceLogos"));

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const [settings, content, dict] = await Promise.all([
    getSettings(),
    getPageContent("home"),
    getDictionary(locale as Locale),
  ]);

  return (
    <>
      <Hero settings={settings} content={content} />
      <TrustBar settings={settings} />
      <Categories content={content} />
      <WhyUs content={content} locale={locale as Locale} dict={dict} />
      <Stats settings={settings} />
      <About settings={settings} content={content} locale={locale as Locale} dict={dict} />
      <Sectors content={content} locale={locale as Locale} dict={dict} />
      <ReferenceLogos variant="compact" className="py-12 lg:py-16" />
      <Testimonials dict={dict} />
      <CTA content={content} locale={locale as Locale} dict={dict} />
    </>
  );
}
