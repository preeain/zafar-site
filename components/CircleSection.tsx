"use client";

import Image from "next/image";
import { useState, type FormEvent } from "react";
import { useSiteContent } from "@/lib/site-content";
import { track } from "@vercel/analytics";
import Reveal from "./Reveal";

async function subscribe(
  email: string,
  city: string,
  website: string,
  consent: boolean,
): Promise<void> {
  const response = await fetch("/api/subscribe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, city, website, consent }),
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as
      | { error?: string }
      | null;
    throw new Error(body?.error ?? "Could not join right now. Please try again.");
  }
}

export default function CircleSection() {
  const { circle } = useSiteContent();
  const [joined, setJoined] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function onJoin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    setSubmitting(true);
    setError("");
    try {
      await subscribe(
        String(data.get("email") ?? ""),
        String(data.get("city") ?? ""),
        String(data.get("website") ?? ""),
        data.get("consent") === "on",
      );
      track("circle_signup", { city_provided: Boolean(data.get("city")) });
      setJoined(true);
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : "Could not join right now. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
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
            className="flex flex-wrap items-end justify-center gap-5 max-[760px]:flex-col max-[760px]:items-stretch"
          >
            <div className="pointer-events-none absolute h-px w-px overflow-hidden opacity-0">
              <label htmlFor="circle-website">Website</label>
              <input
                id="circle-website"
                name="website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
              />
            </div>
            <label htmlFor="circle-email" className="sr-only">
              Email address
            </label>
            <input
              id="circle-email"
              type="email"
              required
              name="email"
              placeholder="EMAIL…"
              autoComplete="email"
              spellCheck={false}
              className={`${inputClass} flex-2`}
            />
            <label htmlFor="circle-city" className="sr-only">
              City
            </label>
            <input
              id="circle-city"
              type="text"
              name="city"
              placeholder="CITY…"
              autoComplete="address-level2"
              className={`${inputClass} flex-1`}
            />
            <label className="flex w-full cursor-pointer items-start justify-center gap-3 text-left text-xs leading-relaxed text-white/75 max-[760px]:justify-start">
              <input name="consent" type="checkbox" required className="mt-0.5 h-4 w-4 flex-none accent-red" />
              <span>I agree to receive Zafar Sandhu music, video, show, and presale updates. I can unsubscribe anytime.</span>
            </label>
            <button
              type="submit"
              disabled={submitting}
              className="cut-r min-h-12 cursor-pointer border-none bg-red pr-10 pl-[26px] text-[13px] font-semibold tracking-[0.18em] text-white transition-colors duration-200 [--cut:14px] hover:bg-white hover:text-ink disabled:cursor-wait disabled:opacity-65"
            >
              {submitting ? "JOINING…" : "JOIN"}
            </button>
          </form>
        )}
        {error && (
          <p
            role="alert"
            className="mx-auto mt-4 mb-0 max-w-[480px] text-sm leading-relaxed text-white"
          >
            {error}
          </p>
        )}
        <p className="mx-auto mt-[22px] mb-0 max-w-[440px] text-[11px] leading-[1.6] tracking-[0.06em] text-white/55">
          {circle.privacy}{" "}
          {circle.privacyPolicy.href ? (
            <a
              href={circle.privacyPolicy.href}
              className="border-b border-white/40 text-white/60"
            >
              {circle.privacyPolicy.label}
            </a>
          ) : (
            <span className="text-white/60">Privacy details coming soon.</span>
          )}
        </p>
        <p className="mx-auto mt-3.5 mb-0 text-xs font-semibold tracking-[0.16em]">
          {circle.whatsapp.href ? (
            <a
              href={circle.whatsapp.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center border-b-2 border-transparent text-white/70 hover:border-white hover:text-white"
            >
              {circle.whatsapp.label}
            </a>
          ) : (
            <span className="inline-flex min-h-11 items-center text-white/50">
              {circle.whatsapp.label}
            </span>
          )}
        </p>
      </Reveal>
    </section>
  );
}
