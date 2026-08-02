import Link from "next/link";
import { requireAdmin } from "@/lib/supabase/auth-helpers";
import { createClient } from "@/lib/supabase/server";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { deleteUser } from "./actions";

export const metadata = { title: "Kullanıcılar" };

export default async function AdminUsersListPage() {
  const staff = await requireAdmin();
  const supabase = await createClient();
  const { data: users } = await supabase
    .from("profiles")
    .select("id, full_name, role, created_at")
    .order("created_at", { ascending: true });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl text-bordo-950">Kullanıcılar</h1>
        <Link
          href="/admin/kullanicilar/new"
          className="rounded-full bg-bordo-500 px-5 py-2.5 text-sm font-semibold text-cream transition hover:bg-bordo-600"
        >
          + Yeni Kullanıcı
        </Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-bordo-100 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-bordo-50/60 text-xs uppercase tracking-wide text-ink/50">
            <tr>
              <th className="px-5 py-3">Ad Soyad</th>
              <th className="px-5 py-3">Rol</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody>
            {(users ?? []).map((user) => (
              <tr key={user.id} className="border-t border-bordo-50">
                <td className="px-5 py-3 font-medium text-ink">
                  {user.full_name}
                  {user.id === staff.id && (
                    <span className="ml-2 text-xs font-normal text-ink/40">
                      (siz)
                    </span>
                  )}
                </td>
                <td className="px-5 py-3 text-ink/60">
                  {user.role === "admin" ? "Yönetici" : "Editör"}
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center justify-end gap-4">
                    <Link
                      href={`/admin/kullanicilar/${user.id}`}
                      className="text-xs font-semibold text-bordo-500 hover:text-bordo-700"
                    >
                      Düzenle
                    </Link>
                    {user.id !== staff.id && (
                      <DeleteButton
                        action={deleteUser.bind(null, user.id)}
                        confirmMessage="Bu kullanıcıyı silmek istediğinizden emin misiniz?"
                      />
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
