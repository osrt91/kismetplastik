"use client";

import { useState, useMemo } from "react";
import Link from "@/components/ui/LocaleLink";
import { ChevronRight, Search, BookOpen } from "lucide-react";
import { FaBook } from "react-icons/fa6";
import AnimateOnScroll from "@/components/ui/AnimateOnScroll";
import { useLocale } from "@/contexts/LocaleContext";

interface GlossaryTerm {
  term: string;
  definition: string;
  category: string;
}

const terms: GlossaryTerm[] = [
  { term: "PET", definition: "Polietilen Tereftalat. Şeffaf, hafif ve geri dönüştürülebilir bir plastik türü. Kozmetik şişe üretiminde en yaygın kullanılan malzeme.", category: "malzeme" },
  { term: "HDPE", definition: "Yüksek Yoğunluklu Polietilen. Opak, dayanıklı ve kimyasal dirençli plastik. Losyon ve temizlik ürünü şişelerinde kullanılır.", category: "malzeme" },
  { term: "PP", definition: "Polipropilen. Esnek, sıkılabilir ve ısıya dayanıklı plastik. Kapak ve pompa üretiminde tercih edilir.", category: "malzeme" },
  { term: "LDPE", definition: "Düşük Yoğunluklu Polietilen. Yumuşak ve esnek yapısıyla tüp ambalajlar ve sıkılabilir şişelerde kullanılır.", category: "malzeme" },
  { term: "rPET", definition: "Geri Dönüştürülmüş PET. Kullanılmış PET ambalajların geri dönüştürülmesiyle elde edilen malzeme. Çevreye duyarlı üretimde tercih edilir.", category: "malzeme" },
  { term: "Preform", definition: "PET şişe üretiminin ilk aşamasında enjeksiyon kalıplama ile elde edilen yarı mamul. Şişirme işlemiyle şişeye dönüştürülür.", category: "uretim" },
  { term: "Şişirme Kalıplama", definition: "Isıtılmış preformun basınçlı hava ile kalıp içinde şişirilerek şişe şekline dönüştürülmesi işlemi. PET şişe üretiminin temel yöntemi.", category: "uretim" },
  { term: "Enjeksiyon Kalıplama", definition: "Eritilmiş plastiğin yüksek basınçla kalıba enjekte edilmesiyle parça üretim yöntemi. Kapak, tıpa ve pompa parçalarında kullanılır.", category: "uretim" },
  { term: "Boyun Ölçüsü", definition: "Şişe ağzının standart ölçülendirme sistemi. Örn: 18/410, 20/410, 24/410, 28/410. İlk sayı çap (mm), ikinci sayı diş profili standardını belirtir.", category: "tasarim" },
  { term: "Flip-Top Kapak", definition: "Tek elle açılıp kapanabilen menteşeli kapak tipi. Şampuan, losyon ve kozmetik şişelerde yaygın kullanılır.", category: "tasarim" },
  { term: "Disc-Top Kapak", definition: "Basma yoluyla açılan disk şeklinde kapak tipi. Şampuan ve duş jeli şişelerinde kullanılır.", category: "tasarim" },
  { term: "Parmak Sprey", definition: "Parmakla basılarak sıvıyı sis şeklinde püskürten mekanizma. Parfüm, kolonya ve kozmetik spreylerde kullanılır.", category: "tasarim" },
  { term: "Losyon Pompası", definition: "Bastırarak sıvıyı dozajlı şekilde dağıtan pompa mekanizması. Sıvı sabun, losyon ve krem ambalajlarında kullanılır.", category: "tasarim" },
  { term: "İç Tıpa", definition: "Şişe ağzına yerleştirilen sızdırmazlık elemanı. Kapak altında kullanılarak ürünün akmasını engeller.", category: "tasarim" },
  { term: "Damlatıcı Tıpa", definition: "Kontrollü damlatma sağlayan delikli tıpa. Serum, göz damlası ve esansiyel yağ şişelerinde kullanılır.", category: "tasarim" },
  { term: "Tetikli Püskürtücü", definition: "Tetik mekanizmasıyla sıvıyı sis veya jet şeklinde püskürten başlık. Temizlik ürünlerinde yaygın kullanılır.", category: "tasarim" },
  { term: "ISO 9001", definition: "Kalite Yönetim Sistemi uluslararası standardı. Üretim süreçlerinin kalite standartlarına uygun yönetildiğini belgeler.", category: "kalite" },
  { term: "ISO 22000", definition: "Gıda Güvenliği Yönetim Sistemi standardı. Gıda ile temas eden ambalaj ürünlerinin güvenliğini garanti eder.", category: "kalite" },
  { term: "FSSC 22000", definition: "Gıda Güvenliği Sistem Sertifikasyonu. ISO 22000'in ötesinde ek gereksinimleri kapsayan kapsamlı gıda güvenliği sertifikası.", category: "kalite" },
  { term: "GMP", definition: "Good Manufacturing Practices (İyi Üretim Uygulamaları). Üretim sürecinin hijyen ve kalite standartlarına uygun yürütülmesini sağlayan kurallar bütünü.", category: "kalite" },
  { term: "CE İşareti", definition: "Avrupa Birliği pazarında ürünün güvenlik, sağlık ve çevre koruma gerekliliklerini karşıladığını gösteren işaret.", category: "kalite" },
  { term: "Bariyer Özelliği", definition: "Ambalajın gazlara (oksijen, nem, UV) karşı geçirgenlik direnci. PET yüksek bariyer özelliğine sahiptir.", category: "malzeme" },
  { term: "Mold (Kalıp)", definition: "Plastik şişe ve parçaların şekillendirildiği çelik kalıp. Her farklı ürün tasarımı için ayrı kalıp gerekir.", category: "uretim" },
  { term: "Gravimetrik Dozajlama", definition: "Ağırlık bazlı hammadde karışım sistemi. Üretimde tutarlı renk ve malzeme oranı sağlar.", category: "uretim" },
  { term: "Sürdürülebilir Ambalaj", definition: "Çevresel etkisi minimize edilmiş, geri dönüştürülebilir veya biyobozunur malzemelerden üretilen ambalaj.", category: "cevre" },
  { term: "Karbon Ayak İzi", definition: "Bir ürünün üretiminden bertarafına kadar tüm yaşam döngüsünde oluşturduğu toplam sera gazı emisyonu.", category: "cevre" },
  { term: "Hafifletme (Lightweighting)", definition: "Aynı performansı koruyarak ambalaj ağırlığını azaltma yaklaşımı. Malzeme tasarrufu ve karbon ayak izi azaltımı sağlar.", category: "cevre" },
  { term: "PCR", definition: "Post-Consumer Recycled. Tüketici tarafından kullanılmış ve geri dönüştürülmüş malzeme. rPET üretiminde kullanılır.", category: "cevre" },
];

