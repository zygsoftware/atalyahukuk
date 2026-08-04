import { createStaticClient } from "@/lib/supabase/static";

export async function getSiteSettings() {
  try {
    const supabase = createStaticClient();
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
