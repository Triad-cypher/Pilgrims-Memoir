"use client";

import { useState } from "react";
import { Check, ExternalLink } from "lucide-react";

export function ShareButton({ className }: { className?: string }) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // Fallback for browsers/contexts where the Clipboard API is unavailable.
      const textarea = document.createElement("textarea");
      textarea.value = url;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      className={
        className ??
        "inline-flex items-center gap-1.5 rounded-full border border-black/10 px-3 py-1.5 text-xs font-medium text-rose-600"
      }
    >
      {copied ? (
        <>
          <Check size={13} /> Link copied
        </>
      ) : (
        <>
          <ExternalLink size={13} /> Share on media
        </>
      )}
    </button>
  );
}
