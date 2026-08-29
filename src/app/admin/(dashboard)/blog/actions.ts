"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireStaff } from "@/lib/supabase/auth-helpers";
import { createClient } from "@/lib/supabase/server";
import type { PostCategory, PostStatus } from "@/lib/supabase/types";

function readPostFields(formData: FormData) {
  const status = formData.get("status") as PostStatus;
  const category = (formData.get("category") as PostCategory) || "blog";
  return {
    slug: String(formData.get("slug") ?? "").trim(),
    category,
    title_tr: String(formData.get("title_tr") ?? "").trim(),
    title_en: (formData.get("title_en") as string) || null,
    excerpt_tr: (formData.get("excerpt_tr") as string) || null,
    excerpt_en: (formData.get("excerpt_en") as string) || null,
    content_tr: (formData.get("content_tr") as string) || "",
    content_en: (formData.get("content_en") as string) || null,
    cover_image_url: (formData.get("cover_image_url") as string) || null,
    status,
    is_pinned: formData.get("is_pinned") === "on",
    meta_title: (formData.get("meta_title") as string) || null,
    meta_description: (formData.get("meta_description") as string) || null,
  };
}

export async function createPost(formData: FormData) {
  const staff = await requireStaff();
  const fields = readPostFields(formData);
  const supabase = await createClient();

  const { error } = await supabase.from("posts").insert({
    ...fields,
    author_id: staff.id,
    published_at: fields.status === "published" ? new Date().toISOString() : null,
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/", "layout");
  revalidatePath("/sitemap.xml");
  redirect("/admin/blog");
}

export async function updatePost(id: string, formData: FormData) {
  await requireStaff();
  const fields = readPostFields(formData);
  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("posts")
    .select("status, published_at")
    .eq("id", id)
    .single();

  const shouldSetPublishedAt =
    fields.status === "published" && !existing?.published_at;

  const { error } = await supabase
    .from("posts")
    .update({
      ...fields,
      ...(shouldSetPublishedAt
        ? { published_at: new Date().toISOString() }
        : {}),
    })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/", "layout");
  revalidatePath("/sitemap.xml");
  redirect("/admin/blog");
}

export async function deletePost(id: string) {
  await requireStaff();
  const supabase = await createClient();
  await supabase.from("posts").delete().eq("id", id);
  revalidatePath("/", "layout");
  revalidatePath("/sitemap.xml");
}
