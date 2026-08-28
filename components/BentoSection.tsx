"use client";

import { useSiteContent } from "@/lib/site-content";
import Reveal from "./Reveal";
import TrackedLink from "./TrackedLink";

function tileColors(key: string, redTile: string) {
  return redTile === key
    ? "bg-red text-white"
    : "bg-white text-ink";
}

const tileBase =
  "cut-corner block border border-ink p-7 transition-transform duration-300 [transition-timing-function:var(--ease-zaf)] hover:-translate-y-1";

export default function BentoSection() {
  const { bento, config } = useSiteContent();
  return (
    <section
      id="world"
      className="bg-white px-[clamp(20px,4vw,56px)] pb-[clamp(56px,7vw,110px)]"
    >
      <div className="mx-auto max-w-[1240px]">
        <Reveal>
          <p className="overline-label m-0 mb-2.5 text-ink/60">
            05 — THE WORLD OF ZAFAR
          </p>
          <h2 className="section-h2">EVERYTHING, ONE PLACE</h2>
        </Reveal>
        <Reveal className="grid grid-cols-4 gap-3.5 max-[760px]:grid-cols-1">
          <TrackedLink
            href={bento.release.href}
            target="_blank"
            rel="noopener noreferrer"
            eventName="listen_game"
            eventProperties={{ placement: "world_tile", platform: "spotify" }}
            className={`${tileBase} ${tileColors("release", config.redTile)} relative col-span-2 min-h-60 max-[760px]:col-span-1`}
          >
            <p className="m-0 text-[11px] font-semibold tracking-[0.22em] opacity-60">
              {bento.release.overline}
            </p>
            <p className="m-0 mt-[18px] font-display text-[clamp(26px,2.6vw,38px)] leading-none">
              {bento.release.title}
            </p>
            <p className="absolute bottom-6 left-7 m-0 text-[13px] font-semibold tracking-[0.14em]">
              {bento.release.action}
            </p>
          </TrackedLink>
          <a
            href={bento.show.href}
            className={`${tileBase} ${tileColors("show", config.redTile)} relative min-h-60`}
          >
            <p className="m-0 text-[11px] font-semibold tracking-[0.22em] opacity-75">
              {bento.show.overline}
            </p>
            <p className="tnum m-0 mt-[18px] font-display text-[clamp(22px,2vw,30px)] leading-[1.05]">
              {bento.show.city}
              <br />
              {bento.show.date}
            </p>
            <p className="absolute bottom-6 left-7 m-0 text-[13px] font-semibold tracking-[0.14em]">
              {bento.show.action}
            </p>
          </a>
          <a
            href={bento.community.href}
            className={`${tileBase} ${tileColors("community", config.redTile)} relative min-h-60`}
          >
            <p className="m-0 text-[11px] font-semibold tracking-[0.22em] opacity-60">
              {bento.community.overline}
            </p>
            <p className="m-0 mt-[18px] font-display text-[clamp(22px,2vw,30px)] leading-[1.05]">
              {bento.community.title}
            </p>
            <p className="absolute bottom-6 left-7 m-0 text-[13px] font-semibold tracking-[0.14em]">
              {bento.community.action}
            </p>
          </a>
          <a
            href={bento.merch.href}
            className={`${tileBase} ${tileColors("merch", config.redTile)} col-span-full flex min-h-[150px] flex-wrap items-center justify-between gap-x-8 gap-y-3 p-[26px_44px_26px_28px]`}
          >
            <div>
              <p className="m-0 mb-3 text-[11px] font-semibold tracking-[0.22em] opacity-60">
                {bento.merch.overline}
              </p>
              <p className="m-0 font-display text-[clamp(26px,2.6vw,38px)] leading-none">
                {bento.merch.title}
              </p>
            </div>
            <p className="m-0 text-[13px] font-semibold tracking-[0.14em]">
              {bento.merch.action}
            </p>
          </a>
        </Reveal>
      </div>
    </section>
  );
}
