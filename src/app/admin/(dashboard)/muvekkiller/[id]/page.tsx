import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ClientForm } from "../ClientForm";
import { updateClientRecord } from "../actions";
import { CASE_STATUS_LABEL, PRACTICE_AREA_LABEL } from "@/lib/admin-labels";

export const metadata = { title: "Müvekkili Düzenle" };

export default async function EditClientPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const [{ data: client }, { data: cases }] = await Promise.all([
    supabase.from("clients").select("*").eq("id", id).single(),
    supabase
      .from("cases")
      .select("id, title, case_number, practice_area, status, opened_date")
      .eq("client_id", id)
      .order("created_at", { ascending: false }),
  ]);

  if (!client) notFound();

  return (
    <div>
      <h1 className="font-serif text-2xl text-bordo-950">Müvekkili Düzenle</h1>
      <div className="mt-6">
        <ClientForm
          initial={client}
          onSubmit={updateClientRecord.bind(null, id)}
        />
      </div>

      <div className="mt-12 max-w-2xl">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-xl text-bordo-950">Dosyalar</h2>
          <Link
            href={`/admin/muvekkiller/${id}/dosyalar/new`}
            className="rounded-full bg-bordo-500 px-5 py-2 text-sm font-semibold text-cream transition hover:bg-bordo-600"
          >
            + Yeni Dosya
          </Link>
        </div>

        <div className="mt-4 divide-y divide-bordo-100 rounded-xl border border-bordo-100 bg-white">
          {!cases || cases.length === 0 ? (
            <p className="px-5 py-6 text-sm text-ink/60">
              Bu müvekkile ait dosya bulunmuyor.
            </p>
          ) : (
            cases.map((c) => (
              <Link
                key={c.id}
                href={`/admin/muvekkiller/${id}/dosyalar/${c.id}`}
                className="flex items-center justify-between gap-4 px-5 py-4 transition hover:bg-bordo-50"
              >
                <div>
                  <p className="text-sm font-semibold text-ink">{c.title}</p>
                  <p className="mt-0.5 text-xs text-ink/60">
                    {[
                      c.case_number,
                      c.practice_area
                        ? PRACTICE_AREA_LABEL[c.practice_area]
                        : null,
                      c.opened_date,
                    ]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                </div>
                <span
                  className={
                    "shrink-0 rounded-full px-3 py-1 text-xs font-medium " +
                    (c.status === "acik"
                      ? "bg-emerald-50 text-emerald-700"
                      : c.status === "beklemede"
                        ? "bg-amber-50 text-amber-700"
                        : "bg-ink/5 text-ink/60")
                  }
                >
                  {CASE_STATUS_LABEL[c.status]}
                </span>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
