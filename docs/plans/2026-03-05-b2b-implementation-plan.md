# B2B Platform UI Transformation — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transform Kismet Plastik from a generic AI-looking site into a premium B2B platform with Progressive Disclosure (public vitrin + dealer portal).

**Architecture:** Single Next.js 16 app with two UX layers: public site (marketing/vitrin) and dealer portal (business tool). Component hierarchy split into `public/`, `portal/`, `shared/` directories. Design system rebuilt with Fraunces + Instrument Sans + JetBrains Mono fonts, Navy/Amber/Cream palette, asymmetric layouts.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS 4, Supabase, Three.js/R3F, Framer Motion, shadcn/ui

---

## Phase 1: Design System Foundation

### Task 1: Configure JetBrains Mono Font

**Files:**
- Modify: `src/app/[locale]/layout.tsx`
- Modify: `src/app/globals.css`

**Step 1: Add JetBrains Mono to locale layout**

In `src/app/[locale]/layout.tsx`, add the import:

```typescript
import { Fraunces, Instrument_Sans, JetBrains_Mono } from "next/font/google";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});
```

Add `${jetbrainsMono.variable}` to the `<html>` className alongside existing font variables.

**Step 2: Update CSS font variables in globals.css**

Find the `--font-mono` variable and update:
```css
--font-mono: var(--font-jetbrains-mono, ui-monospace, "SFMono-Regular", "Cascadia Code", monospace);
```

**Step 3: Verify build**

Run: `npm run build`
Expected: Build succeeds, no errors.

**Step 4: Commit**

```bash
git add src/app/[locale]/layout.tsx src/app/globals.css
git commit -m "feat: add JetBrains Mono font for mono typography"
```

---

### Task 2: Standardize Font Usage in CSS

**Files:**
- Modify: `src/app/globals.css`

**Step 1: Ensure font-family assignments use the new variables**

Verify these CSS variable assignments exist in globals.css and are correct:
```css
--font-display: var(--font-fraunces, "Myriad Pro"), Georgia, serif;
--font-body: var(--font-instrument-sans, "Myriad Pro"), system-ui, sans-serif;
--font-mono: var(--font-jetbrains-mono, ui-monospace, "SFMono-Regular", monospace);
```

Ensure base `body` styles use `font-family: var(--font-body)`.
Ensure `h1, h2, h3, h4, h5, h6` use `font-family: var(--font-display)`.

**Step 2: Add utility classes**

```css
.font-display { font-family: var(--font-display); }
.font-body { font-family: var(--font-body); }
.font-mono { font-family: var(--font-mono); }
```

**Step 3: Verify build**

Run: `npm run build`

**Step 4: Commit**

```bash
git add src/app/globals.css
git commit -m "feat: standardize font-family assignments with display/body/mono"
```

---

### Task 3: Clean Up Shadow & Spacing Tokens

**Files:**
- Modify: `src/app/globals.css`

**Step 1: Add centralized shadow tokens**

```css
:root {
  --shadow-xs: 0 1px 2px rgba(10, 22, 40, 0.04);
  --shadow-sm: 0 2px 4px rgba(10, 22, 40, 0.06);
  --shadow-md: 0 4px 12px rgba(10, 22, 40, 0.08);
  --shadow-lg: 0 8px 24px rgba(10, 22, 40, 0.10);
  --shadow-xl: 0 16px 48px rgba(10, 22, 40, 0.12);
  --shadow-amber-glow: 0 0 24px rgba(245, 158, 11, 0.3);
}
```

**Step 2: Add border-radius tokens (if not already present)**

```css
:root {
  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-2xl: 24px;
}
```

**Step 3: Verify build**

Run: `npm run build`

**Step 4: Commit**

```bash
git add src/app/globals.css
git commit -m "feat: add centralized shadow and border-radius tokens"
```

---

### Task 4: Remove Decorative Animations

**Files:**
- Modify: `src/app/globals.css`

**Step 1: Identify and remove/comment out purely decorative animations**

Remove these keyframes and related classes from globals.css:
- `particle-float` (floating dots)
- `gradient-mesh` (mesh background animation)
- `glow-pulse` (breathing glow — keep only if used on CTA buttons)

