import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { deleteClientRecord } from "./actions";

export const metadata = { title: "Müvekkiller" };

const STATUS_LABEL: Record<string, string> = {
  aktif: "Aktif",
  pasif: "Pasif",
  arsiv: "Arşiv",
};

export default async function AdminClientsListPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("clients")
    .select("id, full_name, phone, email, practice_area, status, created_at")
    .order("created_at", { ascending: false });

  if (q) {
    query = query.ilike("full_name", `%${q}%`);
  }

  const { data: clients } = await query;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-serif text-2xl text-bordo-950">Müvekkiller</h1>
        <Link
          href="/admin/muvekkiller/new"
          className="rounded-full bg-bordo-500 px-5 py-2.5 text-sm font-semibold text-cream transition hover:bg-bordo-600"
        >
          + Yeni Müvekkil
        </Link>
      </div>

      <form className="mt-6 max-w-sm">
        <input
          type="search"
          name="q"
          defaultValue={q ?? ""}
          placeholder="İsme göre ara..."
          className="w-full rounded-lg border border-bordo-100 px-4 py-2.5 text-sm outline-none focus:border-bordo-400"
        />
      </form>

      <div className="mt-6 overflow-hidden rounded-2xl border border-bordo-100 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-bordo-50/60 text-xs uppercase tracking-wide text-ink/50">
            <tr>
              <th className="px-5 py-3">Ad Soyad</th>
              <th className="px-5 py-3">İletişim</th>
              <th className="px-5 py-3">Hukuk Alanı</th>
              <th className="px-5 py-3">Durum</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody>
            {(clients ?? []).map((client) => (
              <tr key={client.id} className="border-t border-bordo-50">
                <td className="px-5 py-3 font-medium text-ink">
                  <Link
                    href={`/admin/muvekkiller/${client.id}`}
                    className="hover:text-bordo-600 hover:underline"
                  >
                    {client.full_name}
                  </Link>
                </td>
                <td className="px-5 py-3 text-ink/60">
                  {client.phone ?? client.email ?? "—"}
                </td>
                <td className="px-5 py-3 text-ink/60">
                  {client.practice_area ?? "—"}
                </td>
                <td className="px-5 py-3">
                  <span className="rounded-full bg-bordo-50 px-2.5 py-1 text-xs font-medium text-bordo-600">
                    {STATUS_LABEL[client.status] ?? client.status}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center justify-end gap-4">
                    <Link
                      href={`/admin/muvekkiller/${client.id}`}
                      className="text-xs font-semibold text-bordo-500 hover:text-bordo-700"
                    >
                      Düzenle
                    </Link>
                    <DeleteButton
                      action={deleteClientRecord.bind(null, client.id)}
                    />
                  </div>
                </td>
              </tr>
            ))}
            {(clients ?? []).length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-ink/50">
                  Kayıtlı müvekkil bulunamadı.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
