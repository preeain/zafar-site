"use client";

import Image from "next/image";
import { useState } from "react";
import { useSiteContent } from "@/lib/site-content";
import { links } from "@/content/site";
import { usePlayer, fmt } from "@/lib/player";
import Reveal from "./Reveal";
import Scrubber from "./Scrubber";
import TrackedLink from "./TrackedLink";

export default function MusicSection() {
  const { nextDrop, release, tracks } = useSiteContent();
  const p = usePlayer();
  const [lyricsOpen, setLyricsOpen] = useState(false);
  const track = tracks[p.currentTrack];
  const hasPreview = Boolean(track.src);

  return (
    <section
      id="music"
      className="bg-ink p-[clamp(56px,7vw,110px)_clamp(20px,4vw,56px)] text-white"
    >
      <Reveal className="mx-auto max-w-[1240px]">
        <p className="overline-label m-0 mb-2.5 text-white/55">01 — MUSIC</p>
        <h2 className="section-h2">GAME — OUT NOW</h2>
        <div className="grid grid-cols-2 items-end gap-[clamp(28px,4vw,72px)] max-[760px]:grid-cols-1">
          {/* Transport */}
          <div>
            <p className={`m-0 mb-1.5 text-[11px] font-semibold tracking-[0.24em] ${p.playing ? "text-red" : "text-white/65"}`}>
              {hasPreview && p.playing ? "NOW PLAYING" : hasPreview && p.started ? "PAUSED" : "TOP SINGLE"}
            </p>
            <p className="m-0 mb-[22px] font-display text-[clamp(24px,2.6vw,40px)] leading-none">
              {track.title}
            </p>
            {hasPreview ? <div className="flex items-center gap-[18px]">
              <button
                onClick={p.togglePlay}
                aria-label={
                  p.playing ? `Pause ${track.title}` : `Play ${track.title}`
                }
                className={`cut-r h-14 w-14 cursor-pointer border border-white text-[13px] font-semibold tracking-[0.1em] text-white transition-colors duration-200 [--cut:10px] hover:bg-white hover:text-ink ${p.playing ? "bg-red" : "bg-transparent"}`}
              >
                <span aria-hidden="true">{p.playing ? "❚❚" : "▶"}</span>
              </button>
              <Scrubber
                trackClass="h-[34px]"
                cut={12}
                showTimes
                className="flex-1"
              />
            </div> : (
              <TrackedLink
                href={track.link}
                target="_blank"
                rel="noopener noreferrer"
                eventName="listen_game"
                eventProperties={{ placement: "music_player", platform: "spotify" }}
                className="cut-r inline-flex min-h-13 items-center bg-red pr-11 pl-7 text-sm font-semibold tracking-[.16em] text-white hover:bg-white hover:text-ink"
              >
                LISTEN ON SPOTIFY ↗
              </TrackedLink>
            )}
          </div>
          {/* Tracklist */}
          <div>
            {tracks.map((tr, i) => (
              <div
                key={tr.title}
                className="flex items-stretch border-b border-white/22"
              >
                {tr.src ? <button
                  onClick={() => p.selectTrack(i)}
                  aria-current={i === p.currentTrack ? "true" : undefined}
                  className={`group flex min-h-14 flex-1 cursor-pointer items-center gap-[18px] border-none bg-transparent p-[18px_6px] text-left transition-[color,padding-left] duration-200 hover:pl-3.5 hover:text-white ${i === p.currentTrack ? "text-white" : "text-white/65"}`}
                >
                  <span
                    className={`tnum text-xs tracking-[0.1em] ${i === p.currentTrack ? "text-red" : "text-white/55"}`}
                  >
                    0{i + 1}
                  </span>
                  <span className="flex-1 font-display text-[clamp(16px,1.5vw,21px)] tracking-[0.02em]">
                    {tr.title}
                  </span>
                  <span className="tnum text-xs text-white/55">
                    {fmt(tr.dur)}
                  </span>
                </button> : (
                  <div aria-current={i === p.currentTrack ? "true" : undefined} className="flex min-h-14 flex-1 items-center gap-[18px] p-[18px_6px] text-white">
                    <span className="tnum text-xs tracking-[0.1em] text-red">0{i + 1}</span>
                    <span className="flex-1 font-display text-[clamp(16px,1.5vw,21px)] tracking-[0.02em]">{tr.title}</span>
                    <span className="tnum text-xs text-white/65">{fmt(tr.dur)}</span>
                  </div>
                )}
                {tr.link ? (
                  <TrackedLink
                    href={tr.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    eventName="listen_game"
                    eventProperties={{ placement: "tracklist", platform: "spotify" }}
                    aria-label={`Stream ${tr.title}`}
                    title={`Stream ${tr.title}`}
                    className="flex min-h-11 w-12 items-center justify-center text-[15px] text-white/55 transition-colors duration-200 hover:text-red"
                  >
                    <span aria-hidden="true">↗</span>
                  </TrackedLink>
                ) : (
                  <span
                    aria-label={`Streaming link for ${tr.title} coming soon`}
                    className="flex min-h-11 w-12 items-center justify-center text-[10px] font-semibold text-white/35"
                  >
                    SOON
                  </span>
                )}
              </div>
            ))}
            <p className="m-0 mx-1.5 mt-3.5 text-[11px] tracking-[0.14em] text-white/65">
              OFFICIAL RELEASE · STREAM ON YOUR PREFERRED PLATFORM
            </p>
          </div>
        </div>

        {/* Releases ledger */}
        <Reveal className="mt-[clamp(48px,5vw,80px)]">
          <p className="overline-label m-0 mb-[18px] text-white/55">RELEASES</p>
          <div className="flex flex-wrap items-center gap-x-[22px] gap-y-3.5 border-y border-white/30 p-[18px_6px]">
            <span className="cut-r h-[52px] w-[52px] flex-none overflow-hidden [--cut:9px]">
              <Image
                src={links.gameArtwork}
                alt=""
                width={104}
                height={104}
                sizes="52px"
                className="block h-full w-full object-cover"
              />
            </span>
            <span className="font-display text-[19px]">{release.title}</span>
            <span className="tnum text-xs tracking-[0.12em] text-white/55">
              {release.date}
            </span>
            <span className="min-w-[200px] flex-1 text-xs tracking-[0.1em] text-white/55">
              {release.credits}
            </span>
            <TrackedLink
              href={release.href}
              target="_blank"
              rel="noopener noreferrer"
              eventName="listen_game"
              eventProperties={{ placement: "release_ledger", platform: "spotify" }}
              className="cut-r inline-flex min-h-11 items-center border border-white/50 pr-8 pl-4 text-xs font-semibold tracking-[.14em] text-white hover:bg-white hover:text-ink"
            >
              STREAM ↗
            </TrackedLink>
            {release.lyricsGurmukhi.length > 0 && (
              <button
                onClick={() => setLyricsOpen((v) => !v)}
                aria-expanded={lyricsOpen}
                aria-controls="release-lyrics"
                className="cut-r min-h-11 cursor-pointer border border-white/50 bg-transparent pr-[26px] pl-4 text-xs font-semibold tracking-[0.16em] text-white transition-colors duration-200 [--cut:12px] hover:bg-white hover:text-ink"
              >
                {lyricsOpen ? "HIDE LYRICS" : "LYRICS"}
              </button>
            )}
          </div>
          {lyricsOpen && (
            <div
              id="release-lyrics"
              className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-x-12 gap-y-6 border-b border-white/30 p-[26px_6px]"
            >
              <div>
                <p
                  lang="pa"
                  className="m-0 mb-3 text-[11px] font-semibold tracking-[0.22em] text-white/55"
                >
                  ਗੁਰਮੁਖੀ
                </p>
                <p
                  lang="pa"
                  className="m-0 font-gurmukhi text-[17px] leading-[2] font-semibold text-white/85"
                >
                  {release.lyricsGurmukhi.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </p>
              </div>
              <div>
                <p className="m-0 mb-3 text-[11px] font-semibold tracking-[0.22em] text-white/55">
                  TRANSLITERATION
                </p>
                <p className="m-0 text-[15px] leading-[2.27] text-white/65">
                  {release.lyricsTransliteration.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </p>
              </div>
            </div>
          )}
          {/* Next drop / presave */}
          <div className="flex flex-wrap items-center gap-x-[22px] gap-y-3.5 border-b border-white/30 p-[22px_6px]">
            <span className="text-[11px] font-semibold tracking-[0.24em] text-red">
              NEXT DROP
            </span>
            <span className="font-display text-[19px]">{nextDrop.title}</span>
            <span className="min-w-[140px] flex-1 text-xs tracking-[0.12em] text-white/55">
              {nextDrop.date}
            </span>
            {nextDrop.presaveHref ? (
              <a
                href={nextDrop.presaveHref}
                target="_blank"
                rel="noopener noreferrer"
                className="cut-r inline-flex min-h-12 items-center bg-red pr-9 pl-[22px] text-[13px] font-semibold tracking-[0.16em] text-white transition-colors duration-200 [--cut:14px] hover:bg-white hover:text-ink"
              >
                PRESAVE →
              </a>
            ) : (
              <a href="#community" className="cut-r inline-flex min-h-12 items-center border border-white/50 pr-8 pl-5 text-xs font-semibold tracking-[0.16em] text-white hover:bg-white hover:text-ink">
                JOIN THE CIRCLE →
              </a>
            )}
          </div>
        </Reveal>
      </Reveal>
    </section>
  );
}
