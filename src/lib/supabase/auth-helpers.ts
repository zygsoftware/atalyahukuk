import "server-only";
import { redirect } from "next/navigation";
import { createClient } from "./server";
import type { ProfileRole } from "./types";

export interface CurrentStaff {
  id: string;
  email: string | null;
  fullName: string;
  role: ProfileRole;
}

export async function getCurrentStaff(): Promise<CurrentStaff | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role")
    .eq("id", user.id)
    .single();

  if (!profile) return null;

  return {
    id: user.id,
    email: user.email ?? null,
    fullName: profile.full_name,
    role: profile.role,
  };
}

/** Admin sayfalarında session/role garanti etmek için — middleware zaten koruyor, bu ikinci bir güvenlik katmanıdır. */
export async function requireStaff(): Promise<CurrentStaff> {
  const staff = await getCurrentStaff();
  if (!staff) redirect("/admin/login");
  return staff;
}

export async function requireAdmin(): Promise<CurrentStaff> {
  const staff = await requireStaff();
  if (staff.role !== "admin") redirect("/admin");
  return staff;
}
