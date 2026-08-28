import { createSupabaseServerClient } from "@/lib/supabase/server-ssr";
import { isAdminConfigured } from "@/lib/admin/auth";

export async function POST(request: Request) {
  if (!isAdminConfigured()) return Response.redirect(new URL("/admin/login", request.url), 303);
  const client = await createSupabaseServerClient();
  await client.auth.signOut();
  return Response.redirect(new URL("/admin/login", request.url), 303);
}
