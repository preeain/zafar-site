"use client";

import Image from "next/image";
import { useState } from "react";
import { track } from "@vercel/analytics";
import { useSiteContent } from "@/lib/site-content";
import Reveal from "./Reveal";
import TrackedLink from "./TrackedLink";

export default function VisualsSection() {
  const { visuals } = useSiteContent();
  const [playing, setPlaying] = useState(false);
  return (
    <section
      id="visuals"
      className="bg-white p-[clamp(56px,7vw,110px)_clamp(20px,4vw,56px)]"
    >
      <div className="mx-auto max-w-[1240px]">
        <Reveal>
          <p className="overline-label m-0 mb-2.5 text-ink/60">02 — VISUALS</p>
          <h2 className="section-h2">WATCH</h2>
        </Reveal>
        <Reveal className="cut-crop relative aspect-video bg-ink">
          {playing ? (
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${visuals.youtubeId}?autoplay=1&rel=0`}
              title={visuals.caption}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 h-full w-full border-none"
            />
          ) : (
            <button
              type="button"
              onClick={() => {
                track("watch_game", { placement: "video_facade", platform: "youtube" });
                setPlaying(true);
              }}
              aria-label={`Play ${visuals.caption}`}
              className="group absolute inset-0 cursor-pointer border-0 bg-ink p-0 text-white"
            >
              <Image
                src={`https://i.ytimg.com/vi/${visuals.youtubeId}/sddefault.jpg`}
                alt="Zafar Sandhu and Pree Mayall in the GAME official video"
                fill
                sizes="(max-width: 760px) 100vw, 1240px"
                className="object-cover opacity-90 transition-[transform,opacity] duration-500 group-hover:scale-[1.015] group-hover:opacity-100"
              />
              <span className="cut-r absolute top-1/2 left-1/2 inline-flex min-h-14 -translate-x-1/2 -translate-y-1/2 items-center bg-red pr-9 pl-6 text-xs font-semibold tracking-[.16em] text-white group-hover:bg-white group-hover:text-ink">
                PLAY VIDEO ▶
              </span>
            </button>
          )}
        </Reveal>
        <p className="m-0 mt-3.5 mb-10 text-xs font-semibold tracking-[0.18em] text-ink/60">
          {visuals.caption}
        </p>
        <p className="mt-[-24px] mb-10 max-w-[680px] text-sm leading-relaxed text-ink/65">
          {visuals.description}{" "}
          <TrackedLink
            href={visuals.youtubeHref}
            target="_blank"
            rel="noopener noreferrer"
            eventName="watch_game"
            eventProperties={{ placement: "visuals", platform: "youtube" }}
            className="border-b border-ink font-semibold text-ink"
          >
            WATCH WITH CAPTIONS ON YOUTUBE ↗
          </TrackedLink>
        </p>
        <Reveal>
          <p className="overline-label m-0 mb-4 text-ink/60">
            BEHIND THE SCENES
          </p>
          <div className="flex gap-3.5 overflow-x-auto pb-2.5">
            {visuals.bts.map((caption, i) => (
              <div key={caption} className="w-[min(340px,78vw)] flex-none">
                <div className="flex h-[210px] w-full items-center justify-center border border-ink/25 bg-warm-paper">
                  <span className="text-[11px] font-semibold tracking-[0.18em] text-ink/60">
                    BTS IMAGE 0{i + 1} · COMING SOON
                  </span>
                </div>
                <p className="m-0 mt-2.5 text-[11px] font-semibold tracking-[0.18em] text-ink/60">
                  {caption}
                </p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
