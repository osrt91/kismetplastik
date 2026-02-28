export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string[];
  category: string;
  date: string;
  readTime: string;
}

export const blogPosts: BlogPost[] = [
  {
    slug: "pet-sise-uretim-sureci",
    title: "PET Şişe Üretim Süreci: Hammaddeden Ürüne",
    excerpt:
      "PET şişelerin üretim aşamalarını, kullanılan teknolojileri ve kalite kontrol süreçlerini detaylı olarak inceliyoruz.",
    content: [
      "PET (Polietilen Tereftalat), günümüzde en yaygın kullanılan ambalaj malzemelerinden biridir. Hafifliği, şeffaflığı, geri dönüştürülebilirliği ve mükemmel bariyer özellikleri sayesinde kozmetik, parfümeri ve kişisel bakım sektörlerinde tercih edilmektedir.",
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
    slug: "kozmetik-ambalaj-trendleri-2026",
    title: "2026 Yılında Kozmetik Ambalaj Trendleri",
    excerpt:
      "Sürdürülebilirlik, akıllı ambalaj ve minimalist tasarım gibi öne çıkan kozmetik ambalaj trendlerini keşfedin.",
    content: [
      "2026 yılı kozmetik ambalaj sektöründe önemli değişimlerin yaşandığı bir dönem. Tüketici beklentileri, çevresel düzenlemeler ve teknolojik gelişmeler sektörü hızla dönüştürüyor.",
      "Sürdürülebilir ambalaj, 2026'nın en belirgin trendi. Geri dönüştürülebilir malzemeler, biyobozunur plastikler ve azaltılmış ambalaj kullanımı ön plana çıkıyor. rPET (geri dönüştürülmüş PET) kullanımı hızla artıyor.",
      "Akıllı ambalaj teknolojileri de yükselişte. QR kodları, NFC etiketler ve hologram güvenlik unsurları ile tüketicilere ürün hakkında detaylı bilgi sunulmakta ve marka güvenliği artırılmaktadır.",
      "Minimalist tasarım trendi devam ediyor. Sade etiketler, temiz tipografi ve lüks hissiyat yaratan ambalaj tasarımları hem estetik hem de çevresel açıdan tercih ediliyor.",
      "E-ticaretin büyümesiyle birlikte kargo dayanıklı kozmetik ambalaj çözümleri de önem kazanıyor. Hasar önleyici iç yapılar, hafif ama dayanıklı malzemeler bu alandaki talebi şekillendiriyor.",
    ],
    category: "Sektör",
    date: "2026-02-10",
    readTime: "6 dk",
  },
  {
    slug: "pet-malzeme-avantajlari",
    title: "PET Malzemenin Avantajları Nelerdir?",
    excerpt:
      "PET'in hafifliği, şeffaflığı, geri dönüşülebilirliği ve kozmetik ambalaj açısından sunduğu avantajlar.",
    content: [
      "PET, modern ambalaj endüstrisinin vazgeçilmez malzemesidir. Cam ile karşılaştırıldığında %90 daha hafif olan PET, lojistik maliyetleri önemli ölçüde düşürür.",
      "Mükemmel şeffaklık özelliği, ürünün raflarda öne çıkmasını sağlar. Tüketiciler ürünü görebildiği için satın alma kararlarını daha kolay verir.",
      "PET, %100 geri dönüştürülebilir bir malzemedir. Geri dönüşüm sürecinde orijinal özelliklerini büyük ölçüde korur ve yeniden kullanılabilir.",
      "Kozmetik güvenliği açısından PET, uluslararası standartlara uygun bir malzemedir. Ürünle temas eden yüzeyinde zararlı madde salınımı yapmaz.",
      "Kırılmaz yapısı sayesinde cam şişelere göre çok daha güvenlidir. Taşıma ve depolama sırasında hasar riski minimize edilir.",
    ],
    category: "Bilgi",
    date: "2026-02-05",
    readTime: "5 dk",
  },
  {
    slug: "iso-sertifika-onemi",
    title: "Kozmetik Ambalajda ISO Sertifikalarının Önemi",
    excerpt:
      "ISO 9001, ISO 14001 ve FSSC 22000 sertifikalarının ambalaj sektöründeki önemi.",
    content: [
      "ISO sertifikaları, bir firmanın üretim süreçlerinin uluslararası standartlara uygun olduğunu belgeler. Ambalaj sektöründe bu sertifikalar müşteri güveninin temelini oluşturur.",
      "ISO 9001 Kalite Yönetim Sistemi, ürün ve hizmet kalitesinin sürekli iyileştirilmesini sağlar. Müşteri memnuniyetini ön plana koyar.",
      "ISO 14001 Çevre Yönetim Sistemi, üretim süreçlerinin çevreye olan etkisini minimize etmeyi hedefler. Sürdürülebilir üretim anlayışının temelini oluşturur.",
      "FSSC 22000 sertifikası, tüketici ile temas eden ambalaj ürünlerinin güvenliğini garanti eder. Özellikle kozmetik sektörüne tedarik yapan firmalar için önemli bir kalite belgesidir.",
      "Sertifikalı olmak sadece kalite güvencesi değil, aynı zamanda pazara erişim kapısıdır. Uluslararası ticarette ve büyük perakende zincirlerinde sertifika şartı aranmaktadır.",
    ],
    category: "Kalite",
    date: "2026-01-28",
    readTime: "7 dk",
  },
  {
    slug: "dogru-sise-secimi",
    title: "İşletmeniz İçin Doğru Şişe Nasıl Seçilir?",
    excerpt:
      "Ürününüze uygun şişe seçerken dikkat etmeniz gereken kriterler.",
    content: [
      "Doğru ambalaj seçimi, ürün kalitesini ve marka algısını doğrudan etkiler. Şişe seçiminde dikkat edilmesi gereken birçok kriter bulunmaktadır.",
      "Hacim, en temel seçim kriteridir. Ürün miktarı, hedef pazar ve tüketim alışkanlıkları hacim belirlemede etkili olan faktörlerdir.",
      "Ağız çapı, kapak uyumluluğunu belirler. 18mm serum ve esansiyel yağ şişeleri için, 20mm kolonya ve parfüm şişeleri için, 24mm kozmetik ve kişisel bakım ürünleri için, 28mm sıvı sabun ve şampuan şişeleri için uygundur.",
      "Malzeme seçimi ürün ile uyumlu olmalıdır. PET kozmetik ve kişisel bakım için ideal iken, HDPE temizlik ürünleri için daha uygundur.",
      "Tasarım, marka kimliğini yansıtmalıdır. Standart kalıplar maliyet avantajı sağlarken, özel kalıplar markanızı farklılaştırır.",
    ],
    category: "Rehber",
    date: "2026-01-20",
    readTime: "6 dk",
  },
  {
    slug: "surdurulebilir-ambalaj",
    title: "Sürdürülebilir Ambalaj: Çevreye Duyarlı Üretim",
    excerpt:
      "Geri dönüştürülebilir malzemeler ve çevre dostu üretim süreçlerimiz hakkında.",
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
