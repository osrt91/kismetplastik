import Hero from "@/components/sections/Hero";
import Categories from "@/components/sections/Categories";
import WhyUs from "@/components/sections/WhyUs";
import ProductFinder from "@/components/sections/ProductFinder";
import ProcessSteps from "@/components/sections/ProcessSteps";
import Stats from "@/components/sections/Stats";
import About from "@/components/sections/About";
import Sectors from "@/components/sections/Sectors";
import Certificates from "@/components/sections/Certificates";
import References from "@/components/sections/References";
import Testimonials from "@/components/sections/Testimonials";
import CTA from "@/components/sections/CTA";

export default function Home() {
  return (
    <>
      <Hero />
      <Categories />
      <WhyUs />
      <ProductFinder />
      <ProcessSteps />
      <Stats />
      <About />
      <Sectors />
      <Certificates />
      <References />
      <Testimonials />
      <CTA />
    </>
  );
}
