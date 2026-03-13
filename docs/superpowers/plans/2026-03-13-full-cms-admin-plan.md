# Full CMS: Admin Panelinden Tum Icerik Yonetimi — Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Sitedeki tum hardcoded icerigi admin panelinden yonetilebilir hale getirmek — 2 yeni DB tablosu, 2 yeni admin sayfasi, 23+ frontend sayfa guncelleme, otomatik ceviri sistemi.

**Architecture:** Mevcut Supabase tablolarini (`site_settings`, `content_sections`, `faq_items`, `certificates`, `trade_shows`, `resources`, `career_listings`) kullanarak hardcoded icerigi DB'ye tasima. Yeni `translations` ve `glossary_terms` tablolari ekleme. Admin paneline `/admin/pages` (sayfa icerik editoru) ve `/admin/glossary` ekleme. Google Translate API ile 9 dile otomatik ceviri.

**Tech Stack:** Next.js 16, Supabase (PostgreSQL + RLS), TypeScript, Tailwind CSS, Google Translate API v2

**Spec:** `docs/superpowers/specs/2026-03-13-full-cms-admin-design.md`

---

## Key Architecture Decisions

### Client/Server Boundary Pattern

Many frontend pages and components are `"use client"`. The standard pattern for this migration:

1. **Page files (`page.tsx`):** Convert to async server components. Remove `"use client"` directive if present. Call `getPageContent()`, `getSettings()`, etc. at the server level.
2. **Client components (sections, pages):** Keep as `"use client"`. Add new props interface (e.g. `content?: Record<string, DbContentSection>`, `settings?: Record<string, string>`). Receive data as serializable props from the parent server page.
3. **Fallback strategy:** During migration, always fall back to existing `dict` values: `content?.home_hero?.title_tr ?? dict.home.heroHeading`. This prevents breakage if DB content is missing.

Example:
```typescript
// page.tsx (server component — NO "use client")
import { getPageContent, getSettings } from "@/lib/content";
import HeroClient from "@/components/sections/Hero";

export default async function Page({ params }) {
  const { locale } = await params;
  const content = await getPageContent("home");
  const settings = await getSettings();
  return <HeroClient content={content} settings={settings} locale={locale} />;
}

// Hero.tsx (client component — keeps "use client")
"use client";
export default function Hero({ content, settings, locale }: HeroProps) {
  const { dict } = useLocale();
  const title = content?.home_hero?.title_tr ?? dict.home.heroHeading;
  // ...
}
```

### `getLocalizedField` — Async from the Start

`getLocalizedField` is defined as `async` from Task 5 onward. All call sites must `await` it. For client components, use the synchronous version that only handles TR/EN (no translations table lookup needed — translations lookup only happens server-side for other locales). Export both:
- `getLocalizedFieldSync(item, field, locale)` — for client components (TR/EN only, no DB)
- `getLocalizedField(item, field, locale, sourceTable?)` — async, for server components (all 11 locales)

### Seed Scripts (.mjs) — Supabase Initialization

All seed scripts use `dotenv` to load `.env.local` and create their own Supabase client:
```javascript
import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);
```
Scripts duplicate the data inline (not importing from .ts files) since they are .mjs.

### Existing API Routes

`/api/admin/content/sections/route.ts` already exists for `content_sections` CRUD. The new `/admin/pages` UI will reuse these existing API routes (adding `?page=` filter param to GET) rather than creating a duplicate API.

---

## Chunk 1: Database Migration + Seed Data

### Task 1: SQL Migration — New Tables + Seed Settings

**Files:**
- Create: `docs/supabase-migrations/014_cms_content_tables.sql`
- Modify: `src/types/database.ts`

- [ ] **Step 1: Write SQL migration file**

Create `docs/supabase-migrations/014_cms_content_tables.sql` with:

```sql
-- 1. glossary_terms table
CREATE TABLE IF NOT EXISTS glossary_terms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  term_tr TEXT NOT NULL,
  term_en TEXT NOT NULL DEFAULT '',
  definition_tr TEXT NOT NULL,
  definition_en TEXT NOT NULL DEFAULT '',
  letter TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_glossary_letter ON glossary_terms(letter);
ALTER TABLE glossary_terms ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read active glossary" ON glossary_terms FOR SELECT USING (is_active = true);
CREATE POLICY "Service role write glossary" ON glossary_terms FOR ALL USING (auth.role() = 'service_role');

-- 2. translations table
CREATE TABLE IF NOT EXISTS translations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  source_table TEXT NOT NULL,
  source_id UUID NOT NULL,
  field_name TEXT NOT NULL,
  locale TEXT NOT NULL,
  translated_text TEXT NOT NULL,
  is_manual BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(source_table, source_id, field_name, locale)
);
CREATE INDEX IF NOT EXISTS idx_translations_lookup ON translations(source_table, source_id, locale);
ALTER TABLE translations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read translations" ON translations FOR SELECT USING (true);
CREATE POLICY "Service role write translations" ON translations FOR ALL USING (auth.role() = 'service_role');
```

- [ ] **Step 2: Run migration on Supabase**

SSH into VPS and run the SQL against the Supabase PostgreSQL instance, or run via Supabase Studio SQL editor.

- [ ] **Step 3: Update TypeScript types**

Add to `src/types/database.ts`:

```typescript
export interface GlossaryTerm {
  id: string;
  term_tr: string;
  term_en: string;
  definition_tr: string;
  definition_en: string;
  letter: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Translation {
  id: string;
  source_table: string;
  source_id: string;
  field_name: string;
  locale: string;
  translated_text: string;
  is_manual: boolean;
  created_at: string;
  updated_at: string;
}
```

Also add to the `Database.public.Tables` interface:

