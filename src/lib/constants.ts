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
] as const;

export type ServiceSlug = (typeof SERVICE_SLUGS)[number];

export const TEAM_MEMBER_KEYS = ["member1", "member2"] as const;

export const PROCESS_STEP_KEYS = ["step1", "step2", "step3", "step4"] as const;

export const TESTIMONIAL_KEYS = ["t1", "t2", "t3"] as const;

export const FAQ_KEYS = ["f1", "f2", "f3", "f4", "f5"] as const;
