"use client";

import { useMemo, useState } from "react";
import { useFormStatus } from "react-dom";
import type { SiteContent } from "@/content/site";
import { publishContent, restoreDefaults, saveDraft } from "@/app/admin/actions";

type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };
type Path = (string | number)[];

const sections: { key: keyof SiteContent; label: string; note: string }[] = [
  { key: "site", label: "Identity & SEO", note: "Search titles, descriptions, canonical domain, and sharing copy." },
  { key: "hero", label: "Hero", note: "Homepage announcement and the first streaming destinations visitors see." },
  { key: "tracks", label: "Music", note: "Track order, duration, optional preview audio, and streaming links." },
  { key: "release", label: "Current release", note: "The featured release, credits, streaming destination, and optional lyrics." },
  { key: "nextDrop", label: "Next release", note: "Future release messaging and a presave destination when one exists." },
  { key: "visuals", label: "Video & BTS", note: "Featured YouTube video and behind-the-scenes captions." },
  { key: "story", label: "Story", note: "Biography, Punjabi name treatment, and press-kit link." },
  { key: "shows", label: "Tour", note: "Dates, cities, venues, and ticket links." },
  { key: "circle", label: "The Circle", note: "Fan-club promise, privacy link, and WhatsApp channel." },
  { key: "bookings", label: "Bookings & press", note: "Industry copy, contact addresses, and press materials." },
  { key: "footer", label: "Social & contacts", note: "Management, press, and official artist profiles." },
  { key: "bento", label: "Homepage tiles", note: "The calls to action in the World of Zafar grid." },
  { key: "config", label: "Experience", note: "Featured tile and audio-player behavior." },
];

const multilineKeys = new Set(["description", "ogDescription", "copy", "credits", "quote", "privacy", "paragraphs"]);

const templates: Record<string, JsonValue> = {
  streamingLinks: { label: "PLATFORM", href: "" },
  tracks: { title: "NEW TRACK", dur: 180, src: "", link: "" },
  lyricsGurmukhi: "",
  lyricsTransliteration: "",
  bts: "",
  paragraphs: "",
  shows: { id: "", date: "", city: "", venue: "", tickets: "" },
  socials: { label: "PLATFORM", href: "" },
};

function labelFor(key: string | number) {
  if (typeof key === "number") return `ITEM ${String(key + 1).padStart(2, "0")}`;
  return key.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/[_-]/g, " ").toUpperCase();
}

function clone<T>(value: T): T {
  return structuredClone(value);
}

function setAtPath(root: JsonValue, path: Path, value: JsonValue): JsonValue {
  if (path.length === 0) return value;
  const [head, ...rest] = path;
  const output = clone(root);
  if (Array.isArray(output) && typeof head === "number") {
    output[head] = setAtPath(output[head], rest, value);
  } else if (output && typeof output === "object" && !Array.isArray(output) && typeof head === "string") {
    output[head] = setAtPath(output[head], rest, value);
  }
  return output;
}

function ActionButton({ idle, pending, className }: { idle: string; pending: string; className: string }) {
  const status = useFormStatus();
  return <button disabled={status.pending} className={className}>{status.pending ? pending : idle}</button>;
}

