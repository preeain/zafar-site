import { shows } from "@/content/site";
import Reveal from "./Reveal";

export default function TourSection() {
  return (
    <section
      id="tour"
      className="bg-white px-[clamp(20px,4vw,56px)] pb-[clamp(56px,7vw,110px)]"
    >
      <div className="mx-auto max-w-[1240px]">
        <Reveal>
          <p className="overline-label m-0 mb-2.5 text-ink/60">06 — TOUR</p>
          <h2 className="section-h2">ON STAGE</h2>
        </Reveal>
        <Reveal>
          <div className="flex gap-5 border-b border-ink px-1.5 pb-3 text-[11px] font-semibold tracking-[0.2em] text-ink/60 max-[760px]:hidden">
            <span className="w-[110px]">DATE</span>
            <span className="w-[180px]">CITY</span>
            <span className="flex-1">VENUE</span>
            <span className="w-[130px]" />
          </div>
          {shows.map((show, i) => (
            <div
              key={i}
              className="flex flex-wrap items-center gap-x-5 gap-y-3 border-b border-ink/25 p-[20px_6px] transition-[padding-left] duration-200 [transition-timing-function:var(--ease-zaf)] hover:pl-4"
            >
              <span className="tnum w-[110px] text-[13px] font-semibold tracking-[0.08em]">
                {show.date}
              </span>
              <span className="w-[180px] font-display text-[17px]">
                {show.city}
              </span>
              <span className="min-w-[140px] flex-1 text-sm tracking-[0.06em] text-ink/65">
                {show.venue}
              </span>
              <a
                href={show.tickets}
                className="cut-r inline-flex min-h-11 min-w-[130px] items-center justify-center border border-ink bg-white pr-[26px] pl-4 text-xs font-semibold tracking-[0.16em] text-ink transition-colors duration-200 [--cut:12px] hover:border-red hover:bg-red hover:text-white"
              >
                TICKETS
              </a>
            </div>
          ))}
          <p className="m-0 mx-1.5 mt-4 text-xs tracking-[0.14em] text-ink/60">
            MORE DATES SOON — JOIN{" "}
            <a href="#community" className="border-b border-ink font-semibold text-ink">
              THE CIRCLE
            </a>{" "}
            FOR PRESALES.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