Keep these functional animations:
- `fade-in-up`, `hero-fade-up`, `hero-fade-in`
- `slide-up`, `slide-in-left`, `slide-in-right`
- `scroll-fade-in`, `scroll-scale`
- `hover-lift`, `hover-glow-amber`
- `marquee`

**Step 2: Verify build**

Run: `npm run build`

**Step 3: Commit**

```bash
git add src/app/globals.css
git commit -m "refactor: remove decorative particle/mesh animations, keep functional ones"
```

---

## Phase 2: Component Structure Setup

### Task 5: Create Component Directory Structure

**Files:**
- Create: `src/components/public/.gitkeep`
- Create: `src/components/portal/.gitkeep`
- Create: `src/components/shared/.gitkeep`

**Step 1: Create directories**

```bash
mkdir -p src/components/public src/components/portal src/components/shared
touch src/components/public/.gitkeep src/components/portal/.gitkeep src/components/shared/.gitkeep
```

**Step 2: Commit**

```bash
git add src/components/public src/components/portal src/components/shared
git commit -m "chore: create public/portal/shared component directories"
```

---

### Task 6: Create Shared PriceDisplay Component

**Files:**
- Create: `src/components/shared/PriceDisplay.tsx`

**Step 1: Create component**

```tsx
"use client";

import { useEffect, useState } from "react";
import { createBrowserClient } from "@/lib/supabase-browser";

interface PriceDisplayProps {
  price?: number | null;
  currency?: string;
  className?: string;
  showLoginPrompt?: boolean;
}

export default function PriceDisplay({
  price,
  currency = "TRY",
  className = "",
  showLoginPrompt = true,
}: PriceDisplayProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const supabase = createBrowserClient();
        const { data: { session } } = await supabase.auth.getSession();
        setIsAuthenticated(!!session);
      } catch {
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  if (loading) {
    return <span className={`inline-block h-5 w-16 animate-pulse rounded bg-neutral-200 ${className}`} />;
  }

  if (!isAuthenticated) {
    if (!showLoginPrompt) return null;
    return (
      <span className={`font-mono text-sm text-neutral-500 ${className}`}>
        Fiyat icin giris yapin
      </span>
    );
  }

  if (price == null) {
    return <span className={`font-mono text-sm text-neutral-400 ${className}`}>—</span>;
  }

  const formatted = new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(price);

  return <span className={`font-mono font-semibold ${className}`}>{formatted}</span>;
}
```

**Step 2: Verify build**

Run: `npm run build`

**Step 3: Commit**

```bash
git add src/components/shared/PriceDisplay.tsx
git commit -m "feat: add PriceDisplay component with auth-based visibility"
```

---

## Phase 3: Public Site Homepage Refactor

### Task 7: Refactor Hero Section — Asymmetric Layout

**Files:**
- Modify: `src/components/sections/Hero.tsx`

**Step 1: Read current Hero.tsx completely**

Understand the existing layout, particles, gradient orbs, floating cards.

**Step 2: Refactor to asymmetric layout**

Key changes:
- Remove particle dots (18 floating elements)
- Remove gradient orb decorations
- Keep wave divider
- Change from two-column symmetric to asymmetric: left 60% text, right 40% placeholder for future 3D
- Use Fraunces for main heading (`font-display` class)
- Simplify to: heading + subtitle + 2 CTA buttons + trust numbers inline
- Dark gradient mesh background stays but simplified
- Staggered fade-in animation for text elements (keep existing, remove particle animations)

**Step 3: Verify build and visual check on localhost**

Run: `npm run build`
Check: `http://localhost:3005/tr`

**Step 4: Commit**

```bash
git add src/components/sections/Hero.tsx
git commit -m "refactor: Hero section — asymmetric layout, remove decorative particles"
```

---

### Task 8: Create Trust Bar Component

**Files:**
- Create: `src/components/public/TrustBar.tsx`
- Modify: `src/app/[locale]/page.tsx`

**Step 1: Create TrustBar component**

Single horizontal bar with 4 stats: "57 Yil | 8 Ulke | 2000+ Urun | 500+ Bayi"
- Count-up animation on scroll into view (IntersectionObserver)
- Cream background, subtle top/bottom border
- JetBrains Mono for numbers, Instrument Sans for labels
- Compact: `py-6` padding

