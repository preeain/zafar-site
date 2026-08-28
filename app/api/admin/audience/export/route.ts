import { assertAdmin } from "@/lib/admin/auth";
import { getSupabaseAdmin } from "@/lib/supabase/server";

function csvCell(value: unknown) {
  let text = String(value ?? "");
  if (/^[=+\-@]/.test(text)) text = `'${text}`;
  return `"${text.replaceAll('"', '""')}"`;
}

export async function GET() {
  const user = await assertAdmin().catch(() => null);
  if (!user) return Response.json({ error: "Not authorized." }, { status: 401 });
  const db = getSupabaseAdmin();
  if (!db) return Response.json({ error: "Audience storage is not configured." }, { status: 503 });

  const { data, error } = await db.from("subscribers").select("email,city,consented_at,unsubscribed_at,source,consent_version").order("consented_at", { ascending: false }).limit(10_000);
  if (error) return Response.json({ error: "Audience export failed." }, { status: 502 });

  const header = ["email", "city", "joined", "status", "source", "consent_version"];
  const rows = (data ?? []).map((row) => [row.email, row.city, row.consented_at, row.unsubscribed_at ? "unsubscribed" : "active", row.source, row.consent_version]);
  const csv = [header, ...rows].map((row) => row.map(csvCell).join(",")).join("\r\n");
  const date = new Date().toISOString().slice(0, 10);

  return new Response(`\uFEFF${csv}`, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="zafar-circle-${date}.csv"`,
      "Cache-Control": "private, no-store",
    },
  });
}
