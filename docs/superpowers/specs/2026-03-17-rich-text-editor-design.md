# Admin Rich Text Editor — Design Spec

**Date:** 2026-03-17
**Status:** Approved

## Goal

Replace the plain textarea in admin blog editor with a full WYSIWYG editor (TipTap). Store blog content as HTML instead of TEXT[].

## Components

### 1. RichTextEditor Component

**File:** `src/components/admin/RichTextEditor.tsx`

TipTap-based WYSIWYG editor with toolbar:
- **Block:** H2, H3, Blockquote, HorizontalRule, CodeBlock
- **Inline:** Bold, Italic, Underline, Strikethrough, Code
- **List:** BulletList, OrderedList
- **Media:** Link (URL dialog), Image (URL input for Supabase storage URLs)
- **UI:** Character count, dark mode compatible (admin dark theme)

Props:
```typescript
interface RichTextEditorProps {
  content: string;          // HTML string
  onChange: (html: string) => void;
  placeholder?: string;
}
```

Dynamic import in admin pages — not included in public bundle.

### 2. Database Migration

**File:** `docs/supabase-migrations/011_blog_content_html.sql`

```sql
-- Add HTML content column
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS content_html TEXT;

-- Migrate existing TEXT[] content to HTML paragraphs
UPDATE blog_posts
SET content_html = (
  SELECT string_agg('<p>' || elem || '</p>', E'\n')
  FROM unnest(content) AS elem
)
WHERE content IS NOT NULL AND array_length(content, 1) > 0;

-- Set empty string for null
UPDATE blog_posts SET content_html = '' WHERE content_html IS NULL;
```

Keep `content TEXT[]` column for backward compatibility. New reads/writes use `content_html`.

### 3. Admin Page Changes

**Files:** `src/app/admin/blog/[slug]/page.tsx`, `src/app/admin/blog/new/page.tsx`

- Replace `<textarea>` with `<RichTextEditor>` (dynamic import)
- Form state: `content` field stores HTML string
- Preview: render HTML directly instead of split-by-paragraph
- API calls: send `content_html` field

### 4. API Route Changes

**File:** `src/app/api/admin/blog/route.ts`

- POST/PUT: write `content_html` field
- GET: return `content_html` (fall back to joined `content` TEXT[] for old posts)

### 5. Frontend Render

**File:** `src/components/pages/BlogDetailClient.tsx`

- Read `content_html` from blog post data
- Render via `<div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />`
- Sanitize with allowlist of safe tags (p, h2, h3, strong, em, u, a, img, ul, ol, li, blockquote, code, pre, hr)
- Fallback: if `content_html` is empty, use old `content` TEXT[] paragraph render

### Packages

```
@tiptap/react
@tiptap/starter-kit
@tiptap/extension-link
@tiptap/extension-image
@tiptap/extension-underline
```

~30KB gzipped, admin-only (dynamic import).

### Styling

TipTap editor styled with Tailwind prose classes. Toolbar uses admin dark theme colors (navy bg, white icons). Active state uses amber highlight.

### Migration Plan

1. Install packages
2. Run SQL migration on VPS Supabase
3. Deploy code changes
4. Existing posts render from `content_html` (migrated from TEXT[])
5. New/edited posts write `content_html` directly

### Out of Scope

- Collaborative editing
- Version history / drafts
- Markdown import/export
- Image upload from editor (use existing blog upload, paste URL)
