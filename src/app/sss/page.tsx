"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronRight,
  ChevronDown,
  HelpCircle,
  MessageCircle,
  Phone,
} from "lucide-react";
import AnimateOnScroll from "@/components/ui/AnimateOnScroll";
import { useLocale } from "@/contexts/LocaleContext";

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqData: FAQItem[] = [
  {
    category: "Genel",
    question: "Kismet Plastik hangi ürünleri üretiyor?",
    answer:
      "PET şişeler, kavanozlar, kapaklar, preformlar ve özel tasarım ambalaj ürünleri üretmekteyiz. Gıda, kozmetik, kimya ve ilaç sektörlerine yönelik geniş bir ürün yelpazemiz bulunmaktadır.",
  },
  {
    category: "Genel",
    question: "Hangi sektörlere hizmet veriyorsunuz?",
    answer:
      "Gıda & içecek, kozmetik, kimya, ilaç & eczacılık, kişisel bakım ve endüstriyel sektörlere hizmet vermekteyiz. Her sektörün standartlarına uygun ürünler sunuyoruz.",
  },
  {
    category: "Sipariş",
    question: "Minimum sipariş miktarı nedir?",
    answer:
      "Minimum sipariş miktarları ürüne göre değişmektedir. PET şişelerde genellikle 1.000-20.000 adet, kapaklarda 20.000-50.000 adet, preformlarda 50.000-100.000 adet minimum sipariş alıyoruz. Detaylı bilgi için teklif formumuzu doldurabilirsiniz.",
  },
  {
    category: "Sipariş",
    question: "Sipariş süreci nasıl işliyor?",
    answer:
      "Teklif formumuzu doldurmanız veya bizi aramanız yeterlidir. Uzman ekibimiz ihtiyaçlarınızı değerlendirir, size özel bir teklif hazırlar. Onayınızın ardından üretim planlanır ve belirtilen sürede teslimat yapılır.",
  },
  {
    category: "Sipariş",
    question: "Teslimat süreleri ne kadardır?",
    answer:
      "Standart ürünlerde stoktan 3-5 iş günü, özel üretim siparişlerde 15-30 iş günü içinde teslimat yapılmaktadır. Sipariş miktarına ve ürün özelliklerine göre bu süreler değişebilir.",
  },
  {
    category: "Sipariş",
    question: "Ödeme koşulları nelerdir?",
    answer:
      "Kurumsal müşterilerimize vadeli ödeme, çek, havale/EFT ve kredi kartı ile ödeme seçenekleri sunmaktayız. Yeni müşterilerimiz için ilk siparişte peşin veya kapıda ödeme şartı uygulanabilir.",
  },
  {
    category: "Ürün",
    question: "Özel tasarım ürün yaptırabilir miyim?",
    answer:
      "Evet, markanıza özel kalıp tasarımı ve ürün geliştirme hizmeti sunuyoruz. Kalıp maliyeti ve üretim süreci hakkında detaylı bilgi almak için bizimle iletişime geçebilirsiniz.",
  },
  {
    category: "Ürün",
    question: "Ürünleriniz gıdaya uygun mu?",
    answer:
      "Evet, tüm gıda ambalajı ürünlerimiz Türk Gıda Kodeksi ve AB gıda temas malzemesi yönetmeliklerine uygun olarak üretilmektedir. İlgili test raporları ve sertifikalar mevcuttur.",
  },
  {
    category: "Ürün",
    question: "Ürünleriniz geri dönüştürülebilir mi?",
    answer:
      "PET (Polietilen Tereftalat) %100 geri dönüştürülebilir bir malzemedir. Tüm ürünlerimiz geri dönüşüm kodlamasına sahiptir ve çevreye duyarlı üretim anlayışımızla sürdürülebilirliğe katkıda bulunuyoruz.",
  },
  {
    category: "Kalite",
    question: "Hangi kalite sertifikalarına sahipsiniz?",
    answer:
      "ISO 9001 (Kalite Yönetimi), ISO 14001 (Çevre Yönetimi), ISO 45001 (İSG), ISO 10002 (Müşteri Memnuniyeti), ISO/IEC 27001 (Bilgi Güvenliği) ve CE sertifikalarına sahibiz.",
  },
  {
    category: "Kalite",
    question: "Kalite kontrol süreciniz nasıldır?",
    answer:
      "4 aşamalı kalite kontrol sürecimiz: Hammadde kontrolü, üretim süreç kontrolü, ürün testleri ve son kontrol & sevkiyat aşamalarından oluşur. Modern laboratuvarımızda boyutsal ölçüm, basınç dayanım, sızdırmazlık ve gıdaya uygunluk testleri yapılmaktadır.",
  },
  {
    category: "Bayi",
    question: "Bayi olmak için ne gerekiyor?",
    answer:
      "Bayilik başvurusu için ticaret sicil belgesi, vergi levhası ve firma bilgileriniz ile bize başvurmanız yeterlidir. Değerlendirme sonucunda bölgesel bayilik veya yetkili satıcılık sözleşmesi yapılmaktadır.",
  },
];

