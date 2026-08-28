"use client";

import { useState } from "react";

export type MediaAsset = {
  path: string;
  folder: string;
  name: string;
  url: string;
  type: string;
  size: number;
  createdAt: string;
};

function formatBytes(value: number) {
  if (!value) return "SIZE UNKNOWN";
  if (value < 1024) return `${value} B`;
  if (value < 1024 * 1024) return `${Math.round(value / 1024)} KB`;
  return `${(value / (1024 * 1024)).toFixed(1)} MB`;
}

export default function MediaUploader({ initialAssets, libraryError }: { initialAssets: MediaAsset[]; libraryError: boolean }) {
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ url?: string; error?: string }>({});
  const [assets, setAssets] = useState(initialAssets);
  const [query, setQuery] = useState("");
  const [copyStatus, setCopyStatus] = useState("");

  async function upload(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setBusy(true);
    setResult({});
    try {
      const response = await fetch("/api/admin/upload", { method: "POST", body: new FormData(form) });
      const body = (await response.json()) as Partial<MediaAsset> & { error?: string };
      if (!response.ok || !body.url || !body.path || !body.folder || !body.name || !body.type) {
        setResult({ error: body.error || "Upload failed. Please try again." });
        return;
      }
      const asset: MediaAsset = {
        path: body.path,
        folder: body.folder,
        name: body.name,
        url: body.url,
        type: body.type,
        size: body.size ?? 0,
        createdAt: new Date().toISOString(),
      };
      setAssets((current) => [asset, ...current].slice(0, 100));
      setResult({ url: body.url });
      form.reset();
    } catch {
      setResult({ error: "The upload could not reach the server. Check your connection and try again." });
    } finally {
      setBusy(false);
    }
  }

  async function copyUrl(url: string, name: string) {
    try {
      await navigator.clipboard.writeText(url);
      setCopyStatus(`${name} URL copied.`);
    } catch {
      setCopyStatus("Copy failed. Open the asset and copy its address from the browser.");
    }
  }

  const normalizedQuery = query.trim().toLowerCase();
  const visibleAssets = normalizedQuery
    ? assets.filter((asset) => `${asset.name} ${asset.folder} ${asset.type}`.toLowerCase().includes(normalizedQuery))
    : assets;

  return (
    <div className="grid gap-8 xl:grid-cols-[minmax(20rem,34rem)_minmax(0,1fr)] xl:items-start">
      <form onSubmit={upload} className="border border-ink bg-white p-6 sm:p-8">
        <p className="mb-2 text-[10px] font-semibold tracking-[.22em] text-ink/55">ZAFAR PUBLIC STORAGE</p>
        <h2 className="mb-3 font-display text-3xl">UPLOAD MEDIA</h2>
        <p className="mb-8 text-sm leading-relaxed text-ink/65">Upload optimized artwork, photography, audio previews, or a press kit up to 4 MB. Files are verified before storage.</p>
        <label className="mb-6 block text-xs font-semibold tracking-[.14em]">
          DESTINATION
          <select name="folder" className="mt-2 min-h-12 w-full border border-ink bg-white px-3 text-base">
            <option value="images">IMAGES</option>
            <option value="audio">AUDIO</option>
            <option value="press">PRESS KIT</option>
          </select>
        </label>
        <label className="mb-7 block text-xs font-semibold tracking-[.14em]">
          FILE
          <input name="file" type="file" required accept="image/jpeg,image/png,image/webp,image/avif,audio/mpeg,audio/mp4,application/pdf" className="mt-2 block min-h-12 w-full border border-ink p-3 text-base" />
        </label>
        <button disabled={busy} className="cut-r min-h-12 bg-red pr-9 pl-6 text-xs font-semibold tracking-[.14em] text-white disabled:cursor-wait disabled:opacity-50">
          {busy ? "UPLOADING…" : "UPLOAD FILE"}
        </button>
        {result.error && <p role="alert" className="mt-5 border border-red p-3 text-sm leading-relaxed">{result.error}</p>}
        {result.url && (
          <div className="mt-5">
            <label className="text-xs font-semibold tracking-[.14em]">
              PUBLIC URL
              <input readOnly value={result.url} onFocus={(event) => event.currentTarget.select()} className="mt-2 min-h-12 w-full border border-ink bg-[#f8f8f6] px-3 font-mono text-xs" />
            </label>
          </div>
        )}
      </form>

      <section aria-labelledby="media-library-heading" className="min-w-0 border border-ink bg-white">
        <div className="border-b border-ink p-5 sm:p-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 id="media-library-heading" className="font-display text-3xl">LIBRARY</h2>
              <p className="mt-2 text-xs font-semibold tracking-[.12em] text-ink/55">{assets.length} MOST RECENT ASSETS</p>
            </div>
            <label className="min-w-[14rem] flex-1 text-xs font-semibold tracking-[.12em] sm:max-w-sm">
              <span className="sr-only">Filter media library</span>
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="FILTER BY NAME OR TYPE" className="min-h-12 w-full border border-ink bg-white px-4 text-base" />
            </label>
          </div>
        </div>
        <p aria-live="polite" className="sr-only">{copyStatus}</p>
        {libraryError && assets.length === 0 && (
          <p role="status" className="p-6 text-sm leading-relaxed text-ink/65">The library will connect after Supabase storage is configured and the latest migration is installed.</p>
        )}
        {!libraryError && assets.length === 0 && (
          <p className="p-6 text-sm leading-relaxed text-ink/65">No media has been uploaded. Add the first Zafar asset using the upload form.</p>
        )}
        {assets.length > 0 && visibleAssets.length === 0 && (
          <p className="p-6 text-sm leading-relaxed text-ink/65">No media matches “{query.trim()}”. Clear the filter to see the full library.</p>
        )}
        {visibleAssets.length > 0 && (
          <ul>
            {visibleAssets.map((asset) => (
              <li key={asset.path} className="grid min-w-0 gap-4 border-b border-ink/15 p-5 last:border-0 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold" title={asset.name}>{asset.name}</p>
                  <p className="mt-2 truncate text-[10px] font-semibold tracking-[.12em] text-ink/55">{asset.folder.toUpperCase()} · {asset.type.toUpperCase()} · {formatBytes(asset.size)}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <a href={asset.url} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center border border-ink px-4 text-xs font-semibold tracking-[.1em] hover:bg-ink hover:text-white">OPEN ↗</a>
                  <button type="button" onClick={() => copyUrl(asset.url, asset.name)} className="min-h-11 border border-ink bg-ink px-4 text-xs font-semibold tracking-[.1em] text-white hover:bg-red">COPY URL</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
