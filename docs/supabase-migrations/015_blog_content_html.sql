-- Add HTML content column for rich text editor
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
