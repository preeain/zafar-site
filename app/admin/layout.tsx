import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Control Room | Zafar Sandhu",
  robots: { index: false, follow: false, noarchive: true },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
