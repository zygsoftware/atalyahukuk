import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/supabase/auth-helpers";
import { createClient } from "@/lib/supabase/server";
import { EditUserForm } from "./EditUserForm";

export const metadata = { title: "Kullanıcıyı Düzenle" };

export default async function EditUserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const staff = await requireAdmin();
  const supabase = await createClient();
  const { data: user } = await supabase
    .from("profiles")
    .select("id, full_name, role")
    .eq("id", id)
    .single();

  if (!user) notFound();

  return (
    <div>
      <h1 className="font-serif text-2xl text-bordo-950">
        Kullanıcıyı Düzenle
      </h1>
      <div className="mt-6">
        <EditUserForm
          id={user.id}
          initialFullName={user.full_name}
          initialRole={user.role}
          isSelf={user.id === staff.id}
        />
      </div>
    </div>
  );
}
