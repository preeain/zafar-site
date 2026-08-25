import { visuals } from "@/content/site";
import Reveal from "./Reveal";

export default function VisualsSection() {
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
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${visuals.youtubeId}`}
            title={visuals.caption}
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 h-full w-full border-none"
          />
        </Reveal>
        <p className="m-0 mt-3.5 mb-10 text-xs font-semibold tracking-[0.18em] text-ink/60">
          {visuals.caption}
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
                    [BTS STILL 0{i + 1}]
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
