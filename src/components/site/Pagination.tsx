import Link from "next/link";

export function Pagination({
  basePath,
  currentPage,
  totalPages,
  extraQuery = {},
}: {
  basePath: string;
  currentPage: number;
  totalPages: number;
  extraQuery?: Record<string, string | undefined>;
}) {
  if (totalPages <= 1) return null;
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  const pageHref = (p: number) => {
    const query = new URLSearchParams();
    for (const [key, value] of Object.entries(extraQuery)) {
      if (value) query.set(key, value);
    }
    if (p !== 1) query.set("page", String(p));
    const qs = query.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  };

  return (
    <div className="mt-10 flex items-center justify-between">
      <Link
        href={pageHref(Math.max(1, currentPage - 1))}
        aria-disabled={currentPage === 1}
        className={`text-ink-soft ${currentPage === 1 ? "pointer-events-none opacity-30" : "hover:text-ink"}`}
      >
        ←
      </Link>
      <div className="flex items-center gap-2">
        {pages.map((p) => (
          <Link
            key={p}
            href={pageHref(p)}
            className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
              p === currentPage ? "bg-ink text-white" : "text-ink-soft hover:bg-cream-dark"
            }`}
          >
            {p}
          </Link>
        ))}
      </div>
      <Link
        href={pageHref(Math.min(totalPages, currentPage + 1))}
        aria-disabled={currentPage === totalPages}
        className={`text-ink-soft ${currentPage === totalPages ? "pointer-events-none opacity-30" : "hover:text-ink"}`}
      >
        →
      </Link>
    </div>
  );
}
