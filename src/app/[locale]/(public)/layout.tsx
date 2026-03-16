import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import dynamic from "next/dynamic";
import { LocalBusinessJsonLd, OrganizationJsonLd } from "@/components/seo/JsonLd";
import { getSettings } from "@/lib/content";

const WhatsAppButton = dynamic(() => import("@/components/ui/WhatsAppButton"));
const ScrollToTop = dynamic(() => import("@/components/ui/ScrollToTop"));

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();

  return (
    <>
      <LocalBusinessJsonLd />
      <OrganizationJsonLd />
      <a
        href="#main-content"
        className="fixed left-4 top-4 z-[100] -translate-y-20 rounded-lg bg-primary-900 px-4 py-2 text-sm font-bold text-white shadow-lg transition-transform focus:translate-y-0"
      >
        İçeriğe atla
      </a>
      <div className="scroll-progress-bar" />
      <Header />
      <main id="main-content" tabIndex={-1}>
        {children}
      </main>
      <Footer settings={settings} />
      <WhatsAppButton />
      <ScrollToTop />
    </>
  );
}
