"use client";

import { useState, useTransition } from "react";
import type { Database } from "@/lib/supabase/types";

type ClientRow = Database["public"]["Tables"]["clients"]["Row"];

export function ClientForm({
  initial,
  onSubmit,
}: {
  initial?: ClientRow;
  onSubmit: (formData: FormData) => Promise<void>;
}) {
  const [fullName, setFullName] = useState(initial?.full_name ?? "");
  const [phone, setPhone] = useState(initial?.phone ?? "");
  const [email, setEmail] = useState(initial?.email ?? "");
  const [note, setNote] = useState(initial?.note ?? "");
  const [status, setStatus] = useState(initial?.status ?? "aktif");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const formData = new FormData();
    formData.set("full_name", fullName);
    formData.set("phone", phone ?? "");
    formData.set("email", email ?? "");
    formData.set("note", note ?? "");
    formData.set("status", status);

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
          Ad Soyad / Unvan *
        </label>
        <input
          required
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="mt-2 w-full rounded-lg border border-bordo-100 px-4 py-2.5 text-sm outline-none focus:border-bordo-400"
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-ink/80">Telefon</label>
          <input
            value={phone ?? ""}
            onChange={(e) => setPhone(e.target.value)}
            className="mt-2 w-full rounded-lg border border-bordo-100 px-4 py-2.5 text-sm outline-none focus:border-bordo-400"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-ink/80">E-posta</label>
          <input
            type="email"
            value={email ?? ""}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-2 w-full rounded-lg border border-bordo-100 px-4 py-2.5 text-sm outline-none focus:border-bordo-400"
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-ink/80">Durum</label>
        <select
          value={status}
          onChange={(e) =>
            setStatus(e.target.value as "aktif" | "pasif" | "arsiv")
          }
          className="mt-2 w-full max-w-xs rounded-lg border border-bordo-100 px-4 py-2.5 text-sm outline-none focus:border-bordo-400"
        >
          <option value="aktif">Aktif</option>
          <option value="pasif">Pasif</option>
          <option value="arsiv">Arşiv</option>
        </select>
      </div>

      <div>
        <label className="text-sm font-medium text-ink/80">Müvekkil Notu</label>
        <textarea
          rows={6}
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
