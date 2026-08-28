import MediaUploader from "@/components/admin/MediaUploader";
import { requireAdminPage } from "@/lib/admin/auth";

export default async function MediaPage() {
  await requireAdminPage();
  return <><p className="mb-3 text-xs font-semibold tracking-[.24em] text-ink/65">ASSET LIBRARY</p><h1 className="mb-10 font-display text-5xl">MEDIA</h1><MediaUploader /></>;
}
