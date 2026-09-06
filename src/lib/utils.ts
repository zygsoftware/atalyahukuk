import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

const TR_MAP: Record<string, string> = {
  ç: "c",
  Ç: "c",
  ğ: "g",
  Ğ: "g",
  ı: "i",
  I: "i",
  İ: "i",
  ö: "o",
  Ö: "o",
  ş: "s",
  Ş: "s",
  ü: "u",
  Ü: "u",
};

export function slugify(input: string): string {
  const normalized = input
    .split("")
    .map((char) => TR_MAP[char] ?? char)
    .join("");

  return normalized
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Supabase Storage nesne anahtarları boşluk/Türkçe karakter/özel karakter
// içeren dosya adlarını reddediyor ("Invalid key" hatası). Yükleme öncesi
// dosya adını güvenli bir slug'a çeviririz, uzantı korunur.
export function sanitizeFileName(fileName: string): string {
  const lastDot = fileName.lastIndexOf(".");
  const hasExt = lastDot > 0 && lastDot < fileName.length - 1;
  const base = hasExt ? fileName.slice(0, lastDot) : fileName;
  const ext = hasExt
    ? fileName
        .slice(lastDot + 1)
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "")
    : "";

  const safeBase = slugify(base) || "dosya";
  return ext ? `${safeBase}.${ext}` : safeBase;
}

/**
 * Türkçe/İngilizce/Rusça alanlardan locale'e uygun olanı seçer.
 * Rusça alan boşsa İngilizce'ye, o da boşsa Türkçe'ye düşer.
 */
export function pickLocaleField<T>(
  locale: string,
  tr: T,
  en: T | null | undefined,
  ru?: T | null,
): T {
  if (locale === "tr") return tr;
  if (locale === "ru") return (ru ?? en ?? tr) as T;
  return (en ?? tr) as T;
}

const DATE_LOCALE_MAP: Record<string, string> = {
  tr: "tr-TR",
  en: "en-US",
  ru: "ru-RU",
};

export function formatDate(date: string, locale: string): string {
  return new Intl.DateTimeFormat(DATE_LOCALE_MAP[locale] ?? "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}

/** Türkiye telefon numaralarını "905056004607" gibi ülke kodlu, sadece rakamlı hale getirir. */
export function toE164Digits(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("90")) return digits;
  if (digits.startsWith("0")) return `90${digits.slice(1)}`;
  return `90${digits}`;
}

/** Boşluk/parantez içeren görüntü metnini geçerli bir tel: bağlantısına çevirir. */
export function toTelHref(phone: string): string {
  return `tel:+${toE164Digits(phone)}`;
}
