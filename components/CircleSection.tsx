"use client";

import Image from "next/image";
import { useState, type FormEvent } from "react";
import { circle } from "@/content/site";
import Reveal from "./Reveal";

/**
 * Stub submit handler — swap in a real mailing-list API call
 * (Mailchimp/Klaviyo/etc.) capturing email + city.
 */
async function subscribe(email: string, city: string): Promise<void> {
  void email;
  void city;
}

export default function CircleSection() {
  const [joined, setJoined] = useState(false);

  async function onJoin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    await subscribe(String(data.get("email") ?? ""), String(data.get("city") ?? ""));
    setJoined(true);
  }

  const inputClass =
    "min-h-12 border-0 border-b border-white/50 bg-transparent px-0.5 font-body text-sm tracking-[0.12em] text-white placeholder:text-white/55";

  return (
    <section
      id="community"
      className="bg-ink p-[clamp(72px,9vw,140px)_clamp(20px,4vw,56px)] text-white"
    >
      <Reveal className="mx-auto max-w-[760px] text-center">
        <Image
          src="/img/logo-black.png"
          alt="ZAFAR sandhu"
          width={1600}
          height={571}
          sizes="(max-width: 760px) 24vw, 280px"
          className="mx-auto mb-[34px] block h-auto w-[clamp(180px,24vw,280px)] invert"
        />
        <h2 className="m-0 mb-4 font-display text-[clamp(34px,4.5vw,60px)] leading-[0.95] text-balance">
          THE CIRCLE
        </h2>
        <p className="mx-auto mt-0 mb-11 max-w-[480px] text-[15px] leading-[1.6] text-white/72 text-pretty">
          {circle.copy}
        </p>
        {joined ? (
          /* White, not red: red is reserved for CTAs and live states, and a
             confirmation is neither. Announced so it is not silent to AT. */
          <p
            role="status"
            aria-live="polite"
            className="m-0 font-display text-[22px] tracking-[0.04em] text-white"
          >
            YOU ARE IN THE CIRCLE.
          </p>
        ) : (
          <form
            onSubmit={onJoin}
            className="flex items-end justify-center gap-5 max-[760px]:flex-col max-[760px]:items-stretch"
          >
            <input
              type="email"
              required
              name="email"
              placeholder="EMAIL"
              aria-label="Email"
              className={`${inputClass} flex-2`}
            />
            <input
              type="text"
              name="city"
              placeholder="CITY"
              aria-label="City"
              className={`${inputClass} flex-1`}
            />
            <button
              type="submit"
              className="cut-r min-h-12 cursor-pointer border-none bg-red pr-10 pl-[26px] text-[13px] font-semibold tracking-[0.18em] text-white transition-colors duration-200 [--cut:14px] hover:bg-white hover:text-ink"
            >
              JOIN
            </button>
          </form>
        )}
        <p className="mx-auto mt-[22px] mb-0 max-w-[440px] text-[11px] leading-[1.6] tracking-[0.06em] text-white/55">
          {circle.privacy}{" "}
          <a
            href={circle.privacyPolicy.href}
            className="border-b border-white/40 text-white/60"
          >
            {circle.privacyPolicy.label}
          </a>
        </p>
        <p className="mx-auto mt-3.5 mb-0 text-xs font-semibold tracking-[0.16em]">
          <a
            href={circle.whatsapp.href}
            target="_blank"
            rel="noopener"
            className="inline-flex min-h-11 items-center border-b-2 border-transparent text-white/70 hover:border-white hover:text-white"
          >
            {circle.whatsapp.label}
          </a>
        </p>
      </Reveal>
    </section>
  );
}
