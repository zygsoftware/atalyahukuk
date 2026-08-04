import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { HearingStatusSelect } from "@/components/admin/HearingStatusSelect";
import { CaseForm } from "../CaseForm";
import {
  updateCase,
  deleteCase,
  createHearing,
  setHearingStatusForm,
  deleteHearing,
} from "../actions";
import { TR_TIME_ZONE } from "@/lib/timezone";

export const metadata = { title: "Dosya Detayı" };

export default async function CaseDetailPage({
  params,
}: {
  params: Promise<{ id: string; caseId: string }>;
}) {
  const { id, caseId } = await params;
  const supabase = await createClient();

  const [{ data: client }, { data: caseRow }, { data: hearings }] =
    await Promise.all([
      supabase.from("clients").select("id, full_name").eq("id", id).single(),
      supabase.from("cases").select("*").eq("id", caseId).single(),
      supabase
        .from("hearings")
        .select("*")
        .eq("case_id", caseId)
        .order("hearing_date", { ascending: true }),
    ]);

  if (!client || !caseRow || caseRow.client_id !== client.id) notFound();

  return (
    <div>
      <p className="text-sm font-medium text-bordo-500">
        <Link href={`/admin/muvekkiller/${id}`} className="hover:underline">
          {client.full_name}
        </Link>
      </p>
      <div className="mt-1 flex items-center justify-between">
        <h1 className="font-serif text-2xl text-bordo-950">Dosya Düzenle</h1>
        <DeleteButton
          action={deleteCase.bind(null, id, caseId)}
          confirmMessage="Bu dosyayı ve tüm duruşmalarını silmek istediğinizden emin misiniz?"
        />
      </div>

      <div className="mt-6">
        <CaseForm
          initial={caseRow}
          onSubmit={updateCase.bind(null, id, caseId)}
        />
      </div>

      <div className="mt-12 max-w-2xl">
        <h2 className="font-serif text-xl text-bordo-950">Duruşmalar</h2>

        <div className="mt-4 divide-y divide-bordo-100 rounded-xl border border-bordo-100 bg-white">
          {!hearings || hearings.length === 0 ? (
            <p className="px-5 py-6 text-sm text-ink/60">
              Bu dosyaya ait duruşma bulunmuyor.
            </p>
          ) : (
            hearings.map((h) => (
              <div
                key={h.id}
                className="flex flex-wrap items-center justify-between gap-3 px-5 py-4"
              >
                <div>
                  <p className="text-sm font-semibold text-ink">
                    {new Date(h.hearing_date).toLocaleString("tr-TR", {
                      dateStyle: "medium",
                      timeStyle: "short",
                      timeZone: TR_TIME_ZONE,
                    })}
                  </p>
                  <p className="mt-0.5 text-xs text-ink/60">
                    {[h.title, h.location].filter(Boolean).join(" · ") || "—"}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <HearingStatusSelect
                    defaultValue={h.status}
                    action={setHearingStatusForm.bind(null, id, caseId, h.id)}
                  />
                  <DeleteButton
                    action={deleteHearing.bind(null, id, caseId, h.id)}
                    confirmMessage="Bu duruşmayı silmek istediğinizden emin misiniz?"
                  />
                </div>
              </div>
            ))
          )}
        </div>

        <form
          action={createHearing.bind(null, id, caseId)}
          className="mt-6 grid gap-4 rounded-xl border border-bordo-100 bg-white p-5 sm:grid-cols-2"
        >
          <p className="text-sm font-semibold text-ink sm:col-span-2">
            Duruşma Ekle
          </p>
          <div>
            <label className="text-xs font-medium text-ink/70">Tarih *</label>
            <input
              required
              type="date"
              name="hearing_date"
              className="mt-1.5 w-full rounded-lg border border-bordo-100 px-3 py-2 text-sm outline-none focus:border-bordo-400"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-ink/70">Saat</label>
            <input
              type="time"
              name="hearing_time"
              defaultValue="09:00"
              className="mt-1.5 w-full rounded-lg border border-bordo-100 px-3 py-2 text-sm outline-none focus:border-bordo-400"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-ink/70">Başlık</label>
            <input
              name="title"
              placeholder="ör. Ön inceleme duruşması"
              className="mt-1.5 w-full rounded-lg border border-bordo-100 px-3 py-2 text-sm outline-none focus:border-bordo-400"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-ink/70">Yer</label>
            <input
              name="location"
              placeholder="ör. Salon 4"
              className="mt-1.5 w-full rounded-lg border border-bordo-100 px-3 py-2 text-sm outline-none focus:border-bordo-400"
            />
          </div>
          <div className="sm:col-span-2">
            <button
              type="submit"
              className="rounded-full bg-bordo-500 px-6 py-2.5 text-sm font-semibold text-cream transition hover:bg-bordo-600"
            >
              Duruşma Ekle
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
