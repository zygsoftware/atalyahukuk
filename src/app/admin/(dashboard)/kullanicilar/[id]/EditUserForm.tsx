"use client";

import { useState, useTransition } from "react";
import { updateUser } from "../actions";

export function EditUserForm({
  id,
  initialFullName,
  initialRole,
  isSelf,
}: {
  id: string;
  initialFullName: string;
  initialRole: "admin" | "editor";
  isSelf: boolean;
}) {
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      try {
        await updateUser(id, formData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Bir hata oluştu.");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md space-y-6">
      <div>
        <label className="text-sm font-medium text-ink/80">Ad Soyad *</label>
        <input
          name="full_name"
          required
          defaultValue={initialFullName}
          className="mt-2 w-full rounded-lg border border-bordo-100 px-4 py-2.5 text-sm outline-none focus:border-bordo-400"
        />
      </div>
      <div>
        <label className="text-sm font-medium text-ink/80">Rol *</label>
        {isSelf && <input type="hidden" name="role" value={initialRole} />}
        <select
          name={isSelf ? undefined : "role"}
          defaultValue={initialRole}
          disabled={isSelf}
          className="mt-2 w-full rounded-lg border border-bordo-100 px-4 py-2.5 text-sm outline-none focus:border-bordo-400 disabled:bg-ink/5"
        >
          <option value="editor">Editör (Blog / Duyuru / Mesajlar)</option>
          <option value="admin">Yönetici (Tüm yetkiler)</option>
        </select>
        {isSelf && (
          <p className="mt-1 text-xs text-ink/50">
            Kendi rolünüzü değiştiremezsiniz.
          </p>
        )}
      </div>
      <div>
        <label className="text-sm font-medium text-ink/80">
          Yeni Şifre (opsiyonel)
        </label>
        <input
          name="password"
          type="text"
          minLength={8}
          className="mt-2 w-full rounded-lg border border-bordo-100 px-4 py-2.5 text-sm outline-none focus:border-bordo-400"
        />
        <p className="mt-1 text-xs text-ink/50">
          Boş bırakılırsa şifre değişmez.
        </p>
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
