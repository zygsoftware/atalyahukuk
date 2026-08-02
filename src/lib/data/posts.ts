import { createClient } from "@/lib/supabase/server";

export async function getPublishedPosts() {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("posts")
      .select(
        "id, slug, title_tr, title_en, excerpt_tr, excerpt_en, cover_image_url, published_at",
      )
      .eq("status", "published")
      .order("published_at", { ascending: false });

    return data ?? [];
  } catch {
    return [];
  }
}

export async function getPublishedPostBySlug(slug: string) {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("posts")
      .select("*")
      .eq("status", "published")
      .eq("slug", slug)
      .single();

    return data;
  } catch {
    return null;
  }
}

export async function getPublishedPostSlugs() {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("posts")
      .select("slug")
      .eq("status", "published");

    return (data ?? []).map((row) => row.slug);
  } catch {
    return [];
  }
}
