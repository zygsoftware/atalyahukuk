-- meta_title/meta_description alanları TR ve EN arasında paylaşılıyordu;
-- meta_title_ru gibi EN için de ayrı bir alan olmadığından, meta_title Türkçe
-- girildiğinde İngilizce sayfada da Türkçe SEO başlığı/açıklaması gösteriliyordu.
-- meta_title_ru ile aynı desende EN'e özel alanlar eklenir.
alter table public.posts
  add column meta_title_en text,
  add column meta_description_en text;
