-- Add Russian-language fields to posts, mirroring the existing _en columns.
-- Nullable: falls back to English (then Turkish) in the app when empty.
alter table posts add column if not exists title_ru text;
alter table posts add column if not exists excerpt_ru text;
alter table posts add column if not exists content_ru text;
alter table posts add column if not exists meta_title_ru text;
alter table posts add column if not exists meta_description_ru text;
