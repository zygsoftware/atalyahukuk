"use server";

import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/supabase/auth-helpers";
import { createClient, createServiceRoleClient } from "@/lib/supabase/server";
import type { ProfileRole } from "@/lib/supabase/types";

export async function inviteUser(formData: FormData) {
  await requireAdmin();

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const fullName = String(formData.get("full_name") ?? "").trim();
  const role = (formData.get("role") as ProfileRole) || "editor";

  if (!email || !password || !fullName) {
    throw new Error("Tüm alanlar zorunludur.");
  }
  if (password.length < 8) {
    throw new Error("Şifre en az 8 karakter olmalıdır.");
  }

  const admin = createServiceRoleClient();
  const { error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: fullName, role },
  });

  if (error) throw new Error(error.message);

  redirect("/admin/kullanicilar");
}

export async function updateUser(id: string, formData: FormData) {
  const staff = await requireAdmin();

  const fullName = String(formData.get("full_name") ?? "").trim();
  const role = (formData.get("role") as ProfileRole) || "editor";
  const newPassword = String(formData.get("password") ?? "");

  if (id === staff.id && role !== "admin") {
    throw new Error("Kendi yönetici rolünüzü kaldıramazsınız.");
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({ full_name: fullName, role })
    .eq("id", id);
  if (error) throw new Error(error.message);

  if (newPassword) {
    if (newPassword.length < 8) {
      throw new Error("Şifre en az 8 karakter olmalıdır.");
    }
    const admin = createServiceRoleClient();
    const { error: pwError } = await admin.auth.admin.updateUserById(id, {
      password: newPassword,
    });
    if (pwError) throw new Error(pwError.message);
  }

  redirect("/admin/kullanicilar");
}

export async function deleteUser(id: string) {
  const staff = await requireAdmin();
  if (id === staff.id) {
    throw new Error("Kendi hesabınızı silemezsiniz.");
  }
  const admin = createServiceRoleClient();
  await admin.auth.admin.deleteUser(id);
}
