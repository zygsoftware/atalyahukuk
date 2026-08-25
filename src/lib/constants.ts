export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://atalyahukuk.com";

export const SITE_NAME = "Atalya Hukuk Bürosu";

export const NAV_ITEMS = [
  { href: "/", key: "home" },
  { href: "/hakkimizda", key: "about" },
  { href: "/hizmetler", key: "services" },
  { href: "/galeri", key: "gallery" },
  { href: "/blog", key: "blog" },
  { href: "/duyurular", key: "announcements" },
  { href: "/iletisim", key: "contact" },
] as const;

export const GALLERY_CATEGORIES = ["ofis", "ekip", "etkinlik", "diger"] as const;

export const SERVICE_SLUGS = [
  "ceza-hukuku",
  "aile-hukuku",
  "is-hukuku",
  "ticaret-hukuku",
  "gayrimenkul-hukuku",
  "icra-iflas-hukuku",
  "miras-hukuku",
  "sozlesmeler-hukuku",
  "idari-hukuku",
  "vatandaslik-basvurusu",
  "ikamet-izni",
  "uluslararasi-ticaret-gumruk",
] as const;

export type ServiceSlug = (typeof SERVICE_SLUGS)[number];

// Hizmet detay sayfası hero görselleri.
export const SERVICE_IMAGES: Record<ServiceSlug, string> = {
  "ceza-hukuku": "/images/hizmet/ceza-hukuku.jpg",
  "aile-hukuku": "/images/hizmet/aile-hukuku.jpg",
  "is-hukuku": "/images/hizmet/is-hukuku.jpg",
  "ticaret-hukuku": "/images/hizmet/ticaret-hukuku.jpg",
  "gayrimenkul-hukuku": "/images/hizmet/gayrimenkul-hukuku.jpg",
  "icra-iflas-hukuku": "/images/hizmet/icra-iflas-hukuku.jpg",
  "miras-hukuku": "/images/hizmet/miras-hukuku.jpg",
  "sozlesmeler-hukuku": "/images/hizmet/sozlesmeler-hukuku.jpg",
  // Kendine ait bir görsel eklenene kadar ofis fotoğrafı kullanılır.
  "idari-hukuku": "/images/ofis/atalya-hukuk-burosu-calisma-odasi.jpg",
  "vatandaslik-basvurusu": "/images/ofis/atalya-hukuk-burosu-calisma-odasi.jpg",
  "ikamet-izni": "/images/ofis/atalya-hukuk-burosu-calisma-odasi.jpg",
  "uluslararasi-ticaret-gumruk":
    "/images/ofis/atalya-hukuk-burosu-calisma-odasi.jpg",
};

export const TEAM_MEMBER_KEYS = ["member1", "member2", "member3"] as const;

// Gerçek ekip fotoğrafları eklendiğinde buraya /images/ofis/... yolu yazılır.
// Boş bırakılan üyeler için TeamCard baş harfli avatar gösterir.
export const TEAM_PHOTOS: Partial<Record<(typeof TEAM_MEMBER_KEYS)[number], string>> =
  {
    member1: "/images/ofis/mumtaz-kose.jpg",
    member2: "/images/ofis/furkan-yagci.png",
    member3: "/images/ofis/gurkan-yavuz.png",
  };

export const PROCESS_STEP_KEYS = ["step1", "step2", "step3", "step4"] as const;

export const FAQ_KEYS = ["f1", "f2", "f3", "f4", "f5"] as const;
