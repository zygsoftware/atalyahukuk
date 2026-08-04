-- Opsiyonel örnek galeri içeriği — sitede kullanılan stok fotoğrafları
-- galeriye ekler. İsterseniz Supabase SQL Editor'de çalıştırın, istemezseniz
-- atlayın (siteyi bozmaz). Kendi fotoğraflarınızı ekledikten sonra bu
-- örnekleri /admin/galeri panelinden silebilirsiniz.

insert into public.gallery_images (image_url, caption_tr, caption_en, category, sort_order, is_active)
values
  ('/images/stock/gallery-1-colleagues.jpg', 'Ofisimizden bir çalışma anı', 'A working moment from our office', 'ofis', 1, true),
  ('/images/stock/gallery-2-justice.jpg', 'Danışmanlık görüşmesi', 'Consultation meeting', 'etkinlik', 2, true),
  ('/images/stock/gallery-3-consultation.jpg', 'Müvekkil görüşmesi', 'Client consultation', 'etkinlik', 3, true);
