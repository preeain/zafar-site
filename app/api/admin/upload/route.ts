import { assertAdmin } from "@/lib/admin/auth";
import { getSupabaseAdmin } from "@/lib/supabase/server";

const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/avif", "audio/mpeg", "audio/mp4", "application/pdf"]);
const FOLDERS = new Set(["images", "audio", "press"]);
const EXTENSIONS: Record<string, Set<string>> = {
  "image/jpeg": new Set(["jpg", "jpeg"]),
  "image/png": new Set(["png"]),
  "image/webp": new Set(["webp"]),
  "image/avif": new Set(["avif"]),
  "audio/mpeg": new Set(["mp3"]),
  "audio/mp4": new Set(["m4a", "mp4"]),
  "application/pdf": new Set(["pdf"]),
};
const MAX = 4 * 1024 * 1024;
const MAX_REQUEST = MAX + 64 * 1024;
const MAX_FILENAME = 180;

function startsWith(bytes: Uint8Array, signature: number[]) {
  return signature.every((value, index) => bytes[index] === value);
}

function ascii(bytes: Uint8Array) {
  return new TextDecoder("latin1").decode(bytes);
}

function hasValidSignature(type: string, bytes: Uint8Array) {
  if (type === "image/jpeg") return startsWith(bytes, [0xff, 0xd8, 0xff]);
  if (type === "image/png") return startsWith(bytes, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  if (type === "image/webp") return ascii(bytes.slice(0, 4)) === "RIFF" && ascii(bytes.slice(8, 12)) === "WEBP";
  if (type === "image/avif") {
    const header = ascii(bytes);
    return ascii(bytes.slice(4, 8)) === "ftyp" && (header.includes("avif") || header.includes("avis"));
  }
  if (type === "audio/mpeg") return ascii(bytes.slice(0, 3)) === "ID3" || (bytes[0] === 0xff && (bytes[1] & 0xe0) === 0xe0);
  if (type === "audio/mp4") return ascii(bytes.slice(4, 8)) === "ftyp";
  if (type === "application/pdf") return ascii(bytes.slice(0, 5)) === "%PDF-";
  return false;
}

export async function POST(request: Request) {
  const requestOrigin = request.headers.get("origin");
  if (requestOrigin && requestOrigin !== new URL(request.url).origin) {
    return Response.json({ error: "Request origin is not allowed." }, { status: 403 });
  }
  const user = await assertAdmin().catch(() => null);
  if (!user?.email) return Response.json({ error: "Not authorized." }, { status: 401 });
  const declaredLength = Number(request.headers.get("content-length"));
  if (Number.isFinite(declaredLength) && declaredLength > MAX_REQUEST) {
    return Response.json({ error: "The upload request is too large." }, { status: 413 });
  }
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return Response.json({ error: "The upload request could not be read." }, { status: 400 });
  }
  const file = form.get("file");
  const folder = String(form.get("folder") ?? "").toLowerCase();
  if (!FOLDERS.has(folder)) {
    return Response.json({ error: "Choose an approved destination." }, { status: 400 });
  }
  if (!(file instanceof File) || file.size === 0 || !ALLOWED.has(file.type) || file.size > MAX || file.name.length > MAX_FILENAME) {
    return Response.json({ error: "Choose an approved image, MP3, MP4 audio, or PDF under 4 MB." }, { status: 400 });
  }
  const extension = file.name.split(".").pop()?.toLowerCase() ?? "";
  const header = new Uint8Array(await file.slice(0, 64).arrayBuffer());
  if (!EXTENSIONS[file.type]?.has(extension) || !hasValidSignature(file.type, header)) {
    return Response.json({ error: "The file contents do not match its filename and media type." }, { status: 400 });
  }
  const db = getSupabaseAdmin();
  if (!db) return Response.json({ error: "Storage is not configured." }, { status: 503 });
  const safeName = file.name.normalize("NFKC").replace(/[^a-z0-9._-]/gi, "-").replace(/-+/g, "-").toLowerCase();
  const path = `${folder}/${crypto.randomUUID()}-${safeName}`;
  const { error } = await db.storage.from("zafar-public").upload(path, file, { cacheControl: "31536000", contentType: file.type, upsert: false });
  if (error) return Response.json({ error: "Upload failed." }, { status: 502 });
  const { data } = db.storage.from("zafar-public").getPublicUrl(path);
  await db.from("admin_audit_log").insert({ actor_id: user.id, actor_email: user.email, action: "upload", entity: path, metadata: { size: file.size, type: file.type } });
  return Response.json({ url: data.publicUrl, path, folder, name: file.name, type: file.type, size: file.size });
}
