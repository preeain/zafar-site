"use client";

import Image from "next/image";
import { useSiteContent } from "@/lib/site-content";
import { links } from "@/content/site";
import { usePlayer, useElapsed, useProgressPct, fmt } from "@/lib/player";
import TrackedLink from "./TrackedLink";

/**
 * Leaf: re-renders on the playback tick so the plate around it does not.
 * `isTop` decides whether there is a position to show at all — pausing must
 * hold the fill where it is, not empty it — while `playing` only picks the
 * colour, so the red reads as live rather than as progress.
 */
function PlateProgress({ isTop, playing }: { isTop: boolean; playing: boolean }) {
  const pct = useProgressPct(0, isTop);
  return (
    <span
      className={`progress-fill cut-r block h-full w-full [--cut:4px] ${playing ? "bg-red" : "bg-ink"}`}
      style={{ transform: `translateX(${(pct - 100).toFixed(2)}%)` }}
    />
  );
}

/** Leaf: same reason — the timecode ticks, the plate does not. */
function PlateTime({ show }: { show: boolean }) {
  const { tracks } = useSiteContent();
  const elapsed = useElapsed();
  return (
    <span aria-hidden="true" className="tnum mt-[5px] block text-[11px] text-ink/60">
      {show ? `${fmt(elapsed)} / ${fmt(tracks[0].dur)}` : ""}
    </span>
  );
}

