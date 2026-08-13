-- Bakım modunu artık admin panelinden (veritabanından) anlık açıp kapatabilmek için.
-- Öncesinde yalnızca Vercel ortam değişkeni ile kontrol ediliyordu (her değişiklik
-- için yeniden deploy gerekiyordu). MAINTENANCE_MODE ortam değişkeni artık yalnızca
-- acil durum "hard kill switch" olarak korunuyor; normal kullanımda bu sütun geçerli.
alter table public.site_settings
  add column maintenance_mode boolean not null default false;
