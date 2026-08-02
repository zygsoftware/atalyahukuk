"use server";

import { redirect } from "next/navigation";
import { requireStaff } from "@/lib/supabase/auth-helpers";
import { createClient } from "@/lib/supabase/server";

function readFields(formData: FormData) {
  return {
    slug: String(formData.get("slug") ?? "").trim(),
    title_tr: String(formData.get("title_tr") ?? "").trim(),
    title_en: (formData.get("title_en") as string) || null,
    content_tr: (formData.get("content_tr") as string) || "",
    content_en: (formData.get("content_en") as string) || null,
    is_pinned: formData.get("is_pinned") === "on",
    is_active: formData.get("is_active") === "on",
  };
}

export async function createAnnouncement(formData: FormData) {
  await requireStaff();
  const fields = readFields(formData);
  const supabase = await createClient();

  const { error } = await supabase.from("announcements").insert(fields);
  if (error) throw new Error(error.message);

  redirect("/admin/duyurular");
}

export async function updateAnnouncement(id: string, formData: FormData) {
  await requireStaff();
  const fields = readFields(formData);
  const supabase = await createClient();

  const { error } = await supabase
    .from("announcements")
    .update(fields)
    .eq("id", id);
  if (error) throw new Error(error.message);

  redirect("/admin/duyurular");
}

export async function deleteAnnouncement(id: string) {
  await requireStaff();
  const supabase = await createClient();
  await supabase.from("announcements").delete().eq("id", id);
}
