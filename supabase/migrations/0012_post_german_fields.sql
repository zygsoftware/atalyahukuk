-- Add German-language fields to posts, mirroring the existing _ru columns.
-- Nullable: falls back to English (then Turkish) in the app when empty.
alter table posts add column if not exists title_de text;
alter table posts add column if not exists excerpt_de text;
alter table posts add column if not exists content_de text;
alter table posts add column if not exists meta_title_de text;
alter table posts add column if not exists meta_description_de text;
