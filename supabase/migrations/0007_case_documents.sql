-- Dosya evrakları (vekaletname, dilekçe vb.) — özel/gizli storage bucket
-- ve bunları dosyayla ilişkilendiren tablo. "media" bucket'ının aksine
-- burası public DEĞİL: yalnızca giriş yapmış personel (is_staff())
-- erişebilir, görüntüleme imzalı (signed) URL üzerinden yapılır.

insert into storage.buckets (id, name, public)
values ('case-documents', 'case-documents', false)
on conflict (id) do nothing;

create policy "case-documents: staff can view" on storage.objects
  for select using (bucket_id = 'case-documents' and public.is_staff());

create policy "case-documents: staff can upload" on storage.objects
  for insert with check (bucket_id = 'case-documents' and public.is_staff());

create policy "case-documents: staff can delete" on storage.objects
  for delete using (bucket_id = 'case-documents' and public.is_staff());

-- ============================================================
-- case_documents — dosyaya yüklenen evrakların kaydı
-- ============================================================
create table public.case_documents (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references public.cases (id) on delete cascade,
  name text not null,
  file_path text not null,
  file_size bigint,
  uploaded_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now()
);

alter table public.case_documents enable row level security;

create policy "case_documents: staff full access" on public.case_documents
  for all using (public.is_staff()) with check (public.is_staff());

create index case_documents_case_id_idx on public.case_documents (case_id);
