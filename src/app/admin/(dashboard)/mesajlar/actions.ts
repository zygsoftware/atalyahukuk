"use server";

import { revalidatePath } from "next/cache";
import { requireStaff } from "@/lib/supabase/auth-helpers";
import { createClient } from "@/lib/supabase/server";

export async function setMessageRead(id: string, isRead: boolean) {
  await requireStaff();
  const supabase = await createClient();
  await supabase.from("contact_messages").update({ is_read: isRead }).eq("id", id);
  revalidatePath("/admin/mesajlar");
}

export async function deleteMessage(id: string) {
  await requireStaff();
  const supabase = await createClient();
  await supabase.from("contact_messages").delete().eq("id", id);
  revalidatePath("/admin/mesajlar");
}
