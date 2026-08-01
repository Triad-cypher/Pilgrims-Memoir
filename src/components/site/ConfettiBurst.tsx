"use client";

import { useEffect, useRef } from "react";

const SESSION_KEY = "pm_confetti_shown";
const DURATION_MS = 2600;
const PARTICLE_COUNT = 110;
const COLORS = ["#058D37", "#079E3D", "#C6D7CB", "#D21C5C", "#A3432B", "#FAF8F5"];

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rotation: number;
  rotationSpeed: number;
  color: string;
  shape: "rect" | "circle";
}

export function ConfettiBurst() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let frameId: number | null = null;

    // Deferred via setTimeout so React StrictMode's dev-only mount→cleanup→remount cycle
    // cleanly cancels the first (throwaway) pass instead of both passes racing to claim
    // the sessionStorage flag. Production never double-invokes effects, so this is a no-op
    // there beyond a single tick's delay.
    const timeoutId = window.setTimeout(() => {
      if (sessionStorage.getItem(SESSION_KEY)) return;
      sessionStorage.setItem(SESSION_KEY, "1");

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const originX = canvas.width / 2;
      const originY = canvas.height * 0.25;

      const particles: Particle[] = Array.from({ length: PARTICLE_COUNT }, () => {
        const angle = Math.random() * Math.PI * 2;
        const speed = 4 + Math.random() * 9;
        return {
          x: originX,
          y: originY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 4,
          size: 5 + Math.random() * 5,
          rotation: Math.random() * 360,
          rotationSpeed: (Math.random() - 0.5) * 12,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          shape: Math.random() > 0.5 ? "rect" : "circle",
        };
      });

      const start = performance.now();

      function frame(now: number) {
        const elapsed = now - start;
        const progress = elapsed / DURATION_MS;
        if (!ctx || !canvas || progress >= 1) {
          if (ctx && canvas) ctx.clearRect(0, 0, canvas.width, canvas.height);
          return;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const fade = Math.max(0, 1 - progress * 1.15);

        for (const p of particles) {
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.18; // gravity
          p.vx *= 0.99; // air drag
          p.rotation += p.rotationSpeed;

          ctx.save();
          ctx.globalAlpha = fade;
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.fillStyle = p.color;
          if (p.shape === "rect") {
            ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
          } else {
            ctx.beginPath();
            ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.restore();
        }

        frameId = requestAnimationFrame(frame);
      }

      frameId = requestAnimationFrame(frame);
    }, 0);

    return () => {
      clearTimeout(timeoutId);
      if (frameId !== null) cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[100]"
      aria-hidden="true"
    />
  );
}
