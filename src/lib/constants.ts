export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://atalyahukuk.com";

export const SITE_NAME = "Atalya Hukuk Bürosu";

export const NAV_ITEMS = [
  { href: "/", key: "home" },
  { href: "/hakkimizda", key: "about" },
  { href: "/hizmetler", key: "services" },
  { href: "/blog", key: "blog" },
  { href: "/duyurular", key: "announcements" },
  { href: "/iletisim", key: "contact" },
] as const;

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