const categories = [...new Set(faqData.map((f) => f.category))];

export default function SSSPage() {
  const { dict } = useLocale();
  const f = dict.faq;
  const nav = dict.nav;

  const [activeCategory, setActiveCategory] = useState("Genel");
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const filteredFAQ = faqData.filter((faq) => faq.category === activeCategory);

  return (
    <section className="bg-white">
      {/* Hero */}
      <div className="bg-gradient-to-br from-primary-900 via-primary-700 to-primary-900 py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <AnimateOnScroll animation="fade-up">
            <nav className="mb-6 flex items-center gap-1.5 text-sm text-white/60">
              <Link href="/" className="hover:text-white">{nav.home}</Link>
              <ChevronRight size={14} />
              <span className="text-white">{f.heroTitle}</span>
            </nav>
            <h1 className="mb-3 text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl">
              {f.heroTitle}
            </h1>
            <p className="max-w-2xl text-lg text-white/70">
              {f.heroSubtitle}
            </p>
          </AnimateOnScroll>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-12 lg:px-6 lg:py-20">
        {/* Category Tabs */}
        <AnimateOnScroll animation="fade-up">
          <div className="mb-10 flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat);
                  setOpenIndex(0);
                }}
                className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition-all ${
                  activeCategory === cat
                    ? "bg-primary-900 text-white shadow-md"
                    : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </AnimateOnScroll>

        {/* FAQ Accordion */}
        <div className="space-y-3">
          {filteredFAQ.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <AnimateOnScroll key={faq.question} animation="fade-up" delay={i * 60}>
                <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white transition-shadow hover:shadow-md">
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    className="flex w-full items-center justify-between px-6 py-5 text-left"
                  >
                    <div className="flex items-center gap-3">
                      <HelpCircle
                        size={20}
                        className={isOpen ? "text-accent-500" : "text-neutral-400"}
                      />
                      <span className="font-semibold text-primary-900">{faq.question}</span>
                    </div>
                    <ChevronDown
                      size={20}
                      className={`shrink-0 text-neutral-400 transition-transform duration-300 ${
                        isOpen ? "rotate-180 text-accent-500" : ""
                      }`}
                    />
                  </button>
                  <div
                    className={`grid transition-all duration-300 ease-in-out ${
                      isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="border-t border-neutral-100 px-6 py-5">
                        <p className="leading-relaxed text-neutral-600">{faq.answer}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </AnimateOnScroll>
            );
          })}
        </div>

        {/* Contact CTA */}
        <AnimateOnScroll animation="fade-up">
          <div className="mt-16 rounded-2xl bg-primary-50 p-8 text-center lg:p-12">
            <HelpCircle size={40} className="mx-auto mb-4 text-primary-700" />
            <h3 className="mb-3 text-xl font-bold text-primary-900">
              {f.notFound}
            </h3>
            <p className="mb-6 text-neutral-600">
              {f.notFoundDesc}
            </p>
            <div className="flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/iletisim"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-900 px-6 py-3.5 font-bold text-white transition-all hover:bg-primary-700"
              >
                <MessageCircle size={18} />
                {f.writeUs}
              </Link>
              <a
                href="tel:+902121234567"
                className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-primary-900 px-6 py-3.5 font-semibold text-primary-900 transition-all hover:bg-primary-900 hover:text-white"
              >
                <Phone size={18} />
                {f.callUs}
              </a>
            </div>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
