import { createStaticClient } from "@/lib/supabase/static";

export async function getActiveAnnouncements() {
  try {
    const supabase = createStaticClient();
    const { data } = await supabase
      .from("announcements")
      .select("id, slug, title_tr, title_en, is_pinned, published_at")
      .eq("is_active", true)
      .order("is_pinned", { ascending: false })
      .order("published_at", { ascending: false });

    return data ?? [];
  } catch {
    return [];
  }
}

export async function getActiveAnnouncementBySlug(slug: string) {
  try {
    const supabase = createStaticClient();
    const { data } = await supabase
      .from("announcements")
      .select("*")
      .eq("is_active", true)
      .eq("slug", slug)
      .single();

    return data;
  } catch {
    return null;
  }
}

export async function getActiveAnnouncementSlugs() {
  try {
    const supabase = createStaticClient();
    const { data } = await supabase
      .from("announcements")
      .select("slug")
      .eq("is_active", true);

    return (data ?? []).map((row) => row.slug);
  } catch {
    return [];
  }
}
