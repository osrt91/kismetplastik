# Kismet Plastik B2B

B2B kozmetik ambalaj platformu. Bayi portali, siparis/teklif yonetimi, 2D/3D urun gorsellestirici ve admin paneli iceren tam entegre bir is uygulamasi.

**Canli:** [kismetplastik.com](https://www.kismetplastik.com)

## Ozellikler

- **B2B Bayi Portali** — Kayit, onay sureci, dashboard, siparis ve teklif yonetimi
- **Urun Katalogu** — 8 kategori, filtreleme, detay sayfalari
- **2D/3D Gorsellestirici** — Three.js ile interaktif urun goruntuleyici, SVG tabanli 2D gorsellemee
- **Siparis Sistemi** — Durum takibi (pending → delivered), siparis gecmisi
- **Teklif Yonetimi** — Online teklif isteme ve takip
- **Admin Paneli** — Urun, blog, galeri ve bayi yonetimi
- **Coklu Dil** — Turkce (varsayilan) ve Ingilizce
- **PWA** — Service worker, offline destek, Android TWA

## Tech Stack

| Katman | Teknoloji |
|--------|-----------|
| Framework | Next.js 16.1.6 (App Router, React 19) |
| Dil | TypeScript 5 |
| Stil | Tailwind CSS 4 |
| Component | shadcn/ui (Radix UI) |
| Veritabani | Supabase (PostgreSQL + RLS) |
| Auth | Supabase Auth (bayi) + Cookie (admin) |
| 3D | Three.js + React Three Fiber + Drei |
| E-posta | Resend |
| Deploy | Vercel (fra1) |

## Baslangic

### Gereksinimler

- Node.js 18+
- npm veya yarn
- Supabase hesabi ([supabase.com](https://supabase.com))

### Kurulum

```bash
git clone https://github.com/osrt91/kismetplastik.git
cd kismetplastik
npm install
```

### Environment Variables

`.env.example` dosyasini `.env.local` olarak kopyalayin ve doldurun:

```bash
cp .env.example .env.local
```

| Degisken | Zorunlu | Aciklama |
|----------|---------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Evet | Supabase proje URL'i |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Evet | Supabase anonim API anahtari |
| `ADMIN_SECRET` | Evet | Admin panel sifresi (min 32 karakter) |
| `RESEND_API_KEY` | Hayir | Resend e-posta API anahtari |
| `EMAIL_FROM` | Hayir | Gonderen e-posta adresi |
| `EMAIL_TO` | Hayir | Alici e-posta (varsayilan: bilgi@kismetplastik.com) |
| `OPENAI_API_KEY` | Hayir | OpenAI chatbot API anahtari |
| `NEXT_PUBLIC_GA_ID` | Hayir | Google Analytics ID |

> `RESEND_API_KEY` olmadan formlar basarili calisir — e-postalar konsola loglanir.

### Veritabani Kurulumu

Supabase Dashboard > SQL Editor'da asagidaki dosyayi calistirin:

```bash
supabase/migrations/001_initial_schema.sql
```

Bu dosya tum tablolari, RLS policy'lerini, trigger'lari ve storage bucket'i olusturur.

> **Alternatif (adimli):** Farkli migration dosyalarini sirayla calistirmak icin: `docs/supabase-schema.sql` → `docs/supabase-migration-002.sql` → `docs/supabase-migration-003.sql`

### Calistirma

```bash
npm run dev      # Gelistirme sunucusu (Turbopack)
npm run build    # Production build
npm run start    # Production sunucu
npm run lint     # ESLint kontrolu
```

Tarayicida [http://localhost:3000](http://localhost:3000) adresini acin.

## Proje Yapisi

```
src/
  app/
    [locale]/           # i18n sayfalari (tr/en)
      bayi-panel/       # B2B portal (auth zorunlu)
      urunler/          # Urun katalogu
      ...               # Kurumsal sayfalar
    admin/              # Admin paneli
    api/                # API route'lari
  components/
    layout/             # Header, Footer
    sections/           # Ana sayfa bolumleri
    pages/              # Sayfa client component'leri
    ui/                 # shadcn/ui + ozel component'ler
  lib/                  # Yardimci moduller (Supabase, auth, i18n, email)
  locales/              # Ceviri dosyalari (tr.json, en.json)
  types/                # TypeScript tip tanimlari
docs/                   # SQL migration'lar ve dokumantasyon
supabase/migrations/    # Konsolide veritabani semasi
```

## Deployment

### Vercel

1. GitHub repo'sunu Vercel'e baglayin
2. Environment variable'lari Vercel dashboard'dan ekleyin
3. Region: `fra1` (Frankfurt)
4. Build komutu: `npm run build`

### Android TWA

`twa/` klasorunde Bubblewrap konfigurasyonu ve deployment kilavuzu mevcuttur.

## Dokumantasyon

| Dokuman | Aciklama |
|---------|----------|
| [ARCHITECTURE.md](ARCHITECTURE.md) | Mimari, route yapisi, veri akisi, auth |
| [docs/DATABASE_SCHEMA.md](docs/DATABASE_SCHEMA.md) | Veritabani semasi, tablolar, RLS, trigger'lar |
| [docs/B2B_PORTAL.md](docs/B2B_PORTAL.md) | Bayi portali kullanim kilavuzu |
| [docs/VISUALIZER.md](docs/VISUALIZER.md) | 2D/3D gorsellestirici teknik dokumantasyonu |
| [CLAUDE.md](CLAUDE.md) | Gelistirici kurallari ve proje standartlari |
