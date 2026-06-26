"use client";

import { DemoProvider } from "@/lib/demo-context";
import type { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return <DemoProvider>{children}</DemoProvider>;
}
