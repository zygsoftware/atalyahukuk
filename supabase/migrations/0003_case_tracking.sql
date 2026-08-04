-- Müvekkil takip sistemi — dosyalar, duruşmalar, hatırlatmalar

-- ============================================================
-- cases — müvekkile ait dava/dosyalar
-- ============================================================
create table public.cases (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients (id) on delete cascade,
  title text not null,
  case_number text,
  practice_area text,
  court text,
  status text not null default 'acik' check (status in ('acik', 'kapali', 'beklemede')),
  opened_date date not null default current_date,
  closed_date date,
  note text,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.cases enable row level security;

create trigger cases_set_updated_at
  before update on public.cases
  for each row execute function public.set_updated_at();

create policy "cases: staff full access" on public.cases
  for all using (public.is_staff()) with check (public.is_staff());

create index cases_client_id_idx on public.cases (client_id);
create index cases_status_idx on public.cases (status);

-- ============================================================
-- hearings — dosyaya ait duruşmalar
-- ============================================================
create table public.hearings (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references public.cases (id) on delete cascade,
  hearing_date timestamptz not null,
  title text,
  location text,
  status text not null default 'planlandi' check (status in ('planlandi', 'tamamlandi', 'ertelendi')),
  outcome_note text,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.hearings enable row level security;

create trigger hearings_set_updated_at
  before update on public.hearings
  for each row execute function public.set_updated_at();

create policy "hearings: staff full access" on public.hearings
  for all using (public.is_staff()) with check (public.is_staff());

create index hearings_case_id_idx on public.hearings (case_id);
create index hearings_hearing_date_idx on public.hearings (hearing_date);

-- ============================================================
-- reminders — genel veya müvekkil/dosya bazlı hatırlatmalar
-- ============================================================
create table public.reminders (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  due_date timestamptz not null,
  client_id uuid references public.clients (id) on delete set null,
  case_id uuid references public.cases (id) on delete set null,
  is_done boolean not null default false,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now()
);

alter table public.reminders enable row level security;

create policy "reminders: staff full access" on public.reminders
  for all using (public.is_staff()) with check (public.is_staff());

create index reminders_due_date_idx on public.reminders (due_date);
create index reminders_is_done_idx on public.reminders (is_done);
