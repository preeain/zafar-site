import ContentEditor from "@/components/admin/ContentEditor";
import { requireAdminPage } from "@/lib/admin/auth";
import { getContentRecord } from "@/lib/admin/content";

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  await requireAdminPage();
  const [record, params] = await Promise.all([getContentRecord(), searchParams]);
  const status = params.saved === "published" ? "SITE PUBLISHED." : params.saved === "restored" ? "BUILT-IN CONTENT RESTORED TO THE DRAFT." : "DRAFT SAVED.";
  return (
    <>
      <div className="mb-10 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
        <div><p className="mb-3 text-xs font-semibold tracking-[.24em] text-ink/55">ZAFAR SANDHU · WEBSITE ADMIN</p><h1 className="max-w-4xl font-display text-[clamp(38px,6vw,76px)] leading-[.9]">CONTROL THE COMPLETE ARTIST SITE.</h1></div>
        <div className="border border-ink bg-white p-4 text-xs leading-relaxed text-ink/70"><p>LAST PUBLISHED</p><p className="mt-1 font-semibold text-ink">{record.published_at ? new Date(record.published_at).toLocaleString() : "NOT YET PUBLISHED"}</p></div>
      </div>
      {params.saved && <p role="status" className="mb-6 border border-ink bg-white p-4 text-sm font-semibold tracking-[.08em]">{status}</p>}
      <ContentEditor initial={record.draft} />
    </>
  );
}
