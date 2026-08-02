import { createClient } from "@/lib/supabase/server";

export async function getSiteSettings() {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("site_settings")
      .select("*")
      .eq("id", 1)
      .single();

    return data;
  } catch {
    return null;
  }
}
