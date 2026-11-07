"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

// Mirrors SESSION_IDLE_SECONDS in src/lib/auth.ts — the server enforces it too.
const IDLE_MS = 15 * 60 * 1000;
const WARN_MS = 14 * 60 * 1000;
// While the admin is active, tell the server at most this often (keeps the session alive while
// they type a long post without navigating).
const PING_EVERY_MS = 60 * 1000;
const CHECK_EVERY_MS = 5 * 1000;
// Shared across tabs so activity in one CMS tab keeps the others signed in too.
const STORAGE_KEY = "pm_cms_last_activity";
const ACTIVITY_EVENTS = ["mousemove", "mousedown", "keydown", "scroll", "touchstart", "wheel"] as const;

function readShared(): number {
  try {
    return Number(localStorage.getItem(STORAGE_KEY)) || 0;
  } catch {
    return 0;
  }
}

function writeShared(time: number) {
  try {
    localStorage.setItem(STORAGE_KEY, String(time));
  } catch {
    // Storage unavailable — this tab's own timer still works.
  }
}

/** Signs the admin out after 15 minutes without any activity, with a warning a minute before. */
export function IdleTimeout() {
  const pathname = usePathname();
  const lastActivity = useRef(Date.now());
  const lastPing = useRef(Date.now());
  const signingOut = useRef(false);
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);

  const signOut = useCallback(async () => {
    if (signingOut.current) return;
    signingOut.current = true;
    await fetch("/api/auth/logout", { method: "POST" }).catch(() => null);
    window.location.href = `/cms/login?reason=idle&next=${encodeURIComponent(pathname)}`;
  }, [pathname]);

  const ping = useCallback(async () => {
    lastPing.current = Date.now();
    const res = await fetch("/api/auth/refresh", { method: "POST" }).catch(() => null);
    if (res && res.status === 401) signOut();
  }, [signOut]);

  const markActive = useCallback(() => {
    const now = Date.now();
    // Throttle: activity events fire constantly.
    if (now - lastActivity.current < 1000) return;
    lastActivity.current = now;
    writeShared(now);
  }, []);

  const check = useCallback(() => {
    const now = Date.now();
    const latest = Math.max(lastActivity.current, readShared());
    const idle = now - latest;

    if (idle >= IDLE_MS) {
      signOut();
      return;
    }
    setSecondsLeft(idle >= WARN_MS ? Math.ceil((IDLE_MS - idle) / 1000) : null);

    // Activity since the last ping: slide the server-side session forward.
    if (latest > lastPing.current && now - lastPing.current >= PING_EVERY_MS) {
      ping();
    }
  }, [ping, signOut]);

  useEffect(() => {
    writeShared(Date.now());
    for (const event of ACTIVITY_EVENTS) window.addEventListener(event, markActive, { passive: true });
    // Timers are throttled in background tabs / sleeping laptops, so re-check on return.
    const onVisible = () => document.visibilityState === "visible" && check();
    document.addEventListener("visibilitychange", onVisible);
    const timer = window.setInterval(check, CHECK_EVERY_MS);
    return () => {
      for (const event of ACTIVITY_EVENTS) window.removeEventListener(event, markActive);
      document.removeEventListener("visibilitychange", onVisible);
      window.clearInterval(timer);
    };
  }, [check, markActive]);

  if (secondsLeft === null) return null;

  return (
    <div
      role="alertdialog"
      aria-live="assertive"
      aria-label="Session about to expire"
      className="fixed right-6 bottom-6 z-[100] w-[340px] rounded-2xl border border-black/10 bg-white p-5 shadow-2xl"
    >
      <p className="font-bold text-ink">Still there?</p>
      <p className="mt-1 text-sm text-ink-soft/80">
        For your security you&apos;ll be signed out in{" "}
        <span className="font-semibold text-ink">{secondsLeft}s</span> because of inactivity.
      </p>
      <div className="mt-4 flex gap-2">
        <button
          onClick={() => {
            lastActivity.current = Date.now();
            writeShared(lastActivity.current);
            setSecondsLeft(null);
            ping();
          }}
          className="flex-1 rounded-full bg-brand-500 py-2.5 text-sm font-semibold text-white hover:bg-brand-600"
        >
          Stay signed in
        </button>
        <button
          onClick={signOut}
          className="rounded-full border border-black/10 px-4 py-2.5 text-sm font-semibold text-ink-soft hover:bg-cream"
        >
          Sign out
        </button>
      </div>
    </div>
  );
}
