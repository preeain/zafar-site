import { redirect } from "next/navigation";
import AdminLogin from "@/components/admin/AdminLogin";
import { getAdminUser, isAdminConfigured } from "@/lib/admin/auth";

export default async function LoginPage() {
  if (await getAdminUser()) redirect("/admin");
  return <AdminLogin configured={isAdminConfigured()} />;
}
