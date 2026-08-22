import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { CASE_STATUS_LABEL, PRACTICE_AREA_LABEL } from "@/lib/admin-labels";

export const metadata = { title: "Dosyalar" };

export default async function AdminCasesListPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("cases")
    .select(
      "id, client_id, title, case_number, practice_area, status, opened_date",
    )
    .order("opened_date", { ascending: false });

  if (q) {
    query = query.ilike("title", `%${q}%`);
  }

  const [{ data: cases }, { data: clients }] = await Promise.all([
    query,
    supabase.from("clients").select("id, full_name"),
  ]);

  const clientNameById = new Map(
    (clients ?? []).map((c) => [c.id, c.full_name]),
  );

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-serif text-2xl text-bordo-950">Dosyalar</h1>
        <Link
          href="/admin/muvekkiller"
          className="text-sm font-semibold text-bordo-500 hover:text-bordo-700"
        >
          Yeni dosya eklemek için müvekkile gidin →
        </Link>
      </div>

      <form className="mt-6 max-w-sm">
        <input
          type="search"
          name="q"
          defaultValue={q ?? ""}
          placeholder="Dosya konusuna göre ara..."
          className="w-full rounded-lg border border-bordo-100 px-4 py-2.5 text-sm outline-none focus:border-bordo-400"
        />
      </form>

      <div className="mt-6 overflow-hidden rounded-2xl border border-bordo-100 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-bordo-50/60 text-xs uppercase tracking-wide text-ink/50">
            <tr>
              <th className="px-5 py-3">Dosya</th>
              <th className="px-5 py-3">Müvekkil</th>
              <th className="px-5 py-3">Hukuk Alanı</th>
              <th className="px-5 py-3">Açılış Tarihi</th>
              <th className="px-5 py-3">Durum</th>
            </tr>
          </thead>
          <tbody>
            {(cases ?? []).map((c) => (
              <tr key={c.id} className="border-t border-bordo-50">
                <td className="px-5 py-3 font-medium text-ink">
                  <Link
                    href={`/admin/muvekkiller/${c.client_id}/dosyalar/${c.id}`}
                    className="hover:text-bordo-600 hover:underline"
                  >
                    {c.title}
                  </Link>
                  {c.case_number && (
                    <p className="mt-0.5 text-xs font-normal text-ink/50">
                      {c.case_number}
                    </p>
                  )}
                </td>
                <td className="px-5 py-3 text-ink/60">
                  <Link
                    href={`/admin/muvekkiller/${c.client_id}`}
                    className="hover:text-bordo-600 hover:underline"
                  >
                    {clientNameById.get(c.client_id) ?? "—"}
                  </Link>
                </td>
                <td className="px-5 py-3 text-ink/60">
                  {c.practice_area
                    ? (PRACTICE_AREA_LABEL[c.practice_area] ?? c.practice_area)
                    : "—"}
                </td>
                <td className="px-5 py-3 text-ink/60">{c.opened_date}</td>
                <td className="px-5 py-3">
                  <span
                    className={
                      "rounded-full px-2.5 py-1 text-xs font-medium " +
                      (c.status === "acik"
                        ? "bg-emerald-50 text-emerald-700"
                        : c.status === "beklemede"
                          ? "bg-amber-50 text-amber-700"
                          : "bg-ink/5 text-ink/60")
                    }
                  >
                    {CASE_STATUS_LABEL[c.status]}
                  </span>
                </td>
              </tr>
            ))}
            {(cases ?? []).length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-ink/50">
                  Kayıtlı dosya bulunamadı.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
