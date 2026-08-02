"use server";

import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/supabase/auth-helpers";
import { createClient } from "@/lib/supabase/server";
import type { ClientStatus } from "@/lib/supabase/types";

function readFields(formData: FormData) {
  return {
    full_name: String(formData.get("full_name") ?? "").trim(),
    phone: (formData.get("phone") as string) || null,
    email: (formData.get("email") as string) || null,
    practice_area: (formData.get("practice_area") as string) || null,
    note: (formData.get("note") as string) || null,
    status: (formData.get("status") as ClientStatus) || "aktif",
  };
}

export async function createClientRecord(formData: FormData) {
  const staff = await requireAdmin();
  const fields = readFields(formData);
  const supabase = await createClient();

  const { error } = await supabase
    .from("clients")
    .insert({ ...fields, created_by: staff.id });
  if (error) throw new Error(error.message);

  redirect("/admin/muvekkiller");
}

export async function updateClientRecord(id: string, formData: FormData) {
  await requireAdmin();
  const fields = readFields(formData);
  const supabase = await createClient();

  const { error } = await supabase.from("clients").update(fields).eq("id", id);
  if (error) throw new Error(error.message);

  redirect("/admin/muvekkiller");
}

export async function deleteClientRecord(id: string) {
  await requireAdmin();
  const supabase = await createClient();
  await supabase.from("clients").delete().eq("id", id);
}
