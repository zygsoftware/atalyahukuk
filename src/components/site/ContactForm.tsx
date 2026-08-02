"use client";

import { useState, type FormEvent } from "react";

type Status = "idle" | "sending" | "success" | "error";

export function ContactForm({
  labels,
}: {
  labels: {
    name: string;
    email: string;
    phone: string;
    message: string;
    submit: string;
    sending: string;
    success: string;
    error: string;
  };
}) {
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      message: formData.get("message"),
      company: formData.get("company"),
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("request-failed");
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Honeypot — ekran okuyuculardan ve görsel olarak gizli */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="company">Company</label>
        <input
          id="company"
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="name"
            className="text-sm font-medium text-ink/80"
          >
            {labels.name}
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            minLength={2}
            className="mt-2 w-full rounded-lg border border-bordo-100 bg-white px-4 py-3 text-sm outline-none focus:border-bordo-400"
          />
        </div>
        <div>
          <label
            htmlFor="email"
            className="text-sm font-medium text-ink/80"
          >
            {labels.email}
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="mt-2 w-full rounded-lg border border-bordo-100 bg-white px-4 py-3 text-sm outline-none focus:border-bordo-400"
          />
        </div>
      </div>

      <div>
        <label htmlFor="phone" className="text-sm font-medium text-ink/80">
          {labels.phone}
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          className="mt-2 w-full rounded-lg border border-bordo-100 bg-white px-4 py-3 text-sm outline-none focus:border-bordo-400"
        />
      </div>

      <div>
        <label htmlFor="message" className="text-sm font-medium text-ink/80">
          {labels.message}
        </label>
        <textarea
          id="message"
          name="message"
          required
          minLength={10}
          rows={5}
          className="mt-2 w-full rounded-lg border border-bordo-100 bg-white px-4 py-3 text-sm outline-none focus:border-bordo-400"
        />
      </div>

      <button
        type="submit"
        disabled={status === "sending"}
        className="rounded-full bg-bordo-500 px-7 py-3.5 text-sm font-semibold text-cream transition hover:bg-bordo-600 disabled:opacity-60"
      >
        {status === "sending" ? labels.sending : labels.submit}
      </button>

      {status === "success" && (
        <p className="text-sm font-medium text-green-700">{labels.success}</p>
      )}
      {status === "error" && (
        <p className="text-sm font-medium text-bordo-600">{labels.error}</p>
      )}
    </form>
  );
}
