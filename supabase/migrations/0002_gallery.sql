-- Galeri modülü — ofis/ekip/etkinlik fotoğrafları

create table public.gallery_images (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  caption_tr text,
  caption_en text,
  category text not null default 'diger' check (category in ('ofis', 'ekip', 'etkinlik', 'diger')),
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now()
);

alter table public.gallery_images enable row level security;

create policy "gallery_images: public can view active" on public.gallery_images
  for select using (is_active = true);

create policy "gallery_images: staff can view all" on public.gallery_images
  for select using (public.is_staff());

create policy "gallery_images: staff can insert" on public.gallery_images
  for insert with check (public.is_staff());

create policy "gallery_images: staff can update" on public.gallery_images
  for update using (public.is_staff());

create policy "gallery_images: staff can delete" on public.gallery_images
  for delete using (public.is_staff());

create index gallery_images_active_order_idx
  on public.gallery_images (is_active, sort_order, created_at desc);
