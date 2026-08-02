"use client";

import { useActionState } from "react";
import { login, type LoginState } from "./actions";

const initialState: LoginState = { error: null };

export function LoginForm() {
  const [state, formAction, pending] = useActionState(login, initialState);

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <label htmlFor="email" className="text-sm font-medium text-cream/80">
          E-posta
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="mt-2 w-full rounded-lg border border-cream/20 bg-cream/5 px-4 py-3 text-sm text-cream outline-none focus:border-gold-400"
        />
      </div>
      <div>
        <label
          htmlFor="password"
          className="text-sm font-medium text-cream/80"
        >
          Şifre
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="mt-2 w-full rounded-lg border border-cream/20 bg-cream/5 px-4 py-3 text-sm text-cream outline-none focus:border-gold-400"
        />
      </div>

      {state.error && (
        <p className="text-sm font-medium text-red-400">{state.error}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-gold-500 px-6 py-3.5 text-sm font-semibold text-bordo-950 transition hover:bg-gold-400 disabled:opacity-60"
      >
        {pending ? "Giriş yapılıyor..." : "Giriş Yap"}
      </button>
    </form>
  );
}