```typescript
glossary_terms: {
  Row: GlossaryTerm;
  Insert: Omit<GlossaryTerm, "id" | "created_at" | "updated_at">;
  Update: Partial<Omit<GlossaryTerm, "id">>;
};
translations: {
  Row: Translation;
  Insert: Omit<Translation, "id" | "created_at" | "updated_at">;
  Update: Partial<Omit<Translation, "id">>;
};
```

- [ ] **Step 4: Verify build**

Run: `npm run build`
Expected: Build succeeds with no type errors.

- [ ] **Step 5: Commit**

```bash
git add docs/supabase-migrations/014_cms_content_tables.sql src/types/database.ts
git commit -m "feat: add glossary_terms and translations tables for CMS"
```

### Task 2: Seed site_settings with Stats + Missing Keys

**Files:**
- Create: `scripts/seed-cms-settings.mjs`

- [ ] **Step 1: Create seed script**

Create `scripts/seed-cms-settings.mjs` that upserts these keys into `site_settings`:

```javascript
const settings = [
  // Stats group
  { key: "stats_experience_years", value: "57", group: "stats" },
  { key: "stats_products", value: "500", group: "stats" },
  { key: "stats_capacity", value: "50M", group: "stats" },
  { key: "stats_customers", value: "1000", group: "stats" },
  { key: "experience_badge", value: "57+", group: "stats" },
  // Contact group additions
  { key: "working_hours", value: "Pzt-Cum 09:00 - 18:00", group: "contact" },
  { key: "working_hours_en", value: "Mon-Fri 09:00 - 18:00", group: "contact" },
  { key: "google_maps_url", value: "", group: "contact" },
  // Company group additions
  { key: "company_address_en", value: "", group: "company" },
];
```

Use Supabase client with service role key to upsert on conflict `(key)`.

- [ ] **Step 2: Run seed script**

Run: `node scripts/seed-cms-settings.mjs`
Expected: "9 settings upserted"

- [ ] **Step 3: Commit**

```bash
git add scripts/seed-cms-settings.mjs
git commit -m "feat: seed site_settings with stats and missing keys"
```

### Task 3: Seed content_sections with Page Content

**Files:**
- Create: `scripts/seed-cms-content.mjs`

- [ ] **Step 1: Create seed script**

Extract ALL hardcoded content from the following sources into `content_sections` rows:

**Source files to extract from:**
- `src/locales/tr.json` + `src/locales/en.json` — home.*, about.*, quality.*, contact.*, etc.
- `src/components/sections/Hero.tsx` — hero heading, subtext, badge, CTAs
- `src/components/sections/Stats.tsx` — stat labels
- `src/components/sections/About.tsx` — about lead paragraphs, strengths
- `src/components/sections/WhyUs.tsx` — features (6 items with icons)
- `src/components/sections/Sectors.tsx` — sector cards (6 items)
- `src/components/sections/CTA.tsx` — CTA title, subtitle, note
- `src/components/sections/Categories.tsx` — section title, subtitle
- `src/app/[locale]/hakkimizda/page.tsx` — about hero, story, mission, vision, values
- `src/app/[locale]/kalite/page.tsx` — quality hero, process steps, lab info
- `src/app/[locale]/uretim/page.tsx` — production hero, process steps
- `src/app/[locale]/iletisim/page.tsx` — contact page title
- `src/app/[locale]/vizyon-misyon/page.tsx` — vision, mission texts
- `src/app/[locale]/surdurulebilirlik/page.tsx` — sustainability content
- `src/app/[locale]/kvkk/page.tsx` — full KVKK text
- `src/app/[locale]/tarihce/page.tsx` — history hero
- `src/app/[locale]/arge/page.tsx` — R&D content
- `src/app/[locale]/sektorler/page.tsx` — sectors page content
- `src/app/[locale]/kariyer/page.tsx` — career hero, perks
- `src/app/[locale]/katalog/page.tsx` — catalog hero
- `src/app/[locale]/referanslar/page.tsx` — references hero, stats
- `src/app/[locale]/fabrika/page.tsx` — factory hero
- `src/app/[locale]/teklif-al/page.tsx` — quote hero, benefits
- `src/app/[locale]/numune-talep/page.tsx` — sample request hero
- `src/app/[locale]/on-siparis/page.tsx` — preorder hero

Each row maps to `content_sections` schema: `section_key`, `title_tr`, `title_en`, `subtitle_tr`, `subtitle_en`, `content_tr`, `content_en`, `cta_text_tr`, `cta_text_en`, `cta_url`, `image_url`, `display_order`, `is_active`, `metadata`.

Section key naming: `{page}_{section}` e.g. `home_hero`, `about_story`, `quality_step_1`.

- [ ] **Step 2: Run seed script**

Run: `node scripts/seed-cms-content.mjs`
Expected: "~120 content sections upserted"

- [ ] **Step 3: Commit**

```bash
git add scripts/seed-cms-content.mjs
git commit -m "feat: seed content_sections with all page content"
```

### Task 4: Seed Static Data Tables

**Files:**
- Create: `scripts/seed-cms-static-data.mjs`

- [ ] **Step 1: Create seed script**

Migrate data from static files to DB tables:

1. `src/data/certificates.ts` → `certificates` table (check if data already exists, upsert)
2. `src/data/trade-shows.ts` → `trade_shows` table
3. `src/data/resources.ts` → `resources` table
4. `src/data/references.ts` → `references` table (check if data already exists)
5. `src/data/milestones.ts` → `milestones` table (check if data already exists)
6. Hardcoded FAQ data from `src/app/[locale]/sss/page.tsx` → `faq_items` table

Map field names from camelCase (static files) to snake_case (DB), e.g.:
- `nameEn` → `name_en`
- `descriptionEn` → `description_en`
- `startDate` → `start_date`
- `pdfUrl` → `pdf_url`

