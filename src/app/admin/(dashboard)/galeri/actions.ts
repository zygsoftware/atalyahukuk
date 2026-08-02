"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireStaff } from "@/lib/supabase/auth-helpers";
import { createClient } from "@/lib/supabase/server";
import type { GalleryCategory } from "@/lib/supabase/types";

export async function createGalleryImage(formData: FormData) {
  const staff = await requireStaff();
  const imageUrl = String(formData.get("image_url") ?? "").trim();
  if (!imageUrl) {
    throw new Error("Görsel yüklemeden kaydedemezsiniz.");
  }

  const supabase = await createClient();
  const { error } = await supabase.from("gallery_images").insert({
    image_url: imageUrl,
    caption_tr: (formData.get("caption_tr") as string) || null,
    caption_en: (formData.get("caption_en") as string) || null,
    category: (formData.get("category") as GalleryCategory) || "diger",
    is_active: formData.get("is_active") === "on",
    created_by: staff.id,
  });

  if (error) throw new Error(error.message);

  redirect("/admin/galeri");
}

export async function toggleGalleryImageActive(id: string, isActive: boolean) {
  await requireStaff();
  const supabase = await createClient();
  await supabase
    .from("gallery_images")
    .update({ is_active: isActive })
    .eq("id", id);
  revalidatePath("/admin/galeri");
}

export async function deleteGalleryImage(id: string) {
  await requireStaff();
  const supabase = await createClient();
  await supabase.from("gallery_images").delete().eq("id", id);
  revalidatePath("/admin/galeri");
}
