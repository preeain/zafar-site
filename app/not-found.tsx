import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center bg-white px-[clamp(20px,6vw,88px)] py-16 text-ink">
      <div className="max-w-3xl">
        <p className="mb-4 text-xs font-semibold tracking-[.24em] text-ink/65">404 · OFF AIR</p>
        <h1 className="font-display text-[clamp(48px,10vw,112px)] leading-[.86]">THIS PAGE LEFT THE STUDIO.</h1>
        <Link href="/" className="cut-r mt-10 inline-flex min-h-12 items-center bg-ink pr-9 pl-6 text-xs font-semibold tracking-[.16em] text-white hover:bg-red">BACK TO ZAFAR</Link>
      </div>
    </main>
  );
}