- [ ] **Step 2: Run seed script**

Run: `node scripts/seed-cms-static-data.mjs`
Expected: "Certificates: X, Trade shows: X, Resources: X, FAQ: X seeded"

- [ ] **Step 3: Commit**

```bash
git add scripts/seed-cms-static-data.mjs
git commit -m "feat: seed certificates, trade_shows, resources, faq_items from static data"
```

---

## Chunk 2: Content Utility Library

### Task 5: Create `src/lib/content.ts`

**Files:**
- Create: `src/lib/content.ts`

- [ ] **Step 1: Write content utility functions**

```typescript
import { getSupabase } from "@/lib/supabase";
import type { DbContentSection, DbSiteSetting, DbCertificate, DbTradeShow, DbResource, DbFaqItem, DbCareerListing, DbReference, DbMilestone, GlossaryTerm } from "@/types/database";

// ─── Site Settings ─────────────────────────────────────────────

/**
 * Fetch all site_settings as a key-value map.
 * Cached via Next.js ISR with revalidateTag("site-settings").
 */
export async function getSettings(): Promise<Record<string, string>> {
  const supabase = getSupabase();
  const { data } = await supabase
    .from("site_settings")
    .select("key, value");

  const map: Record<string, string> = {};
  (data ?? []).forEach((s: DbSiteSetting) => {
    map[s.key] = s.value;
  });
  return map;
}

// ─── Page Content ──────────────────────────────────────────────

/**
 * Fetch all content_sections for a page prefix.
 * E.g. getPageContent("home") returns all rows where section_key LIKE 'home_%'
 */
export async function getPageContent(
  pagePrefix: string
): Promise<Record<string, DbContentSection>> {
  const supabase = getSupabase();
  const { data } = await supabase
    .from("content_sections")
    .select("*")
    .like("section_key", `${pagePrefix}_%`)
    .eq("is_active", true)
    .order("display_order");

  const map: Record<string, DbContentSection> = {};
  (data ?? []).forEach((s: DbContentSection) => {
    map[s.section_key] = s;
  });
  return map;
}

// ─── Localized Field Helper ────────────────────────────────────

/**
 * Synchronous version for client components (TR/EN only, no DB lookup).
 * Use this in "use client" components.
 */
export function getLocalizedFieldSync(
  item: Record<string, unknown> | null | undefined,
  field: string,
  locale: string
): string {
  if (!item) return "";
  if (locale === "tr") return (item[`${field}_tr`] as string) ?? "";
  if (locale === "en") return (item[`${field}_en`] as string) ?? "";
  return (item[`${field}_en`] as string) ?? (item[`${field}_tr`] as string) ?? "";
}

/**
 * Async version for server components (all 11 locales, with translations table lookup).
 * For TR/EN returns directly. For other locales checks translations table.
 */
export async function getLocalizedField(
  item: Record<string, unknown> | null | undefined,
  field: string,
  locale: string,
  sourceTable?: string
): Promise<string> {
  if (!item) return "";
  if (locale === "tr") return (item[`${field}_tr`] as string) ?? "";
  if (locale === "en") return (item[`${field}_en`] as string) ?? "";

  // Check translations table for other locales
  if (sourceTable && item.id) {
    const supabase = getSupabase();
    const { data } = await supabase
      .from("translations")
      .select("translated_text")
      .eq("source_table", sourceTable)
      .eq("source_id", item.id as string)
      .eq("field_name", field)
      .eq("locale", locale)
      .single();

    if (data?.translated_text) return data.translated_text;
  }

  // Fallback to EN
  return (item[`${field}_en`] as string) ?? (item[`${field}_tr`] as string) ?? "";
}

// ─── Static Data Fetchers ──────────────────────────────────────

export async function getCertificates(): Promise<DbCertificate[]> {
  const supabase = getSupabase();
  const { data } = await supabase
    .from("certificates")
    .select("*")
    .eq("is_active", true)
    .order("display_order");
  return data ?? [];
}

export async function getTradeShows(): Promise<DbTradeShow[]> {
  const supabase = getSupabase();
  const { data } = await supabase
    .from("trade_shows")
    .select("*")
    .eq("is_active", true)
    .order("start_date", { ascending: false });
  return data ?? [];
}

export async function getResources(): Promise<DbResource[]> {
  const supabase = getSupabase();
  const { data } = await supabase
    .from("resources")
    .select("*")
    .eq("is_active", true)
    .order("display_order");
  return data ?? [];
}

export async function getFaqItems(): Promise<DbFaqItem[]> {
  const supabase = getSupabase();
  const { data } = await supabase
    .from("faq_items")
    .select("*")
    .eq("is_active", true)
    .order("display_order");
  return data ?? [];
}

export async function getCareerListings(): Promise<DbCareerListing[]> {
  const supabase = getSupabase();
  const { data } = await supabase
    .from("career_listings")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function getReferences(): Promise<DbReference[]> {
  const supabase = getSupabase();
  const { data } = await supabase
    .from("references")
    .select("*")
    .eq("is_active", true)
    .order("display_order");
  return data ?? [];
}

export async function getMilestones(): Promise<DbMilestone[]> {
  const supabase = getSupabase();
  const { data } = await supabase
    .from("milestones")
    .select("*")
    .order("year", { ascending: true });
  return data ?? [];
}

export async function getGlossaryTerms(): Promise<GlossaryTerm[]> {
  const supabase = getSupabase();
  const { data } = await supabase
    .from("glossary_terms")
    .select("*")
    .eq("is_active", true)
    .order("display_order");
  return data ?? [];
}
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: Build succeeds.

- [ ] **Step 3: Commit**

```bash
git add src/lib/content.ts
git commit -m "feat: add content utility library (getSettings, getPageContent, data fetchers)"
```

---

## Chunk 3: Admin Panel Updates

### Task 6: Extend `/admin/settings` with Stats Group

**Files:**
- Modify: `src/app/admin/settings/page.tsx`

- [ ] **Step 1: Add stats group to SETTING_GROUPS array**

Add after the existing `contact` group in the `SETTING_GROUPS` array:

```typescript
{
  id: "stats",
  label: "İstatistikler",
  icon: TrendingUp,
  fields: [
    { key: "stats_experience_years", label: "Tecrübe Yılı", placeholder: "57" },
    { key: "stats_products", label: "Ürün Sayısı", placeholder: "500" },
    { key: "stats_capacity", label: "Üretim Kapasitesi", placeholder: "50M" },
    { key: "stats_customers", label: "Müşteri Sayısı", placeholder: "1000" },
    { key: "experience_badge", label: "Badge Metni", placeholder: "57+" },
  ],
},
```

Add `TrendingUp` to the lucide-react imports.

Also extend the `contact` group fields with:
```typescript
{ key: "working_hours", label: "Çalışma Saatleri (TR)", placeholder: "Pzt-Cum 09:00 - 18:00" },
{ key: "working_hours_en", label: "Çalışma Saatleri (EN)", placeholder: "Mon-Fri 09:00 - 18:00" },
{ key: "google_maps_url", label: "Google Maps Embed URL", placeholder: "https://maps.google.com/...", type: "url" },
```

And extend the `company` group fields with:
```typescript
{ key: "company_address_en", label: "Adres (İngilizce)", placeholder: "English address", type: "textarea" },
```

- [ ] **Step 2: Verify in browser**

Navigate to `/admin/settings`. Confirm the new "İstatistikler" group appears, all fields are editable, and save works.

- [ ] **Step 3: Commit**

```bash
git add src/app/admin/settings/page.tsx
git commit -m "feat: add stats group and missing fields to admin settings"
```

### Task 7: Create `/admin/pages` — Page Content Editor

**Files:**
- Create: `src/app/admin/pages/page.tsx`

- [ ] **Step 1: Build page content editor**

Create a new admin page with:

**Left sidebar:** List of 16 pages (Ana Sayfa, Hakkımızda, Kalite, Üretim, İletişim, Vizyon-Misyon, Sürdürülebilirlik, KVKK, Tarihçe, Ar-Ge, Sektörler, Kariyer, Katalog, Referanslar, Fabrika, Teklif Al).

Each page item has `key` and `label`:
```typescript
const PAGES = [
  { key: "home", label: "Ana Sayfa" },
  { key: "about", label: "Hakkımızda" },
  { key: "quality", label: "Kalite" },
  { key: "production", label: "Üretim" },
  { key: "contact", label: "İletişim" },
  { key: "vision", label: "Vizyon-Misyon" },
  { key: "sustainability", label: "Sürdürülebilirlik" },
  { key: "kvkk", label: "KVKK" },
  { key: "history", label: "Tarihçe" },
  { key: "rnd", label: "Ar-Ge" },
  { key: "sectors", label: "Sektörler" },
  { key: "career", label: "Kariyer" },
  { key: "catalog", label: "Katalog" },
  { key: "references", label: "Referanslar" },
  { key: "factory", label: "Fabrika" },
  { key: "quote", label: "Teklif Al" },
];
```

**Right panel:** When a page is selected, fetch `content_sections` where `section_key LIKE '{pageKey}_%'`. Render each section as a card with:
- Section label (derived from section_key, e.g. `home_hero` → "Hero")
- TR tab / EN tab toggle
- `title` field (input)
- `subtitle` field (input)
- `content` field (textarea)
- `cta_text` field (input, if applicable)
- `cta_url` field (input, if applicable)
- `image_url` field (input, if applicable)
- metadata JSON display (read-only or simple key-value editor for `icon` etc.)

**Save:** PUT to `/api/admin/content/sections` with the modified sections array. Upsert into `content_sections` on conflict `(section_key)`.

**API Route needed:** Create `/api/admin/pages/route.ts` with:
- GET: fetch content_sections by prefix (query param `?page=home`)
- PUT: upsert content_sections array

Follow the same pattern as `/api/admin/settings/route.ts` — auth check, rate limit, validation, return `{ success, data }`.

- [ ] **Step 2: Extend existing content sections API**

Modify `src/app/api/admin/content/sections/route.ts` (already exists):

- Add `?page=` query param filter to GET handler: when present, filter `section_key LIKE '{page}_%'`
- Ensure PUT/POST handler supports upsert on conflict `(section_key)`

Do NOT create a duplicate `/api/admin/pages/route.ts`. The `/admin/pages` UI will call the existing `/api/admin/content/sections` API.

- [ ] **Step 3: Add to admin sidebar**

Modify `src/app/admin/layout.tsx`: add "Sayfa İçerikleri" link with `FileText` icon to the "Ürün & İçerik" nav group, pointing to `/admin/pages`.

- [ ] **Step 4: Verify in browser**

Navigate to `/admin/pages`. Select "Ana Sayfa", verify sections load. Edit a title, save, verify it persists on reload.

- [ ] **Step 5: Commit**

```bash
git add src/app/admin/pages/page.tsx src/app/api/admin/content/sections/route.ts src/app/admin/layout.tsx
git commit -m "feat: add /admin/pages — page content editor"
```

### Task 8: Create `/admin/glossary` — Glossary Management

**Files:**
- Create: `src/app/admin/glossary/page.tsx`
- Create: `src/app/api/admin/glossary/route.ts`
- Create: `src/app/api/admin/glossary/[id]/route.ts`

- [ ] **Step 1: Build glossary admin page**

Standard CRUD page for `glossary_terms` table. Follow the pattern of `/admin/certificates/page.tsx`:
- Table listing with columns: Terim (TR), Terim (EN), Harf, Sıra, Durum, İşlemler
- Filter by letter (A-Z tabs)
- Create/Edit modal with fields: term_tr, term_en, definition_tr, definition_en, letter, display_order, is_active
- Delete with confirmation dialog

- [ ] **Step 2: Create API routes**

`/api/admin/glossary/route.ts`:
- GET: fetch all glossary_terms ordered by letter, display_order
- POST: create new term (validate required fields)

`/api/admin/glossary/[id]/route.ts`:
- PUT: update term by id
- DELETE: delete term by id

All routes: `checkAuth(request)`, use `supabase-admin` for writes.

- [ ] **Step 3: Add to admin sidebar**

Add "Sözlük" link with `BookOpen` icon to the "Kurumsal" nav group in `src/app/admin/layout.tsx`.

- [ ] **Step 4: Verify in browser**

Navigate to `/admin/glossary`. Add a term, edit it, delete it. Verify CRUD works.

- [ ] **Step 5: Commit**

```bash
git add src/app/admin/glossary/ src/app/api/admin/glossary/ src/app/admin/layout.tsx
git commit -m "feat: add /admin/glossary — glossary term management"
```

---

## Chunk 4: Frontend — Settings + Homepage Sections

### Task 9: Update Footer to Read from DB

**Files:**
- Modify: `src/components/layout/Footer.tsx`

- [ ] **Step 1: Replace hardcoded contact info**

Read `src/components/layout/Footer.tsx`. Find hardcoded phone, email, address strings. Replace with data from `getSettings()`.

The Footer is a client component — so pass settings as props from the layout or convert the contact section to use a server component wrapper.

**Approach:** Create a thin server component `FooterWrapper` that calls `getSettings()` and passes contact info as props to Footer, OR use a `useEffect` fetch on the client side if the Footer must remain a client component.

Recommended: Since Footer is rendered in a server layout, extract the contact info section and pass it as props from the parent layout. Add `settings` prop to Footer:

```typescript
interface FooterProps {
  settings?: Record<string, string>;
}
```

In `src/app/[locale]/layout.tsx`, call `getSettings()` and pass to Footer.

Replace hardcoded values:
- Phone: `settings.company_phone ?? "0212 549 87 03"`
- Email: `settings.company_email ?? "bilgi@kismetplastik.com"`
- Address: `locale === "tr" ? (settings.company_address ?? "...") : (settings.company_address_en ?? "...")`
- Working hours: `locale === "tr" ? (settings.working_hours ?? "...") : (settings.working_hours_en ?? "...")`
- Social links: `settings.social_instagram`, `settings.social_linkedin`, etc.

- [ ] **Step 2: Verify in browser**

Navigate to homepage. Confirm footer shows correct info from DB.

- [ ] **Step 3: Commit**

```bash
git add src/components/layout/Footer.tsx src/app/[locale]/layout.tsx
git commit -m "feat: Footer reads contact info from site_settings DB"
```

### Task 10: Update Stats + TrustBar to Read from DB

**Files:**
- Modify: `src/components/sections/Stats.tsx`
- Modify: `src/components/public/TrustBar.tsx`

- [ ] **Step 1: Update Stats.tsx**

Replace hardcoded `statValues` array `[55, 500, 1000, 50M]` with values from `getSettings()`. Pass settings as props from the homepage.

```typescript
interface StatsProps {
  settings?: Record<string, string>;
}

