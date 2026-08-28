import { assertAdmin } from "@/lib/admin/auth";
import { getSupabaseAdmin } from "@/lib/supabase/server";

const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/avif", "audio/mpeg", "audio/mp4", "application/pdf"]);
const MAX = 4 * 1024 * 1024;

export async function POST(request: Request) {
  const requestOrigin = request.headers.get("origin");
  if (requestOrigin && requestOrigin !== new URL(request.url).origin) {
    return Response.json({ error: "Request origin is not allowed." }, { status: 403 });
  }
  const user = await assertAdmin().catch(() => null);
  if (!user?.email) return Response.json({ error: "Not authorized." }, { status: 401 });
  const form = await request.formData();
  const file = form.get("file");
  const folder = String(form.get("folder") ?? "uploads").replace(/[^a-z0-9-]/gi, "").toLowerCase() || "uploads";
  if (!(file instanceof File) || !ALLOWED.has(file.type) || file.size > MAX) {
    return Response.json({ error: "Choose an approved image, MP3, MP4 audio, or PDF under 4 MB." }, { status: 400 });
  }
  const db = getSupabaseAdmin();
  if (!db) return Response.json({ error: "Storage is not configured." }, { status: 503 });
  const safeName = file.name.replace(/[^a-z0-9._-]/gi, "-").toLowerCase();
  const path = `${folder}/${crypto.randomUUID()}-${safeName}`;
  const { error } = await db.storage.from("zafar-public").upload(path, file, { contentType: file.type, upsert: false });
  if (error) return Response.json({ error: "Upload failed." }, { status: 502 });
  const { data } = db.storage.from("zafar-public").getPublicUrl(path);
  await db.from("admin_audit_log").insert({ actor_id: user.id, actor_email: user.email, action: "upload", entity: path, metadata: { size: file.size, type: file.type } });
  return Response.json({ url: data.publicUrl, path });
}
