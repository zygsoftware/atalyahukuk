-- Footer/site ayarlarında Facebook bağlantısını da gösterebilmek için.
alter table public.site_settings
  add column facebook_url text;
