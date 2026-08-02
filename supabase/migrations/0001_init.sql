-- Atalya Hukuk Bürosu — başlangıç şeması
-- Tablolar, tetikleyiciler ve Row Level Security (RLS) politikaları

create extension if not exists pgcrypto;

-- ============================================================
-- profiles — yönetim paneli kullanıcıları (admin / editor)
-- ============================================================
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null,
  role text not null default 'editor' check (role in ('admin', 'editor')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- auth.users tablosuna her yeni kullanıcı eklendiğinde otomatik profil oluşturur
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.email),
    coalesce(new.raw_user_meta_data ->> 'role', 'editor')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Recursive RLS'ten kaçınmak için security definer yardımcı fonksiyonlar
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

create or replace function public.is_staff()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles where id = auth.uid()
  );
$$;

create policy "profiles: staff can view all" on public.profiles
  for select using (public.is_staff());

create policy "profiles: admin can update" on public.profiles
  for update using (public.is_admin());

create policy "profiles: admin can delete" on public.profiles
  for delete using (public.is_admin());

-- ============================================================
-- ortak: updated_at otomatik güncelleme
-- ============================================================
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ============================================================
-- posts — blog / makale
-- ============================================================
create table public.posts (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title_tr text not null,
  title_en text,
  excerpt_tr text,
  excerpt_en text,
  content_tr text not null default '',
  content_en text,
  cover_image_url text,
  status text not null default 'draft' check (status in ('draft', 'published')),
  meta_title text,
  meta_description text,
  author_id uuid references public.profiles (id) on delete set null,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.posts enable row level security;

create trigger posts_set_updated_at
  before update on public.posts
  for each row execute function public.set_updated_at();

create policy "posts: public can view published" on public.posts
  for select using (status = 'published');

create policy "posts: staff can view all" on public.posts
  for select using (public.is_staff());

create policy "posts: staff can insert" on public.posts
  for insert with check (public.is_staff());

create policy "posts: staff can update" on public.posts
  for update using (public.is_staff());

create policy "posts: staff can delete" on public.posts
  for delete using (public.is_staff());

create index posts_status_published_at_idx on public.posts (status, published_at desc);

-- ============================================================
-- announcements — duyurular
-- ============================================================
create table public.announcements (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title_tr text not null,
  title_en text,
  content_tr text not null default '',
  content_en text,
  is_pinned boolean not null default false,
  is_active boolean not null default true,
  published_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.announcements enable row level security;

create trigger announcements_set_updated_at
  before update on public.announcements
  for each row execute function public.set_updated_at();

create policy "announcements: public can view active" on public.announcements
  for select using (is_active = true);

create policy "announcements: staff can view all" on public.announcements
  for select using (public.is_staff());

create policy "announcements: staff can insert" on public.announcements
  for insert with check (public.is_staff());

create policy "announcements: staff can update" on public.announcements
  for update using (public.is_staff());

create policy "announcements: staff can delete" on public.announcements
  for delete using (public.is_staff());

create index announcements_active_pinned_idx
  on public.announcements (is_active, is_pinned desc, published_at desc);

-- ============================================================
-- clients — müvekkil kayıtları (yalnızca dahili, herkese kapalı)
-- ============================================================
create table public.clients (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone text,
  email text,
  practice_area text,
  note text,
  status text not null default 'aktif' check (status in ('aktif', 'pasif', 'arsiv')),
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.clients enable row level security;

create trigger clients_set_updated_at
  before update on public.clients
  for each row execute function public.set_updated_at();

create policy "clients: staff full access" on public.clients
  for all using (public.is_staff()) with check (public.is_staff());

create index clients_status_idx on public.clients (status, created_at desc);

-- ============================================================
-- contact_messages — iletişim formu kayıtları
-- (yazma yalnızca sunucu tarafında service-role ile yapılır; RLS'te insert
--  politikası bilinçli olarak tanımlanmamıştır)
-- ============================================================
create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  message text not null,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.contact_messages enable row level security;

create policy "contact_messages: staff can view" on public.contact_messages
  for select using (public.is_staff());

create policy "contact_messages: staff can update" on public.contact_messages
  for update using (public.is_staff());

create policy "contact_messages: staff can delete" on public.contact_messages
  for delete using (public.is_staff());

-- ============================================================
-- site_settings — herkese açık iletişim/ofis bilgileri (tek satır)
-- ============================================================
create table public.site_settings (
  id smallint primary key default 1,
  phone text,
  email text,
  address_tr text,
  address_en text,
  working_hours_tr text,
  working_hours_en text,
  instagram_url text,
  linkedin_url text,
  updated_at timestamptz not null default now(),
  constraint single_row check (id = 1)
);

alter table public.site_settings enable row level security;

create trigger site_settings_set_updated_at
  before update on public.site_settings
  for each row execute function public.set_updated_at();

create policy "site_settings: public can view" on public.site_settings
  for select using (true);

create policy "site_settings: admin can update" on public.site_settings
  for update using (public.is_admin());

insert into public.site_settings (id, phone, email, address_tr, address_en, working_hours_tr, working_hours_en)
values (
  1,
  '+90 (000) 000 00 00',
  'info@atalyahukuk.com',
  '[Adres bilgisi yönetim panelinden güncellenecek]',
  '[Address to be updated from the admin panel]',
  'Pazartesi - Cuma, 09:00 - 18:00',
  'Monday - Friday, 9:00 AM - 6:00 PM'
);

-- ============================================================
-- storage — blog kapak görselleri için herkese açık "media" bucket
-- ============================================================
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

create policy "media: public can view" on storage.objects
  for select using (bucket_id = 'media');

create policy "media: staff can upload" on storage.objects
  for insert with check (bucket_id = 'media' and public.is_staff());

create policy "media: staff can update" on storage.objects
  for update using (bucket_id = 'media' and public.is_staff());

create policy "media: staff can delete" on storage.objects
  for delete using (bucket_id = 'media' and public.is_staff());
