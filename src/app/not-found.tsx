import Link from "next/link";
import { Home, ArrowLeft, Search } from "lucide-react";

export default function NotFound() {
  return (
    <section className="flex min-h-[80vh] items-center justify-center bg-gradient-to-br from-neutral-50 to-white px-4">
      <div className="text-center">
        <div className="mb-8">
          <span className="text-[120px] font-black leading-none text-primary-100 sm:text-[160px]">
            404
          </span>
        </div>

        <h1 className="mb-3 text-2xl font-extrabold text-primary-900 sm:text-3xl">
          Sayfa Bulunamadı
        </h1>
        <p className="mx-auto mb-8 max-w-md text-neutral-500">
          Aradığınız sayfa taşınmış, silinmiş veya hiç var olmamış olabilir.
          Aşağıdaki bağlantılardan devam edebilirsiniz.
        </p>

        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl bg-accent-500 px-6 py-3.5 font-bold text-primary-900 shadow-lg transition-all hover:bg-accent-400 hover:-translate-y-0.5"
          >
            <Home size={18} />
            Ana Sayfaya Dön
          </Link>
          <Link
            href="/urunler"
            className="inline-flex items-center gap-2 rounded-xl border-2 border-primary-900 px-6 py-3.5 font-semibold text-primary-900 transition-all hover:bg-primary-900 hover:text-white"
          >
            <Search size={18} />
            Ürünleri İncele
          </Link>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { name: "Hakkımızda", href: "/hakkimizda" },
            { name: "İletişim", href: "/iletisim" },
            { name: "Teklif Al", href: "/teklif-al" },
            { name: "SSS", href: "/sss" },
          ].map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm font-medium text-neutral-600 transition-all hover:border-primary-100 hover:text-primary-900 hover:shadow-md"
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
