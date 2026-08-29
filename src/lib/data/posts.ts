import { createStaticClient } from "@/lib/supabase/static";

export async function getPublishedPosts() {
  try {
    const supabase = createStaticClient();
    const { data } = await supabase
      .from("posts")
      .select(
        "id, slug, title_tr, title_en, excerpt_tr, excerpt_en, cover_image_url, category, is_pinned, published_at",
      )
      .eq("status", "published")
      .order("is_pinned", { ascending: false })
      .order("published_at", { ascending: false });

    return data ?? [];
  } catch {
    return [];
  }
}

export async function getPublishedPostBySlug(slug: string) {
  try {
    const supabase = createStaticClient();
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

export async function getRelatedPosts(excludeSlug: string, limit = 3) {
  try {
    const supabase = createStaticClient();
    const { data } = await supabase
      .from("posts")
      .select(
        "id, slug, title_tr, title_en, excerpt_tr, excerpt_en, cover_image_url, category, is_pinned, published_at",
      )
      .eq("status", "published")
      .neq("slug", excludeSlug)
      .order("is_pinned", { ascending: false })
      .order("published_at", { ascending: false })
      .limit(limit);

    return data ?? [];
  } catch {
    return [];
  }
}

export async function getPublishedPostSlugs() {
  try {
    const supabase = createStaticClient();
    const { data } = await supabase
      .from("posts")
      .select("slug")
      .eq("status", "published");

    return (data ?? []).map((row) => row.slug);
  } catch {
    return [];
  }
}