**Step 2: Add TrustBar to homepage between Hero and Categories**

In `src/app/[locale]/page.tsx`, import and place after Hero.

**Step 3: Verify build**

Run: `npm run build`

**Step 4: Commit**

```bash
git add src/components/public/TrustBar.tsx src/app/[locale]/page.tsx
git commit -m "feat: add TrustBar component with count-up animation"
```

---

### Task 9: Refactor Categories to Horizontal Carousel

**Files:**
- Modify: `src/components/sections/Categories.tsx`

**Step 1: Read current Categories.tsx**

**Step 2: Refactor from grid to horizontal scroll carousel**

- Change from 4-col grid to horizontal scroll with snap points
- Each card: large image area + category name + product count
- CSS scroll-snap-type: x mandatory
- Scroll buttons (left/right arrows) for desktop
- Natural horizontal scroll on mobile
- Cards wider (min-w-[280px]) with aspect ratio for image area

**Step 3: Verify build**

Run: `npm run build`

**Step 4: Commit**

```bash
git add src/components/sections/Categories.tsx
git commit -m "refactor: Categories — horizontal scroll carousel with snap points"
```

---

### Task 10: Refactor WhyUs to Process Timeline

**Files:**
- Modify: `src/components/sections/WhyUs.tsx`

**Step 1: Read current WhyUs.tsx**

**Step 2: Refactor to horizontal timeline flow**

Change from 3-col grid to horizontal timeline:
- 4 steps: Hammadde > Uretim > Kalite Kontrol > Teslimat
- Each step: circle number + title + description + placeholder image area
- Connected by horizontal line/arrow between steps
- On mobile: vertical timeline
- Use Fraunces for step titles
- Placeholder boxes for future factory photos (gray bg with camera icon)

**Step 3: Verify build**

Run: `npm run build`

**Step 4: Commit**

```bash
git add src/components/sections/WhyUs.tsx
git commit -m "refactor: WhyUs — process timeline (Hammadde > Uretim > Kalite > Teslimat)"
```

---

### Task 11: Polish Remaining Homepage Sections

**Files:**
- Modify: `src/components/sections/Stats.tsx`
- Modify: `src/components/sections/Sectors.tsx`
- Modify: `src/components/sections/Testimonials.tsx`
- Modify: `src/components/sections/CTA.tsx`
- Modify: `src/components/sections/About.tsx`

**Step 1: Stats — ensure Fraunces headings, JetBrains Mono numbers**

**Step 2: Sectors — ensure asymmetric card layout (2+1 or 1+2 pattern)**

**Step 3: Testimonials — remove marquee if too generic, simplify**

**Step 4: CTA — bold "Bayimiz Olun" section, navy bg, amber button**

**Step 5: About — ensure Fraunces heading, placeholder area for factory photo**

**Step 6: Verify build**

Run: `npm run build`

**Step 7: Commit**

```bash
git add src/components/sections/
git commit -m "refactor: polish homepage sections — consistent typography and layout"
```

---

## Phase 4: Portal Layout Rebuild

### Task 12: Rebuild Portal Sidebar

**Files:**
- Create: `src/components/portal/Sidebar.tsx`
- Modify: `src/app/[locale]/bayi-panel/layout.tsx`

**Step 1: Create Sidebar component**