export default function ContentEditor({ initial }: { initial: SiteContent }) {
  const [content, setContent] = useState(initial);
  const [active, setActive] = useState<keyof SiteContent>("site");
  const serialized = useMemo(() => JSON.stringify(content), [content]);
  const current = sections.find((section) => section.key === active)!;
  const sectionValue = content[active] as JsonValue;

  function update(path: Path, value: JsonValue) {
    setContent((previous) => ({
      ...previous,
      [active]: setAtPath(previous[active] as JsonValue, path, value),
    }));
  }

  function addItem(path: Path, key: string, items: JsonValue[]) {
    const template = clone(templates[key] ?? items.at(-1) ?? "");
    if (key === "shows" && template && typeof template === "object" && !Array.isArray(template)) {
      template.id = crypto.randomUUID();
    }
    update(path, [...items, template]);
  }

  function renderField(value: JsonValue, path: Path, key: string | number): React.ReactNode {
    const id = `field-${active}-${path.join("-") || "root"}`;
    const label = labelFor(key);

    if (typeof value === "boolean") {
      return (
        <label key={id} className="flex min-h-12 items-center justify-between gap-4 border-b border-ink/20 py-3 text-xs font-semibold tracking-[.12em]">
          {label}
          <input type="checkbox" checked={value} onChange={(event) => update(path, event.target.checked)} className="h-5 w-5 accent-red" />
        </label>
      );
    }

    if (typeof value === "number") {
      return (
        <label key={id} htmlFor={id} className="block text-xs font-semibold tracking-[.12em]">
          {label}
          <input id={id} type="number" min={key === "dur" ? 1 : undefined} value={value} onChange={(event) => update(path, Number(event.target.value))} className="mt-2 min-h-12 w-full border border-ink bg-white px-3 text-base font-normal tracking-normal outline-none focus:border-red" />
        </label>
      );
    }

    if (typeof value === "string") {
      if (key === "redTile") {
        return (
          <label key={id} htmlFor={id} className="block text-xs font-semibold tracking-[.12em]">
            {label}
            <select id={id} value={value} onChange={(event) => update(path, event.target.value)} className="mt-2 min-h-12 w-full border border-ink bg-white px-3 text-sm tracking-[.08em]">
              <option value="release">TOP RELEASE</option>
              <option value="show">LIVE DATES</option>
              <option value="community">THE CIRCLE</option>
              <option value="merch">MERCH</option>
            </select>
          </label>
        );
      }

      const multiline = multilineKeys.has(String(key)) || value.length > 120;
      return (
        <label key={id} htmlFor={id} className="block text-xs font-semibold tracking-[.12em]">
          {label}
          {multiline ? (
            <textarea id={id} value={value} onChange={(event) => update(path, event.target.value)} rows={4} className="mt-2 w-full resize-y border border-ink bg-white p-3 text-base font-normal leading-relaxed tracking-normal outline-none focus:border-red" />
          ) : (
            <input id={id} type={String(key).toLowerCase().includes("email") ? "email" : "text"} value={value} onChange={(event) => update(path, event.target.value)} className="mt-2 min-h-12 w-full border border-ink bg-white px-3 text-base font-normal tracking-normal outline-none focus:border-red" />
          )}
        </label>
      );
    }

    if (Array.isArray(value)) {
      return (
        <fieldset key={id} className="border border-ink/35 p-4 sm:p-5">
          <legend className="px-2 text-xs font-semibold tracking-[.14em]">{label}</legend>
          <div className="space-y-4">
            {value.map((item, index) => (
              <div key={`${id}-${index}`} className="border border-ink/20 bg-[#f8f8f6] p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <p className="text-[10px] font-semibold tracking-[.16em] text-ink/65">{labelFor(index)}</p>
                  <div className="flex gap-2">
                    <button type="button" disabled={index === 0} onClick={() => {
                      const reordered = [...value];
                      [reordered[index - 1], reordered[index]] = [reordered[index], reordered[index - 1]];
                      update(path, reordered);
                    }} className="min-h-9 border border-ink px-3 text-[10px] font-semibold disabled:opacity-30">MOVE UP</button>
                    <button type="button" onClick={() => update(path, value.filter((_, itemIndex) => itemIndex !== index))} className="min-h-9 border border-ink px-3 text-[10px] font-semibold hover:bg-ink hover:text-white">REMOVE</button>
                  </div>
                </div>
                {renderField(item, [...path, index], index)}
              </div>
            ))}
            {value.length === 0 && <p className="text-sm text-ink/65">No items yet.</p>}
            <button type="button" onClick={() => addItem(path, String(key), value)} className="min-h-11 border border-ink bg-white px-4 text-xs font-semibold tracking-[.12em] hover:bg-ink hover:text-white">ADD {label.replace(/S$/, "")}</button>
          </div>
        </fieldset>
      );
    }

    if (value && typeof value === "object") {
      const fields = Object.entries(value);
      return (
        <fieldset key={id} className={path.length ? "border border-ink/30 p-4 sm:p-5" : "space-y-5"}>
          {path.length > 0 && <legend className="px-2 text-xs font-semibold tracking-[.14em]">{label}</legend>}
          <div className="grid gap-5 sm:grid-cols-2">
            {fields.map(([childKey, childValue]) => (
              <div key={`${id}-${childKey}`} className={multilineKeys.has(childKey) || typeof childValue === "object" ? "sm:col-span-2" : undefined}>
                {renderField(childValue, [...path, childKey], childKey)}
              </div>
            ))}
          </div>
        </fieldset>
      );
    }

    return null;
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[280px_1fr]">
      <nav aria-label="Content sections" className="border border-ink bg-white p-2 xl:sticky xl:top-24 xl:self-start">
        {sections.map((section, index) => (
          <button key={section.key} onClick={() => setActive(section.key)} aria-current={active === section.key ? "page" : undefined} className={`flex min-h-12 w-full items-center gap-3 border-b border-ink/15 px-3 text-left text-xs font-semibold tracking-[.1em] last:border-0 ${active === section.key ? "bg-ink text-white" : "bg-white text-ink hover:bg-warm-paper"}`}>
            <span className="tnum text-[10px] opacity-60">{String(index + 1).padStart(2, "0")}</span>{section.label.toUpperCase()}
          </button>
        ))}
      </nav>

      <section className="min-w-0 border border-ink bg-white">
        <header className="border-b border-ink p-5 sm:p-7">
          <p className="mb-2 text-[10px] font-semibold tracking-[.22em] text-ink/65">EDITING</p>
          <h2 className="font-display text-3xl">{current.label.toUpperCase()}</h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink/70">{current.note}</p>
        </header>
        <div className="p-5 sm:p-7">{renderField(sectionValue, [], String(active))}</div>
        <footer className="sticky bottom-0 flex flex-wrap items-center justify-between gap-3 border-t border-ink bg-white/95 p-4 backdrop-blur sm:px-7">
          <p className="max-w-md text-xs leading-relaxed text-ink/65">Save keeps changes private. Publish updates the complete public site.</p>
          <div className="flex flex-wrap gap-2">
            <form action={restoreDefaults} onSubmit={(event) => { if (!window.confirm("Replace the current draft with the built-in site content?")) event.preventDefault(); }}>
              <ActionButton idle="RESET DRAFT" pending="RESETTING…" className="min-h-12 border border-ink/40 bg-white px-4 text-xs font-semibold tracking-[.12em] hover:border-ink" />
            </form>
            <form action={saveDraft}>
              <input type="hidden" name="content" value={serialized} />
              <ActionButton idle="SAVE DRAFT" pending="SAVING…" className="min-h-12 border border-ink bg-white px-5 text-xs font-semibold tracking-[.14em] hover:bg-ink hover:text-white disabled:opacity-50" />
            </form>
            <form action={publishContent} onSubmit={(event) => { if (!window.confirm("Publish these changes to zafarsandhu.com now?")) event.preventDefault(); }}>
              <input type="hidden" name="content" value={serialized} />
              <ActionButton idle="PUBLISH SITE" pending="PUBLISHING…" className="cut-r min-h-12 bg-red pr-8 pl-5 text-xs font-semibold tracking-[.14em] text-white hover:bg-ink disabled:opacity-50" />
            </form>
          </div>
        </footer>
      </section>
    </div>
  );
}
