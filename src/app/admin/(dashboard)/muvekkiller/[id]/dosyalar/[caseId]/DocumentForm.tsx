"use client";

import { useRef, useState, useTransition } from "react";
import { createClient } from "@/lib/supabase/client";

export function DocumentForm({
  caseId,
  onSubmit,
}: {
  caseId: string;
  onSubmit: (formData: FormData) => Promise<void>;
}) {
  const [name, setName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Evrak adı girin.");
      return;
    }
    if (!file) {
      setError("Bir dosya seçin.");
      return;
    }

    setUploading(true);
    startTransition(async () => {
      try {
        const supabase = createClient();
        const path = `${caseId}/${Date.now()}-${file.name}`;
        const { data, error: uploadError } = await supabase.storage
          .from("case-documents")
          .upload(path, file);
        if (uploadError || !data) {
          throw new Error(uploadError?.message ?? "Dosya yüklenemedi.");
        }

        const formData = new FormData();
        formData.set("name", name.trim());
        formData.set("file_path", data.path);
        formData.set("file_size", String(file.size));

        await onSubmit(formData);
        setName("");
        setFile(null);
        if (inputRef.current) inputRef.current.value = "";
      } catch (err) {
        setError(err instanceof Error ? err.message : "Bir hata oluştu.");
      } finally {
        setUploading(false);
      }
    });
  }

  const isBusy = pending || uploading;

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-4 grid gap-4 rounded-xl border border-bordo-100 bg-white p-5 sm:grid-cols-2"
    >
      <p className="text-sm font-semibold text-ink sm:col-span-2">
        Evrak Ekle
      </p>
      <div>
        <label className="text-xs font-medium text-ink/70">Evrak Adı *</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="ör. Vekaletname"
          className="mt-1.5 w-full rounded-lg border border-bordo-100 px-3 py-2 text-sm outline-none focus:border-bordo-400"
        />
      </div>
      <div>
        <label className="text-xs font-medium text-ink/70">Dosya *</label>
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="mt-1.5 w-full text-sm text-ink/70 file:mr-3 file:rounded-full file:border-0 file:bg-bordo-50 file:px-4 file:py-2 file:text-xs file:font-semibold file:text-bordo-600"
        />
      </div>

      {error && (
        <p className="text-sm font-medium text-bordo-600 sm:col-span-2">
          {error}
        </p>
      )}

      <div className="sm:col-span-2">
        <button
          type="submit"
          disabled={isBusy}
          className="rounded-full bg-bordo-500 px-6 py-2.5 text-sm font-semibold text-cream transition hover:bg-bordo-600 disabled:opacity-60"
        >
          {uploading ? "Yükleniyor..." : "Evrak Ekle"}
        </button>
      </div>
    </form>
  );
}
