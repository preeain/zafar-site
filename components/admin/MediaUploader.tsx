"use client";

import { useState } from "react";

export default function MediaUploader() {
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ url?: string; error?: string }>({});
  async function upload(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setResult({});
    const response = await fetch("/api/admin/upload", { method: "POST", body: new FormData(event.currentTarget) });
    const body = await response.json(); setResult(response.ok ? { url: body.url } : { error: body.error }); setBusy(false);
  }
  return <form onSubmit={upload} className="max-w-3xl border border-ink bg-white p-6 sm:p-8">
    <p className="mb-2 text-[10px] font-semibold tracking-[.22em] text-ink/55">ZAFAR PUBLIC STORAGE</p><h2 className="mb-3 font-display text-3xl">UPLOAD MEDIA</h2>
    <p className="mb-8 text-sm leading-relaxed text-ink/65">Upload optimized artwork, photography, audio previews, or a press kit up to 4 MB. Copy the returned URL into the relevant content field.</p>
    <label className="mb-6 block text-xs font-semibold tracking-[.14em]">DESTINATION<select name="folder" className="mt-2 min-h-12 w-full border border-ink bg-white px-3"><option value="images">IMAGES</option><option value="audio">AUDIO</option><option value="press">PRESS KIT</option></select></label>
    <label className="mb-7 block text-xs font-semibold tracking-[.14em]">FILE<input name="file" type="file" required accept="image/jpeg,image/png,image/webp,image/avif,audio/mpeg,audio/mp4,application/pdf" className="mt-2 block min-h-12 w-full border border-ink p-3 text-sm" /></label>
    <button disabled={busy} className="cut-r min-h-12 bg-red pr-9 pl-6 text-xs font-semibold tracking-[.14em] text-white disabled:opacity-50">{busy ? "UPLOADING…" : "UPLOAD FILE"}</button>
    {result.error && <p role="alert" className="mt-5 border border-red p-3 text-sm">{result.error}</p>}
    {result.url && <div className="mt-5"><label className="text-xs font-semibold tracking-[.14em]">PUBLIC URL<input readOnly value={result.url} onFocus={(event) => event.currentTarget.select()} className="mt-2 min-h-12 w-full border border-ink bg-[#f8f8f6] px-3 font-mono text-xs" /></label></div>}
  </form>;
}