export default function Hero() {
  const { hero, tracks, visuals } = useSiteContent();
  const p = usePlayer();
  const topTrack = tracks[0];
  const hasPreview = Boolean(topTrack.src);
  const isTop = p.currentTrack === 0;
  const topPlaying = p.playing && isTop;

  return (
    <section
      id="hero"
      className="relative flex min-h-[calc(100dvh-64px)] items-center overflow-hidden bg-white max-[760px]:min-h-0 max-[760px]:flex-col-reverse"
    >
      <div
        className="absolute top-0 right-0 bottom-0 w-[clamp(280px,44vw,720px)] animate-[zafFade_1.1s_var(--ease-zaf)_0.15s_both] [clip-path:polygon(clamp(48px,8vw,132px)_0,100%_0,100%_100%,0_100%)] max-[760px]:relative! max-[760px]:h-[clamp(220px,28dvh,250px)] max-[760px]:w-full! max-[760px]:[clip-path:polygon(0_9vw,100%_0,100%_100%,0_100%)]!"
      >
        <Image
          src="/img/hero-studio.jpg"
          alt="Zafar Sandhu, seated on a stool in a white studio"
          fill
          preload
          sizes="(max-width: 760px) 100vw, 44vw"
          className="object-cover object-[50%_22%]"
        />
      </div>
      <div className="relative z-[2] w-full p-[clamp(40px,6vw,96px)_clamp(20px,4vw,56px)] max-[760px]:px-5 max-[760px]:pt-7 max-[760px]:pb-8">
        <h1 className="m-0">
          <Image
            src="/img/logo-black.png"
            alt="Zafar Sandhu"
            width={1600}
            height={571}
            loading="eager"
            sizes="(max-width: 760px) 84vw, min(60vw, 880px)"
            className="mb-[clamp(28px,3.5vw,52px)] block h-auto w-[clamp(320px,60vw,880px)] animate-[zafSlide_0.9s_var(--ease-zaf)_both] max-[760px]:mb-6 max-[760px]:w-[84vw]"
          />
        </h1>
        <p className="m-0 mb-[18px] animate-[zafUp_0.8s_var(--ease-zaf)_0.3s_both] text-[clamp(14px,1.3vw,17px)] font-semibold tracking-[0.22em] text-ink max-[760px]:mb-3">
          {hero.tagline}
        </p>
        <div className="flex animate-[zafUp_0.8s_var(--ease-zaf)_0.4s_both] flex-wrap items-center gap-[clamp(14px,2vw,24px)] max-[760px]:gap-2.5">
          <TrackedLink
            href={topTrack.link}
            target="_blank"
            rel="noopener noreferrer"
            eventName="listen_game"
            eventProperties={{ placement: "hero", platform: "spotify" }}
            className="cut-r inline-flex min-h-[52px] items-center bg-red pr-11 pl-[30px] text-sm font-semibold tracking-[0.18em] text-white transition-[background,transform] duration-200 [transition-timing-function:ease,var(--ease-zaf)] hover:translate-x-1 hover:bg-ink hover:text-white"
          >
            LISTEN ↗
          </TrackedLink>
          <TrackedLink
            href={visuals.youtubeHref}
            target="_blank"
            rel="noopener noreferrer"
            eventName="watch_game"
            eventProperties={{ placement: "hero", platform: "youtube" }}
            className="cut-r inline-flex min-h-[52px] items-center gap-2.5 bg-ink pr-10 pl-6 text-[13px] font-semibold tracking-[0.16em] text-white transition-[background,transform] duration-200 [transition-timing-function:ease,var(--ease-zaf)] hover:translate-x-1 hover:bg-red hover:text-white"
          >
            <span aria-hidden="true" className="text-[10px] text-red">
              ▶
            </span>
            LATEST VIDEO
          </TrackedLink>
        </div>
        {hasPreview ? (
          <button
            onClick={p.playTop}
            aria-label={topPlaying ? `Pause ${topTrack.title}` : `Play ${topTrack.title}, top single`}
            className="cut-r relative mt-[clamp(24px,3vw,40px)] flex animate-[zafUp_0.8s_var(--ease-zaf)_0.5s_both] cursor-pointer items-center gap-[18px] border border-ink bg-white p-[12px_34px_16px_12px] text-left transition-[transform,background] duration-200 [transition-timing-function:var(--ease-zaf),ease] [--cut:20px] hover:translate-x-1 hover:bg-warm-paper max-[760px]:mt-[18px]"
          >
            <TopSingleArtwork />
            <span aria-hidden="true" className="block">
              <span className={`block text-[10px] font-semibold tracking-[0.24em] ${topPlaying ? "text-red" : "text-ink/65"}`}>
                {topPlaying ? "NOW PLAYING" : "TOP SINGLE"}
              </span>
              <span className="mt-[5px] block font-display text-[17px] text-ink">{topTrack.title}</span>
            </span>
            <span aria-hidden="true" className="ml-3.5 block text-right">
              <span className="block text-xs font-semibold tracking-[0.14em] text-ink">{topPlaying ? "❚❚" : "PLAY ▶"}</span>
              <PlateTime show={isTop && p.started} />
            </span>
            <span aria-hidden="true" className="absolute right-0 bottom-0 left-0 block h-1 overflow-hidden bg-ink/12">
              <PlateProgress isTop={isTop} playing={topPlaying} />
            </span>
          </button>
        ) : (
          <TrackedLink
            href={topTrack.link}
            target="_blank"
            rel="noopener noreferrer"
            eventName="listen_game"
            eventProperties={{ placement: "top_single", platform: "spotify" }}
            className="cut-r relative mt-[clamp(24px,3vw,40px)] flex w-fit animate-[zafUp_0.8s_var(--ease-zaf)_0.5s_both] items-center gap-[18px] border border-ink bg-white p-[12px_34px_12px_12px] text-left transition-[transform,background] duration-200 [transition-timing-function:var(--ease-zaf),ease] [--cut:20px] hover:translate-x-1 hover:bg-warm-paper max-[760px]:mt-[18px]"
          >
            <TopSingleArtwork />
            <span className="block">
              <span className="block text-[10px] font-semibold tracking-[0.24em] text-ink/65">TOP SINGLE</span>
              <span className="mt-[5px] block font-display text-[17px] text-ink">{topTrack.title}</span>
            </span>
            <span className="ml-3.5 block text-xs font-semibold tracking-[0.14em] text-ink">STREAM ↗</span>
          </TrackedLink>
        )}
        <div className="mt-[18px] flex animate-[zafUp_0.8s_var(--ease-zaf)_0.6s_both] flex-wrap items-center gap-x-[26px] gap-y-1 max-[760px]:mt-2">
          {hero.streamingLinks.map((l) =>
            l.href ? (
              <TrackedLink
                key={l.label}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                eventName="streaming_link"
                eventProperties={{ placement: "hero", platform: l.label.toLowerCase() }}
                className="inline-flex min-h-11 items-center border-b-2 border-transparent text-[11px] font-semibold tracking-[0.18em] text-ink/65 hover:border-ink hover:text-ink"
              >
                {l.label} ↗
              </TrackedLink>
            ) : (
              <span
                key={l.label}
                className="inline-flex min-h-11 items-center text-[11px] font-semibold tracking-[0.18em] text-ink/40"
              >
                {l.label} · SOON
              </span>
            ),
          )}
        </div>
      </div>
    </section>
  );
}

function TopSingleArtwork() {
  return (
    <span className="cut-r block h-14 w-14 flex-none overflow-hidden bg-ink [--cut:10px]">
      <Image
        src={links.gameArtwork}
        alt=""
        width={112}
        height={112}
        sizes="56px"
        className="block h-full w-full object-cover"
      />
    </span>
  );
}
