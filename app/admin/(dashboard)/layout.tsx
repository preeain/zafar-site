import Image from "next/image";
import Link from "next/link";
import { requireAdminPage } from "@/lib/admin/auth";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAdminPage();
  return (
    <div className="admin-shell min-h-screen bg-[#f3f1ed] text-ink">
      <header className="sticky top-0 z-50 border-b border-ink bg-white/95 backdrop-blur">
        <div className="mx-auto flex min-h-16 max-w-[1500px] items-center justify-between gap-5 px-5 sm:px-8">
          <div className="flex items-center gap-4">
            <Image src="/img/logo-black.png" alt="Zafar Sandhu" width={1600} height={571} className="h-auto w-24" />
            <span className="border-l border-ink/25 pl-4 text-[10px] font-semibold tracking-[.2em] text-ink/60">CONTROL ROOM</span>
          </div>
          <div className="flex items-center gap-4">
            <nav className="hidden items-center gap-4 lg:flex"><Link href="/admin" className="min-h-11 content-center text-xs font-semibold tracking-[.12em]">CONTENT</Link><Link href="/admin/media" className="min-h-11 content-center text-xs font-semibold tracking-[.12em]">MEDIA</Link><Link href="/admin/audience" className="min-h-11 content-center text-xs font-semibold tracking-[.12em]">AUDIENCE</Link></nav>
            <Link href="/" target="_blank" className="hidden min-h-11 items-center text-xs font-semibold tracking-[.12em] sm:flex">VIEW SITE ↗</Link>
            <form action="/admin/logout" method="post"><button className="min-h-11 border border-ink px-4 text-xs font-semibold tracking-[.12em] hover:bg-ink hover:text-white">LOG OUT</button></form>
          </div>
        </div>
        <nav className="mx-auto flex max-w-[1500px] overflow-x-auto border-t border-ink/15 px-5 lg:hidden"><Link href="/admin" className="min-h-11 content-center pr-6 text-[10px] font-semibold tracking-[.14em]">CONTENT</Link><Link href="/admin/media" className="min-h-11 content-center pr-6 text-[10px] font-semibold tracking-[.14em]">MEDIA</Link><Link href="/admin/audience" className="min-h-11 content-center pr-6 text-[10px] font-semibold tracking-[.14em]">AUDIENCE</Link></nav>
      </header>
      <main className="mx-auto max-w-[1500px] px-5 py-8 sm:px-8 sm:py-12">{children}</main>
      <footer className="mx-auto flex max-w-[1500px] flex-wrap justify-between gap-3 border-t border-ink/20 px-5 py-6 text-[10px] tracking-[.12em] text-ink/55 sm:px-8"><span>PRIVATE ADMIN · ZAFAR SANDHU</span><span>{user.email}</span></footer>
    </div>
  );
}
