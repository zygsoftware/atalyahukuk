import {
  Gavel,
  HeartHandshake,
  Briefcase,
  Building2,
  Home,
  Landmark,
  ScrollText,
  FileSignature,
  Scale,
  Stamp,
  IdCard,
  Globe,
  type LucideIcon,
} from "lucide-react";
import type { ServiceSlug } from "@/lib/constants";

export const SERVICE_ICONS: Record<ServiceSlug, LucideIcon> = {
  "ceza-hukuku": Gavel,
  "aile-hukuku": HeartHandshake,
  "is-hukuku": Briefcase,
  "ticaret-hukuku": Building2,
  "gayrimenkul-hukuku": Home,
  "icra-iflas-hukuku": Landmark,
  "miras-hukuku": ScrollText,
  "sozlesmeler-hukuku": FileSignature,
  "idari-hukuku": Scale,
  "vatandaslik-basvurusu": Stamp,
  "ikamet-izni": IdCard,
  "uluslararasi-ticaret-gumruk": Globe,
};
