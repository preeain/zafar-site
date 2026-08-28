"use client";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main className="flex min-h-screen items-center bg-ink px-[clamp(20px,6vw,88px)] py-16 text-white">
      <div className="max-w-3xl">
        <p className="mb-4 text-xs font-semibold tracking-[.24em] text-white/70">SIGNAL INTERRUPTED</p>
        <h1 className="font-display text-[clamp(48px,10vw,112px)] leading-[.86]">THE SITE HIT A BAD NOTE.</h1>
        <p className="mt-7 max-w-xl text-base leading-7 text-white/75">Nothing was submitted. Try loading this part of the site again.</p>
        <button type="button" onClick={reset} className="cut-r mt-10 min-h-12 bg-red pr-9 pl-6 text-xs font-semibold tracking-[.16em] text-white hover:bg-white hover:text-ink">TRY AGAIN</button>
      </div>
    </main>
  );
}
