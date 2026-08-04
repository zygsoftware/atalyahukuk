import type { CaseStatus, HearingStatus } from "@/lib/supabase/types";

export const CASE_STATUS_LABEL: Record<CaseStatus, string> = {
  acik: "Açık",
  kapali: "Kapalı",
  beklemede: "Beklemede",
};

export const HEARING_STATUS_LABEL: Record<HearingStatus, string> = {
  planlandi: "Planlandı",
  tamamlandi: "Tamamlandı",
  ertelendi: "Ertelendi",
};

export const PRACTICE_AREA_LABEL: Record<string, string> = {
  "ceza-hukuku": "Ceza Hukuku",
  "aile-hukuku": "Aile Hukuku",
  "is-hukuku": "İş Hukuku",
  "ticaret-hukuku": "Ticaret ve Şirketler Hukuku",
  "gayrimenkul-hukuku": "Gayrimenkul Hukuku",
  "icra-iflas-hukuku": "İcra ve İflas Hukuku",
  "miras-hukuku": "Miras Hukuku",
  "sozlesmeler-hukuku": "Sözleşmeler Hukuku",
};
