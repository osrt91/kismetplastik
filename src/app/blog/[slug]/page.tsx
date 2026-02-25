"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ChevronRight,
  Calendar,
  Clock,
  ArrowLeft,
  Share2,
  BookOpen,
  Tag,
} from "lucide-react";
import AnimateOnScroll from "@/components/ui/AnimateOnScroll";

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string[];
  category: string;
  date: string;
  readTime: string;
}

const blogPosts: BlogPost[] = [
  {
    slug: "pet-sise-uretim-sureci",
    title: "PET Şişe Üretim Süreci: Hammaddeden Ürüne",
    excerpt: "PET şişelerin üretim aşamalarını, kullanılan teknolojileri ve kalite kontrol süreçlerini detaylı olarak inceliyoruz.",
    content: [
      "PET (Polietilen Tereftalat), günümüzde en yaygın kullanılan ambalaj malzemelerinden biridir. Hafifliği, şeffaflığı, geri dönüştürülebilirliği ve mükemmel bariyer özellikleri sayesinde gıda, içecek, kozmetik ve ilaç sektörlerinde tercih edilmektedir.",
      "PET şişe üretim süreci temel olarak iki ana aşamadan oluşur: preform üretimi (enjeksiyon kalıplama) ve şişe üretimi (şişirme kalıplama). Her iki aşama da yüksek hassasiyet ve kalite kontrol gerektirir.",
      "İlk aşamada, PET granüller kurutma fırınlarında nem oranı optimum seviyeye getirilir. Ardından enjeksiyon makinelerinde eritilerek preform kalıplarına enjekte edilir. Elde edilen preformlar, şişirme aşamasına hazır hale getirilir.",
      "Şişirme aşamasında, preformlar özel fırınlarda ısıtılarak yumuşatılır ve yüksek basınçlı hava ile kalıp içinde şişirilir. Bu işlem, preformu istenen şişe şekline dönüştürür. Sıcaklık, basınç ve zamanlama parametreleri ürün kalitesini doğrudan etkiler.",
      "Üretim sürecinin her aşamasında kapsamlı kalite kontroller uygulanır: boyutsal ölçüm, basınç dayanım testi, sızdırmazlık testi, düşme testi ve görsel kontrol. Bu testler, ürünlerin standartlara uygunluğunu garanti eder.",
    ],
    category: "Üretim",
    date: "2026-02-15",
    readTime: "8 dk",
  },
  {
    slug: "gida-ambalaj-trendleri-2026",
    title: "2026 Yılında Gıda Ambalaj Trendleri",
    excerpt: "Sürdürülebilirlik, akıllı ambalaj ve minimalist tasarım gibi öne çıkan gıda ambalaj trendlerini keşfedin.",
    content: [
      "2026 yılı gıda ambalaj sektöründe önemli değişimlerin yaşandığı bir dönem. Tüketici beklentileri, çevresel düzenlemeler ve teknolojik gelişmeler sektörü hızla dönüştürüyor.",
      "Sürdürülebilir ambalaj, 2026'nın en belirgin trendi. Geri dönüştürülebilir malzemeler, biyobozunur plastikler ve azaltılmış ambalaj kullanımı ön plana çıkıyor. rPET (geri dönüştürülmüş PET) kullanımı hızla artıyor.",
      "Akıllı ambalaj teknolojileri de yükselişte. QR kodları, NFC etiketler ve sıcaklık göstergeleri ile tüketicilere ürün hakkında detaylı bilgi sunulmakta ve ürün güvenliği artırılmaktadır.",
      "Minimalist tasarım trendi devam ediyor. Sade etiketler, temiz tipografi ve daha az mürekkep kullanımı hem estetik hem de çevresel açıdan tercih ediliyor.",
      "E-ticaretin büyümesiyle birlikte kargo dayanıklı ambalaj çözümleri de önem kazanıyor. Hasar önleyici iç yapılar, hafif ama dayanıklı malzemeler bu alandaki talebi şekillendiriyor.",
    ],
    category: "Sektör",
    date: "2026-02-10",
    readTime: "6 dk",
  },
  {
    slug: "pet-malzeme-avantajlari",
    title: "PET Malzemenin Avantajları Nelerdir?",
    excerpt: "PET'in hafifliği, şeffaflığı, geri dönüşülebilirliği ve gıda güvenliği açısından sunduğu avantajlar.",
    content: [
      "PET, modern ambalaj endüstrisinin vazgeçilmez malzemesidir. Cam ile karşılaştırıldığında %90 daha hafif olan PET, lojistik maliyetleri önemli ölçüde düşürür.",
      "Mükemmel şeffaflık özelliği, ürünün raflarda öne çıkmasını sağlar. Tüketiciler ürünü görebildiği için satın alma kararlarını daha kolay verir.",
      "PET, %100 geri dönüştürülebilir bir malzemedir. Geri dönüşüm sürecinde orijinal özelliklerini büyük ölçüde korur ve yeniden kullanılabilir.",
      "Gıda güvenliği açısından PET, uluslararası standartlara uygun bir malzemedir. Gıda ile temas eden yüzeyinde zararlı madde salınımı yapmaz.",
      "Kırılmaz yapısı sayesinde cam şişelere göre çok daha güvenlidir. Taşıma ve depolama sırasında hasar riski minimize edilir.",
    ],
    category: "Bilgi",
    date: "2026-02-05",
    readTime: "5 dk",
  },
  {
    slug: "iso-sertifika-onemi",
    title: "Kozmetik Ambalajda ISO Sertifikalarının Önemi",
    excerpt: "ISO 9001, ISO 14001 ve FSSC 22000 sertifikalarının ambalaj sektöründeki önemi.",
    content: [
      "ISO sertifikaları, bir firmanın üretim süreçlerinin uluslararası standartlara uygun olduğunu belgeler. Ambalaj sektöründe bu sertifikalar müşteri güveninin temelini oluşturur.",
      "ISO 9001 Kalite Yönetim Sistemi, ürün ve hizmet kalitesinin sürekli iyileştirilmesini sağlar. Müşteri memnuniyetini ön plana koyar.",
      "ISO 14001 Çevre Yönetim Sistemi, üretim süreçlerinin çevreye olan etkisini minimize etmeyi hedefler. Sürdürülebilir üretim anlayışının temelini oluşturur.",
      "FSSC 22000 Gıda Güvenliği sertifikası, gıda ile temas eden ambalaj ürünlerinin güvenliğini garanti eder. Özellikle gıda sektörüne tedarik yapan firmalar için zorunlu hale gelmiştir.",
      "Sertifikalı olmak sadece kalite güvencesi değil, aynı zamanda pazara erişim kapısıdır. Uluslararası ticarette ve büyük perakende zincirlerinde sertifika şartı aranmaktadır.",
    ],
    category: "Kalite",
    date: "2026-01-28",
    readTime: "7 dk",
  },
  {
    slug: "dogru-sise-secimi",
    title: "İşletmeniz İçin Doğru Şişe Nasıl Seçilir?",
    excerpt: "Ürününüze uygun şişe seçerken dikkat etmeniz gereken kriterler.",
    content: [
      "Doğru ambalaj seçimi, ürün kalitesini ve marka algısını doğrudan etkiler. Şişe seçiminde dikkat edilmesi gereken birçok kriter bulunmaktadır.",
      "Hacim, en temel seçim kriteridir. Ürün miktarı, hedef pazar ve tüketim alışkanlıkları hacim belirlemede etkili olan faktörlerdir.",
      "Ağız çapı, kapak uyumluluğunu belirler. 18mm serum ve esansiyel yağ şişeleri için, 20mm kolonya ve parfüm şişeleri için, 24mm kozmetik ve kişisel bakım ürünleri için, 28mm sıvı sabun ve şampuan şişeleri için uygundur.",
      "Malzeme seçimi ürün ile uyumlu olmalıdır. PET gıda ve içecek için ideal iken, HDPE temizlik ürünleri için daha uygundur.",
      "Tasarım, marka kimliğini yansıtmalıdır. Standart kalıplar maliyet avantajı sağlarken, özel kalıplar markanızı farklılaştırır.",
    ],
    category: "Rehber",
    date: "2026-01-20",
    readTime: "6 dk",
  },
  {
    slug: "surdurulebilir-ambalaj",
    title: "Sürdürülebilir Ambalaj: Çevreye Duyarlı Üretim",
    excerpt: "Geri dönüştürülebilir malzemeler ve çevre dostu üretim süreçlerimiz hakkında.",
    content: [
      "Sürdürülebilir ambalaj, çevresel etkiyi minimize ederken ürün koruma fonksiyonunu sürdüren ambalaj yaklaşımıdır.",
      "PET, en yaygın geri dönüştürülen plastik türlerinden biridir. Bir PET şişe geri dönüştürüldüğünde yeni şişe, tekstil ürünü veya endüstriyel malzeme haline gelebilir.",
      "Kısmet Plastik olarak, üretim süreçlerimizde enerji verimliliğini artırmak, su tüketimini azaltmak ve atık minimizasyonu sağlamak için sürekli çalışıyoruz.",
      "rPET (geri dönüştürülmüş PET) kullanımını artırarak doğal kaynak tüketimini azaltıyoruz. rPET içerikli ürünlerimiz virgin PET ile aynı kalite standartlarını karşılar.",
      "Çevreye duyarlı üretim sadece bir tercih değil, gelecek nesillere karşı bir sorumluluktur. Bu bilinçle üretim süreçlerimizi sürekli geliştiriyoruz.",
    ],
    category: "Sürdürülebilirlik",
    date: "2026-01-12",
    readTime: "5 dk",
  },
];

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function BlogDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    return (
      <section className="flex min-h-[60vh] items-center justify-center bg-neutral-50">
        <div className="text-center">
          <h1 className="mb-2 text-2xl font-bold text-neutral-700">
            Yazı bulunamadı
          </h1>
          <Link href="/blog" className="text-primary-700 hover:underline">
            Blog sayfasına dön
          </Link>
        </div>
      </section>
    );
  }

  const relatedPosts = blogPosts
    .filter((p) => p.slug !== slug)
    .slice(0, 3);

  return (
    <section className="bg-white">
      {/* Hero */}
      <div className="bg-gradient-to-br from-primary-900 via-primary-700 to-primary-900 py-16 lg:py-20">
        <div className="mx-auto max-w-4xl px-4 lg:px-6">
          <AnimateOnScroll animation="fade-up">
            <nav className="mb-6 flex items-center gap-1.5 text-sm text-white/60">
              <Link href="/" className="hover:text-white">Ana Sayfa</Link>
              <ChevronRight size={14} />
              <Link href="/blog" className="hover:text-white">Blog</Link>
              <ChevronRight size={14} />
              <span className="text-white">{post.title}</span>
            </nav>
            <div className="mb-4 flex items-center gap-3 text-sm text-white/60">
              <span className="rounded-full bg-accent-500/20 px-3 py-1 font-semibold text-accent-400">
                {post.category}
              </span>
              <span className="flex items-center gap-1">
                <Calendar size={14} />
                {formatDate(post.date)}
              </span>
              <span className="flex items-center gap-1">
                <Clock size={14} />
                {post.readTime}
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-white sm:text-3xl lg:text-4xl">
              {post.title}
            </h1>
          </AnimateOnScroll>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-4xl px-4 py-12 lg:px-6 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1fr_280px]">
          <AnimateOnScroll animation="fade-up">
            <article className="prose prose-lg max-w-none">
              <Link
                href="/blog"
                className="mb-8 inline-flex items-center gap-1.5 text-sm font-medium text-primary-700 no-underline transition-colors hover:text-primary-900"
              >
                <ArrowLeft size={16} />
                Blog sayfasına dön
              </Link>

              <p className="text-lg font-medium text-neutral-700">{post.excerpt}</p>

              {post.content.map((paragraph, i) => (
                <p key={i} className="leading-relaxed text-neutral-600">
                  {paragraph}
                </p>
              ))}
            </article>
          </AnimateOnScroll>

          {/* Sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-6">
              <div className="rounded-xl border border-neutral-200 p-5">
                <h3 className="mb-4 flex items-center gap-2 font-bold text-primary-900">
                  <BookOpen size={18} />
                  Diğer Yazılar
                </h3>
                <ul className="space-y-3">
                  {relatedPosts.map((rp) => (
                    <li key={rp.slug}>
                      <Link
                        href={`/blog/${rp.slug}`}
                        className="block text-sm text-neutral-600 transition-colors hover:text-primary-700"
                      >
                        <span className="font-medium">{rp.title}</span>
                        <span className="mt-0.5 flex items-center gap-2 text-xs text-neutral-400">
                          <Tag size={10} />
                          {rp.category} &middot; {rp.readTime}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <Link
                href="/teklif-al"
                className="block rounded-xl bg-accent-500 p-5 text-center font-bold text-primary-900 shadow-lg transition-all hover:bg-accent-400 hover:-translate-y-0.5"
              >
                Teklif Al
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
