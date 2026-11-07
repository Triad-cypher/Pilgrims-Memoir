"use client";

import { FormEvent, useState } from "react";
import { formatDate } from "@/lib/format";

export interface PublicComment {
  id: string;
  commenterName: string;
  body: string;
  createdAt: string;
}

export function CommentsSection({
  resourceId,
  comments,
  variant = "default",
}: {
  resourceId: string;
  comments: PublicComment[];
  /** "cards" is the larger card layout used on the book detail page. */
  variant?: "default" | "cards";
}) {
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

  if (variant === "cards") {
    const field =
      "field min-h-[52px] rounded-2xl border-[1.5px] border-[#DDE2D8] bg-[#F5F6F0] px-[18px] text-[16px] text-[#0F1A14] outline-none";
    return (
      <div className="flex flex-col gap-7 font-geist">
        <div className="flex items-baseline gap-3.5">
          <h2 className="m-0 text-[clamp(36px,4vw,56px)] font-medium tracking-[-0.045em]">Comments</h2>
          <span className="font-quote text-[36px] text-[#1E7A43] italic">({comments.length})</span>
        </div>

        {comments.length === 0 && <p className="m-0 text-[17px] text-[#56615A]">Be the first to leave a comment.</p>}
        {comments.map((c) => (
          <article key={c.id} className="flex gap-4 rounded-3xl border border-[#E1E5DC] bg-white p-[22px]">
            <span
              aria-hidden="true"
              className="grid h-11 w-11 flex-none place-items-center rounded-full bg-[#E4ECDF] font-semibold text-[#0F3B26]"
            >
              {c.commenterName.trim().charAt(0).toUpperCase()}
            </span>
            <div className="flex min-w-0 flex-col gap-1.5">
              <p className="m-0 font-semibold">
                {c.commenterName}{" "}
                <span className="text-[14px] font-normal text-[#56615A]">· {formatDate(c.createdAt)}</span>
              </p>
              <p className="m-0 text-[16px] leading-[1.6] whitespace-pre-wrap text-[#36423B]">{c.body}</p>
            </div>
          </article>
        ))}

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-3.5 rounded-[28px] border border-[#E1E5DC] bg-white p-[clamp(20px,3vw,32px)]"
        >
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(240px,100%),1fr))] gap-3.5">
            <div className="flex flex-col gap-2">
              <label htmlFor="cn" className="text-[14px] font-medium">
                Your name
              </label>
              <input id="cn" required placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} className={field} />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="ce" className="text-[14px] font-medium">
                Your email
              </label>
              <input
                id="ce"
                required
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={field}
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="ct" className="text-[14px] font-medium">
              Comment
            </label>
            <textarea
              id="ct"
              required
              rows={4}
              placeholder="Write a comment…"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className={`${field} resize-y py-4 leading-[1.5]`}
            />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="submit"
              disabled={status === "loading"}
              className="hero-btn min-h-[52px] cursor-pointer rounded-full border-0 bg-[#0F1A14] px-7 text-[16px] font-medium text-[#F5F6F0] disabled:opacity-60"
            >
              {status === "loading" ? "Posting…" : "Post Comment"}
            </button>
            {status === "sent" && <span className="text-sm text-[#1E7A43]">Thanks! Your comment is awaiting approval.</span>}
            {status === "error" && <span className="text-sm text-rose-600">Something went wrong. Please try again.</span>}
          </div>
        </form>
      </div>
    );
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
