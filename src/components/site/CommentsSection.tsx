"use client";

import { FormEvent, useState } from "react";
import { formatDate } from "@/lib/format";

export interface PublicComment {
  id: string;
  commenterName: string;
  body: string;
  createdAt: string;
}

export function CommentsSection({ resourceId, comments }: { resourceId: string; comments: PublicComment[] }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("loading");
    const res = await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resourceId, commenterName: name, commenterEmail: email, comment }),
    });
    if (res.ok) {
      setStatus("sent");
      setName("");
      setEmail("");
      setComment("");
    } else {
      setStatus("error");
    }
  }

  return (
    <div className="mt-10 border-t border-black/5 pt-8">
      <h3 className="text-lg font-bold text-ink">Comments ({comments.length})</h3>

      <div className="mt-5 space-y-5">
        {comments.map((c) => (
          <div key={c.id} className="rounded-xl bg-cream p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-ink">{c.commenterName}</p>
              <p className="text-xs text-ink-soft/50">{formatDate(c.createdAt)}</p>
            </div>
            <p className="mt-1.5 text-sm text-ink-soft/80">{c.body}</p>
          </div>
        ))}
        {comments.length === 0 && <p className="text-sm text-ink-soft/60">Be the first to leave a comment.</p>}
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-3 rounded-xl border border-black/5 p-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <input
            required
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-lg border border-black/10 px-3 py-2 text-sm outline-none focus:border-brand-500"
          />
          <input
            required
            type="email"
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-lg border border-black/10 px-3 py-2 text-sm outline-none focus:border-brand-500"
          />
        </div>
        <textarea
          required
          placeholder="Write a comment…"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
          className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm outline-none focus:border-brand-500"
        />
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={status === "loading"}
            className="rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
          >
            {status === "loading" ? "Posting…" : "Post Comment"}
          </button>
          {status === "sent" && (
            <span className="text-xs text-brand-600">Thanks! Your comment is awaiting approval.</span>
          )}
          {status === "error" && <span className="text-xs text-rose-600">Something went wrong.</span>}
        </div>
      </form>
    </div>
  );
}
