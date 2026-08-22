-- Müvekkil ücretlendirme — nispi oran ve maktu tahsilat bilgileri

-- Nispi (yüzdelik) oran ve maktu ücretin "tahsil edilen" kısmı tekil
-- değerler olduğu için doğrudan clients tablosuna eklenir.
alter table public.clients
  add column nispi_oran numeric(5, 2),
  add column maktu_tahsil_edilen_tutar numeric(12, 2),
  add column maktu_tahsil_edilen_tarih date;

-- ============================================================
-- client_installments — maktu ücretin vadeli "tahsil edilecek" kısmı.
-- Vade sayısı değişken olduğu için ayrı bir tabloda, her vade kendi
-- tutarı ve tarihiyle bir satır olarak tutulur.
-- ============================================================
create table public.client_installments (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients (id) on delete cascade,
  amount numeric(12, 2) not null,
  due_date date not null,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now()
);

alter table public.client_installments enable row level security;

create policy "client_installments: staff full access" on public.client_installments
  for all using (public.is_staff()) with check (public.is_staff());

create index client_installments_client_id_idx on public.client_installments (client_id);
create index client_installments_due_date_idx on public.client_installments (due_date);
