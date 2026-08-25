"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const links = [
  { label: "MUSIC", href: "#music" },
  { label: "VIDEOS", href: "#visuals" },
  { label: "GALLERY", href: "#gallery" },
  { label: "COMMUNITY", href: "#community" },
  { label: "TOUR", href: "#tour" },
  { label: "BOOKINGS", href: "#bookings" },
];

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const openerRef = useRef<HTMLButtonElement | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);

  // While the overlay is open it owns the screen: Escape dismisses it, the
  // page behind it stops scrolling, and focus moves in and then back out.
  useEffect(() => {
    if (!menuOpen) return;
    closeRef.current?.focus();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setMenuOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      openerRef.current?.focus();
    };
  }, [menuOpen]);

  return (
    <>
      <a
        href="#main"
        className="sr-only-focusable cut-r bg-ink pr-8 pl-5 text-xs font-semibold tracking-[0.16em] text-white [--cut:12px]"
      >
        SKIP TO CONTENT
      </a>
      <nav className="sticky top-0 z-[100] flex h-16 items-center justify-between border-b border-ink bg-white/94 px-[clamp(20px,4vw,56px)] backdrop-blur-[8px]">
        <a
          href="#hero"
          aria-label="Zafar Sandhu home"
          className="flex min-h-11 items-center"
        >
          <Image
            src="/img/logo-black.png"
            alt=""
            width={1600}
            height={571}
            sizes="62px"
            className="block h-[22px] w-auto"
            priority
          />
        </a>
        <div className="flex items-center gap-[clamp(16px,2.5vw,34px)] max-[760px]:hidden">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="inline-flex min-h-11 items-center border-b-2 border-transparent px-0.5 text-xs font-semibold tracking-[0.14em] text-ink hover:border-ink"
            >
              {l.label}
            </a>
          ))}
        </div>
        <button
          ref={openerRef}
          onClick={() => setMenuOpen(true)}
          aria-label="Open menu"
          aria-expanded={menuOpen}
          className="hidden h-11 w-11 cursor-pointer flex-col justify-center gap-[5px] border-none bg-transparent p-2.5 max-[760px]:flex"
        >
          <span className="block h-0.5 bg-ink" />
          <span className="block h-0.5 w-[70%] bg-ink" />
          <span className="block h-0.5 bg-ink" />
        </button>
      </nav>

      {menuOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          className="fixed inset-0 z-[300] flex animate-[zafFade_0.3s_ease_both] flex-col bg-ink p-5"
        >
          <div className="flex justify-end">
            <button
              ref={closeRef}
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
              className="cut-r h-11 w-11 cursor-pointer border border-white/40 bg-transparent text-base text-white [--cut:8px]"
            >
              <span aria-hidden="true">✕</span>
            </button>
          </div>
          <div className="my-auto flex flex-col gap-2 px-3">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className="py-2.5 font-display text-[34px] text-white"
              >
                {l.label}
              </a>
            ))}
          </div>
          <Image
            src="/img/logo-black.png"
            alt=""
            width={1600}
            height={571}
            sizes="140px"
            className="mx-3 mb-4 block h-auto w-[140px] invert"
          />
        </div>
      )}
    </>
  );
}
