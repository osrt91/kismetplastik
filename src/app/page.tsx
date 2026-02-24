import Hero from "@/components/sections/Hero";
import Categories from "@/components/sections/Categories";
import WhyUs from "@/components/sections/WhyUs";
import Stats from "@/components/sections/Stats";
import About from "@/components/sections/About";
import Sectors from "@/components/sections/Sectors";
import CTA from "@/components/sections/CTA";

export default function Home() {
  return (
    <>
      <Hero />
      <Categories />
      <WhyUs />
      <Stats />
      <About />
      <Sectors />
      <CTA />
    </>
  );
}
