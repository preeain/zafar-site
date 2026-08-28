"use client";

import Image from "next/image";
import { useSiteContent } from "@/lib/site-content";
import TrackedLink from "./TrackedLink";

export default function Footer() {
  const { footer } = useSiteContent();
  return (
    <footer
      id="contact"
      className="border-t border-ink bg-white p-[clamp(40px,5vw,72px)_clamp(20px,4vw,56px)]"
    >
      <div className="mx-auto flex max-w-[1240px] flex-wrap items-center justify-between gap-6 max-[760px]:flex-col max-[760px]:items-start max-[760px]:gap-7">
        <Image
          src="/img/logo-black.png"
          alt="ZAFAR sandhu"
          width={1600}
          height={571}
          sizes="56px"
          className="block h-5 w-auto"
        />
        {(footer.mgmtEmail || footer.pressEmail) && (
          <div className="flex flex-wrap items-center gap-[clamp(20px,3vw,44px)] text-xs font-medium tracking-[0.12em]">
            {footer.mgmtEmail && (
              <a
                href={`mailto:${footer.mgmtEmail}`}
                className="inline-flex min-h-11 items-center text-ink/60 hover:text-ink"
              >
                MGMT — {footer.mgmtEmail}
              </a>
            )}
            {footer.pressEmail && (
              <a
                href={`mailto:${footer.pressEmail}`}
                className="inline-flex min-h-11 items-center text-ink/60 hover:text-ink"
              >
                PRESS — {footer.pressEmail}
              </a>
            )}
          </div>
        )}
        <div className="flex gap-[22px]">
          {footer.socials.map((s) => (
            <TrackedLink
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              eventName="artist_profile"
              eventProperties={{ placement: "footer", platform: s.label.toLowerCase() }}
              className="inline-flex min-h-11 items-center border-b-2 border-transparent text-xs font-semibold tracking-[0.14em] text-ink hover:border-red"
            >
              {s.label}
            </TrackedLink>
          ))}
        </div>
      </div>
      <p className="mx-auto mt-7 mb-0 max-w-[1240px] text-[11px] tracking-[0.1em] text-ink/60">
        © {footer.year} ZAFAR SANDHU. ALL RIGHTS RESERVED.
      </p>
    </footer>
  );
}