// Inside component:
const statValues = [
  settings?.stats_experience_years ?? "55",
  settings?.stats_products ?? "500",
  settings?.stats_customers ?? "1000",
  settings?.stats_capacity ?? "50M",
];
```

- [ ] **Step 2: Update TrustBar.tsx**

Same approach — replace hardcoded trust numbers with settings values.

- [ ] **Step 3: Pass settings from homepage**

In `src/app/[locale]/page.tsx` (or whichever file renders the homepage), call `getSettings()` at the server level and pass as props to `Stats` and `TrustBar`.

- [ ] **Step 4: Update Hero.tsx and About.tsx badge**

Replace hardcoded "60+" with `settings.experience_badge ?? "57+"`.

- [ ] **Step 5: Verify in browser**

Navigate to homepage. Confirm stats show DB values (57, 500, 1000, 50M). Change a value in admin settings, wait 60s (cache), verify update appears.

- [ ] **Step 6: Commit**

```bash
git add src/components/sections/Stats.tsx src/components/public/TrustBar.tsx src/components/sections/Hero.tsx src/components/sections/About.tsx src/app/[locale]/page.tsx
git commit -m "feat: Stats, TrustBar, Hero, About read from site_settings DB"
```

### Task 11: Update Homepage Sections to Read from content_sections

**Files:**
- Modify: `src/components/sections/Hero.tsx`
- Modify: `src/components/sections/About.tsx`
- Modify: `src/components/sections/WhyUs.tsx`
- Modify: `src/components/sections/Sectors.tsx`
- Modify: `src/components/sections/Categories.tsx`
- Modify: `src/components/sections/CTA.tsx`
- Modify: `src/app/[locale]/page.tsx`

- [ ] **Step 1: Fetch home page content in homepage**

In `src/app/[locale]/page.tsx`, call `getPageContent("home")` at server level. Pass the resulting map to each section component as a `content` prop.

- [ ] **Step 2: Update Hero.tsx**

Replace `dict.home.heroHeading` etc. with `content.home_hero?.title_tr` (respecting locale). Use `getLocalizedField(content.home_hero, "title", locale)` pattern.

Keep fallbacks to dict values during migration: `content.home_hero?.title_tr ?? dict.home.heroHeading`.

- [ ] **Step 3: Update About.tsx**

Replace `dict.home.aboutLead1` etc. with `content.home_about?.content_tr`.
Replace strengths from dict with `content.home_strength_1` through `content.home_strength_6`.

- [ ] **Step 4: Update WhyUs.tsx**

Replace `dict.homeFeatures` entries with `content.home_feature_1` through `content.home_feature_6`.

- [ ] **Step 5: Update Sectors.tsx**

Replace `dict.homeSectors` entries with `content.home_sector_1` through `content.home_sector_6`.

- [ ] **Step 6: Update Categories.tsx and CTA.tsx**

Categories: Replace section title/subtitle with `content.home_categories`.
CTA: Replace title/subtitle/note with `content.home_cta`.

- [ ] **Step 7: Verify in browser**

Navigate to homepage in both TR and EN. All sections should display correctly with DB content.

- [ ] **Step 8: Commit**

```bash
git add src/components/sections/ src/app/[locale]/page.tsx
git commit -m "feat: homepage sections read from content_sections DB"
```

---

## Chunk 5: Frontend — All Remaining Pages

### Task 12a: Update Simple Pages (KVKK, Tarihce, Fabrika, Numune-Talep, On-Siparis)

**Files:**
- Modify: `src/app/[locale]/kvkk/page.tsx`
- Modify: `src/app/[locale]/tarihce/page.tsx` (also update milestone import to use `getMilestones()`)
- Modify: `src/app/[locale]/fabrika/page.tsx`
- Modify: `src/app/[locale]/numune-talep/page.tsx`
- Modify: `src/app/[locale]/on-siparis/page.tsx`
- Modify: `src/components/ui/Timeline.tsx` (update milestone type import from `@/data/milestones` to `@/types/database`)

- [ ] **Step 1: Convert each page to async server component**

Remove `"use client"` if present. Add `getPageContent()` call. Pass content to client sub-components as props. If page delegates to a Client component (e.g. `FactoryClient`), fetch data in page.tsx and pass as props.

Keep fallback values: `content?.kvkk_content?.content_tr ?? existingHardcodedText`.

- [ ] **Step 2: Update tarihce milestones**

Replace `import { milestones } from "@/data/milestones"` with `getMilestones()` from `@/lib/content`. Also update `src/components/ui/Timeline.tsx` if it imports the Milestone type from `@/data/milestones` — change to import `DbMilestone` from `@/types/database`.

- [ ] **Step 3: Verify and commit**

```bash
git add src/app/[locale]/kvkk/ src/app/[locale]/tarihce/ src/app/[locale]/fabrika/ src/app/[locale]/numune-talep/ src/app/[locale]/on-siparis/ src/components/ui/Timeline.tsx
git commit -m "feat: simple pages read from content_sections DB"
```

### Task 12b: Update Medium Pages (Hakkimizda, Kalite, Uretim, Vizyon-Misyon, Sektorler, Ar-Ge, Surdurulebilirlik)

**Files:**
- Modify: `src/app/[locale]/hakkimizda/page.tsx`
- Modify: `src/app/[locale]/kalite/page.tsx`
- Modify: `src/app/[locale]/uretim/page.tsx`
- Modify: `src/app/[locale]/vizyon-misyon/page.tsx`
- Modify: `src/app/[locale]/sektorler/page.tsx`
- Modify: `src/app/[locale]/arge/page.tsx`
- Modify: `src/app/[locale]/surdurulebilirlik/page.tsx`
- Plus any client sub-components these delegate to (e.g. `HakkimizdaClient`, `KaliteClient` etc.)

- [ ] **Step 1: Convert each page**

Same pattern: async server component → `getPageContent("{page}")` → pass to client sub-component.

For kalite/uretim: also fetch process steps from content_sections (`quality_step_*`, `production_step_*`).

- [ ] **Step 2: Verify all 7 pages in TR and EN**

- [ ] **Step 3: Commit**

```bash
git add src/app/[locale]/hakkimizda/ src/app/[locale]/kalite/ src/app/[locale]/uretim/ src/app/[locale]/vizyon-misyon/ src/app/[locale]/sektorler/ src/app/[locale]/arge/ src/app/[locale]/surdurulebilirlik/
git commit -m "feat: medium-complexity pages read from content_sections DB"
```

### Task 12c: Update Complex Pages (Iletisim, Kariyer, Katalog, Referanslar, Teklif-Al)

**Files:**
- Modify: `src/app/[locale]/iletisim/page.tsx`
- Modify: `src/app/[locale]/kariyer/page.tsx`
- Modify: `src/app/[locale]/katalog/page.tsx`
- Modify: `src/app/[locale]/referanslar/page.tsx`
- Modify: `src/app/[locale]/teklif-al/page.tsx`
- Plus client sub-components

- [ ] **Step 1: Update iletisim**

Replace hardcoded contact info (phone, email, address, hours) with `settings.*` values from `getSettings()`.

- [ ] **Step 2: Update kariyer**

Replace hardcoded `positions[]` with `getCareerListings()`. Replace hardcoded `perks[]` with `content.career_perk_*` from content_sections.

- [ ] **Step 3: Update katalog**

Replace hardcoded `catalogs[]` with data from `getResources()` (catalog = resource type).

- [ ] **Step 4: Update referanslar**

Replace hardcoded stats (500+, 30+, 8+) with content_sections `references_stats`. Use `getReferences()` for reference list (may already be doing this).

- [ ] **Step 5: Update teklif-al**

Replace hardcoded benefits/steps with `content.quote_*` from content_sections.

- [ ] **Step 6: Verify all 5 pages in TR and EN**

- [ ] **Step 7: Commit**

```bash
git add src/app/[locale]/iletisim/ src/app/[locale]/kariyer/ src/app/[locale]/katalog/ src/app/[locale]/referanslar/ src/app/[locale]/teklif-al/
git commit -m "feat: complex pages read from content_sections + site_settings DB"
```

### Task 13: Update Data-Driven Pages (SSS, Sertifikalar, Fuarlar, etc.)

**Files:**
- Modify: `src/app/[locale]/sss/page.tsx`
- Modify: `src/app/[locale]/sertifikalar/page.tsx`
- Modify: `src/app/[locale]/fuarlar/page.tsx`
- Modify: `src/app/[locale]/kaynaklar/page.tsx`
- Modify: `src/app/[locale]/ambalaj-sozlugu/page.tsx`
- Modify: `src/app/[locale]/kariyer/page.tsx`
- Modify: `src/components/ui/ReferenceLogos.tsx`
- Modify: `src/components/sections/Testimonials.tsx`
- Modify: `src/components/pages/CertificatesClient.tsx` (actual static import location)
- Modify: `src/components/pages/TradeShowsClient.tsx` (actual static import location)
- Modify: `src/components/pages/ResourcesClient.tsx` (actual static import location)
- Modify: `src/app/api/resources/download/route.ts` (imports from `@/data/resources`)

- [ ] **Step 1: Update SSS page**

Remove hardcoded `faqData` array. Replace with:
```typescript
import { getFaqItems } from "@/lib/content";

