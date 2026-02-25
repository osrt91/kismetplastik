"use client";

import { useState } from "react";
import Link from "@/components/ui/LocaleLink";
import {
  ChevronRight,
  ChevronDown,
  HelpCircle,
  MessageCircle,
  Phone,
  Search,
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
    question: "Kısmet Plastik hangi ürünleri üretiyor?",
    answer:
      "PET şişeler, plastik şişeler, kolonya şişeleri, sprey ambalajlar, oda parfümü şişeleri, sıvı sabun şişeleri, kapaklar ve özel üretim kozmetik ambalaj ürünleri üretmekteyiz. Kozmetik, kişisel bakım ve parfümeri sektörlerine yönelik geniş bir ürün yelpazemiz bulunmaktadır.",
  },
  {
    category: "Genel",
    question: "Hangi sektörlere hizmet veriyorsunuz?",
    answer:
      "Kozmetik, parfümeri, kişisel bakım, temizlik, otelcilik sektörlerine hizmet vermekteyiz. Her sektörün standartlarına uygun ürünler sunuyoruz.",
  },
  {
    category: "Sipariş",
    question: "Minimum sipariş miktarı nedir?",
    answer:
      "Minimum sipariş miktarları ürüne göre değişmektedir. PET ve plastik şişelerde genellikle 5.000-20.000 adet, kapaklarda 20.000-50.000 adet minimum sipariş alıyoruz. Detaylı bilgi için teklif formumuzu doldurabilirsiniz.",
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
    question: "Ürünleriniz kozmetik sektörüne uygun mu?",
    answer:
      "Evet, tüm ürünlerimiz kozmetik sektörü standartlarına uygun olarak üretilmektedir. ISO 9001 kalite yönetim sistemi çerçevesinde üretilen ürünlerimiz için ilgili test raporları ve uygunluk sertifikaları mevcuttur.",
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
      "4 aşamalı kalite kontrol sürecimiz: Hammadde kontrolü, üretim süreç kontrolü, ürün testleri ve son kontrol & sevkiyat aşamalarından oluşur. Modern laboratuvarımızda boyutsal ölçüm, basınç dayanım, sızdırmazlık ve kozmetik uygunluk testleri yapılmaktadır.",
  },
  {
    category: "Bayi",
    question: "Bayi olmak için ne gerekiyor?",
    answer:
      "Bayilik başvurusu için ticaret sicil belgesi, vergi levhası ve firma bilgileriniz ile bize başvurmanız yeterlidir. Değerlendirme sonucunda bölgesel bayilik veya yetkili satıcılık sözleşmesi yapılmaktadır.",
  },
];

const categories = [...new Set(faqData.map((f) => f.category))];

const categoryAccentColors: Record<string, string> = {
  Genel: "border-l-blue-400",
  Sipariş: "border-l-purple-400",
  Ürün: "border-l-emerald-400",
  Kalite: "border-l-amber-400",
  Bayi: "border-l-teal-400",
};

