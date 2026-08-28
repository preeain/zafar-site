import "server-only";
import { defaultContent, type SiteContent } from "@/content/site";
import { getSupabaseAdmin } from "@/lib/supabase/server";

export type ContentRecord = {
  draft: SiteContent;
  published: SiteContent;
  updated_at: string | null;
  published_at: string | null;
};

function mergeValue<T>(fallback: T, incoming: unknown): T {
  if (incoming === undefined || incoming === null) return fallback;
  if (Array.isArray(fallback)) return (Array.isArray(incoming) ? incoming : fallback) as T;
  if (typeof fallback === "object" && fallback !== null && typeof incoming === "object" && !Array.isArray(incoming)) {
    return Object.fromEntries(
      Object.entries(fallback).map(([key, childFallback]) => [
        key,
        mergeValue(childFallback, (incoming as Record<string, unknown>)[key]),
      ]),
    ) as T;
  }
  return incoming as T;
}

function mergeContent(value: unknown): SiteContent {
  return mergeValue(defaultContent, value);
}

export async function getContentRecord(): Promise<ContentRecord> {
  const db = getSupabaseAdmin();
  if (!db) return { draft: defaultContent, published: defaultContent, updated_at: null, published_at: null };
  const { data } = await db.from("site_content").select("draft,published,updated_at,published_at").eq("id", "zafar").maybeSingle();
  return {
    draft: mergeContent(data?.draft),
    published: mergeContent(data?.published),
    updated_at: data?.updated_at ?? null,
    published_at: data?.published_at ?? null,
  };
}

export async function getPublishedContent() {
  const db = getSupabaseAdmin();
  if (!db) return defaultContent;
  const { data } = await db.from("site_content").select("published").eq("id", "zafar").maybeSingle();
  return mergeContent(data?.published);
}
