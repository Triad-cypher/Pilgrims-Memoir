"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      // Hide near the bottom, where the footer has its own back-to-top button.
      const nearBottom = window.scrollY + window.innerHeight > document.documentElement.scrollHeight - 320;
      setVisible(window.scrollY > 400 && !nearBottom);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
      className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-ink text-white shadow-lg transition hover:bg-black"
    >
      <ArrowUp size={20} />
    </button>
  );
}
