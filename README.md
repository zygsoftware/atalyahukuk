# Atalya Hukuk Bürosu — Website & Yönetim Paneli

Next.js (App Router) + Supabase ile geliştirilmiş, Türkçe/İngilizce iki dilli
kurumsal hukuk bürosu websitesi ve blog/duyuru/müvekkil yönetimi yapılabilen
bir admin panel.

## Teknoloji

- **Next.js 16** (App Router, TypeScript, Turbopack)
- **Tailwind CSS v4** — marka renkleri (bordo/gold) `src/app/globals.css` içinde `@theme` ile tanımlı
- **next-intl** — `tr` (varsayılan) ve `en` dilleri, her ikisi de URL öneki ile (`/tr/...`, `/en/...`)
- **Supabase** — Postgres veritabanı, Auth (admin girişi) ve Storage (görsel yükleme)
- **Tiptap** — blog/duyuru zengin metin editörü

## Yerel Kurulum

```bash
npm install
cp .env.example .env.local
```

`.env.local` içine kendi Supabase proje bilgilerinizi girin (aşağıya bakın),
ardından:

```bash
npm run dev
```

## Supabase Kurulumu

1. [supabase.com](https://supabase.com) üzerinde yeni bir proje oluşturun.
2. **Project Settings → API** sayfasından `Project URL`, `anon public` key ve
   `service_role` key değerlerini `.env.local` dosyasına yazın.
3. **SQL Editor**'de `supabase/migrations/` klasöründeki dosyaları sırayla
   (`0001_init.sql`, ardından `0002_gallery.sql`) çalıştırın. Bunlar tüm
   tabloları (`posts`, `announcements`, `clients`, `contact_messages`,
   `site_settings`, `profiles`, `gallery_images`), RLS politikalarını ve
   `media` storage bucket'ını oluşturur.
4. **İlk yönetici kullanıcıyı oluşturun**: Supabase Dashboard →
   Authentication → Users → "Add user" ile bir e-posta/şifre girin (Auto
   Confirm User işaretli olsun). Bu otomatik olarak `profiles` tablosunda
   `role = 'editor'` bir kayıt oluşturur (bkz. `handle_new_user` trigger).
   Ardından SQL Editor'de bu kullanıcıyı yönetici yapın:
   ```sql
   update public.profiles set role = 'admin' where id = 'BURAYA_USER_ID';
   ```
   (User ID'yi Authentication → Users listesinden kopyalayabilirsiniz.) Bu
   ilk kullanıcıdan sonrası artık `/admin/kullanicilar` panelinden
   yönetilebilir.
5. `/admin/login` adresinden bu bilgilerle giriş yapabilirsiniz.

Site ilk açıldığında iletişim bilgileri (telefon, e-posta, adres, çalışma
saatleri) placeholder değerlerle gelir. Gerçek bilgileri girmek için
`site_settings` tablosunu Supabase Dashboard'dan (Table Editor) güncelleyin —
ayrı bir arayüz istenmediyse bu tablo şu an yalnızca veritabanından
düzenlenir.

## Yönetim Paneli (`/admin`)

- **Roller**: `admin` (tüm modüller + kullanıcı yönetimi) ve `editor` (blog,
  duyuru, galeri, mesajlar — müvekkil ve kullanıcı yönetimi hariç)
- **Modüller**: Panel özeti, Blog/Makale, Duyurular, Galeri (kategori
  bazlı görsel yönetimi), Müvekkiller (yalnızca admin), Kullanıcılar
  (yalnızca admin), Mesajlar (iletişim formu kayıtları)
- `/admin` arama motorlarında indekslenmez (`robots.txt` ve `noindex` meta)

## Vercel'e Deploy

1. Bu projeyi bir GitHub reposuna gönderin (`git init`, `git add`,
   `git commit`, ardından bir GitHub reposu oluşturup push edin).
2. [vercel.com](https://vercel.com) üzerinde "New Project" ile bu reposu
   içe aktarın.
3. Environment Variables kısmına `.env.example`'daki değişkenleri girin
   (gerçek Supabase ve site URL değerleriyle; `MAINTENANCE_MODE=false`
   yeterlidir).
4. Deploy edin.
5. **Domain bağlama**: Vercel proje ayarlarından `atalyahukuk.com` domainini
   ekleyin, Vercel'in verdiği DNS kayıtlarını domain sağlayıcınızda (ör.
   Natro, GoDaddy) tanımlayın.

## Bakım Modu

Siteyi geçici olarak ziyaretçilere kapatıp bakım sayfası göstermek için:

1. Vercel → Project Settings → Environment Variables kısmında
   `MAINTENANCE_MODE` değerini `true` yapın (yoksa ekleyin) ve yeniden
   deploy edin (redeploy).
2. Tüm herkese açık sayfalar `/maintenance` sayfasına yönlenir; `/admin`
   paneli ve API rotaları etkilenmez, siz her zaman giriş yapabilirsiniz.
3. Bakım sırasında siteyi önizlemek isterseniz `MAINTENANCE_BYPASS_TOKEN`
   değişkenine gizli bir anahtar tanımlayın, ardından
   `https://siteniz.com/?bypass=ANAHTAR` adresini ziyaret edin — bu tarayıcı
   24 saat boyunca bakım sayfasını atlar.
4. Siteyi tekrar açmak için `MAINTENANCE_MODE` değerini `false` yapıp
   yeniden deploy edin.

## Klasör Yapısı

```
src/
  app/
    [locale]/          → herkese açık site (tr/en)
    admin/              → yönetim paneli (tek dil, Türkçe)
    api/contact/         → iletişim formu API route'u
    sitemap.ts, robots.ts
  components/
    site/               → herkese açık site bileşenleri
    admin/              → yönetim paneli bileşenleri
  i18n/                 → next-intl routing/navigation/request config
  lib/
    supabase/           → Supabase client/server/middleware yardımcıları + tipler
    data/                → herkese açık sayfalar için veri çekme fonksiyonları
messages/               → tr.json, en.json çeviri dosyaları
supabase/migrations/    → veritabanı şeması (SQL)
```

## Marka Renkleri

Logo görselinden örneklenen renkler `src/app/globals.css` içinde tanımlı:

- Bordo (primary): `#680A0F` (`bordo-500`)
- Gold (accent): `#A37A43` (`gold-500`)
- Krem (arka plan): `#FAF8F5`
- Antrasit (metin): `#241F1C`

## Notlar

- Blog/duyuru/hizmet sayfaları hem `/tr` hem `/en` altında farklı URL
  segmentleriyle yayınlanır (ör. `/hizmetler` ↔ `/practice-areas`) —
  eşleme `src/i18n/routing.ts` içinde tanımlıdır.
- Hizmet alanları (`/hizmetler`) şu an statik/placeholder içerik olarak
  `messages/*.json` üzerinden yönetilir; admin panelden düzenlenmez.
  İleride bu da panele taşınabilir.
