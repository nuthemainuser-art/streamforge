export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";
export const runtime = "nodejs";

import type { ReactNode } from "react";

export default function LoginLayout({ children }: { children: ReactNode }) {
  return children;
}
