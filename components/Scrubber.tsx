"use client";

import { useRef, useState } from "react";
import { useSiteContent } from "@/lib/site-content";
import { usePlayer, useElapsed, fmt } from "@/lib/player";

type Props = {
  /** height of the visible track, e.g. "h-[34px]" */
  trackClass: string;
  /** diagonal offset on the fill's leading edge, in px */
  cut: number;
  /** true on the ink sections, where the paused fill is white rather than ink */
  onDark?: boolean;
  /** shows m:ss under each end of the bar (the transport does, the mini bar doesn't) */
  showTimes?: boolean;
  className?: string;
};

/**
 * The player's scrub control. The fill is full width inside a clipping track
 * and slides by transform, so the Z's diagonal keeps a constant angle at every
 * position — which is also what makes the tip usable as the handle.
 *
 * The hit area is padded to 44px while the visible bar keeps its designed
 * height, so the control is thumb-sized without redrawing the design.
 */
export default function Scrubber({
  trackClass,
  cut,
  onDark = true,
  showTimes = false,
  className = "",
}: Props) {
  const { tracks } = useSiteContent();
  const p = usePlayer();
  const elapsed = useElapsed();
  const track = tracks[p.currentTrack];
  const [dragPct, setDragPct] = useState<number | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const livePct = Math.min(100, (elapsed / track.dur) * 100);
  const pct = dragPct ?? livePct;
  const shownSeconds = (pct / 100) * track.dur;
  const dragging = dragPct !== null;

  function pctFromClientX(clientX: number) {
    const el = trackRef.current;
    if (!el) return 0;
    const r = el.getBoundingClientRect();
    return Math.max(0, Math.min(100, ((clientX - r.left) / r.width) * 100));
  }

  function commit(nextPct: number) {
    p.seek((nextPct / 100) * track.dur);
  }

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if (e.button !== 0 && e.pointerType === "mouse") return;
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // Capture is an optimisation for dragging outside the bar, not a
      // requirement — seeking still works without it.
    }
    setDragPct(pctFromClientX(e.clientX));
  }

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!dragging) return;
    setDragPct(pctFromClientX(e.clientX));
  }

  function onPointerUp(e: React.PointerEvent<HTMLDivElement>) {
    if (!dragging) return;
    const final = pctFromClientX(e.clientX);
    commit(final);
    setDragPct(null);
    try {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    } catch {
      /* capture was never taken */
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    const small = 5;
    const large = 30;
    let next: number | null = null;
    switch (e.key) {
      case "ArrowRight":
      case "ArrowUp":
        next = elapsed + small;
        break;
      case "ArrowLeft":
      case "ArrowDown":
        next = elapsed - small;
        break;
      case "PageUp":
        next = elapsed + large;
        break;
      case "PageDown":
        next = elapsed - large;
        break;
      case "Home":
        next = 0;
        break;
      case "End":
        next = track.dur;
        break;
      default:
        return;
    }
    e.preventDefault();
    p.seek(Math.max(0, Math.min(track.dur, next)));
  }

  const fillColor = p.playing ? "bg-red" : onDark ? "bg-white" : "bg-ink";
  const border = onDark ? "border-white/40" : "border-ink/40";

  return (
    <div className={className}>
      {/* Padded so the touch target clears 44px while the bar keeps its height. */}
      <div
        role="slider"
        tabIndex={0}
        aria-label={`Seek within ${track.title}`}
        aria-orientation="horizontal"
        aria-valuemin={0}
        aria-valuemax={Math.round(track.dur)}
        aria-valuenow={Math.round(shownSeconds)}
        aria-valuetext={`${fmt(shownSeconds)} of ${fmt(track.dur)}`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onKeyDown={onKeyDown}
        className="group flex min-h-11 cursor-pointer touch-none items-center"
      >
        <div
          ref={trackRef}
          className={`relative w-full overflow-hidden border ${border} ${trackClass} transition-colors duration-200 group-hover:border-white/70`}
        >
          <div
            data-dragging={dragging}
            style={{
              transform: `translateX(${(pct - 100).toFixed(2)}%)`,
              ["--cut" as string]: `${cut}px`,
            }}
            className={`progress-fill cut-r absolute inset-0 ${fillColor}`}
          />
        </div>
      </div>
      {showTimes && (
        <div
          aria-hidden="true"
          className="tnum mt-2 flex justify-between text-xs text-white/70"
        >
          {/* While scrubbing this reads the target, not playback position. */}
          <span className={dragging ? "text-red" : undefined}>
            {fmt(shownSeconds)}
          </span>
          <span>{fmt(track.dur)}</span>
        </div>
      )}
    </div>
  );
}
