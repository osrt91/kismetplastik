import Hero from "@/components/sections/Hero";
import Categories from "@/components/sections/Categories";
import WhyUs from "@/components/sections/WhyUs";
import Stats from "@/components/sections/Stats";
import About from "@/components/sections/About";
import Sectors from "@/components/sections/Sectors";
import Testimonials from "@/components/sections/Testimonials";
import CTA from "@/components/sections/CTA";
import dynamic from "next/dynamic";

const ReferenceLogos = dynamic(() => import("@/components/ui/ReferenceLogos"));

export default function Home() {
  return (
    <>
      <Hero />
      <Categories />
      <WhyUs />
      <Stats />
      <About />
      <Sectors />
      <ReferenceLogos variant="compact" className="py-12 lg:py-16" />
      <Testimonials />
      <CTA />
    </>
  );
}
