"use client";

import { useState, useTransition } from "react";
import { SERVICE_SLUGS } from "@/lib/constants";
import { CASE_STATUS_LABEL, PRACTICE_AREA_LABEL } from "@/lib/admin-labels";
import type { Database } from "@/lib/supabase/types";

type CaseRow = Database["public"]["Tables"]["cases"]["Row"];

export function CaseForm({
  initial,
  onSubmit,
}: {
  initial?: CaseRow;
  onSubmit: (formData: FormData) => Promise<void>;
}) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [caseNumber, setCaseNumber] = useState(initial?.case_number ?? "");
  const [practiceArea, setPracticeArea] = useState(
    initial?.practice_area ?? "",
  );
  const [court, setCourt] = useState(initial?.court ?? "");
  const [status, setStatus] = useState(initial?.status ?? "acik");
  const [openedDate, setOpenedDate] = useState(
    initial?.opened_date ?? new Date().toISOString().slice(0, 10),
  );
  const [closedDate, setClosedDate] = useState(initial?.closed_date ?? "");
  const [note, setNote] = useState(initial?.note ?? "");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const formData = new FormData();
    formData.set("title", title);
    formData.set("case_number", caseNumber ?? "");
    formData.set("practice_area", practiceArea ?? "");
    formData.set("court", court ?? "");
    formData.set("status", status);
    formData.set("opened_date", openedDate ?? "");
    formData.set("closed_date", closedDate ?? "");
    formData.set("note", note ?? "");

    startTransition(async () => {
      try {
        await onSubmit(formData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Bir hata oluştu.");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      <div>
        <label className="text-sm font-medium text-ink/80">
          Dosya Konusu *
        </label>
        <input
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="ör. Boşanma davası"
          className="mt-2 w-full rounded-lg border border-bordo-100 px-4 py-2.5 text-sm outline-none focus:border-bordo-400"
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-ink/80">Esas No</label>
          <input
            value={caseNumber ?? ""}
            onChange={(e) => setCaseNumber(e.target.value)}
            placeholder="ör. 2026/123 E."
            className="mt-2 w-full rounded-lg border border-bordo-100 px-4 py-2.5 text-sm outline-none focus:border-bordo-400"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-ink/80">
            Mahkeme / Kurum
          </label>
          <input
            value={court ?? ""}
            onChange={(e) => setCourt(e.target.value)}
            placeholder="ör. Antalya 3. Aile Mahkemesi"
            className="mt-2 w-full rounded-lg border border-bordo-100 px-4 py-2.5 text-sm outline-none focus:border-bordo-400"
          />
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-ink/80">
            Hukuk Alanı
          </label>
          <select
            value={practiceArea ?? ""}
            onChange={(e) => setPracticeArea(e.target.value)}
            className="mt-2 w-full rounded-lg border border-bordo-100 px-4 py-2.5 text-sm outline-none focus:border-bordo-400"
          >
            <option value="">Seçiniz</option>
            {SERVICE_SLUGS.map((slug) => (
              <option key={slug} value={slug}>
                {PRACTICE_AREA_LABEL[slug]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium text-ink/80">Durum</label>
          <select
            value={status}
            onChange={(e) =>
              setStatus(e.target.value as "acik" | "kapali" | "beklemede")
            }
            className="mt-2 w-full rounded-lg border border-bordo-100 px-4 py-2.5 text-sm outline-none focus:border-bordo-400"
          >
            {Object.entries(CASE_STATUS_LABEL).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-ink/80">
            Açılış Tarihi
          </label>
          <input
            type="date"
            value={openedDate ?? ""}
            onChange={(e) => setOpenedDate(e.target.value)}
            className="mt-2 w-full rounded-lg border border-bordo-100 px-4 py-2.5 text-sm outline-none focus:border-bordo-400"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-ink/80">
            Kapanış Tarihi
          </label>
          <input
            type="date"
            value={closedDate ?? ""}
            onChange={(e) => setClosedDate(e.target.value)}
            className="mt-2 w-full rounded-lg border border-bordo-100 px-4 py-2.5 text-sm outline-none focus:border-bordo-400"
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-ink/80">Dosya Notu</label>
        <textarea
          rows={5}
          value={note ?? ""}
          onChange={(e) => setNote(e.target.value)}
          className="mt-2 w-full rounded-lg border border-bordo-100 px-4 py-2.5 text-sm outline-none focus:border-bordo-400"
        />
      </div>

      {error && <p className="text-sm font-medium text-bordo-600">{error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-bordo-500 px-7 py-3 text-sm font-semibold text-cream transition hover:bg-bordo-600 disabled:opacity-60"
      >
        {pending ? "Kaydediliyor..." : "Kaydet"}
      </button>
    </form>
  );
}
