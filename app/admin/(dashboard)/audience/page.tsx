import { requireAdminPage } from "@/lib/admin/auth";
import { getSupabaseAdmin } from "@/lib/supabase/server";

export default async function AudiencePage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  await requireAdminPage();
  const { q = "" } = await searchParams;
  const search = q.trim().slice(0, 120);
  const db = getSupabaseAdmin();
  let query = db?.from("subscribers").select("id,email,city,consented_at,unsubscribed_at", { count: "exact" }).order("consented_at", { ascending: false }).limit(250);
  if (query && search) query = query.or(`email.ilike.%${search}%,city.ilike.%${search}%`);
  const result = query ? await query : { data: [], count: 0 };
  const data = result.data ?? [];

  return (
    <>
      <p className="mb-3 text-xs font-semibold tracking-[.24em] text-ink/65">THE CIRCLE</p>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <h1 className="font-display text-5xl">AUDIENCE</h1>
        <p className="font-display text-3xl">{result.count ?? 0} <span className="text-xs tracking-[.12em] text-ink/65">MEMBERS</span></p>
      </div>
      <div className="mb-5 flex flex-wrap gap-3">
        <form action="/admin/audience" className="flex min-w-[280px] flex-1 gap-2">
          <label htmlFor="audience-search" className="sr-only">Search audience</label>
          <input id="audience-search" name="q" defaultValue={search} placeholder="SEARCH EMAIL OR CITY" className="min-h-12 flex-1 border border-ink bg-white px-4 text-sm" />
          <button className="min-h-12 border border-ink bg-ink px-5 text-xs font-semibold tracking-[.12em] text-white hover:bg-red">SEARCH</button>
        </form>
        <a href="/api/admin/audience/export" className="cut-r inline-flex min-h-12 items-center border border-ink bg-white pr-8 pl-5 text-xs font-semibold tracking-[.12em] hover:bg-ink hover:text-white">EXPORT CSV ↓</a>
      </div>
      <div className="overflow-x-auto border border-ink bg-white">
        <table className="w-full min-w-[700px] border-collapse text-left">
          <thead><tr className="border-b border-ink bg-ink text-[10px] tracking-[.16em] text-white"><th className="p-4">EMAIL</th><th className="p-4">CITY</th><th className="p-4">JOINED</th><th className="p-4">STATUS</th></tr></thead>
          <tbody>{data.map((row) => <tr key={row.id} className="border-b border-ink/15 text-sm last:border-0"><td className="p-4 font-semibold">{row.email}</td><td className="p-4 text-ink/70">{row.city || "—"}</td><td className="p-4 text-ink/70">{new Date(row.consented_at).toLocaleDateString()}</td><td className="p-4 text-xs font-semibold tracking-[.1em]">{row.unsubscribed_at ? "UNSUBSCRIBED" : "ACTIVE"}</td></tr>)}</tbody>
        </table>
        {!data.length && <p className="p-8 text-sm text-ink/65">{search ? "No Circle members match this search." : "No Circle members yet."}</p>}
      </div>
    </>
  );
}
