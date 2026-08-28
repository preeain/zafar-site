import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy | Zafar Sandhu",
  description: "How the official Zafar Sandhu website handles mailing-list information.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-white px-[clamp(20px,6vw,88px)] py-[clamp(48px,9vw,120px)] text-ink">
      <div className="mx-auto max-w-[760px]">
        <p className="mb-4 text-xs font-semibold tracking-[.22em] text-ink/65">ZAFAR SANDHU · PRIVACY</p>
        <h1 className="mb-10 font-display text-[clamp(42px,8vw,84px)] leading-[.9]">YOUR INFORMATION STAYS YOURS.</h1>
        <div className="space-y-7 text-base leading-7 text-ink/80">
          <p>When The Circle is active, this website collects the email address and optional city that you submit, along with the time of your consent. We use that information only for Zafar Sandhu music, video, show, and presale updates.</p>
          <p>Website hosting, database, analytics, and email providers may process this information only to operate those services. We do not sell mailing-list information.</p>
          <p>You can unsubscribe using the link in any Circle email. You may also reply to an email you receive to request access, correction, or deletion. If the mailing service is not configured, the signup form displays an unavailable message and does not accept the submission.</p>
          <p>Security controls, access restrictions, and service-provider safeguards are used to protect stored information. No online service can guarantee absolute security.</p>
        </div>
        <p className="mt-10 border-t border-ink/25 pt-5 text-xs tracking-[.12em] text-ink/65">EFFECTIVE AUGUST 28, 2026</p>
        <Link href="/" className="cut-r mt-10 inline-flex min-h-12 items-center bg-ink pr-9 pl-6 text-xs font-semibold tracking-[.16em] text-white hover:bg-red">RETURN TO THE SITE</Link>
      </div>
    </main>
  );
}