const faqItems = await getFaqItems();
```

Map `DbFaqItem` to the existing UI: `getLocalizedField(item, "question", locale)` for question, same for answer. Keep category filtering.

- [ ] **Step 2: Update Sertifikalar page + CertificatesClient**

The page at `sertifikalar/page.tsx` delegates to `CertificatesClient.tsx` which imports from `@/data/certificates`. Convert the page to a server component that fetches data:

```typescript
// sertifikalar/page.tsx (server component)
import { getCertificates } from "@/lib/content";
import CertificatesClient from "@/components/pages/CertificatesClient";

export default async function Page({ params }) {
  const certificates = await getCertificates();
  return <CertificatesClient certificates={certificates} />;
}
```

Update `CertificatesClient.tsx`: remove static import, accept `certificates` as prop.

- [ ] **Step 3: Update Fuarlar page + TradeShowsClient**

Same pattern: server page fetches `getTradeShows()`, passes to `TradeShowsClient` as prop.

- [ ] **Step 4: Update Kaynaklar page + ResourcesClient**

Same pattern: server page fetches `getResources()`, passes to `ResourcesClient` as prop.

Also update `src/app/api/resources/download/route.ts` — replace `import { resources } from "@/data/resources"` with a Supabase query on the `resources` table.

- [ ] **Step 5: Update Ambalaj Sozlugu page**

Replace stub content with full glossary UI:
```typescript
import { getGlossaryTerms } from "@/lib/content";

