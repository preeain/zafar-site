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

async function applyContentVersion({
  content,
  actorId,
  actorEmail,
  versionType,
  action,
  sourceVersionId,
}: {
  content: SiteContent;
  actorId: string;
  actorEmail: string;
  versionType: "draft" | "published";
  action: "save_draft" | "publish" | "restore";
  sourceVersionId?: number;
}) {
  const db = getSupabaseAdmin();
  if (!db) throw new Error("Supabase is not configured.");
  const { error } = await db.rpc("apply_site_content_version", {
    p_content: content,
    p_actor_id: actorId,
    p_actor_email: actorEmail,
    p_version_type: versionType,
    p_action: action,
    p_source_version_id: sourceVersionId ?? null,
  });
  if (error) throw new Error("The content change could not be saved.");
}

export async function saveDraft(formData: FormData) {
  const user = await assertAdmin();
  const draft = parseContent(formData);
  await applyContentVersion({ content: draft, actorId: user.id, actorEmail: user.email!, versionType: "draft", action: "save_draft" });
  revalidatePath("/admin");
  revalidatePath("/admin/history");
  redirect("/admin?saved=draft");
}

export async function publishContent(formData: FormData) {
  const user = await assertAdmin();
  const content = parseContent(formData);
  await applyContentVersion({ content, actorId: user.id, actorEmail: user.email!, versionType: "published", action: "publish" });
  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/history");
  redirect("/admin?saved=published");
}

export async function restoreDefaults() {
  const user = await assertAdmin();
  await applyContentVersion({ content: defaultContent, actorId: user.id, actorEmail: user.email!, versionType: "draft", action: "restore" });
  revalidatePath("/admin/history");
  redirect("/admin?saved=restored");
}

export async function restoreVersion(formData: FormData) {
  const parsedId = z.coerce.number().int().positive().safeParse(formData.get("versionId"));
  if (!parsedId.success) throw new Error("Choose a valid version to restore.");

  const user = await assertAdmin();
  const db = getSupabaseAdmin();
  if (!db) throw new Error("Supabase is not configured.");

  const { data, error } = await db
    .from("content_versions")
    .select("snapshot")
    .eq("id", parsedId.data)
    .maybeSingle();
  if (error || !data) throw new Error("That content version is no longer available.");

  const content = contentSchema.parse(data.snapshot) as SiteContent;
  await applyContentVersion({
    content,
    actorId: user.id,
    actorEmail: user.email!,
    versionType: "draft",
    action: "restore",
    sourceVersionId: parsedId.data,
  });
  revalidatePath("/admin");
  revalidatePath("/admin/history");
  redirect("/admin/history?restored=1");
}
