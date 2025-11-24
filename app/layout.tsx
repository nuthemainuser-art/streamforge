// app/layout.tsx
import "./globals.css";
import { createClient } from "@/lib/supabase/client";
import { SessionContextProvider } from "@supabase/auth-helpers-react";

export const metadata = {
  title: "Streamforge",
  description: "Streamforge – tasks, comics and social engine",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();

  return (
    <html lang="en">
      <body>
        <SessionContextProvider supabaseClient={supabase}>
          {children}
        </SessionContextProvider>
      </body>
    </html>
  );
}
