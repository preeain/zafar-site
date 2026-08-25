"use client";

import { createElement, useEffect, useRef, useState } from "react";

/**
 * Scroll reveal: fade + rise once when the element enters the viewport.
 * Elements already visible in the first viewport don't animate.
 * transform+opacity only; disabled under prefers-reduced-motion.
 */
export default function Reveal({
  as: Tag = "div",
  className = "",
  children,
}: {
  as?: string;
  className?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [phase, setPhase] = useState<"idle" | "pending" | "shown">("idle");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight * 0.9) return; // already visible, skip
    setPhase("pending");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            setPhase("shown");
            io.unobserve(en.target);
          }
        });
      },
      { threshold: 0.12 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const revealClass =
    phase === "idle"
      ? ""
      : phase === "pending"
        ? "reveal-pending"
        : "reveal-pending reveal-shown";

  return createElement(
    Tag,
    { ref, className: `${className} ${revealClass}`.trim() },
    children,
  );
}
