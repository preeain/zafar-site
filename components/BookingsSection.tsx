"use client";

import { useSiteContent } from "@/lib/site-content";
import Reveal from "./Reveal";

const panelClass =
  "bookings-panel cut-corner border border-ink p-[32px_28px]";

export default function BookingsSection() {
  const { bookings } = useSiteContent();
  return (
    <section
      id="bookings"
      className="border-t border-ink bg-white p-[clamp(56px,7vw,110px)_clamp(20px,4vw,56px)]"
    >
      <div className="mx-auto max-w-[1240px]">
        <Reveal>
          <p className="overline-label m-0 mb-2.5 text-ink/60">
            07 — WORK WITH ZAFAR
          </p>
          <h2 className="bookings-title section-h2">BOOKINGS &amp; COLLABORATIONS</h2>
        </Reveal>
        <Reveal className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-3.5 max-[760px]:grid-cols-1">
          <div className={panelClass}>
            <p className="m-0 text-[11px] font-semibold tracking-[0.22em] text-ink/60">
              LIVE BOOKINGS
            </p>
            <p className="mt-4 mb-[26px] max-w-[420px] text-[15px] leading-[1.6] text-ink text-pretty">
              {bookings.live.copy}
            </p>
            {bookings.live.email ? (
              <>
                <a
                  href={`mailto:${bookings.live.email}`}
                  className="cut-r inline-flex min-h-12 items-center bg-ink pr-[38px] pl-6 text-[13px] font-semibold tracking-[0.16em] text-white transition-[background,transform] duration-200 [--cut:14px] hover:translate-x-1 hover:bg-red hover:text-white"
                >
                  BOOK A SHOW
                </a>
                <p className="m-0 mt-3.5 text-xs tracking-[0.12em] text-ink/60">
                  {bookings.live.email}
                </p>
              </>
            ) : (
              <p className="m-0 text-xs font-semibold tracking-[0.14em] text-ink/60">
                BOOKING DETAILS COMING SOON
              </p>
            )}
          </div>
          <div className={panelClass}>
            <p className="m-0 text-[11px] font-semibold tracking-[0.22em] text-ink/60">
              COLLABORATIONS
            </p>
            <p className="mt-4 mb-[26px] max-w-[420px] text-[15px] leading-[1.6] text-ink text-pretty">
              {bookings.collabs.copy}
            </p>
            {bookings.collabs.email ? (
              <>
                <a
                  href={`mailto:${bookings.collabs.email}`}
                  className="cut-r inline-flex min-h-12 items-center border border-ink bg-white pr-[38px] pl-6 text-[13px] font-semibold tracking-[0.16em] text-ink transition-[background,color,transform] duration-200 [--cut:14px] hover:translate-x-1 hover:bg-ink hover:text-white"
                >
                  START A COLLAB
                </a>
                <p className="m-0 mt-3.5 text-xs tracking-[0.12em] text-ink/60">
                  {bookings.collabs.email}
                </p>
              </>
            ) : (
              <p className="m-0 text-xs font-semibold tracking-[0.14em] text-ink/60">
                COLLABORATION DETAILS COMING SOON
              </p>
            )}
          </div>
        </Reveal>
        <Reveal className="bookings-panel cut-corner mt-3.5 flex flex-wrap items-center gap-x-12 gap-y-6 border border-ink p-[32px_28px]">
          <div className="min-w-[min(260px,100%)] flex-1">
            <p className="m-0 mb-3.5 text-[11px] font-semibold tracking-[0.22em] text-ink/60">
              PRESS
            </p>
            <p className="m-0 mb-2 font-display text-[clamp(18px,1.8vw,24px)] leading-[1.25] text-balance">
              {bookings.press.quote}
            </p>
            <p className="m-0 text-xs font-semibold tracking-[0.16em] text-ink/60">
              {bookings.press.publication}
            </p>
          </div>
          <div className="flex flex-col items-start gap-3">
            {bookings.press.kitHref ? (
              <a
                href={bookings.press.kitHref}
                className="cut-r inline-flex min-h-12 items-center bg-ink pr-[38px] pl-6 text-[13px] font-semibold tracking-[0.16em] text-white transition-[background,transform] duration-200 [--cut:14px] hover:translate-x-1 hover:bg-red hover:text-white"
              >
                DOWNLOAD PRESS KIT ↓
              </a>
            ) : (
              <p className="m-0 text-xs font-semibold tracking-[0.14em] text-ink/60">
                DOWNLOADS COMING SOON
              </p>
            )}
            {bookings.press.email && (
              <p className="m-0 text-xs tracking-[0.12em] text-ink/60">
                PHOTOS · BIO · LOGO — {bookings.press.email}
              </p>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
