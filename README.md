# Kısmet Plastik B2B

Next.js ile geliştirilmiş Kısmet Plastik kurumsal / B2B web uygulaması.

## Başlarken

```bash
npm install
npm run dev
```

Tarayıcıda [http://localhost:3000](http://localhost:3000) adresini açın.

## E-posta (İletişim & Teklif formları)

İletişim ve Teklif Al formları **Resend** ile e-posta gönderir. Canlı ortamda çalışması için:

1. [Resend](https://resend.com) hesabı açın ve API anahtarı alın.
2. Proje kökünde `.env.local` oluşturun (`.env.example` örnek alınabilir):

```env
RESEND_API_KEY=re_xxxxxxxxxxxx
EMAIL_FROM=noreply@yourdomain.com
EMAIL_TO=info@kismetplastik.com
```

3. `EMAIL_FROM` için Resend’te doğrulanmış bir domain kullanın; test için `noreply@onboarding.resend.dev` kullanılabilir.

`RESEND_API_KEY` yoksa formlar yine **başarılı** yanıt döner; e-posta sadece konsola loglanır (geliştirme için).

## Proje durumu

- Tüm sayfalar (ana sayfa, ürünler, katalog, teklif al, iletişim, hakkımızda, üretim, kalite, SSS, kariyer, bayi girişi, blog) tamamlandı.
- İletişim ve teklif API’leri Resend ile e-posta gönderiyor; TODO’lar kaldırıldı.
- Build: `npm run build`
