"use client";

import {
  ChevronRight,
  Shield,
  FileText,
  Users,
  Send,
  Lock,
  Eye,
  Mail,
  MapPin,
  Scale,
} from "lucide-react";
import Link from "@/components/ui/LocaleLink";
import AnimateOnScroll from "@/components/ui/AnimateOnScroll";
import { useLocale } from "@/contexts/LocaleContext";

const COMPANY_NAME =
  "Kısmet Plastik Kozmetik Ambalaj ve Kalıp San. Tic. Ltd. Şti.";
const COMPANY_ADDRESS =
  "İkitelli OSB Mah. İPKAS 4A Blok Sok. No:5 Başakşehir/İstanbul";
const CONTACT_EMAIL = "bilgi@kismetplastik.com";

const sections = [
  {
    number: "1",
    title: "Amaç",
    icon: FileText,
    content: `İşbu Aydınlatma Metni, ${COMPANY_NAME} ("Şirket") tarafından 6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") kapsamında, kişisel verilerinizin işlenme amaçları, hukuki sebepleri, toplanma yöntemleri ve haklarınız konusunda sizleri bilgilendirmek amacıyla hazırlanmıştır. Şirketimiz, 1969 yılından bu yana kozmetik ambalaj sektöründe faaliyet göstermekte olup, kişisel verilerin korunmasını temel bir ilke olarak benimsemektedir.`,
  },
  {
    number: "2",
    title: "Kapsam",
    icon: Users,
    content: `Bu Aydınlatma Metni; Şirketimizin müşterileri, potansiyel müşterileri, iş ortakları, tedarikçileri, bayi ağı üyeleri, çalışan adayları, web sitesi ziyaretçileri ve Şirketimizle herhangi bir şekilde iletişime geçen tüm gerçek kişileri kapsamaktadır. Kozmetik ambalaj üretim süreçlerimiz dahilinde işlenen kişisel veriler de bu metin kapsamında değerlendirilmektedir.`,
  },
  {
    number: "3",
    title: "Kişisel Verilerin İşlenme Amaçları",
    icon: Eye,
    content: null,
    list: [
      "Müşteri ilişkilerinin yürütülmesi, teklif hazırlama ve sipariş süreçlerinin yönetimi",
      "Kozmetik ambalaj ürünlerine ilişkin sözleşmesel yükümlülüklerin yerine getirilmesi",
      "Kalite kontrol ve üretim süreçlerinin takibi",
      "Bayi başvurularının değerlendirilmesi ve bayi ilişkilerinin yönetimi",
      "İnsan kaynakları süreçlerinin planlanması ve yürütülmesi",
      "Yasal düzenlemelerden kaynaklanan yükümlülüklerin yerine getirilmesi",
      "Fatura, irsaliye ve muhasebe işlemlerinin gerçekleştirilmesi",
      "B2B platform üzerinden sunulan hizmetlerin iyileştirilmesi",
      "Lojistik ve sevkiyat süreçlerinin koordinasyonu",
      "Şirket güvenliğinin sağlanması ve iş sağlığı-güvenliği yükümlülüklerinin yerine getirilmesi",
    ],
  },
  {
    number: "4",
    title: "İşlenen Kişisel Veri Kategorileri",
    icon: Lock,
    content: null,
    list: [
      "Kimlik bilgileri (ad, soyad, T.C. kimlik numarası, unvan)",
      "İletişim bilgileri (telefon numarası, e-posta adresi, adres)",
      "Finansal bilgiler (banka hesap bilgileri, fatura bilgileri, vergi numarası)",
      "Mesleki deneyim bilgileri (özgeçmiş, iş deneyimi — yalnızca çalışan adayları için)",
      "Görsel ve işitsel kayıtlar (üretim tesisi güvenlik kamera görüntüleri)",
      "İşlem güvenliği bilgileri (IP adresi, giriş-çıkış logları, çerez verileri)",
    ],
  },
  {
    number: "5",
    title: "Kişisel Verilerin Aktarılması",
    icon: Send,
    content: `Kişisel verileriniz, KVKK'nın 8. ve 9. maddelerinde belirtilen şartlara uygun olarak ve gerekli güvenlik önlemleri alınarak aşağıdaki taraflara aktarılabilir:`,
    list: [
      "Yasal yükümlülükler kapsamında yetkili kamu kurum ve kuruluşlarına",
      "Hukuki süreçlerin yürütülmesi amacıyla avukatlar ve hukuk danışmanlıklarına",
      "Mali denetim ve muhasebe hizmetleri için bağımsız denetim şirketlerine",
      "Lojistik ve kargo hizmet sağlayıcılarına (yalnızca sevkiyat için gerekli bilgiler)",
      "Bilgi teknolojileri altyapı hizmeti sunan iş ortaklarına (sunucu, yazılım)",
      "Bankalar ve ödeme kuruluşlarına (yalnızca finansal işlemler kapsamında)",
    ],
  },
  {
    number: "6",
    title: "Kişisel Verilerin Toplanma Yöntemi ve Hukuki Sebebi",
    icon: Scale,
    content: `Kişisel verileriniz; web sitemiz, B2B platformumuz, e-posta, telefon, faks, yüz yüze görüşmeler, sözleşmeler, başvuru formları, kariyer başvuruları ve güvenlik kameraları aracılığıyla otomatik ve otomatik olmayan yöntemlerle toplanmaktadır. Toplanan veriler; KVKK'nın 5. maddesinin 2. fıkrasında yer alan "kanunlarda açıkça öngörülmesi", "bir sözleşmenin kurulması veya ifasıyla doğrudan ilgili olması", "veri sorumlusunun hukuki yükümlülüğünü yerine getirebilmesi" ve "meşru menfaat" hukuki sebeplerine dayanılarak işlenmektedir.`,
  },
  {
    number: "7",
    title: "Veri Sahibinin Hakları",
    icon: Shield,
    content: `KVKK'nın 11. maddesi uyarınca, kişisel veri sahibi olarak aşağıdaki haklara sahipsiniz:`,
    list: [
      "Kişisel verilerinizin işlenip işlenmediğini öğrenme",
      "Kişisel verileriniz işlenmişse buna ilişkin bilgi talep etme",
      "Kişisel verilerinizin işlenme amacını ve bunların amacına uygun kullanılıp kullanılmadığını öğrenme",
      "Yurt içinde veya yurt dışında kişisel verilerinizin aktarıldığı üçüncü kişileri bilme",
      "Kişisel verilerinizin eksik veya yanlış işlenmiş olması halinde bunların düzeltilmesini isteme",
      "KVKK'nın 7. maddesinde öngörülen şartlar çerçevesinde kişisel verilerinizin silinmesini veya yok edilmesini isteme",
      "İşlenen verilerin münhasıran otomatik sistemler vasıtasıyla analiz edilmesi suretiyle aleyhinize bir sonucun ortaya çıkmasına itiraz etme",
      "Kişisel verilerinizin kanuna aykırı olarak işlenmesi sebebiyle zarara uğramanız halinde zararın giderilmesini talep etme",
    ],
  },
];

