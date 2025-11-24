import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

export function createServer() {
  return createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        async get(name: string) {
          const store = await cookies();     // ✔ Await the cookie store
          return store.get(name)?.value ?? "";
        },
        async set(name: string, value: string, options: CookieOptions) {
          const store = await cookies();     // ✔ Await again
          store.set({ name, value, ...options });
        },
        async remove(name: string, options: CookieOptions) {
          const store = await cookies();     // ✔ Await again
          store.set({ name, value: "", ...options });
        },
      },
    }
  );
}
