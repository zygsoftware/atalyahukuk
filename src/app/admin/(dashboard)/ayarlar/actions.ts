"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/supabase/auth-helpers";
import { createClient } from "@/lib/supabase/server";

export async function updateSiteSettings(formData: FormData) {
  await requireAdmin();
  const supabase = await createClient();

  const fields = {
    phone: (formData.get("phone") as string) || null,
    email: (formData.get("email") as string) || null,
    address_tr: (formData.get("address_tr") as string) || null,
    address_en: (formData.get("address_en") as string) || null,
    working_hours_tr: (formData.get("working_hours_tr") as string) || null,
    working_hours_en: (formData.get("working_hours_en") as string) || null,
    facebook_url: (formData.get("facebook_url") as string) || null,
    instagram_url: (formData.get("instagram_url") as string) || null,
    linkedin_url: (formData.get("linkedin_url") as string) || null,
    telegram_url: (formData.get("telegram_url") as string) || null,
    maintenance_mode: formData.get("maintenance_mode") === "on",
  };

  const { error } = await supabase
    .from("site_settings")
    .update(fields)
    .eq("id", 1);
  if (error) throw new Error(error.message);

  // Herkese açık sayfalar cookie'siz "static" client ile çekildiği için
  // Next.js'in veri önbelleğini de temizlememiz gerekiyor.
  revalidatePath("/", "layout");
  revalidatePath("/admin/ayarlar");
}
