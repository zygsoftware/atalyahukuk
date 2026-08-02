"use client";

import { useState, useTransition } from "react";
import { inviteUser } from "../actions";

export function NewUserForm() {
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      try {
        await inviteUser(formData);
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
          className="mt-2 w-full rounded-lg border border-bordo-100 px-4 py-2.5 text-sm outline-none focus:border-bordo-400"
        />
      </div>
      <div>
        <label className="text-sm font-medium text-ink/80">E-posta *</label>
        <input
          name="email"
          type="email"
          required
          className="mt-2 w-full rounded-lg border border-bordo-100 px-4 py-2.5 text-sm outline-none focus:border-bordo-400"
        />
      </div>
      <div>
        <label className="text-sm font-medium text-ink/80">
          Geçici Şifre *
        </label>
        <input
          name="password"
          type="text"
          required
          minLength={8}
          className="mt-2 w-full rounded-lg border border-bordo-100 px-4 py-2.5 text-sm outline-none focus:border-bordo-400"
        />
        <p className="mt-1 text-xs text-ink/50">En az 8 karakter.</p>
      </div>
      <div>
        <label className="text-sm font-medium text-ink/80">Rol *</label>
        <select
          name="role"
          defaultValue="editor"
          className="mt-2 w-full rounded-lg border border-bordo-100 px-4 py-2.5 text-sm outline-none focus:border-bordo-400"
        >
          <option value="editor">Editör (Blog / Duyuru / Mesajlar)</option>
          <option value="admin">Yönetici (Tüm yetkiler)</option>
        </select>
      </div>

      {error && <p className="text-sm font-medium text-bordo-600">{error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-bordo-500 px-7 py-3 text-sm font-semibold text-cream transition hover:bg-bordo-600 disabled:opacity-60"
      >
        {pending ? "Oluşturuluyor..." : "Kullanıcı Oluştur"}
      </button>
    </form>
  );
}