const terms = await getGlossaryTerms();
```

Build alphabetical listing with letter tabs (A-Z), term cards with definitions.

- [ ] **Step 6: Update Kariyer page**

Replace hardcoded `positions[]` with `getCareerListings()`.
Replace hardcoded `perks[]` with `content.career_perk_*` from content_sections.

- [ ] **Step 7: Update ReferenceLogos + Testimonials**

Remove import from `src/data/references.ts`. Replace with `getReferences()`.
Update Testimonials hardcoded `referenceCompanies[]` to use references from DB.

- [ ] **Step 8: Verify all data-driven pages**

Navigate to SSS, Sertifikalar, Fuarlar, Kaynaklar, Ambalaj Sozlugu, Kariyer, Referanslar in both TR and EN.

- [ ] **Step 9: Commit**

```bash
git add src/app/[locale]/sss/ src/app/[locale]/sertifikalar/ src/app/[locale]/fuarlar/ src/app/[locale]/kaynaklar/ src/app/[locale]/ambalaj-sozlugu/ src/app/[locale]/kariyer/ src/components/ui/ReferenceLogos.tsx src/components/sections/Testimonials.tsx
git commit -m "feat: data-driven pages read from DB instead of static files"
```

---

## Chunk 6: Auto-Translation + Cleanup

### Task 14: Google Translate API Integration

**Files:**
- Create: `src/lib/translate.ts`
- Create: `src/app/api/admin/translate/route.ts`

- [ ] **Step 1: Create translate utility**

`src/lib/translate.ts`:

```typescript
const GOOGLE_TRANSLATE_API_KEY = process.env.GOOGLE_TRANSLATE_API_KEY;
const TARGET_LOCALES = ["ar", "ru", "fr", "de", "es", "zh", "ja", "ko", "pt"];

