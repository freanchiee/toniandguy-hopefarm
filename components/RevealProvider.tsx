"use client";

import { useRevealSections } from "@/lib/animations";

export function RevealProvider({ children }: { children: React.ReactNode }) {
  useRevealSections();
  return <>{children}</>;
}
