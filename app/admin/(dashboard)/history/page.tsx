import { restoreVersion } from "@/app/admin/actions";
import { requireAdminPage } from "@/lib/admin/auth";
import { getSupabaseAdmin } from "@/lib/supabase/server";

type VersionRow = {
  id: number;
  version_type: "draft" | "published";
  actor_email: string;
  source_version_id: number | null;
  created_at: string;
  snapshot: { release?: { title?: string } } | null;
};

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short",
});

export default async function HistoryPage({ searchParams }: { searchParams: Promise<{ restored?: string }> }) {
  await requireAdminPage();
  const [params, db] = await Promise.all([searchParams, Promise.resolve(getSupabaseAdmin())]);
  const result = db
    ? await db
        .from("content_versions")
        .select("id,version_type,actor_email,source_version_id,created_at,snapshot")
        .order("created_at", { ascending: false })
        .limit(50)
    : { data: null, error: new Error("Supabase is not configured.") };
  const versions = (result.data ?? []) as VersionRow[];

  return (
    <>
      <p className="mb-3 text-xs font-semibold tracking-[.24em] text-ink/65">RECOVERY LOG</p>
      <div className="mb-8 grid gap-5 lg:grid-cols-[1fr_32rem] lg:items-end">
        <h1 className="font-display text-5xl">CONTENT HISTORY</h1>
        <p className="text-sm leading-relaxed text-ink/65">
          Every save and publish creates an immutable snapshot. Restoring a snapshot creates a new draft; the public site stays unchanged until you publish it.
        </p>
      </div>
      {params.restored === "1" && (
        <p role="status" className="mb-6 border border-ink bg-white p-4 text-sm font-semibold tracking-[.08em]">
          VERSION RESTORED TO THE DRAFT. REVIEW IT IN CONTENT BEFORE PUBLISHING.
        </p>
      )}
      {result.error && (
        <p role="alert" className="border border-red bg-white p-5 text-sm leading-relaxed">
          Content history will appear after the latest Supabase migration is installed.
        </p>
      )}
      {!result.error && versions.length === 0 && (
        <div className="border border-ink bg-white p-8">
          <h2 className="font-display text-2xl">NO SNAPSHOTS YET</h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink/65">Save a draft or publish the site to create the first recoverable version.</p>
        </div>
      )}
      {versions.length > 0 && (
        <ol className="border border-ink bg-white">
          {versions.map((version) => (
            <li key={version.id} className="grid gap-4 border-b border-ink/15 p-5 last:border-0 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                  <span className="font-display text-xl">{version.snapshot?.release?.title || "UNTITLED CONTENT"}</span>
                  <span className="border border-ink px-2 py-1 text-[10px] font-semibold tracking-[.14em]">{version.version_type.toUpperCase()}</span>
                </div>
                <p className="mt-2 break-words text-xs leading-relaxed text-ink/60">
                  VERSION {version.id} · {dateFormatter.format(new Date(version.created_at))} · {version.actor_email}
                  {version.source_version_id ? ` · RESTORED FROM ${version.source_version_id}` : ""}
                </p>
              </div>
              <form action={restoreVersion}>
                <input type="hidden" name="versionId" value={version.id} />
                <button className="min-h-11 border border-ink bg-white px-5 text-xs font-semibold tracking-[.12em] hover:bg-ink hover:text-white">
                  RESTORE AS DRAFT
                </button>
              </form>
            </li>
          ))}
        </ol>
      )}
    </>
  );
}
