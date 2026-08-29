-- Duyurular (announcements) artık ayrı bir modül değil; Blog ile birleştirildi.
-- Blog'un "öne çıkarma" ihtiyacını karşılamak için posts'a is_pinned eklenir.
alter table public.posts
  add column is_pinned boolean not null default false;

-- Not: Mevcut "announcements" tablosu kasıtlı olarak silinmiyor (geri dönüş
-- güvenliği için). İçindeki tek kayıt bu migration'ın ardından çalıştırılan
-- bir betikle posts'a taşındı. Verinin posts'ta doğru göründüğünü teyit
-- ettikten sonra dilerseniz şu komutla kaldırabilirsiniz:
--   drop table public.announcements;