const categoryLabels: Record<string, Record<string, string>> = {
  tr: {
    all: "Tümü",
    malzeme: "Malzeme",
    uretim: "Üretim",
    tasarim: "Tasarım",
    kalite: "Kalite",
    cevre: "Çevre",
    title: "Ambalaj Sözlüğü",
    subtitle: "Kozmetik ambalaj sektöründe kullanılan teknik terimlerin kapsamlı sözlüğü. Sektöre yeni başlayanlar ve profesyoneller için referans kaynağı.",
    searchPlaceholder: "Terim ara...",
    termsCount: "terim",
  },
  en: {
    all: "All",
    malzeme: "Material",
    uretim: "Production",
    tasarim: "Design",
    kalite: "Quality",
    cevre: "Environment",
    title: "Packaging Glossary",
    subtitle: "Comprehensive glossary of technical terms used in the cosmetic packaging sector. A reference source for newcomers and professionals.",
    searchPlaceholder: "Search terms...",
    termsCount: "terms",
  },
};

const alphabet = "ABCDEFGHIJKLMNOPRSTUVYZ".split("");

export default function AmbalajSozluguPage() {
  const { locale, dict } = useLocale();
  const t = categoryLabels[locale] || categoryLabels.tr;
  const nav = dict.nav;

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const filtered = useMemo(() => {
    let result = [...terms];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (t) => t.term.toLowerCase().includes(q) || t.definition.toLowerCase().includes(q)
      );
    }
    if (category !== "all") {
      result = result.filter((t) => t.category === category);
    }
    result.sort((a, b) => a.term.localeCompare(b.term, "tr"));
    return result;
  }, [search, category]);

  const grouped = useMemo(() => {
    const groups: Record<string, GlossaryTerm[]> = {};
    for (const term of filtered) {
      const letter = term.term[0].toUpperCase();
      if (!groups[letter]) groups[letter] = [];
      groups[letter].push(term);
    }
    return groups;
  }, [filtered]);

  return (
    <section className="bg-white">
      <div className="relative overflow-hidden bg-gradient-to-br from-primary-900 via-primary-700 to-primary-900 py-20 lg:py-28">
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="h-full w-full" style={{ backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`, backgroundSize: "40px 40px" }} />
        </div>
        <FaBook size={300} className="pointer-events-none absolute -right-10 top-1/2 -translate-y-1/2 text-white/[0.04]" />
        <div className="relative mx-auto max-w-7xl px-4 lg:px-6">
          <AnimateOnScroll animation="fade-up">
            <nav className="mb-6 flex items-center gap-1.5 text-sm text-white/60">
              <Link href="/" className="transition-colors hover:text-white">{nav.home}</Link>
              <ChevronRight size={14} />
              <span className="text-white">{t.title}</span>
            </nav>
            <h1 className="mb-4 text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl">{t.title}</h1>
            <p className="max-w-2xl text-lg text-white/70">{t.subtitle}</p>
            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white/80">
              <BookOpen size={16} />
              {terms.length} {t.termsCount}
            </div>
          </AnimateOnScroll>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-6 lg:py-20">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full rounded-xl border border-neutral-200 py-3 pl-10 pr-4 text-sm outline-none transition-colors focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {["all", "malzeme", "uretim", "tasarim", "kalite", "cevre"].map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                  category === c ? "bg-primary-900 text-white" : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                }`}
              >
                {t[c]}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6 flex flex-wrap gap-1">
          {alphabet.map((letter) => {
            const hasTerms = grouped[letter]?.length > 0;
            return (
              <a
                key={letter}
                href={hasTerms ? `#letter-${letter}` : undefined}
                className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold transition-colors ${
                  hasTerms ? "bg-primary-50 text-primary-700 hover:bg-primary-100" : "text-neutral-300"
                }`}
              >
                {letter}
              </a>
            );
          })}
        </div>

        <div className="space-y-8">
          {Object.entries(grouped).map(([letter, letterTerms]) => (
            <div key={letter} id={`letter-${letter}`}>
              <h2 className="mb-4 flex items-center gap-3 text-2xl font-black text-primary-900">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-900 text-lg text-white">{letter}</span>
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {letterTerms.map((term) => (
                  <div key={term.term} className="group rounded-xl border border-neutral-100 bg-white p-5 transition-all hover:border-primary-200 hover:shadow-md">
                    <div className="mb-2 flex items-center gap-2">
                      <h3 className="text-base font-bold text-primary-900">{term.term}</h3>
                      <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-semibold text-neutral-500">{t[term.category]}</span>
                    </div>
                    <p className="text-sm leading-relaxed text-neutral-600">{term.definition}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="py-16 text-center">
            <BookOpen size={48} className="mx-auto mb-4 text-neutral-300" />
            <p className="text-neutral-500">{locale === "tr" ? "Terim bulunamadı." : "No terms found."}</p>
          </div>
        )}
      </div>
    </section>
  );
}
