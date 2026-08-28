import { getSupabaseAdmin } from "@/lib/supabase/server";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_BODY_BYTES = 10_000;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 5;
const attempts = new Map<string, { count: number; resetsAt: number }>();

class BodyTooLargeError extends Error {}

type Subscription = {
  email?: unknown;
  city?: unknown;
  website?: unknown;
  consent?: unknown;
};

function rateLimit(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const key = forwarded || request.headers.get("x-real-ip") || "unknown";
  const now = Date.now();
  const current = attempts.get(key);

  if (!current || current.resetsAt <= now) {
    attempts.set(key, { count: 1, resetsAt: now + RATE_LIMIT_WINDOW_MS });
    return null;
  }

  current.count += 1;
  if (current.count <= RATE_LIMIT_MAX) return null;
  return Math.max(1, Math.ceil((current.resetsAt - now) / 1000));
}

function json(body: object, init?: ResponseInit) {
  const headers = new Headers(init?.headers);
  headers.set("Cache-Control", "no-store");
  return Response.json(body, { ...init, headers });
}

async function readSubscription(request: Request): Promise<Subscription> {
  if (!request.body) throw new SyntaxError("Request body is missing");

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > MAX_BODY_BYTES) {
      await reader.cancel();
      throw new BodyTooLargeError();
    }
    chunks.push(value);
  }

  const bytes = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }

  return JSON.parse(new TextDecoder().decode(bytes)) as Subscription;
}

export async function POST(request: Request) {
  const retryAfter = rateLimit(request);
  if (retryAfter) {
    return json(
      { error: "Too many signup attempts. Please try again in a few minutes." },
      { status: 429, headers: { "Retry-After": String(retryAfter) } },
    );
  }

  const requestOrigin = request.headers.get("origin");
  if (requestOrigin && requestOrigin !== new URL(request.url).origin) {
    return json({ error: "Request origin is not allowed." }, { status: 403 });
  }

  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) {
    return json({ error: "The request must be JSON." }, { status: 415 });
  }

  const declaredLength = Number(request.headers.get("content-length"));
  if (Number.isFinite(declaredLength) && declaredLength > MAX_BODY_BYTES) {
    return json({ error: "Request is too large." }, { status: 413 });
  }

  let body: Subscription;
  try {
    body = await readSubscription(request);
  } catch (error) {
    if (error instanceof BodyTooLargeError) {
      return json({ error: "Request is too large." }, { status: 413 });
    }
    return json({ error: "Enter a valid email address." }, { status: 400 });
  }

  // Bots commonly fill this hidden field. Return success without forwarding it.
  if (typeof body.website === "string" && body.website.length > 0) {
    return json({ ok: true });
  }

  const email = typeof body.email === "string" ? body.email.trim() : "";
  const city = typeof body.city === "string" ? body.city.trim() : "";
  if (!EMAIL_PATTERN.test(email) || email.length > 254) {
    return json({ error: "Enter a valid email address." }, { status: 400 });
  }
  if (city.length > 120) {
    return json({ error: "City must be 120 characters or fewer." }, { status: 400 });
  }
  if (body.consent !== true) {
    return json({ error: "Consent is required to join The Circle." }, { status: 400 });
  }

  const db = getSupabaseAdmin();
  if (db) {
    const { error } = await db.from("subscribers").upsert(
      {
        email: email.toLowerCase(),
        city,
        consented_at: new Date().toISOString(),
        consent_version: "2026-08-28",
        source: "zafarsandhu.com",
        unsubscribed_at: null,
      },
      { onConflict: "email" },
    );
    if (!error) return json({ ok: true });
    console.error("Subscriber storage failed", { code: error.code });
    return json(
      { error: "Could not join right now. Please try again in a moment." },
      { status: 502 },
    );
  }

  const webhookUrl = process.env.MAILING_LIST_WEBHOOK_URL;
  if (!webhookUrl) {
    return json(
      { error: "The mailing list is not available yet. Please try again later." },
      { status: 503 },
    );
  }

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, city, consent: true, consentVersion: "2026-08-28", source: "zafarsandhu.com" }),
      cache: "no-store",
      signal: AbortSignal.timeout(8_000),
    });

    if (!response.ok) throw new Error(`Mailing-list webhook returned ${response.status}`);
    return json({ ok: true });
  } catch (error) {
    console.error("Mailing-list subscription failed", error);
    return json(
      { error: "Could not join right now. Please try again in a moment." },
      { status: 502 },
    );
  }
}
