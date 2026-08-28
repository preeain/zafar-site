"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { assertAdmin } from "@/lib/admin/auth";
import { defaultContent, type SiteContent } from "@/content/site";
import { getSupabaseAdmin } from "@/lib/supabase/server";

const contentSchema = z.object({
  site: z.object({ name: z.string(), description: z.string(), ogTitle: z.string(), ogDescription: z.string(), url: z.url() }),
  config: z.object({ redTile: z.enum(["release", "show", "community", "merch"]), autoAdvance: z.boolean() }),
  hero: z.object({ tagline: z.string(), streamingLinks: z.array(z.object({ label: z.string(), href: z.string() })) }),
  tracks: z.array(z.object({ title: z.string(), dur: z.number().int().positive(), src: z.string(), link: z.string() })).min(1),
  release: z.object({ title: z.string(), date: z.string(), credits: z.string(), href: z.string(), lyricsGurmukhi: z.array(z.string()), lyricsTransliteration: z.array(z.string()) }),
  nextDrop: z.object({ title: z.string(), date: z.string(), presaveHref: z.string() }),
  visuals: z.object({ youtubeId: z.string(), caption: z.string(), description: z.string(), youtubeHref: z.string(), bts: z.array(z.string()) }),
  story: z.object({ overline: z.string(), gurmukhiName: z.string(), headline: z.string(), paragraphs: z.array(z.string()), pressKit: z.object({ label: z.string(), href: z.string() }) }),
  bento: z.record(z.string(), z.record(z.string(), z.string())),
  shows: z.array(z.object({ id: z.string(), date: z.string(), city: z.string(), venue: z.string(), tickets: z.string() })),
  circle: z.object({ copy: z.string(), privacy: z.string(), privacyPolicy: z.object({ label: z.string(), href: z.string() }), whatsapp: z.object({ label: z.string(), href: z.string() }) }),
  bookings: z.record(z.string(), z.record(z.string(), z.string())),
  footer: z.object({ mgmtEmail: z.string(), pressEmail: z.string(), socials: z.array(z.object({ label: z.string(), href: z.string() })), year: z.string() }),
});

function parseContent(formData: FormData): SiteContent {
  const raw = String(formData.get("content") ?? "");
  let value: unknown;
  try { value = JSON.parse(raw); } catch { throw new Error("The content contains invalid JSON."); }
  return contentSchema.parse(value) as SiteContent;
}

async function writeAudit(actorId: string, actorEmail: string, action: "save_draft" | "publish") {
  const db = getSupabaseAdmin();
  if (!db) return;
  await db.from("admin_audit_log").insert({ actor_id: actorId, actor_email: actorEmail, action, entity: "site_content" });
}

export async function saveDraft(formData: FormData) {
  const user = await assertAdmin();
  const db = getSupabaseAdmin();
  if (!db) throw new Error("Supabase is not configured.");
  const draft = parseContent(formData);
  const { error } = await db.from("site_content").update({ draft, updated_by: user.id, updated_at: new Date().toISOString() }).eq("id", "zafar");
  if (error) throw new Error("The draft could not be saved.");
  await writeAudit(user.id, user.email!, "save_draft");
  revalidatePath("/admin");
  redirect("/admin?saved=draft");
}

export async function publishContent(formData: FormData) {
  const user = await assertAdmin();
  const db = getSupabaseAdmin();
  if (!db) throw new Error("Supabase is not configured.");
  const content = parseContent(formData);
  const now = new Date().toISOString();
  const { error } = await db.from("site_content").update({ draft: content, published: content, updated_by: user.id, updated_at: now, published_at: now }).eq("id", "zafar");
  if (error) throw new Error("The site could not be published.");
  await writeAudit(user.id, user.email!, "publish");
  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin?saved=published");
}

export async function restoreDefaults() {
  const user = await assertAdmin();
  const db = getSupabaseAdmin();
  if (!db) throw new Error("Supabase is not configured.");
  await db.from("site_content").update({ draft: defaultContent, updated_by: user.id, updated_at: new Date().toISOString() }).eq("id", "zafar");
  await writeAudit(user.id, user.email!, "save_draft");
  redirect("/admin?saved=restored");
}