export async function translateTexts(
  texts: string[],
  targetLocale: string,
  sourceLocale: string = "tr"
): Promise<string[]> {
  if (!GOOGLE_TRANSLATE_API_KEY) {
    console.warn("GOOGLE_TRANSLATE_API_KEY not set, skipping translation");
    return texts;
  }

  const url = `https://translation.googleapis.com/language/v2?key=${GOOGLE_TRANSLATE_API_KEY}`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      q: texts,
      source: sourceLocale,
      target: targetLocale,
      format: "text",
    }),
  });

  const result = await response.json();
  return result.data?.translations?.map((t: { translatedText: string }) => t.translatedText) ?? texts;
}

export { TARGET_LOCALES };
```

- [ ] **Step 2: Create translate API route**

`src/app/api/admin/translate/route.ts`:

POST handler:
- Auth check
- Accept: `{ source_table, source_id, fields: [{ field_name, text_tr, text_en }] }`
- For each target locale, call `translateTexts()` with TR texts
- Upsert results into `translations` table (skip rows where `is_manual = true`)
- Return: `{ success: true, translated_count }`

- [ ] **Step 3: Integrate translation trigger into admin save handlers**

After successful save in `/api/admin/pages/route.ts` PUT handler, call the translate endpoint for each modified section.

Similarly add to other admin save endpoints (certificates, tradeshows, resources, glossary, faq, career).

- [ ] **Step 4: Update getLocalizedField() to check translations table**

In `src/lib/content.ts`, update `getLocalizedField()`:

```typescript
export async function getLocalizedField(
  item: Record<string, unknown>,
  field: string,
  locale: string,
  sourceTable?: string
): Promise<string> {
  if (locale === "tr") return (item[`${field}_tr`] as string) ?? "";
  if (locale === "en") return (item[`${field}_en`] as string) ?? "";

  // Check translations table for other locales
  if (sourceTable && item.id) {
    const supabase = getSupabase();
    const { data } = await supabase
      .from("translations")
      .select("translated_text")
      .eq("source_table", sourceTable)
      .eq("source_id", item.id as string)
      .eq("field_name", field)
      .eq("locale", locale)
      .single();

    if (data?.translated_text) return data.translated_text;
  }

  // Fallback to EN
  return (item[`${field}_en`] as string) ?? (item[`${field}_tr`] as string) ?? "";
}
```

- [ ] **Step 5: Add GOOGLE_TRANSLATE_API_KEY to .env.example**

Add `GOOGLE_TRANSLATE_API_KEY=` to `.env.example`.

- [ ] **Step 6: Verify translation flow**

1. Set GOOGLE_TRANSLATE_API_KEY in .env.local
2. Edit a page content in /admin/pages, save
3. Check translations table in Supabase Studio — should have 9 rows per field
4. Navigate to the page in French (fr) locale — should show translated content

- [ ] **Step 7: Commit**

```bash
git add src/lib/translate.ts src/app/api/admin/translate/ src/lib/content.ts .env.example
git commit -m "feat: Google Translate API integration for auto-translation to 9 locales"
```

### Task 15: Fix Locale Mismatch in Existing Translations Admin

**Files:**
- Modify: `src/app/admin/translations/page.tsx`
- Modify: `src/app/api/admin/translations/route.ts`

- [ ] **Step 1: Update SUPPORTED_LOCALES**

In both files, replace `it` (Italian) with `ko` (Korean) and add `pt` (Portuguese) to match `src/lib/locales.ts`.

- [ ] **Step 2: Commit**

```bash
git add src/app/admin/translations/page.tsx src/app/api/admin/translations/route.ts
git commit -m "fix: sync translation page locales with locales.ts (add ko, pt; remove it)"
```

### Task 16: Delete Static Data Files + Cleanup

**Files:**
- Delete: `src/data/certificates.ts`
- Delete: `src/data/trade-shows.ts`
- Delete: `src/data/resources.ts`
- Delete: `src/data/references.ts`
- Delete: `src/data/milestones.ts`

- [ ] **Step 1: Verify no remaining imports**

Search the codebase for imports from deleted files:
```bash
grep -r "from.*data/certificates" src/
grep -r "from.*data/trade-shows" src/
grep -r "from.*data/resources" src/
grep -r "from.*data/references" src/
grep -r "from.*data/milestones" src/
```

If any imports remain, update them to use `src/lib/content.ts` fetchers.

- [ ] **Step 2: Delete files**

```bash
rm src/data/certificates.ts src/data/trade-shows.ts src/data/resources.ts src/data/references.ts src/data/milestones.ts
```

- [ ] **Step 3: Clean up JSON translation files**

Remove page content keys from `src/locales/tr.json` and `src/locales/en.json` that are now in the DB. Keep only:
- `nav.*` (navigation labels)
- `common.*` (buttons, UI chrome)
- `products.*` / `productData.*` (product page UI)
- `dealer.*` (portal UI)
- `footer.*` (footer labels like "Quick Links", copyright)
- Form labels and placeholders
- Error messages

Remove:
- `home.heroHeading`, `home.heroSubtext`, etc. (now in content_sections)
- `about.storyP1`, `about.storyP2`, etc.
- `homeFeatures.*`, `homeStrengths.*`, `homeSectors.*`
- Any other keys that map to content now in DB

- [ ] **Step 4: Verify build**

Run: `npm run build`
Expected: Build succeeds with no errors. No broken references to deleted files.

- [ ] **Step 5: Verify all pages**

Navigate through all pages in TR and EN. Confirm nothing is broken.

- [ ] **Step 6: Final commit**

```bash
git add -A
git commit -m "feat: remove static data files, clean up translation JSON — full CMS migration complete"
```

### Task 17: Deploy to VPS

- [ ] **Step 1: Push and deploy**

```bash
git push origin master
bash deploy.sh "Full CMS: admin-managed content migration"
```

- [ ] **Step 2: Run migrations on production Supabase**

Execute `docs/supabase-migrations/014_cms_content_tables.sql` on the production Supabase instance.

- [ ] **Step 3: Run seed scripts on production**

```bash
node scripts/seed-cms-settings.mjs
node scripts/seed-cms-content.mjs
node scripts/seed-cms-static-data.mjs
```

- [ ] **Step 4: Verify production**

Navigate to `https://www.kismetplastik.com/test/tr` and verify:
- Homepage stats show correct values
- Footer shows DB contact info
- SSS page loads FAQ from DB
- Admin panel /admin/pages works
- Admin panel /admin/settings shows stats group
- Admin panel /admin/glossary works

---

## Dependency Graph

```
Chunk 1 (DB + Seed) ──→ Chunk 2 (Utility Lib) ──→ Chunk 3 (Admin Pages)
                                                  ──→ Chunk 4 (Frontend: Home)
                                                  ──→ Chunk 5 (Frontend: All Pages)
                                                       ──→ Chunk 6 (Translation + Cleanup)
```

Chunks 3, 4, 5 can run in parallel after Chunk 2 is complete.
Chunk 6 depends on all previous chunks.
