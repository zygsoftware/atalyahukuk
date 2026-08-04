// Türkiye 2016'dan beri DST uygulamıyor, sabit UTC+3.
export const TR_TIME_ZONE = "Europe/Istanbul";

export function trDateTimeToISO(date: string, time: string) {
  return new Date(`${date}T${time}:00+03:00`).toISOString();
}

export function toTRDateKey(isoOrDate: string | Date) {
  const d = typeof isoOrDate === "string" ? new Date(isoOrDate) : isoOrDate;
  return d.toLocaleDateString("en-CA", { timeZone: TR_TIME_ZONE });
}
