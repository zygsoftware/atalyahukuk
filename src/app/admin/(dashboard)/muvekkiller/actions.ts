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

function readPricingFields(formData: FormData) {
  const nispiRaw = (formData.get("nispi_oran") as string) || "";
  const maktuTutarRaw =
    (formData.get("maktu_tahsil_edilen_tutar") as string) || "";

  return {
    nispi_oran: nispiRaw ? Number(nispiRaw) : null,
    maktu_tahsil_edilen_tutar: maktuTutarRaw ? Number(maktuTutarRaw) : null,
    maktu_tahsil_edilen_tarih:
      (formData.get("maktu_tahsil_edilen_tarih") as string) || null,
  };
}

export async function updateClientPricing(id: string, formData: FormData) {
  await requireAdmin();
  const fields = readPricingFields(formData);
  const supabase = await createClient();

  const { error } = await supabase
    .from("clients")
    .update(fields)
    .eq("id", id);
  if (error) throw new Error(error.message);

  redirect(`/admin/muvekkiller/${id}`);
}

export async function createInstallment(clientId: string, formData: FormData) {
  const staff = await requireAdmin();
  const amount = Number((formData.get("amount") as string) || "0");
  const dueDate = (formData.get("due_date") as string) || "";
  if (!dueDate || !amount) {
    throw new Error("Tutar ve vade tarihi zorunludur.");
  }
  const supabase = await createClient();

  const { error } = await supabase.from("client_installments").insert({
    client_id: clientId,
    amount,
    due_date: dueDate,
    created_by: staff.id,
  });
  if (error) throw new Error(error.message);

  redirect(`/admin/muvekkiller/${clientId}`);
}

export async function deleteInstallment(
  clientId: string,
  installmentId: string,
) {
  await requireAdmin();
  const supabase = await createClient();
  await supabase.from("client_installments").delete().eq("id", installmentId);
  redirect(`/admin/muvekkiller/${clientId}`);
}
