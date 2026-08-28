"use client";

import { createContext, useContext } from "react";
import { defaultContent, type SiteContent } from "@/content/site";

const SiteContentContext = createContext<SiteContent>(defaultContent);

export function SiteContentProvider({ content, children }: { content: SiteContent; children: React.ReactNode }) {
  return <SiteContentContext.Provider value={content}>{children}</SiteContentContext.Provider>;
}

export function useSiteContent() {
  return useContext(SiteContentContext);
}
