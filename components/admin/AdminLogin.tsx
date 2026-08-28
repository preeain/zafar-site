"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export default function AdminLogin({ configured }: { configured: boolean }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true); setError("");
    const data = new FormData(event.currentTarget);
    try {
      const client = createSupabaseBrowserClient();
      const { error: signInError } = await client.auth.signInWithPassword({
        email: String(data.get("email") ?? "").trim(),
        password: String(data.get("password") ?? ""),
      });
      if (signInError) throw signInError;
      router.replace("/admin"); router.refresh();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Sign in failed.");
      setBusy(false);
    }
  }

  return (
    <main className="admin-shell min-h-screen bg-ink text-white">
      <div className="grid min-h-screen lg:grid-cols-[1.15fr_.85fr]">
        <section className="relative hidden overflow-hidden border-r border-white/20 lg:block">
          <Image src="/img/hero-studio.jpg" alt="" fill preload sizes="(min-width: 1024px) 58vw, 1px" className="object-cover grayscale" />
          <div className="absolute inset-0 bg-ink/45" />
          <p className="absolute bottom-10 left-10 max-w-md font-display text-5xl leading-[.9]">THE WORK BEHIND THE MUSIC.</p>
        </section>
        <section className="flex items-center p-6 sm:p-12">
          <form onSubmit={submit} className="mx-auto w-full max-w-md">
            <Image src="/img/logo-black.png" alt="Zafar Sandhu" width={1600} height={571} className="mb-14 h-auto w-52 invert" />
            <p className="mb-3 text-xs font-semibold tracking-[.24em] text-white/60">PRIVATE CONTROL ROOM</p>
            <h1 className="mb-10 font-display text-4xl">SIGN IN</h1>
            {!configured && <p role="alert" className="mb-6 border border-red p-4 text-sm">Admin setup is incomplete. Add the Supabase variables and ADMIN_EMAILS first.</p>}
            <label className="mb-6 block text-xs font-semibold tracking-[.16em]">EMAIL
              <input name="email" type="email" autoComplete="email" required disabled={!configured} className="mt-2 min-h-12 w-full border border-white/40 bg-transparent px-4 text-base tracking-normal outline-none focus:border-red" />
            </label>
            <label className="mb-8 block text-xs font-semibold tracking-[.16em]">PASSWORD
              <input name="password" type="password" autoComplete="current-password" required disabled={!configured} className="mt-2 min-h-12 w-full border border-white/40 bg-transparent px-4 text-base tracking-normal outline-none focus:border-red" />
            </label>
            {error && <p role="alert" className="mb-5 text-sm text-white">{error}</p>}
            <button disabled={busy || !configured} className="cut-r min-h-13 w-full cursor-pointer bg-red px-8 text-sm font-semibold tracking-[.18em] disabled:opacity-40">{busy ? "SIGNING IN…" : "ENTER ADMIN"}</button>
          </form>
        </section>
      </div>
    </main>
  );
}