Dedicated sidebar component:
- Navy (#0A1628) background
- Logo at top (compact)
- Navigation items with icons (Lucide):
  - LayoutDashboard: Dashboard
  - Package: Urunler
  - Zap: Hizli Siparis
  - ShoppingCart: Sepetim (with badge count)
  - ClipboardList: Siparislerim
  - FileText: Tekliflerim
  - Receipt: Faturalarim
  - User: Profilim
  - HelpCircle: Destek
- Active item: amber left border + lighter bg
- Collapsible: full (240px) / icon-only (64px)
- Mobile: hidden, toggles via hamburger
- Logout button at bottom

**Step 2: Refactor layout.tsx to use Sidebar component**

Replace inline sidebar code with `<Sidebar />` import.
Main content area: cream bg, proper padding.

**Step 3: Verify build**

Run: `npm run build`

**Step 4: Commit**

```bash
git add src/components/portal/Sidebar.tsx src/app/[locale]/bayi-panel/layout.tsx
git commit -m "feat: rebuild portal sidebar as dedicated component"
```

---

### Task 13: Rebuild Portal Dashboard

**Files:**
- Modify: `src/app/[locale]/bayi-panel/page.tsx`
- Create: `src/components/portal/DashboardCards.tsx`

**Step 1: Create DashboardCards component**

4 summary cards in a grid:
- Aktif Siparisler (blue icon)
- Bekleyen Teklifler (amber icon)
- Odenmemis Faturalar (red icon)
- Son 30 Gun Ciro (green icon, JetBrains Mono for amount)

White card, subtle shadow, cream bg page.

**Step 2: Refactor dashboard page**

- Welcome: "Hos geldiniz, [Firma Adi]" with Fraunces
- DashboardCards component
- Recent orders table (last 5)
- Quick actions: "Yeni Siparis" + "Teklif Iste" amber buttons

**Step 3: Verify build**

Run: `npm run build`

**Step 4: Commit**

```bash
git add src/app/[locale]/bayi-panel/page.tsx src/components/portal/DashboardCards.tsx
git commit -m "refactor: rebuild portal dashboard with summary cards and quick actions"
```

---

## Phase 5: Portal Features

### Task 14: Create Quick Order Page

**Files:**
- Create: `src/app/[locale]/bayi-panel/hizli-siparis/page.tsx`
- Create: `src/components/portal/QuickOrderForm.tsx`

**Step 1: Create QuickOrderForm component**

Excel-like table with:
- Columns: Urun Kodu | Urun Adi (autocomplete) | Miktar | Birim Fiyat | Toplam
- "Satir Ekle" button
- Product code input: on change, fetch product name + price
- Real-time row total and grand total calculation
- Bottom: Ara Toplam | KDV (%20) | Genel Toplam
- Two CTAs: "Siparise Donustur" + "Teklif Iste"
- Keyboard navigation (Tab between cells)

**Step 2: Create page wrapper**

Server component page that renders QuickOrderForm client component.

**Step 3: Add "Hizli Siparis" to sidebar navigation**

Update Sidebar.tsx to include the new route.

**Step 4: Verify build**

Run: `npm run build`

**Step 5: Commit**

```bash
git add src/app/[locale]/bayi-panel/hizli-siparis/ src/components/portal/QuickOrderForm.tsx src/components/portal/Sidebar.tsx
git commit -m "feat: add quick order form with autocomplete and real-time totals"
```

---

### Task 15: Add Excel Paste to Quick Order

**Files:**
- Modify: `src/components/portal/QuickOrderForm.tsx`

**Step 1: Add clipboard paste handler**

- Listen for paste event on the table
- Parse tab-separated values (Excel format): Code\tQuantity
- For each row: lookup product by code, fill name + price
- Show confirmation toast with number of rows added

**Step 2: Add "Excel'den Yapistir" button**

Visual button that triggers focus on a hidden textarea for paste.

**Step 3: Verify build**

Run: `npm run build`

**Step 4: Commit**

```bash
git add src/components/portal/QuickOrderForm.tsx
git commit -m "feat: add Excel paste support to quick order form"
```

---

### Task 16: Portal Product Catalog with Cart

**Files:**
- Create: `src/components/portal/ProductCatalog.tsx`
- Create: `src/components/portal/CartSidebar.tsx`
- Modify: `src/app/[locale]/bayi-panel/urunler/page.tsx`

**Step 1: Create ProductCatalog component**

- Left: category filter sidebar (8 categories, checkboxes)
- Right: product grid with cards
- Each card: image + name + code + price (PriceDisplay) + quantity input + "Sepete Ekle"
- Search bar at top with product code/name autocomplete
- Sort dropdown (price asc/desc, name, newest)

**Step 2: Create CartSidebar component**

- Slide-in from right (Sheet component from shadcn)
- Cart items list with quantity +/- controls
- Remove item button
- Subtotal, KDV, Total
- "Siparise Donustur" button
- Cart icon in portal top bar shows item count badge

**Step 3: Update portal urunler page**

Replace current implementation with new ProductCatalog.

**Step 4: Verify build**

Run: `npm run build`

**Step 5: Commit**

```bash
git add src/components/portal/ProductCatalog.tsx src/components/portal/CartSidebar.tsx src/app/[locale]/bayi-panel/urunler/
git commit -m "feat: portal product catalog with cart sidebar"
```

---

### Task 17: Quote Request Flow (Portal Side)

**Files:**
- Modify: `src/app/[locale]/bayi-panel/tekliflerim/page.tsx`
- Create: `src/app/api/quotes/request/route.ts`

**Step 1: Refactor tekliflerim page**

- Quote list table: Teklif No | Tarih | Urun Sayisi | Toplam | Durum
- Status badges: Beklemede (yellow) | Yanitlandi (blue) | Onaylandi (green) | Reddedildi (red)
- Click row to expand: product lines, prices, admin response
- "Onayla ve Siparise Donustur" button on responded quotes
- "Yeni Teklif Iste" button at top

**Step 2: Create quote request API**

POST `/api/quotes/request`:
- Validate auth (dealer must be logged in)
- Accept product list with quantities
- Create quote_request in Supabase with status "pending"
- Send notification to admin (email via Resend)
- Return { success: true, quoteId }

**Step 3: Verify build**

Run: `npm run build`

**Step 4: Commit**

```bash
git add src/app/[locale]/bayi-panel/tekliflerim/ src/app/api/quotes/request/
git commit -m "feat: quote request flow — portal listing and API"
```

---

### Task 18: Order Timeline Enhancement

**Files:**
- Modify: `src/app/[locale]/bayi-panel/siparislerim/page.tsx`
- Modify: `src/components/ui/OrderTimeline.tsx` (or create if needed)

**Step 1: Enhance order list page**

- Table: Siparis No | Tarih | Urun Sayisi | Toplam | Durum
- Status badges with colors: Beklemede (yellow) | Onaylandi (blue) | Uretimde (purple) | Kargoda (orange) | Teslim Edildi (green)
- Click to expand: vertical timeline + order items

**Step 2: Enhance OrderTimeline component**

- Vertical timeline with status dots (colored by state)
- Each step: date + status text + optional note
- Current step highlighted with pulse animation
- Completed steps with checkmark

**Step 3: Add "Tekrar Siparis Ver" button**

On completed orders, button that copies items to cart.

**Step 4: Verify build**

Run: `npm run build`

**Step 5: Commit**

```bash
git add src/app/[locale]/bayi-panel/siparislerim/ src/components/ui/OrderTimeline.tsx
git commit -m "feat: enhanced order tracking with vertical timeline and reorder"
```

---

## Phase 6: DIA Integration Rewrite

### Task 19: Rewrite DIA Client for v3 API

**Files:**
- Modify: `src/lib/dia-client.ts`

**Step 1: Rewrite dia-client.ts for DIA Web Service v3**

Complete rewrite:
- Base URL: `https://SUNUCU.ws.dia.com.tr/api/v3/`
- Login: POST `/sis/json` with `{ login: { username, password, params: { apikey }, disconnect_same_user: true, lang: "tr" } }`
- Response: `{ code: "200", msg: "<session_id>" }` or error
- Service calls: POST `/<module>/json` with `{ <service_name>: { session_id, firma_kodu, donem_kodu, ...params } }`
- Session management: auto-login, session refresh on 401
- Env vars: DIA_API_URL, DIA_USERNAME, DIA_PASSWORD, DIA_API_KEY, DIA_FIRMA_KODU, DIA_DONEM_KODU

**Step 2: Update dia-services.ts**

Update service functions to use new client format:
- Stock: `scf_stokkart_listele`, `scf_stokkart_getir`
- Cari: `scf_carikart_listele`, `scf_carikart_getir`
- Orders: `scf_siparis_ekle`, `scf_siparis_listele`
- Invoices: `scf_fatura_listele`

**Step 3: Update env vars**

Add to `.env.local`: `DIA_API_KEY=` (empty until obtained)
Rename `DIA_COMPANY_CODE` to `DIA_FIRMA_KODU`, `DIA_PERIOD_ID` to `DIA_DONEM_KODU`

**Step 4: Verify build**

Run: `npm run build`

**Step 5: Commit**

```bash
git add src/lib/dia-client.ts src/lib/dia-services.ts
git commit -m "feat: rewrite DIA client for v3 API (session-based auth)"
```

---

### Task 20: Update DIA Admin Endpoints

**Files:**
- Modify: `src/app/api/admin/dia/test/route.ts`
- Modify: `src/app/api/admin/dia/sync/stock/route.ts`
- Modify: `src/app/api/admin/dia/sync/cari/route.ts`
- Modify: `src/app/api/admin/dia/settings/route.ts`

**Step 1: Update test endpoint for v3 format**

**Step 2: Update sync endpoints for new service call format**

**Step 3: Verify build**

Run: `npm run build`

**Step 4: Commit**

```bash
git add src/app/api/admin/dia/
git commit -m "feat: update DIA admin endpoints for v3 API"
```

---

## Phase 7: Invoice & Final Features

### Task 21: Invoice System Enhancement

**Files:**
- Modify: `src/app/[locale]/bayi-panel/faturalarim/page.tsx`

**Step 1: Enhance invoice list**

- Table: Fatura No | Tarih | Vade | Tutar | Durum
- Status: Odendi (green) | Odenmedi (yellow) | Gecikmis (red border + bg tint)
- JetBrains Mono for all financial figures
- PDF download button per row
- Summary card at top: Toplam Borc | Gecikmis Tutar

**Step 2: Verify build**

Run: `npm run build`

**Step 3: Commit**

```bash
git add src/app/[locale]/bayi-panel/faturalarim/
git commit -m "feat: enhanced invoice page with status badges and summary"
```

---

## Phase 8: Polish & Quality

### Task 22: Dark Mode Consistency Pass

**Files:**
- Multiple component files

**Step 1: Audit all new/modified components for dark mode**

Check every component created/modified in this plan:
- Sidebar: dark mode already navy, minimal changes needed
- Dashboard cards: ensure dark: variants
- Forms: dark input backgrounds
- Tables: dark alternating rows
- Badges: dark mode colors

**Step 2: Fix any missing dark: classes**

**Step 3: Verify build**

Run: `npm run build`

**Step 4: Commit**

```bash
git commit -am "fix: dark mode consistency across all new components"
```

---

### Task 23: Translation Keys

**Files:**
- Modify: `src/locales/tr.json`
- Modify: `src/locales/en.json`

**Step 1: Add all new UI text to translation files**

Portal labels, button texts, status names, error messages, form labels — all new text from Tasks 12-21.

**Step 2: Verify build**

Run: `npm run build`

**Step 3: Commit**

```bash
git add src/locales/
git commit -m "feat: add translation keys for portal and homepage changes"
```

---

### Task 24: Final Build & Quality Check

**Files:** All modified files

**Step 1: Run full quality check**

```bash
npm run lint
npx tsc --noEmit
npm run build
```

**Step 2: Fix any remaining issues**

**Step 3: Visual review of key pages**

- Homepage: `http://localhost:3005/tr`
- Portal dashboard: `http://localhost:3005/tr/bayi-panel`
- Portal catalog: `http://localhost:3005/tr/bayi-panel/urunler`
- Quick order: `http://localhost:3005/tr/bayi-panel/hizli-siparis`

**Step 4: Final commit**

```bash
git commit -am "chore: final quality pass — lint, types, build clean"
```

---

## Dependency Map

```
Task 1-4 (Design System) → no dependencies
Task 5 (Directories) → no dependencies
Task 6 (PriceDisplay) → Task 5
Task 7-11 (Homepage) → Task 1-4
Task 12-13 (Portal Layout) → Task 1-4, 5
Task 14-15 (Quick Order) → Task 12
Task 16 (Catalog+Cart) → Task 6, 12
Task 17 (Quotes) → Task 12
Task 18 (Orders) → Task 12
Task 19-20 (DIA) → independent, blocked by API key
Task 21 (Invoices) → Task 12
Task 22-24 (Polish) → all above
```

## Parallelization Opportunities

These task groups can run in parallel:
- **Group A:** Tasks 1-4 (Design System)
- **Group B:** Task 5 (Directories) — quick, do first
- **Group C:** Tasks 7-11 (Homepage) — after Group A
- **Group D:** Tasks 12-18 (Portal) — after Group A + B
- **Group E:** Tasks 19-20 (DIA) — independent, any time
- **Group F:** Tasks 21-24 (Polish) — after all above
