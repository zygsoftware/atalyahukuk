import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { ClientForm } from "../ClientForm";
import {
  updateClientRecord,
  updateClientPricing,
  createInstallment,
  deleteInstallment,
} from "../actions";
import { CASE_STATUS_LABEL, PRACTICE_AREA_LABEL } from "@/lib/admin-labels";

export const metadata = { title: "Müvekkili Düzenle" };

const TRY_FORMAT = new Intl.NumberFormat("tr-TR", {
  style: "currency",
  currency: "TRY",
});

export default async function EditClientPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const [{ data: client }, { data: cases }, { data: installments }] =
    await Promise.all([
      supabase.from("clients").select("*").eq("id", id).single(),
      supabase
        .from("cases")
        .select("id, title, case_number, practice_area, status, opened_date")
        .eq("client_id", id)
        .order("created_at", { ascending: false }),
      supabase
        .from("client_installments")
        .select("id, amount, due_date")
        .eq("client_id", id)
        .order("due_date", { ascending: true }),
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

      <div className="mt-12 max-w-2xl">
        <h2 className="font-serif text-xl text-bordo-950">Ücretlendirme</h2>

        <form
          action={updateClientPricing.bind(null, id)}
          className="mt-4 space-y-8 rounded-xl border border-bordo-100 bg-white p-5"
        >
          <div>
            <h3 className="text-sm font-semibold text-ink">Nispi</h3>
            <div className="mt-3 max-w-xs">
              <label className="text-xs font-medium text-ink/70">
                Nispi Oran (%)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="100"
                name="nispi_oran"
                defaultValue={client.nispi_oran ?? ""}
                placeholder="ör. 15"
                className="mt-1.5 w-full rounded-lg border border-bordo-100 px-3 py-2 text-sm outline-none focus:border-bordo-400"
              />
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-ink">Maktu</h3>

            <div className="mt-3">
              <p className="text-xs font-medium text-ink/70">
                Tahsil Edilen Tutar ve Tarihi
              </p>
              <div className="mt-2 grid gap-4 sm:grid-cols-2">
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  name="maktu_tahsil_edilen_tutar"
                  defaultValue={client.maktu_tahsil_edilen_tutar ?? ""}
                  placeholder="Tutar (₺)"
                  className="w-full rounded-lg border border-bordo-100 px-3 py-2 text-sm outline-none focus:border-bordo-400"
                />
                <input
                  type="date"
                  name="maktu_tahsil_edilen_tarih"
                  defaultValue={client.maktu_tahsil_edilen_tarih ?? ""}
                  className="w-full rounded-lg border border-bordo-100 px-3 py-2 text-sm outline-none focus:border-bordo-400"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="rounded-full bg-bordo-500 px-7 py-2.5 text-sm font-semibold text-cream transition hover:bg-bordo-600"
          >
            Kaydet
          </button>
        </form>

        <div className="mt-6">
          <p className="text-xs font-medium text-ink/70">
            Tahsil Edilecek Tutar (Vadeler)
          </p>

          <div className="mt-2 divide-y divide-bordo-100 rounded-xl border border-bordo-100 bg-white">
            {!installments || installments.length === 0 ? (
              <p className="px-5 py-6 text-sm text-ink/60">
                Vadeli tahsilat kaydı bulunmuyor.
              </p>
            ) : (
              installments.map((inst) => (
                <div
                  key={inst.id}
                  className="flex items-center justify-between gap-3 px-5 py-3"
                >
                  <div>
                    <p className="text-sm font-semibold text-ink">
                      {TRY_FORMAT.format(inst.amount)}
                    </p>
                    <p className="mt-0.5 text-xs text-ink/60">
                      Vade: {inst.due_date}
                    </p>
                  </div>
                  <DeleteButton
                    action={deleteInstallment.bind(null, id, inst.id)}
                    confirmMessage="Bu vade kaydını silmek istediğinizden emin misiniz?"
                  />
                </div>
              ))
            )}
          </div>

          <form
            action={createInstallment.bind(null, id)}
            className="mt-4 grid gap-4 rounded-xl border border-bordo-100 bg-white p-5 sm:grid-cols-2"
          >
            <p className="text-sm font-semibold text-ink sm:col-span-2">
              Vade Ekle
            </p>
            <div>
              <label className="text-xs font-medium text-ink/70">
                Tutar (₺) *
              </label>
              <input
                required
                type="number"
                step="0.01"
                min="0"
                name="amount"
                className="mt-1.5 w-full rounded-lg border border-bordo-100 px-3 py-2 text-sm outline-none focus:border-bordo-400"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-ink/70">
                Vade Tarihi *
              </label>
              <input
                required
                type="date"
                name="due_date"
                className="mt-1.5 w-full rounded-lg border border-bordo-100 px-3 py-2 text-sm outline-none focus:border-bordo-400"
              />
            </div>
            <div className="sm:col-span-2">
              <button
                type="submit"
                className="rounded-full bg-bordo-500 px-6 py-2.5 text-sm font-semibold text-cream transition hover:bg-bordo-600"
              >
                Vade Ekle
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
