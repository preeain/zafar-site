import MediaUploader, { type MediaAsset } from "@/components/admin/MediaUploader";
import { requireAdminPage } from "@/lib/admin/auth";
import { getSupabaseAdmin } from "@/lib/supabase/server";

const folders = ["images", "audio", "press"] as const;

export default async function MediaPage() {
  await requireAdminPage();
  const db = getSupabaseAdmin();
  const results = db
    ? await Promise.all(
        folders.map(async (folder) => ({
          folder,
          result: await db.storage.from("zafar-public").list(folder, {
            limit: 50,
            offset: 0,
            sortBy: { column: "created_at", order: "desc" },
          }),
        })),
      )
    : [];

  const assets = results
    .flatMap(({ folder, result }) =>
      (result.data ?? [])
        .filter((file) => file.name !== ".emptyFolderPlaceholder")
        .map((file): MediaAsset => {
          const path = `${folder}/${file.name}`;
          const { data } = db!.storage.from("zafar-public").getPublicUrl(path);
          const metadata = file.metadata as { mimetype?: unknown; size?: unknown } | null;
          return {
            path,
            folder,
            name: file.name,
            url: data.publicUrl,
            type: typeof metadata?.mimetype === "string" ? metadata.mimetype : "application/octet-stream",
            size: typeof metadata?.size === "number" ? metadata.size : 0,
            createdAt: file.created_at ?? file.updated_at ?? "",
          };
        }),
    )
    .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))
    .slice(0, 100);
  const libraryError = !db || results.some(({ result }) => Boolean(result.error));

  return (
    <>
      <p className="mb-3 text-xs font-semibold tracking-[.24em] text-ink/65">ASSET LIBRARY</p>
      <h1 className="mb-10 font-display text-5xl">MEDIA</h1>
      <MediaUploader initialAssets={assets} libraryError={libraryError} />
    </>
  );
}