export default function KVKKPage() {
  const { dict } = useLocale();
  const nav = dict.nav;

  return (
    <section className="bg-white">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 py-20 lg:py-28">
        <div className="absolute inset-0 opacity-[0.03]">
          <div
            className="h-full w-full"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-[0.04]">
          <Shield size={400} strokeWidth={0.5} className="text-white" />
        </div>
        <div className="absolute -left-20 bottom-0 opacity-[0.03]">
          <Lock size={300} strokeWidth={0.5} className="text-white" />
        </div>

        <div className="absolute -left-20 -top-20 h-72 w-72 animate-pulse rounded-full bg-accent-500/10 blur-3xl" />
        <div
          className="absolute -bottom-16 right-10 h-64 w-64 rounded-full bg-primary-400/15 blur-3xl"
          style={{ animation: "pulse 4s ease-in-out infinite 1s" }}
        />

        <div className="relative mx-auto max-w-7xl px-4 lg:px-6">
          <AnimateOnScroll animation="fade-up">
            <nav className="mb-6 flex items-center gap-1.5 text-sm text-white/60">
              <Link href="/" className="transition-colors hover:text-white">
                {nav.home}
              </Link>
              <ChevronRight size={14} />
              <span className="text-white">KVKK Aydınlatma Metni</span>
            </nav>
            <h1 className="mb-4 text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl">
              KVKK Aydınlatma Metni
            </h1>
            <p className="max-w-2xl text-lg text-white/70">
              6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında
              kişisel verilerinizin işlenmesine ilişkin bilgilendirme
            </p>
          </AnimateOnScroll>
        </div>
      </div>

      <div className="h-1 bg-gradient-to-r from-transparent via-primary-200 to-transparent" />

      {/* Veri Sorumlusu Bilgileri */}
      <div className="mx-auto max-w-4xl px-4 py-12 lg:px-6 lg:py-16">
        <AnimateOnScroll animation="fade-up">
          <div className="mb-12 rounded-2xl border border-primary-100 bg-primary-50/50 p-6 sm:p-8">
            <h2 className="mb-4 text-lg font-bold text-primary-900">
              Veri Sorumlusu
            </h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <FileText
                  size={18}
                  className="mt-0.5 shrink-0 text-primary-600"
                />
                <div>
                  <span className="text-sm font-semibold text-neutral-500">
                    Unvan
                  </span>
                  <p className="font-semibold text-primary-900">
                    {COMPANY_NAME}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin
                  size={18}
                  className="mt-0.5 shrink-0 text-primary-600"
                />
                <div>
                  <span className="text-sm font-semibold text-neutral-500">
                    Adres
                  </span>
                  <p className="text-neutral-700">{COMPANY_ADDRESS}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail
                  size={18}
                  className="mt-0.5 shrink-0 text-primary-600"
                />
                <div>
                  <span className="text-sm font-semibold text-neutral-500">
                    E-posta
                  </span>
                  <p>
                    <a
                      href={`mailto:${CONTACT_EMAIL}`}
                      className="font-medium text-primary-700 underline-offset-2 transition-colors hover:text-accent-600 hover:underline"
                    >
                      {CONTACT_EMAIL}
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </AnimateOnScroll>

        {/* Sections */}
        <div className="space-y-10">
          {sections.map((section, i) => (
            <AnimateOnScroll key={section.number} animation="fade-up" delay={i * 60}>
              <article className="group relative">
                {/* Left accent bar */}
                <div className="absolute -left-4 top-0 hidden h-full w-1 rounded-full bg-gradient-to-b from-primary-300 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 lg:block" />

                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600 transition-colors group-hover:bg-primary-100">
                    <section.icon size={20} />
                  </div>
                  <div className="flex-1">
                    <h2 className="mb-3 text-xl font-bold text-primary-900">
                      <span className="mr-2 text-accent-500">
                        {section.number}.
                      </span>
                      {section.title}
                    </h2>

                    {section.content && (
                      <p className="mb-4 leading-relaxed text-neutral-600">
                        {section.content}
                      </p>
                    )}

                    {section.list && (
                      <ul className="space-y-2.5">
                        {section.list.map((item, j) => (
                          <li key={j} className="flex items-start gap-2.5">
                            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-500" />
                            <span className="text-sm leading-relaxed text-neutral-600">
                              {item}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                {/* Section divider */}
                {i < sections.length - 1 && (
                  <div className="ml-14 mt-10">
                    <div className="h-px bg-gradient-to-r from-neutral-200 via-neutral-100 to-transparent" />
                  </div>
                )}
              </article>
            </AnimateOnScroll>
          ))}
        </div>

        {/* İletişim (Contact) Section */}
        <AnimateOnScroll animation="fade-up">
          <div className="relative mt-16 overflow-hidden rounded-2xl bg-primary-50 p-8 lg:p-12">
            <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary-200/30 blur-2xl" />
            <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-accent-200/20 blur-2xl" />

            <div className="relative z-10">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 text-primary-700">
                  <Mail size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-primary-900">
                    <span className="mr-2 text-accent-500">8.</span>
                    İletişim
                  </h2>
                </div>
              </div>

              <p className="mb-6 leading-relaxed text-neutral-600">
                KVKK kapsamındaki haklarınızı kullanmak için aşağıdaki
                yöntemlerle Şirketimize başvurabilirsiniz. Başvurularınız en geç
                30 gün içinde ücretsiz olarak sonuçlandırılacaktır. İşlemin
                ayrıca bir maliyet gerektirmesi halinde Kişisel Verileri Koruma
                Kurulu tarafından belirlenen tarife uygulanacaktır.
              </p>

              <div className="space-y-3 rounded-xl border border-primary-100 bg-white p-5">
                <div className="flex items-start gap-3">
                  <Mail size={16} className="mt-0.5 shrink-0 text-primary-600" />
                  <div>
                    <span className="text-sm font-semibold text-neutral-500">
                      E-posta
                    </span>
                    <p>
                      <a
                        href={`mailto:${CONTACT_EMAIL}`}
                        className="font-medium text-primary-700 underline-offset-2 transition-colors hover:text-accent-600 hover:underline"
                      >
                        {CONTACT_EMAIL}
                      </a>
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin
                    size={16}
                    className="mt-0.5 shrink-0 text-primary-600"
                  />
                  <div>
                    <span className="text-sm font-semibold text-neutral-500">
                      Posta Adresi
                    </span>
                    <p className="text-sm text-neutral-700">
                      {COMPANY_NAME}
                      <br />
                      {COMPANY_ADDRESS}
                    </p>
                  </div>
                </div>
              </div>

              <p className="mt-6 text-xs leading-relaxed text-neutral-400">
                İşbu Aydınlatma Metni, 6698 sayılı Kişisel Verilerin Korunması
                Kanunu uyarınca hazırlanmış olup, güncel mevzuat değişiklikleri
                doğrultusunda güncellenebilir. Son güncelleme tarihi: Şubat 2026.
              </p>
            </div>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
