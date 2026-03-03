-- ============================================
-- Kismet Plastik - Veritabani Sema
-- Supabase SQL Editor'de calistirin
-- ============================================

-- UUID extension
create extension if not exists "uuid-ossp";

-- ============================================
-- 1. CATEGORIES
-- ============================================
create table public.categories (
  id         uuid primary key default uuid_generate_v4(),
  slug       text unique not null,
  name       text not null,
  description text not null default '',
  product_count int not null default 0,
  icon       text,
  created_at timestamptz not null default now()
);

-- ============================================
-- 2. PRODUCTS
-- ============================================
create table public.products (
  id                uuid primary key default uuid_generate_v4(),
  slug              text unique not null,
  name              text not null,
  category_slug     text not null references public.categories(slug) on update cascade,
  description       text not null default '',
  short_description text not null default '',
  volume            text,
  weight            text,
  neck_diameter     text,
  height            text,
  diameter          text,
  material          text not null default '',
  colors            text[] not null default '{}',
  color_codes       jsonb,
  model             text,
  shape             text,
  surface_type      text,
  compatible_caps   text[],
  min_order         int not null default 1,
  in_stock          boolean not null default true,
  featured          boolean not null default false,
  specs             jsonb not null default '[]',
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index idx_products_category on public.products(category_slug);
create index idx_products_featured on public.products(featured) where featured = true;

-- ============================================
-- 3. BLOG_POSTS
-- ============================================
create table public.blog_posts (
  id         uuid primary key default uuid_generate_v4(),
  slug       text unique not null,
  title      text not null,
  excerpt    text not null default '',
  content    text[] not null default '{}',
  category   text not null default '',
  date       text not null default '',
  read_time  text not null default '',
  featured   boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_blog_posts_featured on public.blog_posts(featured) where featured = true;

-- ============================================
-- 4. PROFILES (auth.users ile bagli)
-- ============================================
create table public.profiles (
  id              uuid primary key references auth.users(id) on delete cascade,
  email           text,
  full_name       text,
  phone           text,
  company_name    text,
  tax_number      text,
  tax_office      text,
  company_address text,
  city            text,
  district        text,
  role            text not null default 'customer' check (role in ('customer', 'dealer', 'admin')),
  is_approved     boolean not null default false,
  created_at      timestamptz not null default now()
);

create index idx_profiles_role on public.profiles(role);

-- Yeni kullanici kaydolunca otomatik profil olustur
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', '')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================
-- 5. ORDERS
-- ============================================
create table public.orders (
  id               uuid primary key default uuid_generate_v4(),
  profile_id       uuid not null references public.profiles(id) on delete cascade,
  order_number     text unique not null default '',
  status           text not null default 'pending' check (status in ('pending','confirmed','preparing','shipped','delivered','cancelled')),
  shipping_address text,
  billing_address  text,
  subtotal         numeric(12,2) not null default 0,
  tax_amount       numeric(12,2) not null default 0,
  shipping_cost    numeric(12,2) not null default 0,
  total_amount     numeric(12,2) not null default 0,
  payment_method   text not null default 'havale',
  payment_status   text not null default 'pending' check (payment_status in ('pending','paid','refunded')),
  notes            text,
  created_at       timestamptz not null default now()
);

create index idx_orders_profile on public.orders(profile_id);
create index idx_orders_status on public.orders(status);

-- Siparis numarasi otomatik olustur: KP-2026-00001
create or replace function public.generate_order_number()
returns trigger as $$
declare
  yr text;
  seq int;
begin
  yr := to_char(now(), 'YYYY');
  select count(*) + 1 into seq
    from public.orders
    where to_char(created_at, 'YYYY') = yr;
  new.order_number := 'KP-' || yr || '-' || lpad(seq::text, 5, '0');
  return new;
end;
$$ language plpgsql security definer;

create trigger trg_order_number
  before insert on public.orders
  for each row execute function public.generate_order_number();

-- ============================================
-- 6. ORDER_ITEMS
-- ============================================
create table public.order_items (
  id           uuid primary key default uuid_generate_v4(),
  order_id     uuid not null references public.orders(id) on delete cascade,
  product_id   uuid references public.products(id) on delete set null,
  product_name text not null,
  quantity     int not null default 1,
  unit_price   numeric(12,2) not null default 0,
  total_price  numeric(12,2) not null default 0,
  notes        text
);

create index idx_order_items_order on public.order_items(order_id);

-- ============================================
-- 7. ORDER_STATUS_HISTORY
-- ============================================
create table public.order_status_history (
  id         uuid primary key default uuid_generate_v4(),
  order_id   uuid not null references public.orders(id) on delete cascade,
  new_status text not null,
  note       text,
  created_at timestamptz not null default now()
);

create index idx_order_history_order on public.order_status_history(order_id);

-- ============================================
-- 8. QUOTE_REQUESTS
-- ============================================
create table public.quote_requests (
  id           uuid primary key default uuid_generate_v4(),
  company_name text not null,
  contact_name text not null,
  email        text not null,
  phone        text not null,
  message      text,
  status       text not null default 'pending' check (status in ('pending','reviewed','replied','closed')),
  created_at   timestamptz not null default now()
);

create index idx_quotes_status on public.quote_requests(status);

-- ============================================
-- 9. QUOTE_ITEMS
-- ============================================
create table public.quote_items (
  id               uuid primary key default uuid_generate_v4(),
  quote_request_id uuid not null references public.quote_requests(id) on delete cascade,
  product_id       uuid references public.products(id) on delete set null,
  product_name     text not null,
  quantity         int not null default 1,
  notes            text
);

create index idx_quote_items_request on public.quote_items(quote_request_id);

-- ============================================
-- 10. NEWSLETTER_SUBSCRIBERS
-- ============================================
create table public.newsletter_subscribers (
  id            uuid primary key default uuid_generate_v4(),
  email         text unique not null,
  subscribed_at timestamptz not null default now()
);

-- ============================================
-- 11. GALLERY_IMAGES
-- ============================================
create table public.gallery_images (
  id             uuid primary key default uuid_generate_v4(),
  category       text not null check (category in ('uretim','urunler','etkinlikler')),
  title_tr       text not null,
  title_en       text not null default '',
  description_tr text,
  description_en text,
  image_url      text not null,
  storage_path   text not null,
  display_order  int not null default 0,
  is_active      boolean not null default true,
  created_at     timestamptz not null default now()
);

create index idx_gallery_category on public.gallery_images(category);
create index idx_gallery_active on public.gallery_images(is_active) where is_active = true;

-- ============================================
-- 12. SITE_CONTENT
-- ============================================
create table public.site_content (
  id         uuid primary key default uuid_generate_v4(),
  page_key   text unique not null,
  content    jsonb not null default '{}',
  updated_at timestamptz not null default now()
);

-- ============================================
-- UPDATED_AT TRIGGER (products, blog_posts)
-- ============================================
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_products_updated
  before update on public.products
  for each row execute function public.set_updated_at();

create trigger trg_blog_posts_updated
  before update on public.blog_posts
  for each row execute function public.set_updated_at();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Tum tablolarda RLS aktif
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.blog_posts enable row level security;
alter table public.profiles enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.order_status_history enable row level security;
alter table public.quote_requests enable row level security;
alter table public.quote_items enable row level security;
alter table public.newsletter_subscribers enable row level security;
alter table public.gallery_images enable row level security;
alter table public.site_content enable row level security;

-- ----------------------------------------
-- CATEGORIES: herkes okuyabilir
-- ----------------------------------------
create policy "categories_public_read"
  on public.categories for select
  to anon, authenticated
  using (true);

-- ----------------------------------------
-- PRODUCTS: herkes okuyabilir
-- ----------------------------------------
create policy "products_public_read"
  on public.products for select
  to anon, authenticated
  using (true);

-- ----------------------------------------
-- BLOG_POSTS: herkes okuyabilir
-- ----------------------------------------
create policy "blog_posts_public_read"
  on public.blog_posts for select
  to anon, authenticated
  using (true);

-- ----------------------------------------
-- PROFILES: kendi profilini okuma/guncelleme
-- ----------------------------------------
create policy "profiles_own_read"
  on public.profiles for select
  to authenticated
  using (auth.uid() = id);

create policy "profiles_own_update"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- ----------------------------------------
-- ORDERS: kendi siparislerini okuma
-- ----------------------------------------
create policy "orders_own_read"
  on public.orders for select
  to authenticated
  using (profile_id = auth.uid());

create policy "orders_own_insert"
  on public.orders for insert
  to authenticated
  with check (profile_id = auth.uid());

-- ----------------------------------------
-- ORDER_ITEMS: kendi siparis kalemlerini okuma
-- ----------------------------------------
create policy "order_items_own_read"
  on public.order_items for select
  to authenticated
  using (
    order_id in (
      select id from public.orders where profile_id = auth.uid()
    )
  );

create policy "order_items_own_insert"
  on public.order_items for insert
  to authenticated
  with check (
    order_id in (
      select id from public.orders where profile_id = auth.uid()
    )
  );

-- ----------------------------------------
-- ORDER_STATUS_HISTORY: kendi siparis gecmisi
-- ----------------------------------------
create policy "order_history_own_read"
  on public.order_status_history for select
  to authenticated
  using (
    order_id in (
      select id from public.orders where profile_id = auth.uid()
    )
  );

create policy "order_history_insert"
  on public.order_status_history for insert
  to authenticated
  with check (
    order_id in (
      select id from public.orders where profile_id = auth.uid()
    )
  );

-- ----------------------------------------
-- QUOTE_REQUESTS: herkes olusturabilir
-- ----------------------------------------
create policy "quotes_public_insert"
  on public.quote_requests for insert
  to anon, authenticated
  with check (true);

-- ----------------------------------------
-- QUOTE_ITEMS: herkes olusturabilir
-- ----------------------------------------
create policy "quote_items_public_insert"
  on public.quote_items for insert
  to anon, authenticated
  with check (true);

-- ----------------------------------------
-- NEWSLETTER: herkes kayit olabilir
-- ----------------------------------------
create policy "newsletter_public_insert"
  on public.newsletter_subscribers for insert
  to anon, authenticated
  with check (true);

create policy "newsletter_public_read"
  on public.newsletter_subscribers for select
  to anon, authenticated
  using (true);

-- ----------------------------------------
-- GALLERY_IMAGES: herkes aktif olanlari gorebilir
-- ----------------------------------------
create policy "gallery_public_read"
  on public.gallery_images for select
  to anon, authenticated
  using (is_active = true);

-- ----------------------------------------
-- SITE_CONTENT: herkes okuyabilir
-- ----------------------------------------
create policy "site_content_public_read"
  on public.site_content for select
  to anon, authenticated
  using (true);

-- ============================================
-- SERVICE ROLE FULL ACCESS
-- Admin API route'lari service_role key ile
-- calisir, RLS bypass eder (varsayilan davranis)
-- ============================================

-- ============================================
-- STORAGE: gallery bucket
-- ============================================
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'gallery',
  'gallery',
  true,
  10485760, -- 10MB
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do nothing;

-- Gallery bucket: herkes okuyabilir
create policy "gallery_storage_public_read"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'gallery');

-- Gallery bucket: authenticated kullanicilar yukleyebilir
create policy "gallery_storage_auth_insert"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'gallery');

-- Gallery bucket: authenticated kullanicilar silebilir
create policy "gallery_storage_auth_delete"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'gallery');
