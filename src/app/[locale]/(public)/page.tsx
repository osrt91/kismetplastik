import Hero from "@/components/sections/Hero";
import TrustBar from "@/components/public/TrustBar";
import Categories from "@/components/sections/Categories";
import WhyUs from "@/components/sections/WhyUs";
import Stats from "@/components/sections/Stats";
import About from "@/components/sections/About";
import dynamic from "next/dynamic";
import { getSettings, getPageContent } from "@/lib/content";

const Sectors = dynamic(() => import("@/components/sections/Sectors"));
const Testimonials = dynamic(() => import("@/components/sections/Testimonials"));
const CTA = dynamic(() => import("@/components/sections/CTA"));

const ReferenceLogos = dynamic(() => import("@/components/ui/ReferenceLogos"));

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  await params;
  const [settings, content] = await Promise.all([
    getSettings(),
    getPageContent("home"),
  ]);

  return (
    <>
      <Hero settings={settings} content={content} />
      <TrustBar settings={settings} />
      <Categories content={content} />
      <WhyUs content={content} />
      <Stats settings={settings} />
      <About settings={settings} content={content} />
      <Sectors content={content} />
      <ReferenceLogos variant="compact" className="py-12 lg:py-16" />
      <Testimonials />
      <CTA content={content} />
    </>
  );
}
