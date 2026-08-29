-- Birleştirilen Blog modülünde yazının "Blog" mu yoksa "Duyuru" mu olduğunu
-- ayırt etmek için kategori alanı. Mevcut tüm kayıtlar varsayılan olarak
-- 'blog' kabul edilir.
alter table public.posts
  add column category text not null default 'blog'
    check (category in ('blog', 'duyuru'));

-- Daha önce announcements'tan taşınan tek kayıt "duyuru" olarak işaretlenir.
update public.posts
set category = 'duyuru'
where slug = 'satilan-evde-kira-bedeli-kime-ait-yargitay-dan-onemli-karar';
