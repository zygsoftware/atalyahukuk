import { createStaticClient } from "@/lib/supabase/static";

export async function getActiveGalleryImages() {
  try {
    const supabase = createStaticClient();
    const { data } = await supabase
      .from("gallery_images")
      .select("id, image_url, caption_tr, caption_en, category")
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });

    return data ?? [];
  } catch {
    return [];
  }
}
