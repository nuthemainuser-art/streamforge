// app/page.tsx
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import StreamforgeUI from "@/components/StreamforgeUI";

export default async function StreamforgePage() {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return <meta httpEquiv="refresh" content="0; url=/login" />;
  }

  // Initial load for infinite scroll
  const { data: tasks } = await supabase
    .from("tasks")
    .select("*")
    .eq("user_id", session.user.id)
    .order("created_at", { ascending: false })
    .limit(20);

  return (
    <StreamforgeUI
      initialTasks={tasks || []}
      user={session.user}
    />
  );
}
