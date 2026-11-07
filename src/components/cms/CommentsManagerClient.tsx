"use client";

import { useState } from "react";

export interface CommentItem {
  id: string;
  commenterName: string;
  commenterEmail: string;
  body: string;
  reply: string | null;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
  resourceTitle: string;
}

const STATUS_STYLES: Record<CommentItem["status"], string> = {
  APPROVED: "bg-brand-50 text-brand-600",
  PENDING: "bg-amber-100 text-amber-700",
  REJECTED: "bg-rose-100 text-rose-600",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
}

export function CommentsManagerClient({ initialComments }: { initialComments: CommentItem[] }) {
  const [comments, setComments] = useState(initialComments);
  const [selectedId, setSelectedId] = useState<string | null>(initialComments[0]?.id ?? null);
  const [statusFilter, setStatusFilter] = useState<"ALL" | CommentItem["status"]>("ALL");
  const [search, setSearch] = useState("");
  const [replyDraft, setReplyDraft] = useState("");
  const [showReplyBox, setShowReplyBox] = useState(false);

  const filtered = comments.filter(
    (c) =>
      (statusFilter === "ALL" || c.status === statusFilter) &&
      c.commenterName.toLowerCase().includes(search.toLowerCase())
  );

  const selected = comments.find((c) => c.id === selectedId) ?? null;

  async function updateStatus(id: string, status: CommentItem["status"]) {
    const res = await fetch(`/api/cms/comments/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      setComments((cs) => cs.map((c) => (c.id === id ? { ...c, status } : c)));
    }
  }

  async function sendReply(id: string) {
    const res = await fetch(`/api/cms/comments/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reply: replyDraft }),
    });
    if (res.ok) {
      setComments((cs) => cs.map((c) => (c.id === id ? { ...c, reply: replyDraft } : c)));
      setShowReplyBox(false);
      setReplyDraft("");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this comment?")) return;
    const res = await fetch(`/api/cms/comments/${id}`, { method: "DELETE" });
    if (res.ok) {
      setComments((cs) => cs.filter((c) => c.id !== id));
      if (selectedId === id) setSelectedId(null);
    }
  }

  return (
    <div className="grid gap-6 p-8 lg:grid-cols-[1fr_360px]">
      <div className="rounded-2xl border border-black/5 bg-white p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h3 className="font-bold text-ink">All Comments</h3>
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
              className="rounded-full border border-black/10 px-3 py-1.5 text-sm text-ink-soft"
            >
              <option value="ALL">Status: All</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
            </select>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search commenter…"
              className="rounded-full border border-black/10 px-3 py-1.5 text-sm outline-none"
            />
          </div>
        </div>

        <table className="w-full text-left text-sm">
          <thead className="text-xs font-semibold uppercase tracking-wide text-ink-soft/50">
            <tr>
              <th className="pb-2">Commenter</th>
              <th className="pb-2">Comment</th>
              <th className="pb-2">Resource</th>
              <th className="pb-2">Status</th>
              <th className="pb-2">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {filtered.map((c) => (
              <tr
                key={c.id}
                onClick={() => {
                  setSelectedId(c.id);
                  setShowReplyBox(false);
                }}
                className={`cursor-pointer ${selectedId === c.id ? "bg-cream" : "hover:bg-cream/60"}`}
              >
                <td className="py-3 pr-2 font-semibold text-ink">{c.commenterName}</td>
                <td className="max-w-[160px] truncate py-3 pr-2 text-ink-soft/70">{c.body}</td>
                <td className="max-w-[140px] truncate py-3 pr-2 text-ink-soft/70">{c.resourceTitle}</td>
                <td className="py-3 pr-2">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_STYLES[c.status]}`}>
                    {c.status.charAt(0) + c.status.slice(1).toLowerCase()}
                  </span>
                </td>
                <td className="py-3 text-ink-soft/60">{formatDate(c.createdAt)}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="py-8 text-center text-ink-soft/50">
                  No comments match.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="h-fit rounded-2xl border border-black/5 bg-white p-5">
        <h3 className="font-bold text-ink">Comment Details</h3>
        {!selected ? (
          <p className="mt-4 text-sm text-ink-soft/60">Select a comment to see details.</p>
        ) : (
          <div className="mt-4">
            <div className="flex items-center gap-3">
              <img src="/images/figma/admin-avatar.png" alt="" className="h-10 w-10 rounded-full object-cover" />
              <div>
                <p className="font-semibold text-ink">{selected.commenterName}</p>
                <p className="text-xs text-ink-soft/50">{selected.commenterEmail}</p>
              </div>
            </div>
            <p className="mt-3 text-xs text-ink-soft/50">
              On Resource: <span className="font-semibold text-brand-600">{selected.resourceTitle}</span>
            </p>

            <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-ink-soft/50">Comment</p>
            <p className="mt-2 text-sm italic text-ink-soft/85">&ldquo;{selected.body}&rdquo;</p>
            <p className="mt-2 text-xs text-ink-soft/40">Submitted: {formatDate(selected.createdAt)}</p>

            {selected.reply && (
              <div className="mt-4 rounded-xl bg-cream p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft/50">Your Reply</p>
                <p className="mt-1 text-sm text-ink-soft/85">{selected.reply}</p>
              </div>
            )}

            {showReplyBox && (
              <div className="mt-4 space-y-2">
                <textarea
                  value={replyDraft}
                  onChange={(e) => setReplyDraft(e.target.value)}
                  rows={3}
                  placeholder="Write your reply…"
                  className="w-full rounded-xl border border-black/10 px-3 py-2 text-sm outline-none focus:border-brand-500"
                />
                <button
                  onClick={() => sendReply(selected.id)}
                  className="rounded-full bg-ink px-4 py-2 text-xs font-semibold text-white"
                >
                  Send Reply
                </button>
              </div>
            )}

            {selected.status !== "APPROVED" && (
              <button
                onClick={() => updateStatus(selected.id, "APPROVED")}
                className="mt-5 w-full rounded-full bg-brand-500 py-2.5 text-sm font-semibold text-white hover:bg-brand-600"
              >
                Approve Comment
              </button>
            )}
            <button
              onClick={() => setShowReplyBox((v) => !v)}
              className={`${selected.status === "APPROVED" ? "mt-5" : "mt-2"} w-full rounded-full border border-black/10 py-2.5 text-sm font-semibold text-ink hover:bg-cream`}
            >
              Write Reply
            </button>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <button
                onClick={() => updateStatus(selected.id, "REJECTED")}
                className="rounded-full border border-black/10 py-2 text-sm font-semibold text-ink-soft hover:bg-cream"
              >
                Reject
              </button>
              <button
                onClick={() => handleDelete(selected.id)}
                className="rounded-full border border-rose-200 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50"
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
