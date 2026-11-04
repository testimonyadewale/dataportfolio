"use client";

import { useState } from "react";

type Status = "idle" | "sending" | "sent" | "error";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus("sending");
    setError("");
    const body = Object.fromEntries(new FormData(form));
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setStatus("sent");
      form.reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (status === "sent") {
    return (
      <div className="rounded-2xl border border-accent bg-accent-soft p-8">
        <p className="text-lg font-semibold">Thanks, your message is on its way.</p>
        <p className="mt-1 text-muted">I'll get back to you soon.</p>
      </div>
    );
  }

  const input =
    "w-full rounded-lg border border-line bg-surface px-4 py-3 text-ink placeholder:text-muted/70 focus:border-accent focus:outline-none";

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-1.5 text-sm">
          Name
          <input name="name" required maxLength={100} className={input} autoComplete="name" />
        </label>
        <label className="grid gap-1.5 text-sm">
          Email
          <input name="email" type="email" required maxLength={200} className={input} autoComplete="email" />
        </label>
      </div>
      <label className="grid gap-1.5 text-sm">
        What's it about?
        <select name="topic" className={input} defaultValue="Job opportunity">
          <option>Job opportunity</option>
          <option>Freelance project</option>
          <option>Just saying hello</option>
        </select>
      </label>
      <label className="grid gap-1.5 text-sm">
        Message
        <textarea name="message" required rows={5} maxLength={5000} className={input} />
      </label>
      {/* Honeypot: real people never see or fill this. */}
      <input name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={status === "sending"}
          className="rounded-full bg-accent px-6 py-3 font-medium text-accent-ink transition hover:opacity-90 disabled:opacity-60"
        >
          {status === "sending" ? "Sending…" : "Send message"}
        </button>
        {status === "error" && <p className="text-sm text-accent">{error}</p>}
      </div>
    </form>
  );
}
