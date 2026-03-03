import type { Metadata } from "next";
import { generatePageMetadata } from "@/lib/metadata";
import { FAQJsonLd, BreadcrumbJsonLd } from "@/components/seo/JsonLd";

const faqItems = [
  {
    question: "Kısmet Plastik hangi ürünleri üretiyor?",
    answer: "PET şişeler, plastik şişeler, kolonya şişeleri, sprey ambalajlar, oda parfümü şişeleri, sıvı sabun şişeleri, kapaklar ve özel üretim kozmetik ambalaj ürünleri üretmekteyiz.",
  },
  {
    question: "Hangi sektörlere hizmet veriyorsunuz?",
    answer: "Kozmetik, parfümeri, kişisel bakım, temizlik, otelcilik sektörlerine hizmet vermekteyiz.",
  },
  {
    question: "Minimum sipariş miktarı nedir?",
    answer: "Minimum sipariş miktarları ürüne göre değişmektedir. PET ve plastik şişelerde genellikle 5.000-20.000 adet, kapaklarda 20.000-50.000 adet minimum sipariş alıyoruz.",
  },
  {
    question: "Sipariş süreci nasıl işliyor?",
    answer: "Teklif formumuzu doldurmanız veya bizi aramanız yeterlidir. Uzman ekibimiz ihtiyaçlarınızı değerlendirir, size özel bir teklif hazırlar.",
  },
  {
    question: "Teslimat süreleri ne kadardır?",
    answer: "Standart ürünlerde stoktan 3-5 iş günü, özel üretim siparişlerde 15-30 iş günü içinde teslimat yapılmaktadır.",
  },
  {
    question: "Özel tasarım ürün yaptırabilir miyim?",
    answer: "Evet, markanıza özel kalıp tasarımı ve ürün geliştirme hizmeti sunuyoruz.",
  },
  {
    question: "Ürünleriniz kozmetik sektörüne uygun mu?",
    answer: "Evet, tüm ürünlerimiz kozmetik sektörü standartlarına uygun olarak üretilmektedir. ISO 9001 kalite yönetim sistemi çerçevesinde üretilmektedir.",
  },
  {
    question: "Ürünleriniz geri dönüştürülebilir mi?",
    answer: "PET (Polietilen Tereftalat) %100 geri dönüştürülebilir bir malzemedir. Tüm ürünlerimiz geri dönüşüm kodlamasına sahiptir.",
  },
  {
    question: "Hangi kalite sertifikalarına sahipsiniz?",
    answer: "ISO 9001 (Kalite Yönetimi), ISO 14001 (Çevre Yönetimi), ISO 45001 (İSG), ISO 10002 (Müşteri Memnuniyeti), ISO/IEC 27001 (Bilgi Güvenliği) ve CE sertifikalarına sahibiz.",
  },
  {
    question: "Kalite kontrol süreciniz nasıldır?",
    answer: "4 aşamalı kalite kontrol sürecimiz: Hammadde kontrolü, üretim süreç kontrolü, ürün testleri ve son kontrol & sevkiyat aşamalarından oluşur.",
  },
  {
    question: "Ödeme koşulları nelerdir?",
    answer: "Kurumsal müşterilerimize vadeli ödeme, çek, havale/EFT ve kredi kartı ile ödeme seçenekleri sunmaktayız.",
  },
  {
    question: "Bayi olmak için ne gerekiyor?",
    answer: "Bayilik başvurusu için ticaret sicil belgesi, vergi levhası ve firma bilgileriniz ile bize başvurmanız yeterlidir.",
  },
];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return generatePageMetadata({
    locale,
    path: "/sss",
    title: {
      tr: "Sıkça Sorulan Sorular",
      en: "Frequently Asked Questions",
    },
    description: {
      tr: "Kısmet Plastik kozmetik ambalaj hakkında sıkça sorulan sorular. Sipariş, ürün, kalite, teslimat ve bayilik ile ilgili merak ettikleriniz.",
      en: "Frequently asked questions about Kısmet Plastik cosmetic packaging. Everything you need to know about orders, products, quality, delivery and dealership.",
    },
  });
}

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isTr = locale === "tr";

  return (
    <>
      <FAQJsonLd items={faqItems} />
      <BreadcrumbJsonLd
        items={[
          { name: isTr ? "Ana Sayfa" : "Home", url: `https://www.kismetplastik.com/${locale}` },
          { name: isTr ? "Sıkça Sorulan Sorular" : "FAQ", url: `https://www.kismetplastik.com/${locale}/sss` },
        ]}
      />
      {children}
    </>
  );
}
