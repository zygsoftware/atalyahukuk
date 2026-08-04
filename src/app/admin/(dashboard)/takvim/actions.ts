"use server";

import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/supabase/auth-helpers";
import { createClient } from "@/lib/supabase/server";
import { trDateTimeToISO } from "@/lib/timezone";

export async function createReminder(formData: FormData) {
  const staff = await requireAdmin();
  const supabase = await createClient();

  const title = String(formData.get("title") ?? "").trim();
  const date = String(formData.get("due_date") ?? "");
  const time = String(formData.get("due_time") ?? "") || "09:00";
  const description = (formData.get("description") as string) || null;
  const clientId = (formData.get("client_id") as string) || null;
  const month = (formData.get("month") as string) || "";

  if (!title || !date) throw new Error("Başlık ve tarih zorunludur.");

  const { error } = await supabase.from("reminders").insert({
    title,
    description,
    due_date: trDateTimeToISO(date, time),
    client_id: clientId,
    created_by: staff.id,
  });
  if (error) throw new Error(error.message);

  redirect(`/admin/takvim${month ? `?month=${month}` : ""}`);
}

export async function toggleReminderDone(
  id: string,
  isDone: boolean,
  month: string,
) {
  await requireAdmin();
  const supabase = await createClient();
  await supabase.from("reminders").update({ is_done: isDone }).eq("id", id);
  redirect(`/admin/takvim${month ? `?month=${month}` : ""}`);
}

export async function deleteReminder(id: string, month: string) {
  await requireAdmin();
  const supabase = await createClient();
  await supabase.from("reminders").delete().eq("id", id);
  redirect(`/admin/takvim${month ? `?month=${month}` : ""}`);
}
