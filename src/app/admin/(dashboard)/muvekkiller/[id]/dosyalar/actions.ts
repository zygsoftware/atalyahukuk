"use server";

import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/supabase/auth-helpers";
import { createClient } from "@/lib/supabase/server";
import { trDateTimeToISO } from "@/lib/timezone";
import type { CaseStatus, HearingStatus } from "@/lib/supabase/types";

function readCaseFields(formData: FormData) {
  return {
    title: String(formData.get("title") ?? "").trim(),
    case_number: (formData.get("case_number") as string) || null,
    practice_area: (formData.get("practice_area") as string) || null,
    court: (formData.get("court") as string) || null,
    status: (formData.get("status") as CaseStatus) || "acik",
    opened_date: (formData.get("opened_date") as string) || undefined,
    closed_date: (formData.get("closed_date") as string) || null,
    note: (formData.get("note") as string) || null,
  };
}

export async function createCase(clientId: string, formData: FormData) {
  const staff = await requireAdmin();
  const fields = readCaseFields(formData);
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("cases")
    .insert({ ...fields, client_id: clientId, created_by: staff.id })
    .select("id")
    .single();
  if (error) throw new Error(error.message);

  redirect(`/admin/muvekkiller/${clientId}/dosyalar/${data.id}`);
}

export async function updateCase(
  clientId: string,
  caseId: string,
  formData: FormData,
) {
  await requireAdmin();
  const fields = readCaseFields(formData);
  const supabase = await createClient();

  const { error } = await supabase.from("cases").update(fields).eq("id", caseId);
  if (error) throw new Error(error.message);

  redirect(`/admin/muvekkiller/${clientId}/dosyalar/${caseId}`);
}

export async function deleteCase(clientId: string, caseId: string) {
  await requireAdmin();
  const supabase = await createClient();
  await supabase.from("cases").delete().eq("id", caseId);
  redirect(`/admin/muvekkiller/${clientId}`);
}

function readHearingFields(formData: FormData) {
  const date = String(formData.get("hearing_date") ?? "");
  const time = String(formData.get("hearing_time") ?? "") || "09:00";

  return {
    hearing_date: date ? trDateTimeToISO(date, time) : undefined,
    title: (formData.get("title") as string) || null,
    location: (formData.get("location") as string) || null,
  };
}

export async function createHearing(
  clientId: string,
  caseId: string,
  formData: FormData,
) {
  const staff = await requireAdmin();
  const fields = readHearingFields(formData);
  if (!fields.hearing_date) throw new Error("Duruşma tarihi zorunludur.");
  const supabase = await createClient();

  const { error } = await supabase.from("hearings").insert({
    ...fields,
    hearing_date: fields.hearing_date,
    case_id: caseId,
    created_by: staff.id,
  });
  if (error) throw new Error(error.message);

  redirect(`/admin/muvekkiller/${clientId}/dosyalar/${caseId}`);
}

export async function setHearingStatus(
  clientId: string,
  caseId: string,
  hearingId: string,
  status: HearingStatus,
) {
  await requireAdmin();
  const supabase = await createClient();
  await supabase.from("hearings").update({ status }).eq("id", hearingId);
  redirect(`/admin/muvekkiller/${clientId}/dosyalar/${caseId}`);
}

export async function setHearingStatusForm(
  clientId: string,
  caseId: string,
  hearingId: string,
  formData: FormData,
) {
  const status = formData.get("status") as HearingStatus;
  await setHearingStatus(clientId, caseId, hearingId, status);
}

export async function deleteHearing(
  clientId: string,
  caseId: string,
  hearingId: string,
) {
  await requireAdmin();
  const supabase = await createClient();
  await supabase.from("hearings").delete().eq("id", hearingId);
  redirect(`/admin/muvekkiller/${clientId}/dosyalar/${caseId}`);
}
