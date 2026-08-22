-- Floating iletişim butonlarında Telegram'ı da gösterebilmek için.
alter table public.site_settings
  add column telegram_url text;
