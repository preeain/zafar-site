"use client";

import { tracks } from "@/content/site";
import { usePlayer, useElapsed, fmt } from "@/lib/player";
import Scrubber from "./Scrubber";

function BarTime() {
  const p = usePlayer();
  const elapsed = useElapsed();
  return (
    <span className="tnum flex-none text-xs text-white/70">
      {fmt(elapsed)} / {fmt(tracks[p.currentTrack].dur)}
    </span>
  );
}

export default function MiniPlayer() {
  const p = usePlayer();
  if (!p.started || p.miniPlayerDismissed) return null;

  const track = tracks[p.currentTrack];

  return (
    <>
      {/* Reserves the bar's height at the end of the document so the fixed bar
          never covers the footer's last line. Height is pinned to the bar's. */}
      <div aria-hidden="true" className="h-[65px]" />
      <div
        role="region"
        aria-label="Now playing"
        className="fixed right-0 bottom-0 left-0 z-[120] flex h-[65px] animate-[zafUp_0.5s_var(--ease-zaf)_both] items-center gap-[clamp(14px,2vw,26px)] border-t border-white/25 bg-ink px-[clamp(16px,4vw,56px)] text-white"
      >
        <button
          onClick={p.togglePlay}
          aria-label={p.playing ? `Pause ${track.title}` : `Play ${track.title}`}
          className={`cut-r h-11 w-11 flex-none cursor-pointer border border-white text-[11px] font-semibold text-white transition-colors duration-200 [--cut:8px] hover:bg-white hover:text-ink ${p.playing ? "bg-red" : "bg-transparent"}`}
        >
          <span aria-hidden="true">{p.playing ? "❚❚" : "▶"}</span>
        </button>
        <span className="max-w-[34vw] flex-none overflow-hidden font-display text-sm tracking-[0.03em] text-ellipsis whitespace-nowrap max-[560px]:max-w-[26vw]">
          {track.title}
        </span>
        <Scrubber
          trackClass="h-[18px]"
          cut={8}
          className="min-w-[64px] flex-1"
        />
        {/* The timecode is the first thing to go when the dismiss control and
            the bar compete for a narrow viewport — the fill still carries it. */}
        <span className="max-[560px]:hidden">
          <BarTime />
        </span>
        <button
          onClick={p.dismissMiniPlayer}
          aria-label="Hide the now playing bar"
          className="cut-r h-11 w-11 flex-none cursor-pointer border border-white/40 bg-transparent text-sm text-white transition-colors duration-200 [--cut:8px] hover:bg-white hover:text-ink"
        >
          <span aria-hidden="true">✕</span>
        </button>
      </div>
    </>
  );
}
