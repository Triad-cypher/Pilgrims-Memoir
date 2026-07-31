"use client";

import { useRouter } from "next/navigation";

export function ResourceRowActions({ id }: { id: string }) {
  const router = useRouter();

  async function handleDelete() {
    if (!confirm("Delete this resource? This cannot be undone.")) return;
    const res = await fetch(`/api/cms/resources/${id}`, { method: "DELETE" });
    if (res.ok) router.refresh();
  }

  return (
    <button onClick={handleDelete} className="rounded-lg px-2 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-50">
      Delete
    </button>
  );
}