export default function SSSPage() {
  const { dict } = useLocale();
  const f = dict.faq;
  const nav = dict.nav;

  const [activeCategory, setActiveCategory] = useState("Genel");
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState("");

  const searchFiltered = searchQuery.trim()
    ? faqData.filter(
        (faq) =>
          faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : faqData;

  const filteredFAQ = searchFiltered.filter(
    (faq) => faq.category === activeCategory
  );

  const getCategoryCount = (cat: string) =>
    searchFiltered.filter((faq) => faq.category === cat).length;

  return (
    <section className="bg-white">
      {/* Hero */}
      <div className="bg-gradient-to-br from-primary-900 via-primary-700 to-primary-900 py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <AnimateOnScroll animation="fade-up">
            <nav className="mb-6 flex items-center gap-1.5 text-sm text-white/60">
              <Link href="/" className="hover:text-white">
                {nav.home}
              </Link>
              <ChevronRight size={14} />
              <span className="text-white">{f.heroTitle}</span>
            </nav>
            <h1 className="mb-3 text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl">
              {f.heroTitle}
            </h1>
            <p className="max-w-2xl text-lg text-white/70">{f.heroSubtitle}</p>
          </AnimateOnScroll>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-12 lg:px-6 lg:py-20">
        {/* Search Input */}
        <AnimateOnScroll animation="fade-up">
          <div className="relative mb-8">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setOpenIndex(0);
              }}
              placeholder="Soru veya cevaplarda ara..."
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 py-3.5 pl-11 pr-4 text-sm text-neutral-700 outline-none transition-all placeholder:text-neutral-400 focus:border-primary-300 focus:bg-white focus:ring-2 focus:ring-primary-100"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setOpenIndex(0);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-neutral-400 transition-colors hover:bg-neutral-200 hover:text-neutral-600"
              >
                ✕
              </button>
            )}
          </div>
        </AnimateOnScroll>

        {/* Category Tabs */}
        <AnimateOnScroll animation="fade-up">
          <div className="mb-10 flex flex-wrap gap-2">
            {categories.map((cat) => {
              const count = getCategoryCount(cat);
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => {
                    setActiveCategory(cat);
                    setOpenIndex(0);
                  }}
                  className={`relative rounded-xl px-5 py-2.5 text-sm font-semibold transition-all ${
                    isActive
                      ? "bg-primary-900 text-white shadow-md"
                      : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {cat}
                    <span
                      className={`inline-flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[10px] font-bold ${
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-neutral-200 text-neutral-500"
                      }`}
                    >
                      {count}
                    </span>
                  </span>
                  {isActive && (
                    <span className="absolute -bottom-1 left-1/2 h-[3px] w-8 -translate-x-1/2 rounded-full bg-accent-500" />
                  )}
                </button>
              );
            })}
          </div>
        </AnimateOnScroll>

        {/* FAQ Accordion */}
        <div className="space-y-3">
          {filteredFAQ.length === 0 && (
            <AnimateOnScroll animation="fade-up">
              <div className="flex flex-col items-center justify-center rounded-xl border border-neutral-200 bg-neutral-50 px-6 py-12 text-center">
                <Search size={32} className="mb-3 text-neutral-300" />
                <p className="font-semibold text-neutral-500">
                  Sonuç bulunamadı
                </p>
                <p className="mt-1 text-sm text-neutral-400">
                  Arama kriterlerinizi değiştirmeyi veya başka bir kategori
                  seçmeyi deneyin.
                </p>
              </div>
            </AnimateOnScroll>
          )}

          {filteredFAQ.map((faq, i) => {
            const isOpen = openIndex === i;
            const borderColor =
              categoryAccentColors[faq.category] || "border-l-primary-400";
            return (
              <AnimateOnScroll
                key={faq.question}
                animation="fade-up"
                delay={i * 60}
              >
                <div
                  className={`overflow-hidden rounded-xl border bg-white transition-all duration-300 ${
                    isOpen
                      ? "border-primary-200 shadow-md"
                      : "border-neutral-200 hover:shadow-md"
                  }`}
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    className={`flex w-full items-center justify-between px-6 py-5 text-left transition-colors duration-200 ${
                      isOpen ? "bg-primary-50/50" : ""
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <HelpCircle
                        size={20}
                        className={`shrink-0 transition-all duration-300 ${
                          isOpen
                            ? "scale-110 text-accent-500"
                            : "text-neutral-400"
                        }`}
                      />
                      <span className="font-semibold text-primary-900">
                        {faq.question}
                      </span>
                    </div>
                    <ChevronDown
                      size={20}
                      className={`shrink-0 transition-all duration-300 ease-out ${
                        isOpen
                          ? "rotate-180 text-accent-500"
                          : "text-neutral-400"
                      }`}
                    />
                  </button>
                  <div
                    className={`grid transition-all duration-300 ease-in-out ${
                      isOpen
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="border-t border-neutral-100 px-6 py-5">
                        <div className={`border-l-4 ${borderColor} pl-4`}>
                          <p className="leading-relaxed text-neutral-600">
                            {faq.answer}
                          </p>
                        </div>
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
          <div className="relative mt-16 overflow-hidden rounded-2xl bg-primary-50 p-8 text-center lg:p-12">
            <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary-200/30 blur-2xl" />
            <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-accent-200/20 blur-2xl" />
            <div className="absolute right-12 top-1/2 h-16 w-16 -translate-y-1/2 rounded-full bg-primary-300/15 animate-pulse" />
            <div className="absolute bottom-8 left-16 h-10 w-10 rounded-full bg-accent-300/20 animate-pulse [animation-delay:1s]" />
            <div className="absolute left-1/3 top-6 h-6 w-6 rotate-45 rounded-sm bg-primary-200/20 animate-pulse [animation-delay:2s]" />

            <div className="relative z-10">
              <HelpCircle size={40} className="mx-auto mb-4 text-primary-700" />
              <h3 className="mb-3 text-xl font-bold text-primary-900">
                {f.notFound}
              </h3>
              <p className="mb-6 text-neutral-600">{f.notFoundDesc}</p>
              <div className="flex flex-col justify-center gap-3 sm:flex-row">
                <Link
                  href="/iletisim"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-900 px-6 py-3.5 font-bold text-white transition-all hover:bg-primary-700"
                >
                  <MessageCircle size={18} />
                  {f.writeUs}
                </Link>
                <a
                  href="tel:+902125498703"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-primary-900 px-6 py-3.5 font-semibold text-primary-900 transition-all hover:bg-primary-900 hover:text-white"
                >
                  <Phone size={18} />
                  {f.callUs}
                </a>
              </div>
            </div>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
